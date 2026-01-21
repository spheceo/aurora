"use client";
import { FiShoppingCart, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/lib/zustand/useCartStore";
import { api } from "@/lib/orpc";
import { toast } from "@/components/ui/sonner";
import Image from "next/image";

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Check if any items are missing variantId (old cart items)
    const hasInvalidItems = items.some((item) => !item.variantId);
    if (hasInvalidItems) {
      toast("Please clear your cart and re-add items to checkout");
      return;
    }

    const lineItems = items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    toast.promise(
      api.checkout({ lineItems }),
      {
        loading: "Creating checkout...",
        success: (data) => {
          clearCart();
          window.location.href = data.checkoutUrl;
          return "Redirecting to checkout...";
        },
        error: "Failed to create checkout",
      }
    );
  };

  // Calculate total price
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.match(/[\d.]+/)?.[0] || "0");
    return sum + price * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer outline-none relative">
          <FiShoppingCart />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-(--primary) text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{itemCount}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="end">
        <div className="flex items-center justify-between mb-2">
          <DropdownMenuLabel className="p-0 text-lg">My Cart</DropdownMenuLabel>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-xs text-[#9A9A9A] hover:text-red-500 transition-colors">Clear all</button>
          )}
        </div>
        <DropdownMenuSeparator />

        {items.length === 0 ? (
          <div className="py-8 text-center">
            <FiShoppingCart className="w-12 h-12 mx-auto text-[#E7E7E7] mb-3" />
            <p className="text-[#E7E7E7] font-semibold">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-3 py-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {/* Product Image */}
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {item.assets[0]?.url ? (
                      <Image src={item.assets[0].url} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.title}</h4>
                    <p className="text-sm text-[#9A9A9A]">{item.price}</p>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-md border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-md border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <FiPlus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto text-[#9A9A9A] hover:text-red-500 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <DropdownMenuSeparator />

            {/* Total */}
            <div className="flex items-center justify-between py-3">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">R{total.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button onClick={handleCheckout} className="w-full bg-main text-white py-3 rounded-xl font-medium hover:bg-main/80 transition-colors">
              Checkout
            </button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
