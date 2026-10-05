/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Trophy, BarChart3, Plane, Smartphone } from 'lucide-react';

interface HeaderBarProps {
  pesos: number;
  porClic: number;
  porSeg: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenLogros: () => void;
  onOpenStats: () => void;
  onOpenYuma: () => void;
  onOpenDrive: () => void;
  onOpenInstall?: () => void;
  isInstalled?: boolean;
  unclaimedCount?: number;
  nextMilestone: { title: string; cost: number; progress: number } | null;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  pesos,
  porClic,
  porSeg,
  soundEnabled,
  onToggleSound,
  onOpenLogros,
  onOpenStats,
  onOpenYuma,
  onOpenDrive,
  onOpenInstall,
  isInstalled = false,
  unclaimedCount = 0,
  nextMilestone
}) => {
  const fmt = (n: number) => Math.floor(n).toLocaleString('es-ES');

  return (
    <header className="px-4 py-3 bg-[#0f3d2e] border-b-2 border-double border-[#e0a93b]/70 select-none">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 max-w-xl mx-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            className="p-1.5 rounded-lg text-[#e0a93b] hover:bg-[#16553f] transition-colors cursor-pointer"
            title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button
            onClick={onOpenStats}
            aria-label="Ver estadísticas"
            className="p-1.5 rounded-lg text-[#e0a93b] hover:bg-[#16553f] transition-colors cursor-pointer"
            title="Estadísticas"
          >
            <BarChart3 size={18} />
          </button>
          <button
            onClick={onOpenDrive}
            aria-label="Google Drive en la nube"
            className="p-1.5 rounded-lg text-[#e0a93b] hover:bg-[#16553f] transition-colors cursor-pointer"
            title="Google Drive (Guardar / Cargar en la Nube)"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 87.3 78" fill="none">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.45z" fill="#00ac47"/>
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.85l6.1 10.55z" fill="#ea4335"/>
              <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832d"/>
              <path d="M59.85 53H27.45L13.75 76.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.2 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
          </button>
          <button
            onClick={onOpenLogros}
            aria-label="Ver logros"
            className="p-1.5 rounded-lg text-[#e0a93b] hover:bg-[#16553f] transition-colors relative cursor-pointer"
            title="Logros"
          >
            <Trophy size={18} />
            {unclaimedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b3262e] text-[#fdf8ee] rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unclaimedCount}
              </span>
            )}
          </button>
        </div>

        <h1 className="font-serif-vintage text-lg sm:text-xl font-bold text-[#e0a93b] tracking-wide text-center truncate">
          Vámonos para la yuma
        </h1>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isInstalled && onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="flex items-center gap-1 px-2 py-1 text-xs font-serif-vintage font-bold rounded-md bg-[#16553f] text-[#f6e9c8] border border-[#e0a93b]/50 hover:bg-[#e0a93b] hover:text-[#0a2e22] transition-colors cursor-pointer shadow-xs animate-pulse"
              title="Instalar en Android"
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline">Instalar</span>
            </button>
          )}

          <button
            onClick={onOpenYuma}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-[#e0a93b]/15 text-[#e0a93b] border border-[#e0a93b]/40 hover:bg-[#e0a93b]/25 transition-colors cursor-pointer"
            title="Ver ruta a La Yuma"
          >
            <Plane size={14} className="rotate-45" />
            <span className="hidden xs:inline">La Yuma</span>
          </button>
        </div>
      </div>

      {/* Main Pesos Counter */}
      <div className="text-center mt-1">
        <div className="font-serif-vintage text-3xl sm:text-4xl font-bold text-[#fdf8ee] tracking-tight tabular-nums">
          <span className="text-[#e0a93b] mr-1">$</span>
          {fmt(pesos)}
        </div>
        <div className="text-xs sm:text-sm text-[#f6e9c8]/85 font-medium tabular-nums mt-0.5">
          +{fmt(porClic)} por clic <span className="opacity-50">·</span> +{fmt(porSeg)} por segundo
        </div>
      </div>

      {/* Mini Objective Milestone Bar */}
      {nextMilestone && (
        <div
          onClick={onOpenYuma}
          className="mt-2.5 max-w-md mx-auto p-1.5 px-3 rounded-lg bg-[#0a2e22]/80 border border-[#e0a93b]/30 flex items-center justify-between gap-2 text-xs text-[#f6e9c8] cursor-pointer hover:border-[#e0a93b]/60 transition-colors"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[#e0a93b]">🎯</span>
            <span className="truncate opacity-90">{nextMilestone.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 tabular-nums">
            <span className="text-[#e0a93b] font-semibold">{Math.min(100, Math.floor(nextMilestone.progress))}%</span>
            <div className="w-16 h-2 bg-[#16553f] rounded-full overflow-hidden border border-[#e0a93b]/30">
              <div
                className="h-full bg-[#e0a93b] transition-all duration-300"
                style={{ width: `${Math.min(100, nextMilestone.progress)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
