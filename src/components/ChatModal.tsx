
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { sendChatMessage, ChatMessage as GeminiChatMessage, ElementContext } from '../services/chatService';
import elementsData from '../data/elements.json';

// Helper function to find element by name
const findElementByName = (elementName: string): ElementContext | undefined => {
  const element = (elementsData as any[]).find(
    (el: any) => el.name.toLowerCase() === elementName.toLowerCase()
  );
  
  if (!element) return undefined;
  
  return {
    name: element.name,
    symbol: element.symbol,
    atomicNumber: element.atomicNumber,
    atomicMass: element.atomicMass,
    electronConfiguration: element.electronConfiguration,
    group: element.group,
    period: element.period,
    classification: element.classification,
    block: element.block
  };
};

interface Message {
  id: string;
  sender: 'user' | 'usha';
  text: string;
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementContext?: string; // Optional context for element-specific chats
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, elementContext }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<GeminiChatMessage[]>([]);
  
  // Initialize messages with welcome message based on element context
  const [messages, setMessages] = useState<Message[]>(() => {
    return [{
      id: '1',
      sender: 'usha',
      text: elementContext 
        ? `Hello! I'm Usha, your chemistry expert. I see you're interested in ${elementContext}. What would you like to know about this element?`
        : "Hello! I'm Usha, your chemistry expert. How can I assist you with your chemistry questions today?",
      timestamp: new Date()
    }];
  });
  
  // Update welcome message when elementContext changes
  useEffect(() => {
    if (messages.length === 1) { // Only update if it's just the welcome message
      setMessages([{
        id: '1',
        sender: 'usha',
        text: elementContext 
          ? `Hello! I'm Usha, your chemistry expert. I see you're interested in ${elementContext}. What would you like to know about this element?`
          : "Hello! I'm Usha, your chemistry expert. How can I assist you with your chemistry questions today?",
        timestamp: new Date()
      }]);
    }
  }, [elementContext]); // Only run when elementContext changes
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Transform our Messages array to Gemini's ChatMessage format
  const formatMessagesForGemini = () => {
    // Skip the first message (welcome message) and any system messages
    return messages.slice(1).map(message => ({
      role: message.sender === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: message.text }]
    }));
  };
  
  // Handle sending a message
  const handleSend = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    // Add user message to the UI immediately for better UX
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Format messages for Gemini API (exclude the first welcome message)
      const historyForGemini = formatMessagesForGemini();
      
      // Get element context data if we're in element-specific chat
      const elementData = elementContext ? findElementByName(elementContext) : undefined;
      
      console.log('Sending message with element context:', {
        elementContext,
        elementData,
        message: input,
        history: historyForGemini
      });
      
      // Send to Gemini API
      const response = await sendChatMessage(input, historyForGemini, elementData);
      
      console.log('Received response from Gemini:', response);
      
      // Add Usha's response
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'usha',
        text: response,
        timestamp: new Date()
      };
      
      // Replace the messages array to ensure we maintain the correct state
      setMessages(prev => {
        const newMessages = [...prev, responseMessage];
        // Update conversation history with the latest messages
        setConversationHistory(
          newMessages.slice(1).map(msg => ({
            role: msg.sender === 'user' ? 'user' as const : 'model' as const,
            parts: [{ text: msg.text }]
          }))
        );
        return newMessages;
      });
      
    } catch (error) {
      // Handle error
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'usha',
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to find element data by name
  const findElementByName = (name: string): ElementContext | undefined => {
    try {
      // Dynamically import elements data
      const elementsData = require('../data/elements.json');
      const element = elementsData.find((el: any) => el.name === name);
      
      if (!element) return undefined;
      
      return {
        name: element.name,
        symbol: element.symbol,
        atomicNumber: element.atomicNumber,
        atomicMass: element.atomicMass,
        electronConfiguration: element.electronConfiguration,
        group: element.group,
        period: element.period,
        classification: element.classification,
        block: element.block
      };
    } catch (error) {
      console.error('Error finding element data:', error);
      return undefined;
    }
  };
  
  // Handle pressing Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) { // Only send if not already loading
        handleSend();
      }
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col h-[80vh] max-h-[600px]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold">
              {elementContext ? `Chat with Usha about ${elementContext}` : 'Chat with Usha'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={input.trim() === '' || isLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
