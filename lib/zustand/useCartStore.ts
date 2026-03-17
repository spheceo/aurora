import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ProductSchema } from "../products";
import { z } from "zod";

type Product = z.infer<typeof ProductSchema>;

type CartItem = Product & { quantity: number };

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.variantId === product.variantId);
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.variantId === product.variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (variantId) => {
        set({ items: get().items.filter((item) => item.variantId !== variantId) });
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-store",
      // ! change to `localStorage`
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
