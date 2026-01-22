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
            <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] w-4 h-4 flex items-center justify-center font-medium">{itemCount}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0 bg-background border-border rounded-none" align="end">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium uppercase tracking-wider text-foreground">Cart ({itemCount})</h3>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-[10px] text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer uppercase tracking-wider">Clear All</button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center px-4">
            <FiShoppingCart className="w-8 h-8 mx-auto text-[#9A9A9A] mb-3" />
            <p className="text-[#9A9A9A] text-sm">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="max-h-80 overflow-y-auto">
              {items.map((item, index) => (
                <div key={item.id} className={`px-4 py-4 ${index !== items.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div className="w-20 h-20 relative overflow-hidden bg-secondary/30 shrink-0">
                      {item.assets[0]?.url ? (
                        <Image src={item.assets[0].url} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-secondary/50" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-xs truncate uppercase tracking-wide text-foreground">{item.title}</h4>
                        <p className="text-xs text-[#9A9A9A] mt-0.5">{item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 border border-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <FiMinus className="w-3 h-3 text-foreground" />
                          </button>
                          <span className="text-xs w-8 text-center font-medium text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 border border-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <FiPlus className="w-3 h-3 text-foreground" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#9A9A9A] hover:text-foreground transition-colors cursor-pointer"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-medium text-foreground">Total</span>
                <span className="font-medium text-base text-foreground">R{total.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-foreground text-background py-3 text-xs font-medium hover:bg-foreground/90 transition-colors cursor-pointer uppercase tracking-wider"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
