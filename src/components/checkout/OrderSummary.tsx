import React from "react";
import { UPSShippingRate } from "@/lib/supabase";
import { CartItem } from "@/context/CartContext";

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  selectedShippingRate: UPSShippingRate | null;
}

const OrderSummary = ({
  cartItems,
  subtotal,
  shipping,
  total,
  selectedShippingRate
}: OrderSummaryProps) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex items-center">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded mr-2 sm:mr-4 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm sm:text-base truncate">{item.product.name}</h3>
              <p className="text-gray-600 text-sm">SKU: {item.product.sku || `DP-HYD-${item.product.id}`}</p>
            </div>
            <div className="text-right ml-2">
              <p className="font-medium">€{(item.product.price * item.quantity).toFixed(2)}</p>
              <p className="text-xs text-gray-500">x{item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t mt-6 pt-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          {selectedShippingRate ? (
            <div className="text-right">
              <p className="font-medium text-sm truncate">{selectedShippingRate.serviceName}</p>
              <p className="text-gray-600">€{shipping.toFixed(2)}</p>
            </div>
          ) : (
            <span>€{shipping.toFixed(2)}</span>
          )}
        </div>

        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;