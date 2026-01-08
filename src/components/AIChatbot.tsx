import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chat } from '@/generative-ai';

// Define the structure for a message part
interface MessagePart {
  text: string;
}

// Define the structure for a chat message
interface ChatMessage {
  role: 'user' | 'model';
  parts: MessagePart[];
}

// Pre-made prompts for the user
const suggestedPrompts = [
  "I'm feeling anxious today.",
  "Can you suggest a quick mindfulness exercise?",
  "Tell me something positive.",
  "What are some signs of burnout?",
];

const AIChatbot: React.FC = () => {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const newUserMessage: ChatMessage = { 
      role: 'user', 
      parts: [{ text: input.trim() }]
    };
    
    // Use a functional update to ensure we have the latest history
    setHistory(prevHistory => [...prevHistory, newUserMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat.sendMessage(currentInput);
      const response = result.response;
      const text = response.text();
      const newModelMessage: ChatMessage = { 
        role: 'model', 
        parts: [{ text }]
      };

      setHistory(prevHistory => [...prevHistory, newModelMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: "😔 Oops, I’m really sorry… something went wrong on my side.But hey, don’t stress about it! You can: 🌬 Try a quick breathing exercise to relax🎮 Play some fun mini-games available for free🧠 Take a short quiz/test to keep your mind engaged" }] };
      setHistory(prevHistory => [...prevHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[80vh] flex flex-col bg-card/80 backdrop-blur-lg border-border/20 shadow-xl rounded-2xl">
      <CardHeader className="flex flex-row items-center gap-3 border-b border-border/20 p-4">
        <div className="relative">
            <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-6 w-6" />
                </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card" />
        </div>
        <div>
            <CardTitle className="text-lg font-semibold">Project Sparv</CardTitle>
            <p className="text-sm text-muted-foreground">Your AI Companion</p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
        {history.length === 0 && (
          <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center p-6">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Bot className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-1">Welcome to Project Sparv</h2>
            <p>I'm your friendly AI companion, here to offer a listening ear and a bit of support.</p>
            <p className="text-sm">You can start by typing a message below or try one of the suggestions.</p>
          </div>
        )}

        <AnimatePresence>
          {history.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 items-start ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'model' && (
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-sm md:max-w-md p-3 px-4 rounded-2xl shadow-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-lg'
                    : 'bg-muted text-foreground rounded-bl-lg'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.parts[0].text}</p>
              </div>

              {message.role === 'user' && (
                <Avatar className="h-8 w-8 border-2 border-accent">
                  <AvatarFallback className="bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-end justify-start"
          >
            <Avatar className="h-8 w-8 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-xs p-3 px-4 rounded-2xl bg-muted rounded-bl-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </CardContent>
      
      <div className="p-4 pt-2 bg-card/50">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
            {suggestedPrompts.map((prompt) => (
                <Button 
                    key={prompt} 
                    variant="outline" 
                    size="sm" 
                    className="h-auto rounded-full px-4 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handlePromptClick(prompt)}
                >
                    {prompt}
                </Button>
            ))}
        </div>
        <div className="relative">
          <Input 
            placeholder="Share what's on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
            className="pr-12 h-12 rounded-full pl-5 text-base bg-muted"
          />
          <Button 
            size="icon" 
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full w-9 h-9"
            onClick={() => sendMessage()}
            disabled={isLoading || input.trim() === ''}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">Project Sparv is an AI and not a medical professional.</p>
      </div>
    </Card>
  );
};

export default AIChatbot;
