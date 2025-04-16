import { OrderData } from "@/components/checkout/types";

interface OrderItemsProps {
  orderData: OrderData;
}

const OrderItems = ({ orderData }: OrderItemsProps) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Order Items</h3>
      <div className="border-t border-b py-2 grid grid-cols-4 text-sm text-left">
        <div className="font-medium">Product</div>
        <div className="font-medium">SKU</div>
        <div className="font-medium text-center">Price</div>
        <div className="font-medium text-right">Subtotal</div>
      </div>
      
      {orderData.items.map((item) => (
        <div key={item.product.id} className="border-b py-2 grid grid-cols-4 text-sm text-left">
          <div className="flex items-center gap-2">
            <span>{item.product.name}</span>
            <span className="text-xs text-gray-500">x{item.quantity}</span>
          </div>
          <div>{item.product.sku || `DP-HYD-${item.product.id}`}</div>
          <div className="text-center">€{item.product.price.toFixed(2)}</div>
          <div className="text-right">€{(item.product.price * item.quantity).toFixed(2)}</div>
        </div>
      ))}
      
      <div className="mt-4 flex flex-col items-end text-sm">
        <div className="flex justify-between w-1/2 py-1">
          <span>Subtotal:</span>
          <span>€{orderData.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-1/2 py-1">
          <span>Shipping:</span>
          <span>€{(orderData.shipping?.price || 5.99).toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-1/2 py-1">
          <span>Tax (21%):</span>
          <span>€{orderData.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-1/2 py-1 font-medium border-t mt-1">
          <span>Total:</span>
          <span>€{orderData.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItems;