
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface GeneralChatButtonProps {
  onClick: () => void;
}

const GeneralChatButton: React.FC<GeneralChatButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 rounded-full shadow-lg p-4 h-14 w-14 flex items-center justify-center"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Open Chat</span>
    </Button>
  );
};

export default GeneralChatButton;
