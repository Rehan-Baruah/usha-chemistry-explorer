import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { chatService, Message } from '../services/chatService';
import { Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ElementData } from './ElementTile';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementContext?: ElementData;
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, elementContext, chatHistory, setChatHistory }) => {
  const [inputText, setInputText] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  

  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);
  
  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = { role: 'user' as const, content: inputText };
    // Update history immediately for responsiveness
    const currentChatHistory = [...chatHistory, userMessage];
    setChatHistory(currentChatHistory);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Pass the history *before* the current user message to the service
      const historyForService = chatHistory.slice(); 
      const response = await chatService.sendMessage(
        userMessage.content, 
        historyForService, // Use the state before adding the current user's message
        elementContext
      );
      
      setChatHistory(prev => [
        ...prev, 
        { role: 'model', content: response }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory(prev => [
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
              {chatHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground prose dark:prose-invert'}`}
                  >
                    {message.role === 'user' ? message.content : <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>}
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
