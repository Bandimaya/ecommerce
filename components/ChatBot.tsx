"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}



const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hi there! How can I help you today?', isBot: true },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const quickReplies = [
    'Browse kits',
    '3D Printer rental',
    'Programs',
    'Track an order',
  ];

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botResponses: Record<string, string> = {
        ['Browse kits']: 'You can browse kits on our Shop page.',
        ['3D Printer rental']: 'Our printer rental plans start at $20/day.',
        ['Programs']: 'We offer workshops, summer camps, and teacher training.',
        ['Track an order']: 'Please provide your order ID and we will check the status.',
      };

      const botMessage: Message = {
        id: Date.now(),
        text: botResponses[messageText] || "Thanks for your message! We'll get back to you shortly.",
        isBot: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 800);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={false}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-colors duration-300 ${
          isOpen ? "bg-slate-800" : "bg-primary"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
          >
            {/* Header - Solid Primary */}
            <div className="bg-primary p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Chat with us</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-[11px] text-white/80 font-medium uppercase tracking-wider">Online</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area - Pure White Background */}
            <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3.5 shadow-sm ${
                      message.isBot
                        ? "bg-slate-50 text-slate-800 rounded-2xl rounded-tl-none border border-slate-100"
                        : "bg-primary text-white rounded-2xl rounded-tr-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies & Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex flex-wrap gap-2 mb-4">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="text-[12px] px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-slate-50 rounded-full px-4 py-1 border border-slate-100 focus-within:border-primary/30 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder={'Type a message...'}
                  className="flex-1 py-2.5 bg-transparent border-0 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <Button
                  onClick={() => handleSend()}
                  size="icon"
                  className="h-8 w-8 rounded-full bg-primary hover:bg-primary/90 shrink-0 shadow-sm"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
