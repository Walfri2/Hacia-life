/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plane, Heart, PartyPopper } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-fadeIn">
      <div className="w-full max-w-md bg-[#fdf8ee] text-[#0f3d2e] rounded-3xl border-4 border-[#e0a93b] shadow-2xl p-6 text-center space-y-4 relative overflow-hidden">
        {/* Festive top aura */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#e0a93b]/20 flex items-center justify-center text-4xl shadow-inner border border-[#e0a93b]">
          🗽
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16553f] text-[#f6e9c8] text-xs font-semibold tracking-wider uppercase mb-2">
            <PartyPopper size={14} />
            <span>¡Misión Cumplida!</span>
          </div>

          <h2 className="font-serif-vintage text-2xl font-bold text-[#0f3d2e]">
            ¡Haci llegó a La Yuma!
          </h2>

          <p className="text-xs sm:text-sm text-[#0f3d2e]/85 mt-2 leading-relaxed font-serif-vintage">
            "Entre electrodos quemados, ventanas habaneras, bicitaxis y tazas de café colao...
            el esfuerzo valió cada gota de sudor. ¡Hoy Haci camina por el Malecón de Miami con la frente en alto y el corazón en Cuba!"
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#fff8e3] border border-[#e0a93b]/50 text-xs text-[#16553f] flex items-center justify-center gap-2 font-medium">
          <Heart size={16} className="text-[#b3262e] fill-[#b3262e]" />
          <span>¡Felicidades, lograste el gran sueño!</span>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-[#0f3d2e] text-[#fdf8ee] font-serif-vintage font-bold text-base hover:bg-[#16553f] transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plane size={18} />
            <span>Seguir jugando y mandando remesas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
