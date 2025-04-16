import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { validateUPSAddress, getUPSShippingRates, UPSAddress, UPSShippingRate } from "@/lib/supabase";

// Import our new components
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
      const subtotal = getCartTotal();
      const shipping = selectedShippingRate ? selectedShippingRate.totalPrice : (subtotal > 0 ? 8.93 : 0);
      const total = subtotal + shipping;
      
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
        } : { name: "Standard Shipping", price: 8.93 },
        subtotal: subtotal,
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
        description: "Please fill in all address fields before validating.",
        variant: "destructive"
      });
      return;
    }
    
    setIsValidatingAddress(true);
    
    try {
      const upsAddress: UPSAddress = {
        addressLine: address,
        city: city,
        postalCode: postalCode,
        countryCode: country,
      };
      
      const validatedAddresses = await validateUPSAddress(upsAddress);
      
      if (validatedAddresses.length > 0) {
        const validAddress = validatedAddresses[0];
        
        setFormData(prev => ({
          ...prev,
          address: validAddress.addressLine,
          city: validAddress.city,
          postalCode: validAddress.postalCode,
        }));
        
        toast({
          title: "Address Validated",
          description: "Your shipping address has been validated by UPS.",
        });
        
        fetchShippingRates(validAddress);
      } else {
        toast({
          title: "Address Not Found",
          description: "UPS could not validate this address. Please check your input.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error validating address:", error);
      toast({
        title: "Address Validation Error",
        description: "There was an error validating your address with UPS.",
        variant: "destructive"
      });
    } finally {
      setIsValidatingAddress(false);
    }
  };
  
  const fetchShippingRates = async (toAddress: UPSAddress) => {
    setIsLoadingRates(true);
    
    try {
      const fromAddress: UPSAddress = {
        addressLine: "123 Store St",
        city: "Dublin",
        postalCode: "D01 AB12",
        countryCode: "Ireland"
      };
      
      const totalWeight = cartItems.reduce((sum, item) => sum + (item.quantity * 0.5), 0);
      
      const rates = await getUPSShippingRates(fromAddress, toAddress, totalWeight);
      
      setShippingRates(rates);
      if (rates.length > 0) {
        setSelectedShippingRate(rates[0]);
        setFormData(prev => ({
          ...prev,
          shippingMethod: rates[0].serviceCode
        }));
      }
    } catch (error) {
      console.error("Error fetching shipping rates:", error);
      toast({
        title: "Shipping Rates Error",
        description: "Could not get UPS shipping rates.",
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
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  const subtotal = getCartTotal();
  const shipping = selectedShippingRate ? selectedShippingRate.totalPrice : (subtotal > 0 ? 8.93 : 0);
  const total = subtotal + shipping;
  
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
