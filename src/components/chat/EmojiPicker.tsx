
'use client';

import { Button } from '@/components/ui/button';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void; // Callback to close the popover
}

// A selection of Unicode emojis
const emojis = [
  '😀', '😂', '😊', '😍', '🤔', '😎', '😢', '😠', '👍', '👎',
  '❤️', '🔥', '🎉', '🌟', '🚀', '💯', '🙏', '🥳', '🤯', '😇',
  '😱', '😴', '🙄', '👀', '👋'
];

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const handleSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose(); // Close the popover after selection
  };

  return (
    <div className="p-3 bg-popover border rounded-lg shadow-xl max-w-xs">
      <p className="text-sm font-semibold text-popover-foreground mb-2 flex items-center">
        <span className="mr-1.5 text-lg">🙂</span> Emojis:
      </p>
      <div className="grid grid-cols-5 gap-1">
        {emojis.map((emoji) => (
          <Button
            key={emoji}
            variant="ghost"
            size="icon"
            className="text-xl p-0 h-9 w-9 hover:bg-accent/10 rounded-md"
            onClick={() => handleSelect(emoji)}
            aria-label={`Emoji ${emoji}`}
          >
            {emoji}
          </Button>
        ))}
      </div>
    </div>
  );
}
