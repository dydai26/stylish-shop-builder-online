import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { validatePromoCode, usePromoCode } from "@/lib/promoCodesService";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  category: string;
  sku?: string;
  tags?: string[];
  benefits?: string[];
  usage?: string;
  ingredients?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PromoCode {
  code: string;
  discount: number;
}

interface CartContextType {
  cartItems: CartItem[];
  promoCode: PromoCode | null;
  isValidatingPromo: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getDiscountAmount: () => number;
  getDiscountedTotal: () => number;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  markPromoCodeAsUsed: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initial render
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [promoCode, setPromoCode] = useState<PromoCode | null>(() => {
    // Load promo code from localStorage on initial render
    const savedPromo = localStorage.getItem("promoCode");
    return savedPromo ? JSON.parse(savedPromo) : null;
  });

  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save promo code to localStorage whenever it changes
  useEffect(() => {
    if (promoCode) {
      localStorage.setItem("promoCode", JSON.stringify(promoCode));
    } else {
      localStorage.removeItem("promoCode");
    }
  }, [promoCode]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode(null);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 
      0
    );
  };

  const getDiscountAmount = () => {
    if (!promoCode) return 0;
    const subtotal = getCartTotal();
    return subtotal * (promoCode.discount / 100);
  };

  const getDiscountedTotal = () => {
    const subtotal = getCartTotal();
    const discount = getDiscountAmount();
    return subtotal - discount;
  };

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    const upperCode = code.toUpperCase();
    
    // Check if the same promo code is already applied
    if (promoCode && promoCode.code === upperCode) {
      return { success: false, message: "This promo code is already applied" };
    }
    
    setIsValidatingPromo(true);
    
    try {
      const validation = await validatePromoCode(upperCode);
      
      if (validation.valid && validation.discount) {
        setPromoCode({ code: upperCode, discount: validation.discount });
        return { success: true, message: validation.message || `${validation.discount}% discount applied!` };
      } else {
        return { success: false, message: validation.message || "Invalid promo code" };
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      return { success: false, message: "Error validating promo code" };
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const markPromoCodeAsUsed = async (): Promise<void> => {
    if (promoCode) {
      try {
        await usePromoCode(promoCode.code);
      } catch (error) {
        console.error('Error marking promo code as used:', error);
      }
    }
  };

  const removePromoCode = () => {
    setPromoCode(null);
  };

  return (
    <CartContext.Provider 
      value={{
        cartItems,
        promoCode,
        isValidatingPromo,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getDiscountAmount,
        getDiscountedTotal,
        applyPromoCode,
        removePromoCode,
        markPromoCodeAsUsed
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};