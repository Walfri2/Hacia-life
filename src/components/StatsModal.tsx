/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BarChart3, Coins, MousePointerClick, Wrench, Building2, Clock } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pesos: number;
  totalEarned: number;
  totalClicks: number;
  totalJobsDone: number;
  soldadorNivel: number;
  tricicloNivel?: number;
  calle13Nivel?: number;
  totalBusinesses: number;
  startTime: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  pesos,
  totalEarned,
  totalClicks,
  totalJobsDone,
  soldadorNivel,
  tricicloNivel = 0,
  calle13Nivel = 0,
  totalBusinesses,
  startTime
}) => {
  if (!isOpen) return null;

  const fmt = (n: number) => Math.floor(n).toLocaleString('es-ES');

  const elapsedSecs = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m < 60) return `${m} min ${s} s`;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${h} h ${remM} m`;
  };

  const statItems = [
    { label: 'Pesos en bolsillo', val: `$${fmt(pesos)}`, icon: <Coins size={16} /> },
    { label: 'Total pesos ganados', val: `$${fmt(totalEarned)}`, icon: <Coins size={16} /> },
    { label: 'Clics realizados', val: fmt(totalClicks), icon: <MousePointerClick size={16} /> },
    { label: 'Encargos y fletes completados', val: fmt(totalJobsDone), icon: <Wrench size={16} /> },
    { label: 'Nivel del soldador', val: `Nivel ${soldadorNivel}`, icon: <Wrench size={16} /> },
    { label: 'Nivel de chófer de triciclo', val: `Nivel ${tricicloNivel}`, icon: <Wrench size={16} /> },
    { label: 'Nivel de vendedor de Calle 13', val: `Nivel ${calle13Nivel}`, icon: <Wrench size={16} /> },
    { label: 'Negocios en posesión', val: `${totalBusinesses} unidades`, icon: <Building2 size={16} /> },
    { label: 'Tiempo jugado', val: formatTime(elapsedSecs), icon: <Clock size={16} /> }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-[#fdf8ee] text-[#0f3d2e] rounded-2xl border-3 border-[#e0a93b] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#0f3d2e] text-[#fdf8ee] flex items-center justify-between border-b-2 border-[#e0a93b]">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-[#e0a93b]" size={20} />
            <h2 className="font-serif-vintage text-lg font-bold">
              Estadísticas de la Lucha
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1 rounded-lg text-[#f6e9c8] hover:bg-[#16553f] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {statItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#fff8e3] border border-[#0f3d2e]/15 text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2 text-[#0f3d2e]/85">
                <span className="text-[#16553f]">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className="font-bold text-[#0f3d2e] font-serif-vintage tabular-nums">
                {item.val}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#fff8e3] border-t border-[#0f3d2e]/20 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-[#0f3d2e] text-[#fdf8ee] font-serif-vintage font-bold text-sm hover:bg-[#16553f] transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
