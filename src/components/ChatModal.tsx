
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { sendChatMessage, ChatMessage as GeminiChatMessage, ElementContext } from '../services/chatService';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'usha',
      text: elementContext 
        ? `Hello! I'm Usha, a Nobel laureate in Chemistry (AI). Ask me anything about ${elementContext}!`
        : "Hello! I'm Usha, a Nobel laureate in Chemistry (AI). How can I assist you with your chemistry questions today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<GeminiChatMessage[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Transform our Messages array to Gemini's ChatMessage format
  const formatMessagesForGemini = () => {
    return messages.map(message => ({
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
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Format messages for Gemini API
      const historyForGemini = formatMessagesForGemini();
      
      // Get element context data if we're in element-specific chat
      const elementData = elementContext ? findElementByName(elementContext) : undefined;
      
      // Send to Gemini API
      const response = await sendChatMessage(input, historyForGemini, elementData);
      
      // Add Usha's response
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'usha',
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
      
      // Update conversation history
      setConversationHistory(formatMessagesForGemini());
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'usha',
        text: "I'm sorry, I couldn't process your request right now. Please try again later.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chat error:', error);
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
  
  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={2}
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
