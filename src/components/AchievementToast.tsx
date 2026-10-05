/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
  onViewAchievements: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onDismiss,
  onViewAchievements
}) => {
  if (!achievement) return null;

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92%] animate-bounce shadow-2xl select-none">
      <div
        onClick={() => {
          onViewAchievements();
          onDismiss();
        }}
        className="p-3 bg-[#0f3d2e] text-[#fdf8ee] rounded-2xl border-2 border-[#e0a93b] flex items-center gap-3 cursor-pointer hover:bg-[#16553f] transition-all"
      >
        <div className="text-3xl p-1.5 bg-[#e0a93b]/20 rounded-xl border border-[#e0a93b]/40">
          {achievement.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-[#e0a93b] font-bold uppercase tracking-wider">
            <Trophy size={13} />
            <span>¡Logro Desbloqueado!</span>
          </div>
          <div className="font-serif-vintage font-bold text-sm text-[#fdf8ee] truncate mt-0.5">
            {achievement.title}
          </div>
          <div className="text-[11px] text-[#f6e9c8]/80 truncate">
            {achievement.desc}
          </div>
        </div>
      </div>
    </div>
  );
};
