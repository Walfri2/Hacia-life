/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm bg-[#fdf8ee] text-[#0f3d2e] rounded-2xl border-3 border-[#b3262e] shadow-2xl p-5 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#fee2e2] text-[#b3262e] flex items-center justify-center">
          <AlertTriangle size={24} />
        </div>

        <div>
          <h3 className="font-serif-vintage text-lg font-bold text-[#0f3d2e]">
            ¿Empezar de nuevo?
          </h3>
          <p className="text-xs text-[#0f3d2e]/80 mt-1.5 leading-relaxed">
            Se borrarán todos tus pesos acumulados, nivel de soldador, negocios y progresos hacia La Yuma. ¿Estás completamente seguro?
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-3 rounded-xl border border-[#0f3d2e]/30 bg-[#fff8e3] text-[#0f3d2e] font-serif-vintage font-bold text-xs hover:bg-[#f6e9c8] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-3 rounded-xl bg-[#b3262e] text-[#fdf8ee] font-serif-vintage font-bold text-xs hover:bg-[#8f1d24] transition-colors shadow-sm"
          >
            Sí, borrar todo
          </button>
        </div>
      </div>
    </div>
  );
};
