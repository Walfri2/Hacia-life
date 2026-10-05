/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClothingItem, CarItem, TattooItem } from '../types';
import { Shirt, Car, Sparkles, Check, Lock } from 'lucide-react';

interface EstiloTiendaViewProps {
  pesos: number;
  ropaLista: ClothingItem[];
  ropaEquipada: string;
  ropaComprada: string[];
  carrosLista: CarItem[];
  carroEquipado: string;
  carrosComprados: string[];
  tatuajesLista: TattooItem[];
  tatuajeEquipado: string;
  tatuajesComprados: string[];
  onBuyOrEquipRopa: (item: ClothingItem) => void;
  onBuyOrEquipCarro: (item: CarItem) => void;
  onBuyOrEquipTatuaje: (item: TattooItem) => void;
}

export const EstiloTiendaView: React.FC<EstiloTiendaViewProps> = ({
  pesos,
  ropaLista,
  ropaEquipada,
  ropaComprada,
  carrosLista,
  carroEquipado,
  carrosComprados,
  tatuajesLista,
  tatuajeEquipado,
  tatuajesComprados,
  onBuyOrEquipRopa,
  onBuyOrEquipCarro,
  onBuyOrEquipTatuaje
}) => {
  const [subTab, setSubTab] = useState<'ropa' | 'carros' | 'tatuajes'>('ropa');

  const fmt = (n: number) => Math.floor(n).toLocaleString('es-ES');

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[#fdf8ee] text-[#0f3d2e] select-none flex flex-col">
      <div className="max-w-xl mx-auto w-full space-y-3">
        {/* Header / Intro */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-serif-vintage font-bold text-lg text-[#0f3d2e]">
              Boutique & Garaje Habanero
            </h2>
            <p className="text-xs text-[#0f3d2e]/75">
              Personaliza el estilo de Haci, sus tatuajes y la nave parqueada detrás.
            </p>
          </div>
        </div>

        {/* Sub-tab segmented filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#fff8e3] rounded-xl border border-[#0f3d2e]/20">
          <button
            onClick={() => setSubTab('ropa')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-serif-vintage font-bold transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'ropa'
                ? 'bg-[#0f3d2e] text-[#fdf8ee] shadow-xs'
                : 'text-[#0f3d2e]/75 hover:text-[#0f3d2e]'
            }`}
          >
            <Shirt size={14} />
            <span>Ropa</span>
          </button>
          <button
            onClick={() => setSubTab('carros')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-serif-vintage font-bold transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'carros'
                ? 'bg-[#0f3d2e] text-[#fdf8ee] shadow-xs'
                : 'text-[#0f3d2e]/75 hover:text-[#0f3d2e]'
            }`}
          >
            <Car size={14} />
            <span>Carros</span>
          </button>
          <button
            onClick={() => setSubTab('tatuajes')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-serif-vintage font-bold transition-all flex items-center justify-center gap-1.5 ${
              subTab === 'tatuajes'
                ? 'bg-[#0f3d2e] text-[#fdf8ee] shadow-xs'
                : 'text-[#0f3d2e]/75 hover:text-[#0f3d2e]'
            }`}
          >
            <Sparkles size={14} />
            <span>Tatuajes</span>
          </button>
        </div>

        {/* 1. SECCIÓN DE ROPA */}
        {subTab === 'ropa' && (
          <div className="space-y-2.5">
            {ropaLista.map((item) => {
              const isBought = ropaComprada.includes(item.id) || item.cost === 0;
              const isEquipped = ropaEquipada === item.id;
              const canAfford = pesos >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    isEquipped
                      ? 'bg-[#dcebd0] border-[#16553f] shadow-sm ring-2 ring-[#16553f]/20'
                      : isBought
                      ? 'bg-[#fff8e3] border-[#0f3d2e]/40'
                      : canAfford
                      ? 'bg-[#fff8e3] border-[#0f3d2e]/25 hover:border-[#0f3d2e]/60'
                      : 'bg-[#f4efe3] border-[#0f3d2e]/15 opacity-65'
                  }`}
                >
                  <div className="text-3xl shrink-0 p-2 bg-white/80 rounded-xl shadow-2xs">
                    {item.ic}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif-vintage font-bold text-sm sm:text-base text-[#0f3d2e] truncate">
                        {item.n}
                      </h3>
                      {isEquipped && (
                        <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-full bg-[#16553f] text-[#f6e9c8] shrink-0">
                          Puesta ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#0f3d2e]/80 mt-0.5 line-clamp-1">{item.d}</p>
                    {item.clickBonusPct > 0 && (
                      <div className="text-xs font-semibold text-[#16553f] mt-0.5">
                        +{Math.round(item.clickBonusPct * 100)}% bono por clic
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    {isEquipped ? (
                      <span className="text-xs font-serif-vintage font-bold text-[#16553f] px-3 py-1.5 rounded-lg bg-white/80 border border-[#16553f]/30">
                        Equipado
                      </span>
                    ) : isBought ? (
                      <button
                        onClick={() => onBuyOrEquipRopa(item)}
                        className="text-xs font-serif-vintage font-bold text-[#0f3d2e] px-3.5 py-1.5 rounded-lg bg-[#fff] border-2 border-[#0f3d2e] hover:bg-[#e0a93b]/20 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        Ponerse
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => onBuyOrEquipRopa(item)}
                        className={`text-xs font-serif-vintage font-bold px-3 py-1.5 rounded-lg transition-all flex flex-col items-center ${
                          canAfford
                            ? 'bg-[#0f3d2e] text-[#fdf8ee] hover:bg-[#16553f] active:scale-95 cursor-pointer shadow-xs'
                            : 'bg-[#0f3d2e]/40 text-[#fdf8ee]/60 cursor-not-allowed'
                        }`}
                      >
                        <span>Comprar</span>
                        <span className="text-[11px] text-[#e0a93b] font-mono tabular-nums">
                          ${fmt(item.cost)}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. SECCIÓN DE CARROS (PARQUEADOS DETRÁS) */}
        {subTab === 'carros' && (
          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#fff8e3] border border-[#0f3d2e]/20 text-xs text-[#0f3d2e]/85">
              🚘 <b>Naves del Malecón:</b> El carro que equipes se muestra estacionado justo detrás de Haci y suma ingresos pasivos extra.
            </div>

            {carrosLista.map((car) => {
              const isBought = carrosComprados.includes(car.id) || car.cost === 0;
              const isEquipped = carroEquipado === car.id;
              const canAfford = pesos >= car.cost;

              return (
                <div
                  key={car.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    isEquipped
                      ? 'bg-[#dcebd0] border-[#16553f] shadow-sm ring-2 ring-[#16553f]/20'
                      : isBought
                      ? 'bg-[#fff8e3] border-[#0f3d2e]/40'
                      : canAfford
                      ? 'bg-[#fff8e3] border-[#0f3d2e]/25 hover:border-[#0f3d2e]/60'
                      : 'bg-[#f4efe3] border-[#0f3d2e]/15 opacity-65'
                  }`}
                >
                  <div className="text-3xl shrink-0 p-2 bg-white/80 rounded-xl shadow-2xs">
                    {car.ic}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif-vintage font-bold text-sm sm:text-base text-[#0f3d2e] truncate">
                        {car.n}
                      </h3>
                      {isEquipped && (
                        <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-full bg-[#16553f] text-[#f6e9c8] shrink-0">
                          Parqueado ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#0f3d2e]/80 mt-0.5 line-clamp-1">{car.d}</p>
                    {car.ppsBonus > 0 && (
                      <div className="text-xs font-semibold text-[#16553f] mt-0.5 tabular-nums">
                        +{fmt(car.ppsBonus)}/seg automático
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    {isEquipped ? (
                      <span className="text-xs font-serif-vintage font-bold text-[#16553f] px-3 py-1.5 rounded-lg bg-white/80 border border-[#16553f]/30">
                        En uso
                      </span>
                    ) : isBought ? (
                      <button
                        onClick={() => onBuyOrEquipCarro(car)}
                        className="text-xs font-serif-vintage font-bold text-[#0f3d2e] px-3.5 py-1.5 rounded-lg bg-[#fff] border-2 border-[#0f3d2e] hover:bg-[#e0a93b]/20 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        Estacionar
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => onBuyOrEquipCarro(car)}
                        className={`text-xs font-serif-vintage font-bold px-3 py-1.5 rounded-lg transition-all flex flex-col items-center ${
                          canAfford
                            ? 'bg-[#0f3d2e] text-[#fdf8ee] hover:bg-[#16553f] active:scale-95 cursor-pointer shadow-xs'
                            : 'bg-[#0f3d2e]/40 text-[#fdf8ee]/60 cursor-not-allowed'
                        }`}
                      >
                        <span>Comprar</span>
                        <span className="text-[11px] text-[#e0a93b] font-mono tabular-nums">
                          ${fmt(car.cost)}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. SECCIÓN DE TATUAJES */}
        {subTab === 'tatuajes' && (
          <div className="space-y-2.5">
            <div className="p-2.5 rounded-xl bg-[#fff8e3] border border-[#0f3d2e]/20 text-xs text-[#0f3d2e]/85">
              💉 <b>Tinta y Orgullo:</b> Los tatuajes quedan grabados en los brazos y hombros de Haci, aumentando directamente los pesos fijos ganados por clic.
            </div>

            {tatuajesLista.map((tat) => {
              const isBought = tatuajesComprados.includes(tat.id) || tat.cost === 0;
              const isEquipped = tatuajeEquipado === tat.id;
              const canAfford = pesos >= tat.cost;

              return (
                <div
                  key={tat.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    isEquipped
                      ? 'bg-[#dcebd0] border-[#16553f] shadow-sm ring-2 ring-[#16553f]/20'
                      : isBought
                      ? 'bg-[#fff8e3] border-[#0f3d2e]/40'
                      : canAfford
                      ? 'bg-[#fff8e3] border-[#0f3d2e]/25 hover:border-[#0f3d2e]/60'
                      : 'bg-[#f4efe3] border-[#0f3d2e]/15 opacity-65'
                  }`}
                >
                  <div className="text-3xl shrink-0 p-2 bg-white/80 rounded-xl shadow-2xs">
                    {tat.ic}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif-vintage font-bold text-sm sm:text-base text-[#0f3d2e] truncate">
                        {tat.n}
                      </h3>
                      {isEquipped && (
                        <span className="text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-full bg-[#16553f] text-[#f6e9c8] shrink-0">
                          En piel ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#0f3d2e]/80 mt-0.5 line-clamp-1">{tat.d}</p>
                    {tat.clickBonusFlat > 0 && (
                      <div className="text-xs font-semibold text-[#16553f] mt-0.5 tabular-nums">
                        +${fmt(tat.clickBonusFlat)} directo por clic
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    {isEquipped ? (
                      <span className="text-xs font-serif-vintage font-bold text-[#16553f] px-3 py-1.5 rounded-lg bg-white/80 border border-[#16553f]/30">
                        Grabado
                      </span>
                    ) : isBought ? (
                      <button
                        onClick={() => onBuyOrEquipTatuaje(tat)}
                        className="text-xs font-serif-vintage font-bold text-[#0f3d2e] px-3.5 py-1.5 rounded-lg bg-[#fff] border-2 border-[#0f3d2e] hover:bg-[#e0a93b]/20 active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        Lucir
                      </button>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => onBuyOrEquipTatuaje(tat)}
                        className={`text-xs font-serif-vintage font-bold px-3 py-1.5 rounded-lg transition-all flex flex-col items-center ${
                          canAfford
                            ? 'bg-[#0f3d2e] text-[#fdf8ee] hover:bg-[#16553f] active:scale-95 cursor-pointer shadow-xs'
                            : 'bg-[#0f3d2e]/40 text-[#fdf8ee]/60 cursor-not-allowed'
                        }`}
                      >
                        <span>Tatuar</span>
                        <span className="text-[11px] text-[#e0a93b] font-mono tabular-nums">
                          ${fmt(tat.cost)}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
