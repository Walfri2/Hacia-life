/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DialogoBubbleProps {
  dialogo: string;
  visible: boolean;
  onNext: () => void;
}

export const DialogoBubble: React.FC<DialogoBubbleProps> = ({
  dialogo,
  visible,
  onNext
}) => {
  return (
    <div
      onClick={onNext}
      className={`relative max-w-[90%] sm:max-w-md mx-auto px-4 py-2.5 bg-[#f6e9c8] text-[#0f3d2e] border-2 border-[#e0a93b] rounded-2xl shadow-lg text-center cursor-pointer transition-all duration-300 transform select-none ${
        visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
      }`}
      role="button"
      title="Toca para cambiar de frase"
    >
      <p className="font-serif-vintage text-sm sm:text-base font-semibold leading-snug tracking-tight m-0">
        "{dialogo}"
      </p>

      {/* Comic speech bubble tail pointing down */}
      <div
        className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#e0a93b]"
      />
      <div
        className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#f6e9c8]"
      />
    </div>
  );
};
