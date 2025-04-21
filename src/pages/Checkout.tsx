
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { validateUPSAddress, getUPSShippingRates, UPSAddress, UPSShippingRate } from "@/lib/supabase";

// Import our components
import CheckoutStepper from "@/components/checkout/CheckoutSteppers";
import PersonalInfoStep from "@/components/checkout/PersonalInfoStep";
import ShippingStep from "@/components/checkout/ShippingStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import OrderSummary from "@/components/checkout/OrderSummary";
import { CheckoutFormData } from "@/components/checkout/types";
import { sendOrderConfirmationEmail } from "@/components/checkout/EmailService";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { setOrderData } = useOrder();
  const navigate = useNavigate();
  
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
  
  // Default fallback shipping rates in case API fails
  const fallbackShippingRates: UPSShippingRate[] = [
    {
      serviceCode: "fallback_standard",
      serviceName: "Standard Delivery",
      totalPrice: 5.99,
      currency: "EUR",
      deliveryTimeEstimate: "3-5 business days"
    },
    {
      serviceCode: "fallback_express",
      serviceName: "Express Delivery",
      totalPrice: 12.99,
      currency: "EUR",
      deliveryTimeEstimate: "1-2 business days"
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "shippingMethod") {
      const selected = shippingRates.find(rate => rate.serviceCode === value) || 
                       fallbackShippingRates.find(rate => rate.serviceCode === value);
      if (selected) {
        setSelectedShippingRate(selected);
      }
    }
  };
  
  const handlePaymentSuccess = async (paymentInfo: any) => {
    console.log("Payment successful:", paymentInfo);
    const orderId = `EC${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
    
    try {
      const subtotal = getCartTotal();
      const shipping = selectedShippingRate ? selectedShippingRate.totalPrice : (subtotal > 0 ? 5.99 : 0);
      const tax = subtotal * 0.21;
      const total = subtotal + shipping + tax;
      
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
      toast({
        title: "Address Validation Error",
        description: "Please fill in all address fields before calculating shipping rates.",
        variant: "destructive"
      });
      return;
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
      
      // Try to validate address but handle failures gracefully
      let validatedAddresses: UPSAddress[] = [];
      try {
        validatedAddresses = await validateUPSAddress(upsAddress);
        console.log("Validated addresses:", validatedAddresses);
      } catch (error) {
        console.error("Address validation failed:", error);
        // Use original address if validation fails
        validatedAddresses = [upsAddress];
        
        toast({
          title: "Address Validation Notice",
          description: "We couldn't validate your address with UPS. Using address as entered.",
        });
      }
      
      if (validatedAddresses.length > 0) {
        const validAddress = validatedAddresses[0];
        
        setFormData(prev => ({
          ...prev,
          address: validAddress.addressLine,
          city: validAddress.city,
          postalCode: validAddress.postalCode,
        }));
        
        toast({
          title: "Address Processed",
          description: "Calculating shipping rates...",
        });
        
        // Try to fetch shipping rates with fallback
        await fetchShippingRates(validAddress);
      } else {
        // If no addresses were returned, show a fallback message and use fallback rates
        toast({
          title: "Address Not Found",
          description: "We couldn't find your address. Please check your input or try a different address.",
          variant: "destructive"
        });
        setShippingRates(fallbackShippingRates);
        
        if (!formData.shippingMethod) {
          setFormData(prev => ({
            ...prev,
            shippingMethod: fallbackShippingRates[0].serviceCode
          }));
          setSelectedShippingRate(fallbackShippingRates[0]);
        }
      }
    } catch (error) {
      console.error("Error in address validation flow:", error);
      // Use fallback shipping rates
      setShippingRates(fallbackShippingRates);
      
      if (!formData.shippingMethod) {
        setFormData(prev => ({
          ...prev,
          shippingMethod: fallbackShippingRates[0].serviceCode
        }));
        setSelectedShippingRate(fallbackShippingRates[0]);
      }
      
      toast({
        title: "Shipping Calculation Error",
        description: "There was an error connecting to UPS. We're using estimated shipping rates for your address.",
        variant: "destructive"
      });
    } finally {
      setIsValidatingAddress(false);
    }
  };
  
  const fetchShippingRates = async (toAddress: UPSAddress) => {
    setIsLoadingRates(true);
    
    try {
      console.log("Fetching shipping rates to:", toAddress);
      
      const fromAddress: UPSAddress = {
        addressLine: "123 Store St",
        city: "Dublin",
        postalCode: "D01 AB12",
        countryCode: "Ireland"
      };
      
      // Calculate package weight based on items in cart
      // Assuming each item weighs 0.5 kg as a default
      const totalWeight = Math.max(0.1, cartItems.reduce((sum, item) => sum + (item.quantity * 0.5), 0));
      
      console.log("Calculated package weight:", totalWeight, "kg");
      
      let rates: UPSShippingRate[] = [];
      try {
        rates = await getUPSShippingRates(fromAddress, toAddress, totalWeight);
        console.log("Received shipping rates:", rates);
      } catch (error) {
        console.error("Error fetching shipping rates:", error);
        // Use fallback rates if API call fails
        rates = fallbackShippingRates;
        
        toast({
          title: "Shipping Rates Error",
          description: "We couldn't retrieve real-time shipping rates. Using estimated rates instead.",
          variant: "destructive"
        });
      }
      
      if (rates && rates.length > 0) {
        setShippingRates(rates);
        setSelectedShippingRate(rates[0]);
        setFormData(prev => ({
          ...prev,
          shippingMethod: rates[0].serviceCode
        }));
        
        toast({
          title: "Shipping Options Available",
          description: `${rates.length} shipping options found for your address.`,
        });
      } else {
        // If no rates were returned, use fallback rates
        setShippingRates(fallbackShippingRates);
        setSelectedShippingRate(fallbackShippingRates[0]);
        setFormData(prev => ({
          ...prev,
          shippingMethod: fallbackShippingRates[0].serviceCode
        }));
        
        toast({
          title: "Shipping Options Limited",
          description: "We couldn't find specific shipping options for your address. Using standard rates instead.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in shipping rates flow:", error);
      // Use fallback rates as a last resort
      setShippingRates(fallbackShippingRates);
      setSelectedShippingRate(fallbackShippingRates[0]);
      setFormData(prev => ({
        ...prev,
        shippingMethod: fallbackShippingRates[0].serviceCode
      }));
      
      toast({
        title: "Shipping Calculation Failed",
        description: "An unexpected error occurred. Using standard shipping rates for your order.",
        variant: "destructive"
      });
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
      } else if (!formData.shippingMethod) {
        // If no rates available, use fallback
        setFormData(prev => ({
          ...prev,
          shippingMethod: fallbackShippingRates[0].serviceCode
        }));
        setSelectedShippingRate(fallbackShippingRates[0]);
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const subtotal = getCartTotal();
  const shipping = selectedShippingRate ? selectedShippingRate.totalPrice : (subtotal > 0 ? 5.99 : 0);
  const tax = subtotal * 0.21;
  const total = subtotal + shipping + tax;
  
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
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
