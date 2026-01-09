import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !agreed) {
      toast({
        title: "Error",
        description: "Please enter your email and agree to receive messages.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "default",
          });
        } else {
          console.error("Subscription error:", error);
          toast({
            title: "Error",
            description: "Failed to subscribe. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Success!",
          description: "Thank you for subscribing to our newsletter!",
        });
        setEmail("");
        setAgreed(false);
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
  <div className="container-custom">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
      {/* Left side - Newsletter form */}
      <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
        {/* Заголовок і опис */}
        <div className="text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4 leading-tight">
            Receive Ecovluu's<br />news and offers!
          </h2>
          <p className="text-black text-sm sm:text-base md:text-lg leading-relaxed">
            Subscribe to our newsletter to enjoy<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>all the benefits.
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-left">
          <Input
            type="email"
            placeholder="Type in your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-sm lg:max-w-none h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base rounded-lg border-gray-300"
            required
          />
          
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Checkbox
              id="newsletter-agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-0.5 sm:mt-0"
            />
            <label 
              htmlFor="newsletter-agreement" 
              className="text-xs sm:text-sm text-black cursor-pointer leading-relaxed"
            >
              I agree to receive news and promotional messages.
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg text-sm sm:text-base w-full max-w-sm lg:max-w-none"
          >
            {isLoading ? "Subscribing..." : "subscribe"}
          </Button>
        </form>
      </div>
    
      {/* Right side - Image */}
      <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-200 order-1 lg:order-2">
        <img 
          src="/newslatter.jpg" 
          alt="Newsletter banner" 
          className="absolute inset-0 w-full h-full object-cover"
           loading="lazy"
            decoding="async"
        />
      </div>
    </div>
  </div>    
    </section>
  );
};

export default NewsletterSection;