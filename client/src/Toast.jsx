import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";

function Toast({ message, duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <FaCheck className="text-xl" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

export default Toast;
