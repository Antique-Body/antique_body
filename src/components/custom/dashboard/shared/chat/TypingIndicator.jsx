import React from "react";

export const TypingIndicator = ({ isTyping, userName }) => {
  if (!isTyping) return null;

  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] rounded-lg rounded-tl-none bg-[#222] p-3 text-white">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
          </div>
          <span className="ml-2 text-xs text-gray-400">
            {userName} is typing...
          </span>
        </div>
      </div>
    </div>
  );
}; 