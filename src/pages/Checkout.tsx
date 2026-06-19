
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { validateUPSAddress, getUPSShippingRates, UPSAddress, UPSShippingRate } from "@/lib/supabase";
import { useTikTokTracking } from "@/hooks/useTikTokTracking";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import { useGoogleTracking } from "@/hooks/useGoogleTracking";

// Import our components
import CheckoutStepper from "@/components/checkout/CheckoutSteppers";
import PersonalInfoStep from "@/components/checkout/PersonalInfoStep";
import ShippingStep from "@/components/checkout/ShippingStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import OrderSummary from "@/components/checkout/OrderSummary";
import { CheckoutFormData } from "@/components/checkout/types";
import { sendOrderConfirmationEmail } from "@/components/checkout/EmailService";
import { saveOrderToDatabase } from "@/lib/orderService";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, promoCode, getDiscountAmount, getDiscountedTotal, markPromoCodeAsUsed } = useCart();
  const { setOrderData } = useOrder();
  const navigate = useNavigate();
  const { trackInitiateCheckout, trackPurchase: trackMetaPurchase } = useMetaTracking();
  const { trackBeginCheckout: trackGoogleBeginCheckout, trackPurchase: trackGooglePurchase } = useGoogleTracking();
  
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      trackInitiateCheckout(cartItems, getDiscountedTotal());
      trackGoogleBeginCheckout(cartItems, getDiscountedTotal());
    }
  }, []); // Only track once when checkout is initiated
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Ireland",
    paymentMethod: "stripe",
    shippingMethod: ""
  });
  
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [shippingRates, setShippingRates] = useState<UPSShippingRate[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [selectedShippingRate, setSelectedShippingRate] = useState<UPSShippingRate | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Shipping rates are only calculated when the user clicks "Validate with UPS"
  // Automatic calculation is disabled to satisfy user requirements
  /*
  useEffect(() => {
    const { address, city, postalCode, country } = formData;
    
    if (currentStep === 2 && address && city && postalCode && country && !isValidatingAddress && !isLoadingRates) {
      const timer = setTimeout(() => {
        validateAddress();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [formData.address, formData.city, formData.postalCode, formData.country, currentStep]);
  */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "shippingMethod") {
      const selected = shippingRates.find(rate => rate.serviceCode === value);
      if (selected) {
        setSelectedShippingRate(selected);
      }
    }
  };
  
  const handlePaymentSuccess = async (paymentInfo: any) => {
    console.log("Payment successful:", paymentInfo);
    const orderId = `EC${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
    
    try {
      // Mark promo code as used
      if (promoCode) {
        try {
          await markPromoCodeAsUsed();
        } catch (error) {
          console.error('Error marking promo code as used:', error);
        }
      }

      const subtotal = getCartTotal();
      const discountAmount = getDiscountAmount();
      const discountedSubtotal = getDiscountedTotal();
      const shipping = selectedShippingRate ? selectedShippingRate.totalPrice : (subtotal > 0 ? 5.99 : 0);
      const tax = 0;
      const total = discountedSubtotal + shipping;
      
      const orderData = {
        orderId,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        items: cartItems,
        shipping: selectedShippingRate ? {
          name: selectedShippingRate.serviceName,
          price: selectedShippingRate.totalPrice
        } : { name: "Standard Shipping", price: 5.99 },
        subtotal: subtotal,
        discount: promoCode ? { code: promoCode.code, amount: discountAmount } : null,
        tax: tax,
        total: total,
        date: new Date().toISOString(),
        paymentInfo: paymentInfo
      };
      
      console.log("Setting order data:", orderData);
      setOrderData(orderData);
      
      try {
        await sendOrderConfirmationEmail(orderData);
        console.log("Order confirmation email sent");
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
      }

      try {
        await saveOrderToDatabase(orderData);
        console.log("Order saved to database");
        
        // Track Purchase event
        trackMetaPurchase(cartItems, total, orderId);
        trackGooglePurchase(cartItems, total, orderId);
      } catch (dbError) {
        console.error("Failed to save order to database:", dbError);
      }
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });
      
      clearCart();
      navigate("/order-success", { state: { orderData } });
    } catch (error) {
      console.error("Error processing order:", error);
      setProcessingPayment(false);
      toast({
        title: "Order Error",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const validateAddress = async () => {
    const { address, city, postalCode, country } = formData;
    
    if (!address || !city || !postalCode || !country) {
      return; // Silently return if fields are not filled
    }
    
    setIsValidatingAddress(true);
    
    try {
      console.log("Validating address with UPS:", { address, city, postalCode, country });
      
      const upsAddress: UPSAddress = {
        addressLine: address,
        city: city,
        postalCode: postalCode,
        countryCode: country,
      };
      
      // Validate address with UPS
      let validatedAddresses: UPSAddress[] = [];
      try {
        validatedAddresses = await validateUPSAddress(upsAddress);
        console.log("Validated addresses:", validatedAddresses);
      } catch (error) {
        console.error("Address validation failed:", error);
        // Use original address if validation fails
        validatedAddresses = [upsAddress];
      }
      
      if (validatedAddresses.length > 0) {
        const validAddress = validatedAddresses[0];
        
        // Update address only if it was corrected
        if (validAddress.addressLine !== address || 
            validAddress.city !== city || 
            validAddress.postalCode !== postalCode) {
          setFormData(prev => ({
            ...prev,
            address: validAddress.addressLine,
            city: validAddress.city,
            postalCode: validAddress.postalCode,
          }));
        }
        
        // Fetch shipping rates from UPS API
        await fetchShippingRates(validAddress);
      }
    } catch (error) {
      console.error("Error in address validation flow:", error);
      toast({
        title: "Shipping Calculation Error",
        description: "Unable to calculate shipping rates. Please check your address.",
        variant: "destructive"
      });
    } finally {
      setIsValidatingAddress(false);
    }
  };
  
  const fetchShippingRates = async (toAddress: UPSAddress) => {
    setIsLoadingRates(true);
    
    try {
      console.log("Fetching shipping rates from UPS API:", toAddress);
      
      const fromAddress: UPSAddress = {
        addressLine: "A6, Block A, Santry Business Park, Swords Road",
        city: "Dublin",
        postalCode: "D09 X6V9",
        countryCode: "IE"
      };
      
      // Calculate package weight based on items in cart
      const totalWeight = Math.max(0.1, cartItems.reduce((sum, item) => sum + (item.quantity * 0.5), 0));
      
      console.log("Package weight:", totalWeight, "kg");
      
      // Get real-time shipping rates from UPS API
      const rates = await getUPSShippingRates(fromAddress, toAddress, totalWeight);
      console.log("UPS API rates received:", rates);
      
      // Add 23% VAT to all UPS shipping rates
      const ratesWithVAT = rates.map(rate => ({
        ...rate,
        totalPrice: Number((rate.totalPrice * 1.23).toFixed(2))
      }));
      console.log("Final rates with 23% VAT:", ratesWithVAT);
      
      if (ratesWithVAT && ratesWithVAT.length > 0) {
        setShippingRates(ratesWithVAT);
        setSelectedShippingRate(ratesWithVAT[0]);
        setFormData(prev => ({
          ...prev,
          shippingMethod: ratesWithVAT[0].serviceCode
        }));
      } else {
        throw new Error("No shipping rates available");
      }
    } catch (error) {
      console.error("Error fetching UPS shipping rates:", error);
      toast({
        title: "Shipping Calculation Error",
        description: "Unable to calculate shipping rates from UPS. Please try again.",
        variant: "destructive"
      });
      setShippingRates([]);
    } finally {
      setIsLoadingRates(false);
    }
  };
  
  const handleBackToCart = () => {
    navigate("/cart");
  };
  
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields to continue.",
          variant: "destructive"
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.address || !formData.city || !formData.postalCode || !formData.country) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required shipping information.",
          variant: "destructive"
        });
        return;
      }
      
      if (!formData.shippingMethod && shippingRates.length > 0) {
        // If no shipping method is selected but rates are available, auto-select the first one
        setFormData(prev => ({
          ...prev,
          shippingMethod: shippingRates[0].serviceCode
        }));
        setSelectedShippingRate(shippingRates[0]);
      } else if (!formData.shippingMethod && shippingRates.length === 0) {
        toast({
          title: "No Shipping Options",
          description: "Please validate your address to calculate shipping rates.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const subtotal = getCartTotal();
  const discountAmount = getDiscountAmount();
  const discountedSubtotal = getDiscountedTotal();
  const shipping = selectedShippingRate ? selectedShippingRate.totalPrice : (subtotal > 0 ? 5.99 : 0);
  const tax = 0;
  const total = discountedSubtotal + shipping;
  
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-6 sm:py-12 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToCart}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Checkout</h1>
          </div>

          <CheckoutStepper currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                {currentStep === 1 && (
                  <PersonalInfoStep 
                    formData={formData}
                    handleChange={handleChange}
                    handleNextStep={handleNextStep}
                  />
                )}
                
                {currentStep === 2 && (
                  <ShippingStep 
                    formData={formData}
                    handleChange={handleChange}
                    handlePrevStep={handlePrevStep}
                    handleNextStep={handleNextStep}
                    validateAddress={validateAddress}
                    isValidatingAddress={isValidatingAddress}
                    shippingRates={shippingRates}
                  />
                )}
                
                {currentStep === 3 && (
                  <PaymentStep 
                    formData={formData}
                    handleChange={handleChange}
                    handlePrevStep={handlePrevStep}
                    handlePaymentSuccess={handlePaymentSuccess}
                    processingPayment={processingPayment}
                    setProcessingPayment={setProcessingPayment}
                    total={total}
                    cartItems={cartItems}
                  />
                )}
              </div>
            </div>
            
            <div>
              <OrderSummary 
                cartItems={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                selectedShippingRate={selectedShippingRate}
                discount={promoCode ? { code: promoCode.code, amount: discountAmount } : null}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
