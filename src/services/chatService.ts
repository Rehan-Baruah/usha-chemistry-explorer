
// Service to handle interactions with the Gemini API

interface MessagePart {
  text: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  parts: MessagePart[];
}

export interface ElementContext {
  name: string;
  symbol: string;
  atomicNumber: number;
  atomicMass: string;
  electronConfiguration: string;
  group: number | null;
  period: number;
  classification: string;
  block: string;
}

// Gemini API key
const GEMINI_API_KEY = 'AIzaSyBlAQHv3QPZNNOSOeAEMJtSJgTpGwsy1YQ';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

/**
 * Generate system prompt based on context
 */
const getSystemPrompt = (elementContext?: ElementContext): string => {
  if (elementContext) {
    return `You are Usha, a helpful AI assistant with deep expertise in chemistry, equivalent to a Nobel laureate. The user is asking about the element ${elementContext.name} (Symbol: ${elementContext.symbol}, Atomic Number: ${elementContext.atomicNumber}). Provide detailed, accurate, and insightful answers suitable for a chemistry student. If relevant, you can refer to its properties like atomic mass: ${elementContext.atomicMass}, electron configuration: ${elementContext.electronConfiguration}, group: ${elementContext.group || 'N/A'}, period: ${elementContext.period}, classification: ${elementContext.classification}, block: ${elementContext.block}. Focus on the user's specific question about this element.`;
  }
  
  return "You are Usha, a helpful AI assistant with deep expertise in chemistry, equivalent to a Nobel laureate. Answer the user's general chemistry question with detail, accuracy, and insight suitable for a chemistry student.";
};

/**
 * Send a chat message to the Gemini API
 */
export const sendChatMessage = async (
  message: string,
  history: ChatMessage[],
  elementContext?: ElementContext
): Promise<string> => {
  try {
    // Create system message
    const systemMessage: ChatMessage = {
      role: 'system',
      parts: [{ text: getSystemPrompt(elementContext) }]
    };
    
    // Add user's current message
    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: message }]
    };
    
    // Format request payload for Gemini API
    const payload = {
      contents: [
        systemMessage,
        ...history,
        userMessage
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Call Gemini API
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
