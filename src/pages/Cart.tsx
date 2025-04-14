import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  
  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would verify the coupon code with your backend
    toast({
      title: "Invalid coupon",
      description: "The coupon code you entered is invalid or expired.",
      variant: "destructive",
    });
    
    setCouponCode("");
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding to checkout.",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to checkout with cart items
    navigate("/checkout");
  };
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm text-center">
              <div className="flex justify-center mb-4">
                <ShoppingBag className="h-16 w-16 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Link 
                to="/shop"
                className="inline-block bg-brand-orange text-white font-medium px-6 py-3 rounded hover:bg-brand-orange/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Desktop view - Table layout (hidden on mobile) */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hidden md:block">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left">Product</th>
                        <th className="px-6 py-4 text-center">Quantity</th>
                        <th className="px-6 py-4 text-right">Price</th>
                        <th className="px-6 py-4 text-right">Subtotal</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {cartItems.map((item) => (
                        <tr key={item.product.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded mr-4"
                              />
                              <div>
                                <Link 
                                  to={`/product/${item.product.id}`}
                                  className="font-medium text-brand-brown hover:underline"
                                >
                                  {item.product.name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 rounded hover:bg-gray-100"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="mx-2 w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 rounded hover:bg-gray-100"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            €{item.product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right font-medium">
                            €{(item.product.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-gray-500 hover:text-red-500"
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile view - Card layout (visible only on small screens) */}
                <div className="md:hidden space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="bg-white rounded-lg shadow-sm p-4">
                      <div className="flex items-start space-x-4">
                        {/* Product image */}
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded flex-shrink-0"
                        />
                        
                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${item.product.id}`}
                            className="font-medium text-brand-brown hover:underline block truncate"
                          >
                            {item.product.name}
                          </Link>
                          
                          <div className="mt-1 flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span>€{item.product.price.toFixed(2)}</span>
                          </div>
                          
                          <div className="mt-1 flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">€{(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                          
                          {/* Quantity controls and remove button */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center border border-gray-200 rounded">
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="px-2 py-1 hover:bg-gray-100"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 py-1 border-l border-r border-gray-200">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="px-2 py-1 hover:bg-gray-100"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-gray-500 hover:text-red-500 p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <Link 
                    to="/shop"
                    className="text-brand-brown hover:underline flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Continue Shopping
                  </Link>
                  
                  <Button
                    onClick={() => clearCart()}
                    variant="outline"
                    className="text-gray-600 border-gray-300"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
              
              <div>
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>€{shipping.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                      <span>Total</span>
                      <span>€{total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
