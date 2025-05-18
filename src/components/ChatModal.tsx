
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { chatService, Message } from '../services/chatService';
import { Loader2 } from "lucide-react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementContext?: { 
    name: string; 
    symbol: string; 
    atomicNumber: number;
  };
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, elementContext }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Add Usha's greeting message when the chat modal opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          role: 'model', 
          content: "Hello! I'm Usha. How can I assist you with your chemistry questions today?" 
        }
      ]);
    }
  }, [isOpen]);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = { role: 'user' as const, content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      const response = await chatService.sendMessage(
        userMessage.content, 
        messages, 
        elementContext
      );
      
      setMessages(prev => [
        ...prev, 
        { role: 'model', content: response }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'model', 
          content: "I'm having trouble connecting right now. Please try again in a moment." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {elementContext 
              ? `Chat about ${elementContext.name} (${elementContext.symbol})` 
              : "Chat with Usha"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden mb-4">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Usha is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex items-center gap-2">
          <Textarea
            placeholder="Type your chemistry question..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px]"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!inputText.trim() || isLoading}
            className="self-end"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-2">
          Usha is an AI assistant. Please verify critical information.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
