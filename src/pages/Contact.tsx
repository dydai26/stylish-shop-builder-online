import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import emailjs from 'emailjs-com';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Initialize EmailJS with your user ID (public key)
      emailjs.init("5Oigz1bCaEn2zPhRC");
      
      // Make sure all form fields are included in the template params
      const templateParams = {
        to_name: "Admin", // The recipient's name in the email template
        from_name: formData.name,
        from_email: formData.email,
        phone_number: formData.phone, // Make sure this matches your template variable
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email // This helps you reply directly to the sender
      };

      const result = await emailjs.send(
        "service_3301k2m", 
        "template_5jo06ng",
        templateParams
      );
      
      console.log("Email sent successfully:", result);
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqItems = [
    {
      question: " Are Ecovluu products suitable for all hair types?",
      answer: "Yes! Our formulas are crafted to support a wide range of hair types—from fine and straight to coily, dry, or color-treated. Each product balances scalp care with deep nourishment, without weighing the hair down."
    },
    {
      question: " Do your products contain sulfates, silicones, or parabens?",
      answer: "No SLS, no SLSA, no silicones, no parabens. The Hair Mask – Concentrate is 100% sulfate-free, making it ideal for dry, damaged, or sensitive hair."
    },
    {
      question: " Are your products vegan and cruelty-free?",
      answer: "Yes, Ecovluu is cruelty-free—we do not test on animals at any stage. The Deep Hydrating Shampoo is vegan. The Hair Mask contains hydrolyzed keratin, which is traditionally animal-derived."
    },
    {
      question: " Can I use Ecovluu products on color-treated hair?",
      answer: "Absolutely. Our formulas are color-safe and designed to maintain hydration and fiber integrity, helping prolong the vibrancy of your hair color."
    },
    {
      question: " What makes Ecovluu different from other clean hair care brands?",
      answer: "Ecovluu bridges the gap between clean beauty and professional performance. We combine high-performance botanical actives, amino acids, and modern green science with a commitment to transparency and ingredient purity."
    },
    {
      question: " How often should I use the Hair Mask – Concentrate?",
      answer: "Use it 1 time per week to deeply nourish and repair. For stressed or chemically treated hair, increase as needed. Leave on for at least 10 minutes to allow full absorption."
    },
    {
      question: " Are your products safe for sensitive scalps?",
      answer: "Yes. Our formulations are gentle, pH-balanced, and free from harsh or irritating ingredients. If you have specific sensitivities, we recommend a patch test before full use."
    },
    {
      question: " Where are Ecovluu products made?",
      answer: "All Ecovluu products are handmade in the Ireland, in small batches, with care and precision. This artisanal approach ensures freshness, quality control, and a personal touch in every bottle."
    },
    {
      question: " Do you offer samples or travel sizes?",
      answer: "Not yet—but we're working on it! Join our newsletter to be the first to hear about sample kits, travel editions, and new releases."
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Contact Us - Get in Touch | ECOVLUU</title>
        <meta name="description" content="Have questions about our natural hair care products? Contact the ECOVLUU team. We are here to help you restore and care for your hair." />
        <link rel="canonical" href="https://www.ecovluu.com/contact" />
      </Helmet>
      <div className="bg-gray-50 py-6 sm:py-8 md:py-12">
        <div className="container-custom">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-black text-center">Contact Us</h1>
          <p className="text-center text-black mb-8 sm:mb-12 text-sm sm:text-base px-4">
            Have questions? We're here to help you with your hair care journey.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
            <div className="order-2 lg:order-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium text-sm sm:text-base">
                    Your Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="email" className="block mb-1 font-medium text-sm sm:text-base">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block mb-1 font-medium text-sm sm:text-base">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-1 font-medium text-sm sm:text-base">
                    Subject*
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base bg-white"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Order Status">Order Status</option>
                    <option value="Hair Consultation">Hair Consultation</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-1 font-medium text-sm sm:text-base">
                    Your Message*
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded text-sm sm:text-base resize-none"
                    required
                  ></textarea>
                </div>
                
                <Button
                  type="submit"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black">Business Hours</h2>
              <div className="bg-gray-100 p-4 sm:p-6 rounded-lg mb-6 sm:mb-8">
                <ul className="space-y-2 text-sm sm:text-base">
                  <li className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-brand-brown/10 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-brand-brown" />
              </div>
                <h3 className="text-base sm:text-lg font-bold mb-2">Email Us</h3>
                <p className="text-gray-700 text-sm sm:text-base">info@ecovluu.com</p>
                <p className="text-gray-500 text-xs sm:text-sm">We'll respond within 24 hours</p>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="my-8 sm:my-12 md:my-16">
            <div className="text-center mb-6 sm:mb-8 md:mb-10 px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Still Have Questions?</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Want to know more about healthy eating and the services I offer?<br className="hidden sm:block" />
                <span className="sm:hidden"> </span>Drop the questions and answers section below or contact me in a way convenient for you.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto px-4">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                    <AccordionTrigger className="text-left font-medium hover:text-brand-orange text-sm sm:text-base py-3 sm:py-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-3 sm:pb-4 text-sm sm:text-base leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
