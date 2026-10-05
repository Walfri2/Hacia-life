/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Job, ActiveJob } from '../types';

interface TrabajosViewProps {
  nivelSoldador: number;
  nivelTriciclo: number;
  nivelCalle13: number;
  trabajos: Job[];
  trabajoActivo: ActiveJob | null;
  hechas: Record<string, number>;
  timeSpeedMultiplier: number;
  pagoBonusMultiplier: number;
  onStartJob: (job: Job, durationMs: number, payout: number) => void;
  onCancelJob: () => void;
  onGoToHabilidades: () => void;
}

export const TrabajosView: React.FC<TrabajosViewProps> = ({
  nivelSoldador,
  nivelTriciclo,
  nivelCalle13,
  trabajos,
  trabajoActivo,
  hechas,
  timeSpeedMultiplier,
  pagoBonusMultiplier,
  onStartJob,
  onCancelJob,
  onGoToHabilidades
}) => {
  const [filterCategory, setFilterCategory] = useState<'todos' | 'soldador' | 'triciclo' | 'calle13'>('todos');

  const fmt = (n: number) => Math.floor(n).toLocaleString('es-ES');

  const durText = (ms: number) => {
    const totalSecs = Math.ceil(ms / 1000);
    if (totalSecs < 60) return `${totalSecs} seg`;
    const mins = Math.floor(totalSecs / 60);
    const remSecs = totalSecs % 60;
    return remSecs === 0 ? (mins === 1 ? '1 minuto' : `${mins} minutos`) : `${mins}m ${remSecs}s`;
  };

  const getProfessionLevel = (category: 'soldador' | 'triciclo' | 'calle13') => {
    if (category === 'soldador') return nivelSoldador;
    if (category === 'triciclo') return nivelTriciclo;
    if (category === 'calle13') return nivelCalle13;
    return 0;
  };

  const calcularPago = (job: Job) => {
    const lvl = getProfessionLevel(job.category);
    const multNivel = lvl > 0 ? 1 + 0.25 * (lvl - 1) : 1;
    return Math.round(job.base * multNivel * (1 + pagoBonusMultiplier));
  };

  const calcularDuracion = (job: Job) => {
    return Math.round(job.ms * (1 - timeSpeedMultiplier));
  };

  const isCategoryUnlocked = (category: 'soldador' | 'triciclo' | 'calle13') => {
    return getProfessionLevel(category) > 0;
  };

  const filteredJobs = trabajos.filter((j) => {
    if (filterCategory === 'todos') return true;
    return j.category === filterCategory;
  });

  const now = Date.now();
  let remainingMs = 0;
  let jobPercent = 0;
  let currentJobObj: Job | undefined;

  if (trabajoActivo) {
    currentJobObj = trabajos.find((j) => j.id === trabajoActivo.id);
    remainingMs = Math.max(0, trabajoActivo.fin - now);
    const effectiveTotalMs = currentJobObj ? calcularDuracion(currentJobObj) : 60000;
    jobPercent = Math.min(100, Math.max(0, 100 - (remainingMs / effectiveTotalMs) * 100));
  }

  // Completed summary
  const summaryHechas = trabajos
    .filter((j) => hechas[j.id] && hechas[j.id] > 0)
    .map((j) => `${j.plural}: ${hechas[j.id]}`);

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#fdf8ee] text-[#0f3d2e] select-none">
      <div className="max-w-xl mx-auto space-y-3">
        {/* Category selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
          {[
            { id: 'todos', label: 'Todos los Oficios' },
            { id: 'soldador', label: '🔧 Soldador' },
            { id: 'triciclo', label: '🛺 Fletes de Triciclo' },
            { id: 'calle13', label: '🛍️ Calle 13' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg font-serif-vintage font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-[#0f3d2e] text-[#fdf8ee] shadow-xs'
                  : 'bg-[#fff8e3] text-[#0f3d2e]/70 hover:text-[#0f3d2e] border border-[#0f3d2e]/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Global Jobs Notice */}
        <div className="p-2.5 rounded-xl bg-[#fff8e3] border border-[#0f3d2e]/20 text-center text-xs text-[#0f3d2e]/85">
          <span>Un encargo a la vez</span>
          {timeSpeedMultiplier > 0 && (
            <>
              <span className="mx-1.5 opacity-50">·</span>
              <span className="text-[#e0a93b] font-semibold">⚡ +25% velocidad con café colao</span>
            </>
          )}
          {pagoBonusMultiplier > 0 && (
            <>
              <span className="mx-1.5 opacity-50">·</span>
              <span className="text-[#16553f] font-semibold">✨ +40% pago con cadena de oro</span>
            </>
          )}
        </div>

        {/* Jobs List */}
        <div className="space-y-2.5">
          {filteredJobs.map((j) => {
            const unlocked = isCategoryUnlocked(j.category);
            const isThisActive = trabajoActivo?.id === j.id;
            const isAnyActive = !!trabajoActivo;
            const payout = calcularPago(j);
            const durationMs = calcularDuracion(j);

            return (
              <div
                key={j.id}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  isThisActive
                    ? 'bg-[#fef9c3] border-[#e0a93b] shadow-sm'
                    : unlocked && !isAnyActive
                    ? 'bg-[#fff8e3] border-[#0f3d2e]/40 hover:border-[#0f3d2e]'
                    : unlocked
                    ? 'bg-[#f4efe3] border-[#0f3d2e]/15 opacity-65'
                    : 'bg-[#f1ece1] border-[#0f3d2e]/15 opacity-60'
                }`}
              >
                <div className="text-3xl shrink-0 p-1.5 bg-white/70 rounded-lg">
                  {j.ic}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif-vintage font-bold text-sm sm:text-base text-[#0f3d2e] truncate">
                      {j.n}
                    </span>
                    {!unlocked && (
                      <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded bg-[#b3262e]/15 text-[#b3262e] shrink-0">
                        Bloqueado 🔒
                      </span>
                    )}
                  </div>

                  {isThisActive ? (
                    <div className="mt-1 space-y-1">
                      <div className="text-xs text-[#b3262e] font-semibold animate-pulse">
                        Trabajando… faltan {Math.ceil(remainingMs / 1000)} seg
                      </div>
                      <div className="w-full h-2.5 bg-[#d9c9a0] rounded-full overflow-hidden border border-[#0f3d2e]/20">
                        <div
                          className="h-full bg-[#16553f] transition-all duration-200"
                          style={{ width: `${jobPercent}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#0f3d2e]/80 mt-0.5 line-clamp-1">
                      {j.desc || `Tarda ${durText(durationMs)} · Paga $${fmt(payout)}`}
                    </p>
                  )}

                  {!isThisActive && (
                    <div className="text-[11px] text-[#16553f] font-semibold mt-1">
                      Tarda {durText(durationMs)} <span className="opacity-50">·</span> Paga +${fmt(payout)}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  {unlocked ? (
                    <button
                      disabled={isAnyActive}
                      onClick={() => onStartJob(j, durationMs, payout)}
                      className={`text-xs font-serif-vintage font-bold px-3 py-1.5 rounded-lg transition-all ${
                        isThisActive
                          ? 'bg-[#16553f] text-[#fdf8ee] opacity-90 cursor-default'
                          : !isAnyActive
                          ? 'bg-[#0f3d2e] text-[#fdf8ee] hover:bg-[#16553f] active:scale-95 cursor-pointer shadow-xs'
                          : 'bg-[#0f3d2e]/40 text-[#fdf8ee]/60 cursor-not-allowed'
                      }`}
                    >
                      {isThisActive ? 'En curso' : 'Comenzar'}
                    </button>
                  ) : (
                    <button
                      onClick={onGoToHabilidades}
                      className="text-xs font-serif-vintage font-bold px-2.5 py-1.5 rounded-lg bg-[#fff] border border-[#0f3d2e]/40 hover:bg-[#e0a93b]/20 text-[#0f3d2e] cursor-pointer"
                    >
                      Desbloquear
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancel active job */}
        {trabajoActivo && (
          <button
            onClick={onCancelJob}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-[#b3262e] bg-[#fee2e2]/60 text-[#b3262e] font-serif-vintage font-bold text-sm hover:bg-[#fee2e2] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>✖ Cancelar encargo en curso</span>
          </button>
        )}

        {/* Completed Tally */}
        {summaryHechas.length > 0 && (
          <div className="pt-2 text-center text-xs text-[#0f3d2e]/80 font-medium">
            <span className="font-bold text-[#0f3d2e]">Entregas completadas: </span>
            {summaryHechas.join(' · ')}
          </div>
        )}
      </div>
    </div>
  );
};
