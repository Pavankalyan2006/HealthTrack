
import React from 'react';

interface EmojiButtonProps {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
  color?: string;
}

const EmojiButton: React.FC<EmojiButtonProps> = ({ 
  emoji, 
  label, 
  selected = false, 
  onClick,
  color
}) => {
  return (
    <button
      className={`flex flex-col items-center p-3 rounded-xl transition-all
        ${color ? color : ''}
        ${selected 
          ? 'bg-primary/20 ring-2 ring-primary scale-105 shadow-md' 
          : 'bg-secondary hover:bg-secondary/80'
        }
      `}
      onClick={onClick}
      aria-label={label}
    >
      <span className="text-3xl mb-1">{emoji}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
};

export default EmojiButton;
