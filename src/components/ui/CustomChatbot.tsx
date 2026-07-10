import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface BotFAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

const DEFAULT_FAQS: BotFAQ[] = [
  {
    id: "default-1",
    question: "What is ECOVLUU?",
    answer: "ECOVLUU bridges the gap between clean beauty and professional performance. We combine high-performance botanical actives, amino acids, and modern green science with a commitment to transparency and ingredient purity. All our products are organic, sulfate-free, silicone-free, and paraben-free.",
    display_order: 1
  },
  {
    id: "default-2",
    question: "Shipping & Delivery",
    answer: "We offer free standard delivery for all orders above €50! Standard delivery typically takes 2-3 business days. For orders under €50, a standard shipping fee of €4.95 applies.",
    display_order: 2
  },
  {
    id: "default-3",
    question: "Return Policy",
    answer: "You can return any unopened and unused product in its original packaging within 14 days of purchase. Please contact our support team to request a return label.",
    display_order: 3
  },
  {
    id: "default-4",
    question: "Which shampoo should I choose?",
    answer: "For dry, damaged, or color-treated hair, we highly recommend our Deep Hydrating Shampoo paired with the Deep Conditioning Hair Mask for the best moisturizing and strengthening results.",
    display_order: 4
  },
  {
    id: "default-5",
    question: "Are products safe for colored hair?",
    answer: "Absolutely! All ECOVLUU products are sulfate-free and formulated to be extremely gentle, which helps maintain hair fiber integrity and prolongs the vibrancy of your hair color.",
    display_order: 5
  }
];

const CustomChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<BotFAQ[]>(DEFAULT_FAQS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load FAQs from Supabase
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("bot_faqs")
          .select("*")
          .order("display_order", { ascending: true });
        
        if (error) throw error;
        if (data && data.length > 0) {
          setFaqs(data as any as BotFAQ[]);
        }
      } catch (err) {
        console.warn("Failed to fetch bot FAQs from database, using local defaults:", err);
      }
    };
    fetchFaqs();
  }, []);

  // Restore/Initialize chat history in sessionStorage
  useEffect(() => {
    const savedMessages = sessionStorage.getItem("ecovluu_chat_history");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(parsed);
      } catch (e) {
        initializeGreeting();
      }
    } else {
      initializeGreeting();
    }
  }, []);

  // Save chat history to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("ecovluu_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  const initializeGreeting = () => {
    setMessages([
      {
        id: "greeting",
        text: "Hello! I am your ECOVLUU Assistant. How can I help you restore, hydrate, or strengthen your hair today? Feel free to ask a question or click one of the quick options below.",
        sender: "bot",
        timestamp: new Date()
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages, isBotTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      text: text,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsBotTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const responseText = generateBotResponse(text);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        text: responseText,
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userText: string): string => {
    const normalized = userText.toLowerCase().trim();

    // 1. Direct exact or loose match against our FAQs
    const matchedFaq = faqs.find(
      faq => 
        normalized.includes(faq.question.toLowerCase()) || 
        faq.question.toLowerCase().includes(normalized)
    );

    if (matchedFaq) {
      return matchedFaq.answer;
    }

    // 2. Keyword checking
    if (normalized.includes("shampoo") || normalized.includes("shampoos") || normalized.includes("wash")) {
      return "Our Deep Hydrating Shampoo is organic, sulfate-free, and recommended by professionals. It uses gentle cleansers that lock in moisture. For best results, use it with our Deep Conditioning Hair Mask!";
    }
    if (normalized.includes("mask") || normalized.includes("condition") || normalized.includes("treatment")) {
      return "The ECOVLUU Deep Conditioning Hair Mask is a concentrate rich in hydrolyzed keratin, Abyssinian oil, and aloe vera. Apply it for 5-10 minutes once a week to repair dry or damaged cuticles.";
    }
    if (normalized.includes("ship") || normalized.includes("shipping") || normalized.includes("delivery") || normalized.includes("deliver")) {
      return "We deliver standard packages in 2-3 business days. Shipping is FREE for orders above €50! Otherwise, standard shipping is €4.95.";
    }
    if (normalized.includes("refund") || normalized.includes("return") || normalized.includes("money back")) {
      return "We offer a 14-day refund policy for unopened, unused products in their original packaging. Please contact info@ecovluu.com to request a return label.";
    }
    if (normalized.includes("organic") || normalized.includes("natural") || normalized.includes("ingredients") || normalized.includes("sulfate") || normalized.includes("silicone")) {
      return "ECOVLUU products are sulfate-free, silicone-free, and paraben-free. We use natural active ingredients like Crambe Abyssinica oil, Aloe Vera, Saffron extract, and Chamomile to nourish your scalp and hair safely.";
    }
    if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("hey") || normalized.includes("привіт") || normalized.includes("здравствуйте")) {
      return "Hello! How can I assist you with your hair care routine or order today?";
    }

    return "I'm sorry, I don't have a direct answer for that. You can click on the quick options, check our Shop page, or email us at info@ecovluu.com for personal support!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend(inputValue);
    }
  };

  // Get distinct questions that haven't been asked in the last message
  const getQuickOptions = () => {
    return faqs.slice(0, 4); // Limit to top 4 options
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-4 sm:right-6 z-50 p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-white",
          isOpen ? "bg-brand-brown" : "bg-brand-orange animate-netflix-pulse hover:bg-brand-orange/95"
        )}
        aria-label="Open Chatbot"
      >
        {isOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />}
      </button>

      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[400px] h-[500px] bg-[#FAF5F0] rounded-2xl shadow-2xl border border-brand-brown/10 overflow-hidden flex flex-col animate-fade-in">
          {/* Header */}
          <div className="bg-brand-brown text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20 text-brand-orange">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm flex items-center gap-1.5">
                  EcoVluu Assistant
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-gray-300">Online & Ready</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message Stream Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-custom bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2 max-w-[85%]",
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-brand-brown/5 border border-brand-brown/10 flex items-center justify-center shrink-0 text-brand-brown">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div className="flex flex-col gap-1">
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed text-left",
                      msg.sender === "user"
                        ? "bg-brand-orange text-white rounded-br-none"
                        : "bg-[#FAF5F0] text-gray-800 rounded-bl-none border border-brand-brown/5"
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 text-left px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isBotTyping && (
              <div className="flex items-end gap-2 mr-auto max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-brand-brown/5 border border-brand-brown/10 flex items-center justify-center shrink-0 text-brand-brown">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex space-x-1.5 p-3 bg-[#FAF5F0] rounded-2xl rounded-bl-none border border-brand-brown/5 justify-center items-center">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick-reply options list */}
          {!isBotTyping && faqs.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2 justify-start shrink-0 max-h-[110px] overflow-y-auto">
              {getQuickOptions().map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleSend(faq.question)}
                  className="px-2.5 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-semibold hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-200 text-left truncate max-w-full"
                >
                  {faq.question}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Footer */}
          <div className="p-3 bg-[#FAF5F0] border-t border-brand-brown/10 flex gap-2 items-center shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 min-w-0 px-4 py-2 rounded-xl text-sm border border-gray-200 bg-white focus:outline-none focus:border-brand-orange transition-colors placeholder-gray-400"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
              className={cn(
                "p-2.5 rounded-xl text-white transition-all duration-200 shrink-0",
                inputValue.trim()
                  ? "bg-brand-orange hover:bg-brand-orange/90 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomChatbot;
