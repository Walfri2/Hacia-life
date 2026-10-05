/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Achievement } from '../types';
import { Trophy, CheckCircle, Gift, Sparkles } from 'lucide-react';

interface AchievementWithState extends Achievement {
  currentProgress: number;
  isUnlocked: boolean;
  isClaimed: boolean;
}

interface LogrosViewProps {
  achievements: AchievementWithState[];
  onClaimReward: (ach: AchievementWithState) => void;
}

export const LogrosView: React.FC<LogrosViewProps> = ({
  achievements,
  onClaimReward
}) => {
  const [filter, setFilter] = useState<'todos' | 'clic' | 'herrero' | 'bisne' | 'estilo' | 'yuma'>('todos');

  const fmt = (n: number) => Math.floor(n).toLocaleString('es-ES');

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const unclaimedCount = achievements.filter((a) => a.isUnlocked && !a.isClaimed).length;
  const progressPct = Math.round((unlockedCount / achievements.length) * 100);

  const filteredList = achievements.filter((a) => {
    if (filter === 'todos') return true;
    return a.category === filter;
  });

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#fdf8ee] text-[#0f3d2e] select-none flex flex-col">
      <div className="max-w-xl mx-auto w-full space-y-3.5">
        {/* Progress Banner */}
        <div className="p-4 rounded-2xl bg-[#0f3d2e] text-[#fdf8ee] border-2 border-[#e0a93b] shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="text-[#e0a93b]" size={22} />
              <h2 className="font-serif-vintage font-bold text-lg text-[#fdf8ee]">
                Sistema de Logros de Haci
              </h2>
            </div>
            <span className="font-serif-vintage font-bold text-base text-[#e0a93b] tabular-nums">
              {unlockedCount} / {achievements.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full h-3 bg-[#0a2e22] rounded-full overflow-hidden border border-[#e0a93b]/40">
            <div
              className="h-full bg-gradient-to-r from-[#e0a93b] to-[#f5c258] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-[#f6e9c8]/85">
            <span>Progreso global: {progressPct}%</span>
            {unclaimedCount > 0 ? (
              <span className="text-[#f5c258] font-bold animate-pulse">
                🎁 ¡{unclaimedCount} recompensa{unclaimedCount > 1 ? 's' : ''} por cobrar!
              </span>
            ) : (
              <span>Todas las recompensas al día</span>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'clic', label: 'Clics' },
            { id: 'herrero', label: 'Herrería' },
            { id: 'bisne', label: 'Negocios' },
            { id: 'estilo', label: 'Estilo & Naves' },
            { id: 'yuma', label: 'La Yuma' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg font-serif-vintage font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filter === cat.id
                  ? 'bg-[#0f3d2e] text-[#fdf8ee] shadow-xs'
                  : 'bg-[#fff8e3] text-[#0f3d2e]/70 hover:text-[#0f3d2e] border border-[#0f3d2e]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Achievement Cards */}
        <div className="space-y-2.5">
          {filteredList.map((ach) => {
            const cappedProgress = Math.min(ach.targetCount, ach.currentProgress);
            const itemPercent = Math.min(100, Math.round((cappedProgress / ach.targetCount) * 100));

            return (
              <div
                key={ach.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  ach.isClaimed
                    ? 'bg-[#dcebd0] border-[#16553f]/40'
                    : ach.isUnlocked
                    ? 'bg-[#fff8e3] border-[#e0a93b] ring-2 ring-[#e0a93b]/25 shadow-md'
                    : 'bg-[#f4efe3] border-[#0f3d2e]/15 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`text-3xl shrink-0 p-2 rounded-xl transition-all ${
                      ach.isUnlocked
                        ? 'bg-white shadow-2xs'
                        : 'grayscale opacity-60 bg-black/5'
                    }`}
                  >
                    {ach.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-serif-vintage font-bold text-sm sm:text-base text-[#0f3d2e] truncate">
                        {ach.title}
                      </h3>
                      {ach.isClaimed && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#16553f] bg-white/80 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle size={12} />
                          Cobrado
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#0f3d2e]/80 mt-0.5">{ach.desc}</p>

                    {/* Progress bar inside card */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-[#d9c9a0]/60 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            ach.isUnlocked ? 'bg-[#16553f]' : 'bg-[#e0a93b]'
                          }`}
                          style={{ width: `${itemPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#0f3d2e]/70 shrink-0 tabular-nums">
                        {cappedProgress} / {ach.targetCount}
                      </span>
                    </div>

                    {/* Claim reward button if unlocked but not claimed */}
                    {ach.isUnlocked && !ach.isClaimed && (
                      <div className="mt-2.5 pt-2 border-t border-[#e0a93b]/40 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#16553f]">
                          Recompensa disponible:
                        </span>
                        <button
                          onClick={() => onClaimReward(ach)}
                          className="px-3 py-1 rounded-lg bg-[#0f3d2e] text-[#fdf8ee] font-serif-vintage font-bold text-xs hover:bg-[#16553f] active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Gift size={13} className="text-[#e0a93b]" />
                          <span>Cobrar +${fmt(ach.rewardPesos)}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
