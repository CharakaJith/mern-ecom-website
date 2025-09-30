import React, { useEffect, useState } from 'react';
import { CircleXIcon } from 'lucide-react';
import type { MessagePopupProp } from '@/types/messagePopupProps';

const MessagePopup: React.FC<MessagePopupProp> = ({ message }) => {
  const [visible, setVisible] = useState(true);

  // auto close
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 8000); // 8 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="
        fixed bottom-5 right-5 z-50 
        w-[90%] sm:w-80 md:w-96 lg:max-w-xl 
        p-4 bg-gray-900 border border-black 
        rounded-lg shadow-lg flex items-start gap-3 animate-slideIn
      "
    >
      {/* message */}
      <p className="flex-1 text-white text-sm sm:text-base">{message}</p>

      {/* close button */}
      <button onClick={() => setVisible(false)} className="text-white transition cursor-pointer">
        <CircleXIcon size={20} />
      </button>
    </div>
  );
};

export default MessagePopup;
