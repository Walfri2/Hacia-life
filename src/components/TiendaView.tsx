/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Business } from '../types';

interface TiendaViewProps {
  negocios: Business[];
  negState: Record<string, number>;
  pesos: number;
  discountMultiplier: number;
  onBuy: (b: Business, cost: number) => void;
  onResetPrompt: () => void;
}

export const TiendaView: React.FC<TiendaViewProps> = ({
  negocios,
  negState,
  pesos,
  discountMultiplier,
  onBuy,
  onResetPrompt
}) => {
  const fmt = (n: number) => Math.floor(n).toLocaleString('es-ES');

  const getCount = (id: string) => negState[id] || 0;

  const getCost = (b: Business) => {
    const raw = Math.ceil(b.base * Math.pow(1.15, getCount(b.id)));
    return Math.ceil(raw * (1 - discountMultiplier));
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#fdf8ee] text-[#0f3d2e] select-none">
      <div className="max-w-xl mx-auto space-y-2.5">
        <div className="flex items-center justify-between px-1 text-xs text-[#0f3d2e]/70 font-medium">
          <span>Negocios por la ciudad</span>
          <span>Ingreso pasivo automático</span>
        </div>

        {negocios.map((n) => {
          const count = getCount(n.id);
          const cost = getCost(n);
          const canAfford = pesos >= cost;
          const totalIncome = count * n.seg;

          return (
            <button
              key={n.id}
              disabled={!canAfford}
              onClick={() => onBuy(n, cost)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-100 ${
                canAfford
                  ? 'bg-[#fff8e3] border-[#0f3d2e]/40 hover:border-[#0f3d2e] hover:shadow-sm active:scale-[0.99] active:bg-[#e0a93b]/30'
                  : 'bg-[#f4efe3] border-[#0f3d2e]/15 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="text-3xl sm:text-4xl shrink-0 p-1 bg-white/70 rounded-lg shadow-2xs">
                {n.ic}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 font-serif-vintage font-bold text-base text-[#0f3d2e] leading-snug">
                  <span className="truncate">{n.n}</span>
                  {count > 0 && (
                    <span className="text-xs font-sans font-semibold px-1.5 py-0.5 rounded bg-[#16553f] text-[#f6e9c8]">
                      x{count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#0f3d2e]/80 truncate mt-0.5">{n.d}</p>
                <div className="text-xs text-[#16553f] font-semibold mt-1 tabular-nums">
                  +{fmt(n.seg)}/seg {count > 1 && <span className="opacity-75 font-normal">(Total: +{fmt(totalIncome)}/s)</span>}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <div
                  className={`font-serif-vintage font-bold text-sm sm:text-base tabular-nums ${
                    canAfford ? 'text-[#b3262e]' : 'text-[#888]'
                  }`}
                >
                  ${fmt(cost)}
                </div>
                <div className="text-[11px] text-[#0f3d2e]/60 mt-0.5">
                  {canAfford ? 'Comprar' : 'Faltan pesos'}
                </div>
              </div>
            </button>
          );
        })}

        <div className="pt-4 pb-2 text-center">
          <button
            onClick={onResetPrompt}
            className="text-xs text-[#0f3d2e]/60 hover:text-[#b3262e] underline transition-colors cursor-pointer"
          >
            Empezar de nuevo (Reiniciar partida)
          </button>
        </div>
      </div>
    </div>
  );
};
