
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
  // Add any additional properties that might be useful for context
  [key: string]: any;
}

// Gemini API configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

if (!GEMINI_API_KEY) {
  const errorMsg = 'Error: VITE_GEMINI_API_KEY is not set in environment variables. Please check your .env file.';
  console.error(errorMsg);
  throw new Error(errorMsg);
}

/**
 * Generate system prompt based on context
 */
const getSystemPrompt = (elementContext?: ElementContext): string => {
  if (elementContext) {
    return `You are Usha, a helpful AI assistant with deep expertise in chemistry, equivalent to a Nobel laureate. 
    
The user is asking about the element ${elementContext.name} (${elementContext.symbol}). Here's what you know about this element:
- Atomic Number: ${elementContext.atomicNumber}
- Atomic Mass: ${elementContext.atomicMass}
- Electron Configuration: ${elementContext.electronConfiguration}
- Group: ${elementContext.group || 'N/A'}
- Period: ${elementContext.period}
- Classification: ${elementContext.classification}
- Block: ${elementContext.block}

When responding:
1. Always acknowledge the element being discussed at the beginning of your response.
2. Provide detailed, accurate, and insightful answers focused specifically on this element.
3. If the question is general or unclear, provide a brief overview of the element's key properties and significance.
4. Use your knowledge to explain concepts clearly and help the user understand the chemistry behind this element.`;
  }
  
  return `You are Usha, a helpful AI assistant with deep expertise in chemistry, equivalent to a Nobel laureate. 
  
When responding to general chemistry questions:
1. Provide clear, accurate, and detailed explanations suitable for a chemistry student.
2. Break down complex concepts into understandable parts.
3. Use examples and analogies where helpful.
4. If a question is unclear, ask for clarification.

For the best answers, please be specific with your questions about chemical elements, reactions, or concepts.`;
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
    console.log('Sending message to Gemini API with context:', {
      message,
      hasElementContext: !!elementContext,
      elementContext,
      historyLength: history.length
    });

    // Create system message as the first user message
    const systemMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: getSystemPrompt(elementContext) }]
    };
    
    // Add user's current message
    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: message }]
    };
    
    // Format request payload for Gemini API
    // For element-specific chats, we want to make sure the system message is always first
    // and the history is properly formatted
    const contents = [systemMessage];
    
    // Add history if it exists, making sure to format it correctly
    if (history && history.length > 0) {
      // Filter out any existing system messages from history to avoid duplication
      const filteredHistory = history.filter(msg => msg.role !== 'user' || 
        !msg.parts[0].text.includes('You are Usha, a helpful AI assistant'));
      contents.push(...filteredHistory);
    }
    
    // Add the current user message
    contents.push(userMessage);
    
    const payload = {
      contents,
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    console.log('Gemini API request payload:', JSON.stringify(payload, null, 2));

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
