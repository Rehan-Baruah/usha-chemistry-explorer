
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface GeneralChatButtonProps {
  onClick: () => void;
}

const GeneralChatButton: React.FC<GeneralChatButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-purple-700 transition-colors z-20"
      aria-label="Open chat with Usha"
    >
      <MessageSquare className="h-6 w-6" />
    </button>
  );
};

export default GeneralChatButton;
