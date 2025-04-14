
import { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "@/context/CartContext";

interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod?: string;
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

interface ShippingInfo {
  name: string;
  price: number;
}

export interface OrderData {
  orderId: string;
  customer: Customer;
  items: CartItem[];
  shipping?: ShippingInfo;
  subtotal: number;
  tax: number;
  total: number;
  date: string;
}

interface OrderContextType {
  orderData: OrderData | null;
  setOrderData: (data: OrderData) => void;
  clearOrderData: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const clearOrderData = () => {
    setOrderData(null);
  };

  return (
    <OrderContext.Provider
      value={{
        orderData,
        setOrderData,
        clearOrderData
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
