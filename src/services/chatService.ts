
import axios from 'axios';
import { ElementData } from '../components/ElementTile';

// Use API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Base URL for Gemini API
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent';

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
      console.log('[DEBUG] chatService.sendMessage called.');
      console.log('[DEBUG] VITE_GEMINI_API_KEY loaded:', API_KEY ? 'Exists and is not empty' : 'MISSING or EMPTY');

      // Build system prompt based on context
      let systemPrompt = "You are Usha, a helpful AI assistant with deep expertise in chemistry, equivalent to a Nobel laureate. ";
      if (elementContext) {
        systemPrompt += `The user is asking about the element ${elementContext.name} (Symbol: ${elementContext.symbol}, Atomic Number: ${elementContext.atomicNumber}). Provide detailed, accurate, and insightful answers suitable for a chemistry student. Focus on the user's specific question about this element. When explaining complex topics or providing detailed information, please try to structure your response with clear headings (e.g., using markdown like ## Heading) and subheadings (e.g., ### Subheading) where it enhances readability and organization. Use paragraphs for distinct ideas.`;
      } else {
        systemPrompt += "Answer the user's general chemistry question with detail, accuracy, and insight suitable for a chemistry student. When explaining complex topics or providing detailed information, please try to structure your response with clear headings (e.g., using markdown like ## Heading) and subheadings (e.g., ### Subheading) where it enhances readability and organization. Use paragraphs for distinct ideas.";
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

      const fullApiUrl = `${API_URL}?key=${API_KEY}`;
      const requestPayload = {
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      };

      console.log('[DEBUG] Calling Gemini API. URL:', fullApiUrl); // CAUTION: Key is in URL
      console.log('[DEBUG] Gemini Request Method: POST');
      console.log('[DEBUG] Gemini Request Body:', JSON.stringify(requestPayload));

      // Make API request
      const response = await axios.post(
        fullApiUrl,
        requestPayload
      );

      console.log('[DEBUG] Gemini API Status Code:', response.status);
      console.log('[DEBUG] Gemini API Response Body:', JSON.stringify(response.data));

      // Extract the response text
      const responseText = response.data.candidates[0].content.parts[0].text;
      return responseText;
    } catch (error: any) {
      console.error('[DEBUG] Error calling Gemini API (raw error object):', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('[DEBUG] Gemini API Error Status:', error.response.status);
        console.error('[DEBUG] Gemini API Error Body:', JSON.stringify(error.response.data));
      } else {
        console.error('[DEBUG] Non-Axios error details:', error.message);
      }
      // Re-throw the original error message but also provide a user-friendly one.
      // console.error('Error calling Gemini API (for UI):', error); // This was the original log, might be too verbose for UI path
      throw new Error('Failed to get response from AI assistant. Check console for details.');
    }
  }
};
