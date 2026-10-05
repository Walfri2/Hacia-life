/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Achievement } from '../types';
import { X, Trophy } from 'lucide-react';

interface LogrosModalProps {
  logros: Achievement[];
  unlockedIds?: Record<string, boolean>;
  isOpen: boolean;
  onClose: () => void;
}

export const LogrosModal: React.FC<LogrosModalProps> = ({
  logros,
  unlockedIds = {},
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const unlockedCount = logros.filter((l) => !!unlockedIds[l.id]).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-[#fdf8ee] text-[#0f3d2e] rounded-2xl border-3 border-[#e0a93b] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#0f3d2e] text-[#fdf8ee] flex items-center justify-between border-b-2 border-[#e0a93b]">
          <div className="flex items-center gap-2">
            <Trophy className="text-[#e0a93b]" size={20} />
            <h2 className="font-serif-vintage text-lg font-bold">
              Logros de Haci ({unlockedCount}/{logros.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1 rounded-lg text-[#f6e9c8] hover:bg-[#16553f] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {logros.map((l) => {
            const isUnlocked = !!unlockedIds[l.id];

            return (
              <div
                key={l.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  isUnlocked
                    ? 'bg-[#dcebd0] border-[#16553f]/40'
                    : 'bg-[#f4efe3] border-[#0f3d2e]/15 opacity-60'
                }`}
              >
                <div
                  className={`text-2xl p-2 rounded-lg ${
                    isUnlocked ? 'bg-white shadow-2xs' : 'grayscale opacity-60 bg-black/5'
                  }`}
                >
                  {l.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-vintage font-bold text-sm text-[#0f3d2e]">
                      {l.title}
                    </h3>
                    {isUnlocked && (
                      <span className="text-[10px] font-bold text-[#16553f] bg-white/80 px-1.5 py-0.5 rounded">
                        ¡Conseguido!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#0f3d2e]/80 mt-0.5">{l.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#fff8e3] border-t border-[#0f3d2e]/20 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-[#0f3d2e] text-[#fdf8ee] font-serif-vintage font-bold text-sm hover:bg-[#16553f] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
