/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { YumaMilestone } from '../types';
import { CheckCircle2, Plane, Sparkles } from 'lucide-react';

interface MetasYumaViewProps {
  milestones: YumaMilestone[];
  completedMap: Record<string, boolean>;
  pesos: number;
  onBuyMilestone: (m: YumaMilestone) => void;
}

export const MetasYumaView: React.FC<MetasYumaViewProps> = ({
  milestones,
  completedMap,
  pesos,
  onBuyMilestone
}) => {
  const fmt = (n: number) => Math.floor(n).toLocaleString('es-ES');

  // Find current active milestone (first uncompleted)
  const currentUncompletedIndex = milestones.findIndex((m) => !completedMap[m.id]);
  const isAllCompleted = currentUncompletedIndex === -1;

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#fdf8ee] text-[#0f3d2e] select-none">
      <div className="max-w-xl mx-auto space-y-4">
        {/* Banner */}
        <div className="p-4 rounded-2xl bg-[#0f3d2e] text-[#fdf8ee] border-2 border-[#e0a93b] shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[#e0a93b] text-xs font-bold tracking-wider uppercase">
              <Plane size={15} />
              <span>El Gran Sueño de Haci</span>
            </div>
            <h2 className="font-serif-vintage text-xl sm:text-2xl font-bold mt-1 text-[#fdf8ee]">
              Rumbo a La Yuma
            </h2>
            <p className="text-xs sm:text-sm text-[#f6e9c8]/90 mt-1 max-w-md">
              Cada peso ganado con el sudor de la herrería y los negocios acerca a Haci al anhelado viaje.
            </p>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-3">
          {milestones.map((m, index) => {
            const isCompleted = !!completedMap[m.id];
            const isCurrent = index === currentUncompletedIndex;
            const isLocked = index > currentUncompletedIndex && !isCompleted;
            const canAfford = pesos >= m.cost;

            return (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border-2 transition-all ${
                  isCompleted
                    ? 'bg-[#dcebd0] border-[#16553f]/50'
                    : isCurrent
                    ? 'bg-[#fff8e3] border-[#e0a93b] shadow-md ring-2 ring-[#e0a93b]/20'
                    : 'bg-[#f4efe3] border-[#0f3d2e]/15 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl shrink-0 p-2 bg-white/80 rounded-xl shadow-xs">
                    {m.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-serif-vintage font-bold text-base text-[#0f3d2e] truncate">
                        {m.title}
                      </h3>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#16553f] bg-white/80 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 size={13} />
                          Completado
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#0f3d2e]/80 mt-1 leading-relaxed">
                      {m.desc}
                    </p>

                    {isCompleted && (
                      <div className="mt-2 p-2 rounded-lg bg-white/70 border border-[#16553f]/20 text-xs text-[#16553f] italic font-serif-vintage">
                        "{m.story}"
                      </div>
                    )}

                    {isCurrent && !isCompleted && (
                      <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#e0a93b]/30">
                        <div className="text-xs text-[#0f3d2e]/70">
                          Costo del trámite: <span className="font-bold text-[#b3262e] text-sm tabular-nums">${fmt(m.cost)}</span>
                        </div>
                        <button
                          disabled={!canAfford}
                          onClick={() => onBuyMilestone(m)}
                          className={`px-4 py-1.5 rounded-lg font-serif-vintage font-bold text-xs transition-colors flex items-center gap-1 ${
                            canAfford
                              ? 'bg-[#0f3d2e] text-[#fdf8ee] hover:bg-[#16553f] cursor-pointer shadow-sm'
                              : 'bg-[#0f3d2e]/40 text-[#fdf8ee]/60 cursor-not-allowed'
                          }`}
                        >
                          <Sparkles size={13} />
                          <span>{canAfford ? 'Tramitar ahora' : 'Ahorrar pesos'}</span>
                        </button>
                      </div>
                    )}

                    {isLocked && (
                      <div className="mt-1 text-[11px] text-[#0f3d2e]/50 italic">
                        🔒 Completa el trámite anterior primero
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isAllCompleted && (
          <div className="p-4 rounded-xl bg-[#e0a93b]/20 border-2 border-[#e0a93b] text-center space-y-1">
            <div className="text-3xl">🎉</div>
            <div className="font-serif-vintage font-bold text-lg text-[#0f3d2e]">
              ¡Haci está gozando en La Yuma!
            </div>
            <p className="text-xs text-[#0f3d2e]/85">
              Has completado la travesía de Haci. Puedes seguir jugando y expandiendo tus negocios por diversión sin límites.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
