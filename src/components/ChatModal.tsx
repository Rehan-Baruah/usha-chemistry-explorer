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
<<<<<<< HEAD
  
  
  // Scroll to new messages with specific behavior based on sender
  useEffect(() => {
    if (chatHistory.length === 0) {
      return;
    }

    const lastMessageIndex = chatHistory.length - 1;
    const lastMessageElementId = `chat-message-${lastMessageIndex}`;
    const lastMessageElement = document.getElementById(lastMessageElementId);

    if (lastMessageElement) {
      const lastMessage = chatHistory[lastMessageIndex];
      if (lastMessage.role === 'user') {
        // For user messages, scroll to make the bottom of the message visible
        lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      } else if (lastMessage.role === 'model') {
        // For Usha's messages, scroll to make the top of the message visible
        lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
=======
  const bottomRef = useRef<HTMLDivElement>(null);
  

  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
>>>>>>> ee4c5e5361ea1d46d6bed4286b6d58009903a204
    }
  }, [chatHistory]);
  
  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = { role: 'user' as const, content: inputText };
<<<<<<< HEAD
    setChatHistory(prev => [...prev, userMessage]);
=======
    // Update history immediately for responsiveness
    const currentChatHistory = [...chatHistory, userMessage];
    setChatHistory(currentChatHistory);
>>>>>>> ee4c5e5361ea1d46d6bed4286b6d58009903a204
    setInputText('');
    setIsLoading(true);
    
    try {
<<<<<<< HEAD
      const response = await chatService.sendMessage(
        userMessage.content, 
        chatHistory, 
=======
      // Pass the history *before* the current user message to the service
      const historyForService = chatHistory.slice(); 
      const response = await chatService.sendMessage(
        userMessage.content, 
        historyForService, // Use the state before adding the current user's message
>>>>>>> ee4c5e5361ea1d46d6bed4286b6d58009903a204
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
<<<<<<< HEAD
                  id={`chat-message-${index}`}
=======
>>>>>>> ee4c5e5361ea1d46d6bed4286b6d58009903a204
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground prose dark:prose-invert'}`}
                  >
                    {message.role === 'user' ? message.content : <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>}
                  </div>
                </div>
              ))}
<<<<<<< HEAD
              {/* isLoading indicator is outside the mapped messages, so scrollIntoView on last message works correctly */}
=======
>>>>>>> ee4c5e5361ea1d46d6bed4286b6d58009903a204
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Usha is thinking...</span>
                  </div>
                </div>
              )}
<<<<<<< HEAD
=======
              <div ref={bottomRef} />
>>>>>>> ee4c5e5361ea1d46d6bed4286b6d58009903a204
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
