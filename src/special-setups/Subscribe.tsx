import React from "react";

interface SubscribeButtonProps {
  className?: string;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ className }) => {
  return (
    <div
      className={`z-10 rounded-md bg-violet-600 px-6 py-1 text-center text-black ${className}`}
    >
      SUBSCRIBE
    </div>
  );
};

export default SubscribeButton;
