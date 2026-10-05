/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PerkSkill } from '../types';

interface HabilidadesViewProps {
  nivelSoldador: number;
  nivelTriciclo: number;
  nivelCalle13: number;
  pesos: number;
  costoSoldador: number;
  costoSubidaSoldador: number;
  costoTriciclo: number;
  costoSubidaTriciclo: number;
  costoCalle13: number;
  costoSubidaCalle13: number;
  perks: Record<string, boolean>;
  extraPerks: PerkSkill[];
  onUpgradeSoldador: () => void;
  onUpgradeTriciclo: () => void;
  onUpgradeCalle13: () => void;
  onBuyPerk: (perk: PerkSkill) => void;
}

export const HabilidadesView: React.FC<HabilidadesViewProps> = ({
  nivelSoldador,
  nivelTriciclo,
  nivelCalle13,
  pesos,
  costoSoldador,
  costoSubidaSoldador,
  costoTriciclo,
  costoSubidaTriciclo,
  costoCalle13,
  costoSubidaCalle13,
  perks,
  extraPerks,
  onUpgradeSoldador,
  onUpgradeTriciclo,
  onUpgradeCalle13,
  onBuyPerk
}) => {
  const fmt = (n: number) => Math.floor(n).toLocaleString('es-ES');

  // Soldador calculations
  const costoActualSoldador = nivelSoldador === 0 ? costoSoldador : costoSubidaSoldador;
  const canAffordSoldador = pesos >= costoActualSoldador;

  // Triciclo calculations
  const costoActualTriciclo = nivelTriciclo === 0 ? costoTriciclo : costoSubidaTriciclo;
  const canAffordTriciclo = pesos >= costoActualTriciclo;

  // Calle 13 calculations
  const costoActualCalle13 = nivelCalle13 === 0 ? costoCalle13 : costoSubidaCalle13;
  const canAffordCalle13 = pesos >= costoActualCalle13;

  return (
    <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 bg-[#fdf8ee] text-[#0f3d2e] select-none">
      <div className="max-w-xl mx-auto space-y-3.5">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-xs font-serif-vintage font-bold uppercase tracking-wider text-[#0f3d2e]/80">
              Oficios y Profesiones Habaneras
            </h3>
            <span className="text-[11px] text-[#16553f] font-semibold">
              3 oficios disponibles
            </span>
          </div>

          <div className="space-y-2.5">
            {/* 1. SOLDADOR */}
            <div
              className={`p-3 rounded-xl border-2 transition-all ${
                nivelSoldador > 0
                  ? 'bg-[#fffcf2] border-[#e0a93b] shadow-xs'
                  : canAffordSoldador
                  ? 'bg-[#fff8e3] border-[#0f3d2e]/40 hover:border-[#0f3d2e]'
                  : 'bg-[#f5f0e4] border-[#0f3d2e]/20 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl shrink-0 p-2 bg-[#e0a93b]/20 border border-[#e0a93b]/40 rounded-xl flex items-center justify-center">
                  🔧
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif-vintage font-bold text-base text-[#0f3d2e]">
                      Soldador de Herrería
                    </span>
                    {nivelSoldador > 0 ? (
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#16553f] text-[#f6e9c8]">
                        Nivel {nivelSoldador} 🔥
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#e0a93b]/30 text-[#854d0e]">
                        Por Desbloquear
                      </span>
                    )}
                  </div>

                  {/* Chips of what it does */}
                  <div className="flex items-center gap-1 flex-wrap mt-1 text-[11px] text-[#0f3d2e]/85">
                    <span className="bg-[#e0a93b]/15 px-1.5 py-0.5 rounded font-medium">🪟 Ventanas</span>
                    <span className="bg-[#e0a93b]/15 px-1.5 py-0.5 rounded font-medium">🚪 Puertas</span>
                    <span className="bg-[#e0a93b]/15 px-1.5 py-0.5 rounded font-medium">🏰 Rejas</span>
                    <span className="bg-[#e0a93b]/15 px-1.5 py-0.5 rounded font-medium">🚙 Chasis</span>
                  </div>

                  {/* Benefits */}
                  <div className="text-xs text-[#16553f] font-semibold mt-1 flex items-center gap-2">
                    <span>⚡ +5 pesos por clic</span>
                    <span>·</span>
                    <span>+{nivelSoldador > 0 ? 25 * nivelSoldador : 25}% en herrería</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div
                    className={`font-serif-vintage font-bold text-base tabular-nums ${
                      canAffordSoldador ? 'text-[#b3262e]' : 'text-[#888]'
                    }`}
                  >
                    ${fmt(costoActualSoldador)}
                  </div>
                  <button
                    disabled={!canAffordSoldador}
                    onClick={onUpgradeSoldador}
                    className={`mt-1 text-xs font-serif-vintage font-bold px-3 py-1.5 rounded-lg transition-all ${
                      canAffordSoldador
                        ? 'bg-[#0f3d2e] text-[#fdf8ee] hover:bg-[#16553f] active:scale-95 cursor-pointer shadow-xs'
                        : 'bg-[#0f3d2e]/30 text-[#fdf8ee]/60 cursor-not-allowed'
                    }`}
                  >
                    {nivelSoldador === 0 ? 'Comprar' : 'Subir Nivel'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. CHÓFER DE TRICICLO DE CARGA */}
            <div
              className={`p-3 rounded-xl border-2 transition-all ${
                nivelTriciclo > 0
                  ? 'bg-[#f0f9ff]/90 border-[#0284c7] shadow-xs'
                  : canAffordTriciclo
                  ? 'bg-[#f0f9ff]/50 border-[#0284c7]/40 hover:border-[#0284c7]'
                  : 'bg-[#f5f0e4] border-[#0f3d2e]/20 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl shrink-0 p-2 bg-[#0284c7]/20 border border-[#0284c7]/40 rounded-xl flex items-center justify-center">
                  🛺
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif-vintage font-bold text-base text-[#0f3d2e]">
                      Chófer de Triciclo de Carga
                    </span>
                    {nivelTriciclo > 0 ? (
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#0284c7] text-[#fdf8ee]">
                        Nivel {nivelTriciclo} 🧱
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#0284c7]/20 text-[#0369a1]">
                        Por Desbloquear
                      </span>
                    )}
                  </div>

                  {/* Chips of what it does */}
                  <div className="flex items-center gap-1 flex-wrap mt-1 text-[11px] text-[#0f3d2e]/85">
                    <span className="bg-[#0284c7]/15 px-1.5 py-0.5 rounded font-medium">🏖️ Arena</span>
                    <span className="bg-[#0284c7]/15 px-1.5 py-0.5 rounded font-medium">🧱 Bloques</span>
                    <span className="bg-[#0284c7]/15 px-1.5 py-0.5 rounded font-medium">🏗️ Cemento</span>
                    <span className="bg-[#0284c7]/15 px-1.5 py-0.5 rounded font-medium">🚚 Fletes</span>
                  </div>

                  {/* Benefits */}
                  <div className="text-xs text-[#0284c7] font-semibold mt-1 flex items-center gap-2">
                    <span>⚡ +8 pesos por clic</span>
                    <span>·</span>
                    <span>+{nivelTriciclo > 0 ? 25 * nivelTriciclo : 25}% en fletes</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div
                    className={`font-serif-vintage font-bold text-base tabular-nums ${
                      canAffordTriciclo ? 'text-[#b3262e]' : 'text-[#888]'
                    }`}
                  >
                    ${fmt(costoActualTriciclo)}
                  </div>
                  <button
                    disabled={!canAffordTriciclo}
                    onClick={onUpgradeTriciclo}
                    className={`mt-1 text-xs font-serif-vintage font-bold px-3 py-1.5 rounded-lg transition-all ${
                      canAffordTriciclo
                        ? 'bg-[#0284c7] text-[#fdf8ee] hover:bg-[#0369a1] active:scale-95 cursor-pointer shadow-xs'
                        : 'bg-[#0284c7]/30 text-[#fdf8ee]/60 cursor-not-allowed'
                    }`}
                  >
                    {nivelTriciclo === 0 ? 'Comprar' : 'Subir Nivel'}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. VENDEDOR DE CALLE 13 */}
            <div
              className={`p-3 rounded-xl border-2 transition-all ${
                nivelCalle13 > 0
                  ? 'bg-[#fdf2f8]/90 border-[#ec4899] shadow-xs'
                  : canAffordCalle13
                  ? 'bg-[#fdf2f8]/50 border-[#ec4899]/40 hover:border-[#ec4899]'
                  : 'bg-[#f5f0e4] border-[#0f3d2e]/20 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl shrink-0 p-2 bg-[#ec4899]/20 border border-[#ec4899]/40 rounded-xl flex items-center justify-center">
                  🛍️
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-serif-vintage font-bold text-base text-[#0f3d2e]">
                      Vendedor de Calle 13
                    </span>
                    {nivelCalle13 > 0 ? (
                      <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-[#ec4899] text-[#fdf8ee]">
                        Nivel {nivelCalle13} 👟
                      </span>
                    ) : (
                      <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-[#ec4899]/20 text-[#be185d]">
                        Por Desbloquear
                      </span>
                    )}
                  </div>

                  {/* Chips of what it does */}
                  <div className="flex items-center gap-1 flex-wrap mt-1 text-[11px] text-[#0f3d2e]/85">
                    <span className="bg-[#ec4899]/15 px-1.5 py-0.5 rounded font-medium">👕 Pulóveres</span>
                    <span className="bg-[#ec4899]/15 px-1.5 py-0.5 rounded font-medium">🩳 Shorts</span>
                    <span className="bg-[#ec4899]/15 px-1.5 py-0.5 rounded font-medium">👔 Camisas</span>
                    <span className="bg-[#ec4899]/15 px-1.5 py-0.5 rounded font-medium">👟 Zapatos</span>
                  </div>

                  {/* Benefits */}
                  <div className="text-xs text-[#be185d] font-semibold mt-1 flex items-center gap-2">
                    <span>⚡ +12 pesos por clic</span>
                    <span>·</span>
                    <span>+{nivelCalle13 > 0 ? 25 * nivelCalle13 : 25}% en ventas</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div
                    className={`font-serif-vintage font-bold text-base tabular-nums ${
                      canAffordCalle13 ? 'text-[#b3262e]' : 'text-[#888]'
                    }`}
                  >
                    ${fmt(costoActualCalle13)}
                  </div>
                  <button
                    disabled={!canAffordCalle13}
                    onClick={onUpgradeCalle13}
                    className={`mt-1 text-xs font-serif-vintage font-bold px-3 py-1.5 rounded-lg transition-all ${
                      canAffordCalle13
                        ? 'bg-[#db2777] text-[#fdf8ee] hover:bg-[#be185d] active:scale-95 cursor-pointer shadow-xs'
                        : 'bg-[#db2777]/30 text-[#fdf8ee]/60 cursor-not-allowed'
                    }`}
                  >
                    {nivelCalle13 === 0 ? 'Comprar' : 'Subir Nivel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Perks & Sabiduría Popular Habanera */}
        <div className="pt-1">
          <div className="text-xs font-serif-vintage font-bold uppercase tracking-wider text-[#0f3d2e]/80 px-1 mb-2">
            Perks y Sabiduría Criolla
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {extraPerks.map((perk) => {
              const bought = !!perks[perk.id];
              const canBuy = !bought && pesos >= perk.cost;

              return (
                <button
                  key={perk.id}
                  disabled={bought || !canBuy}
                  onClick={() => onBuyPerk(perk)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    bought
                      ? 'bg-[#dcebd0] border-[#16553f]/40 opacity-95 cursor-default'
                      : canBuy
                      ? 'bg-[#fff8e3] border-[#0f3d2e]/40 hover:border-[#0f3d2e] active:scale-[0.99] cursor-pointer'
                      : 'bg-[#f4efe3] border-[#0f3d2e]/15 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="text-2xl shrink-0 p-1 bg-white/70 rounded-lg">
                    {perk.ic}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 font-serif-vintage font-bold text-xs sm:text-sm text-[#0f3d2e] truncate">
                      <span>{perk.n}</span>
                      {bought && (
                        <span className="text-[9px] font-sans font-bold px-1 rounded bg-[#16553f] text-[#f6e9c8]">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#16553f] font-semibold truncate">
                      {perk.effectText}
                    </div>
                    <div className="text-[11px] font-serif-vintage font-bold text-[#b3262e] tabular-nums">
                      {bought ? 'Activo' : `$${fmt(perk.cost)}`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
