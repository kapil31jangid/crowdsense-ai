"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am CrowdSense AI. Need help navigating the stadium?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_location: "current location", destination: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.recommendation }]);
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[500px] bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
      <CardHeader className="border-b border-zinc-800 py-4 px-6 flex flex-row items-center gap-2">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Bot className="w-5 h-5 text-blue-500" />
        </div>
        <CardTitle className="text-lg font-semibold text-white">Smart Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea 
          className="flex-1 p-6" 
          role="log" 
          aria-live="polite" 
          aria-relevant="additions"
          aria-label="Chat messages"
        >
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user" ? "bg-zinc-700" : "bg-blue-600"
                    }`}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.role === "user" 
                        ? "bg-zinc-800 text-zinc-100 rounded-tr-none" 
                        : "bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800/50 border border-zinc-700 p-3 rounded-2xl rounded-tl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-zinc-800 flex gap-2 bg-zinc-900/40" role="form" aria-label="Send message">
          <Input
            placeholder="Where do you want to go?"
            aria-label="Message to AI assistant"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading} 
            size="icon" 
            className="bg-blue-600 hover:bg-blue-700"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
