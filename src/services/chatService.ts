
import axios from 'axios';
import { ElementData } from '../components/ElementTile';

// Use API key - hardcoded for now since environment variable isn't working
const API_KEY = 'AIzaSyBlAQHv3QPZNNOSOeAEMJtSJgTpGwsy1YQ';

// Base URL for Gemini API
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export type Message = {
  role: 'user' | 'model';
  content: string;
};

export const chatService = {
  sendMessage: async (
    message: string, 
    history: Message[] = [], 
    elementContext?: ElementData
  ) => {
    try {
      // Build system prompt based on context
      let systemPrompt = "You are Usha, a helpful AI assistant with deep expertise in chemistry, equivalent to a Nobel laureate. ";
      
      if (elementContext) {
        systemPrompt += `The user is asking about the element ${elementContext.name} (Symbol: ${elementContext.symbol}, Atomic Number: ${elementContext.atomicNumber}). Provide detailed, accurate, and insightful answers suitable for a chemistry student. Focus on the user's specific question about this element.`;
      } else {
        systemPrompt += "Answer the user's general chemistry question with detail, accuracy, and insight suitable for a chemistry student.";
      }
      
      // Format history for Gemini API
      const formattedHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));
      
      // Create the contents array with system prompt and history
      const contents = [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];
      
      // Make API request
      const response = await axios.post(
        `${API_URL}?key=${API_KEY}`,
        {
          contents,
          systemInstruction: { text: systemPrompt },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }
      );
      
      // Extract the response text
      const responseText = response.data.candidates[0].content.parts[0].text;
      return responseText;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from AI assistant');
    }
  }
};
