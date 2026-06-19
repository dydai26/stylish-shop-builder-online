import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminProvider } from "@/context/AdminContext";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ReviewsProvider } from "@/context/ReviewsContext";

interface AppProvidersProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children, queryClient }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminProvider>
        <CartProvider>
          <OrderProvider>
            <ReviewsProvider>
              {children}
            </ReviewsProvider>
          </OrderProvider>
        </CartProvider>
      </AdminProvider>
    </QueryClientProvider>
  );
};
