/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClothingItem, CarItem, TattooItem, CharacterAction } from '../types';

interface HaciCharacterProps {
  nivel: number;
  clothing: ClothingItem;
  car: CarItem;
  tattoo: TattooItem;
  hasCadena: boolean;
  isWorking: boolean;
  activeJobCategory?: 'soldador' | 'triciclo' | 'calle13' | null;
  currentAction?: CharacterAction | null;
  onTap: (e: React.PointerEvent<HTMLDivElement>) => void;
}

export const HaciCharacter: React.FC<HaciCharacterProps> = ({
  nivel,
  clothing,
  car,
  tattoo,
  hasCadena,
  isWorking,
  activeJobCategory,
  currentAction,
  onTap
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const hasSoldador = nivel > 0;
  const isExperienced = nivel >= 3 || hasCadena;
  const isMaster = nivel >= 6;

  // Active action animation flags
  const isActionSoldar = currentAction?.type === 'soldar_upgrade' || (isWorking && activeJobCategory === 'soldador');
  const isActionTriciclo = currentAction?.type === 'triciclo_upgrade' || (isWorking && activeJobCategory === 'triciclo');
  const isActionCalle13 = currentAction?.type === 'calle13_upgrade' || (isWorking && activeJobCategory === 'calle13');
  const isActionInventiva = currentAction?.type === 'inventiva_upgrade';
  const isActionNegociador = currentAction?.type === 'negociador_upgrade';
  const isActionCafecito = currentAction?.type === 'cafecito_upgrade';
  const isActionCadena = currentAction?.type === 'cadena_upgrade';

  return (
    <div
      className="relative w-full max-w-md h-48 sm:h-56 md:h-64 flex items-center justify-center select-none group touch-manipulation cursor-pointer"
      onPointerDown={(e) => {
        setIsPressed(true);
        onTap(e);
      }}
      onPointerUp={() => setIsPressed(false)}
      onPointerLeave={() => setIsPressed(false)}
    >
      {/* Dynamic Pop-in Action Badge */}
      {currentAction && (
        <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-action-badge">
          <div className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-[#e0a93b] via-[#fef08a] to-[#e0a93b] text-[#0a2e22] font-serif-vintage font-extrabold text-xs sm:text-sm tracking-wide shadow-xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-base sm:text-lg">{currentAction.badge}</span>
            <span>{currentAction.title}</span>
          </div>
        </div>
      )}

      {/* Background Street / Malecón Scene Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl flex flex-col justify-end">
        {/* Distant skyline / lamppost / palm tree silhouette */}
        <div className="absolute top-2 right-4 opacity-25">
          <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
            {/* Palmera */}
            <path d="M40 70 Q42 35 35 15" stroke="#f6e9c8" strokeWidth="3" />
            <path d="M35 15 Q20 5 8 18" stroke="#f6e9c8" strokeWidth="2.5" fill="none" />
            <path d="M35 15 Q30 -2 45 4" stroke="#f6e9c8" strokeWidth="2.5" fill="none" />
            <path d="M35 15 Q50 8 56 25" stroke="#f6e9c8" strokeWidth="2.5" fill="none" />
          </svg>
        </div>

        {/* Asphalt road line */}
        <div className="w-full h-10 bg-black/35 border-t border-[#e0a93b]/20 relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] border-b border-dashed border-[#e0a93b]/30" />
        </div>
      </div>

      {/* CAR / VEHICLE PARKED BEHIND HACI */}
      {car.carType !== 'none' && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-0 pointer-events-none transition-transform duration-200">
          {car.carType === 'bici' && (
            // Flying Pigeon Bicycle
            <svg width="170" height="90" viewBox="0 0 180 100" className="drop-shadow-lg opacity-90">
              <circle cx="35" cy="70" r="22" stroke="#222" strokeWidth="4" fill="none" />
              <circle cx="35" cy="70" r="2" fill="#888" />
              <circle cx="145" cy="70" r="22" stroke="#222" strokeWidth="4" fill="none" />
              <circle cx="145" cy="70" r="2" fill="#888" />
              <path d="M35 70 L75 70 L115 35 L70 35 Z" stroke="#16553f" strokeWidth="3.5" fill="none" />
              <path d="M75 70 L95 28" stroke="#16553f" strokeWidth="3.5" />
              <path d="M145 70 L125 22" stroke="#16553f" strokeWidth="3.5" />
              <path d="M85 28 h20" stroke="#333" strokeWidth="6" strokeLinecap="round" />
              <path d="M125 22 l-12 -6 h18" stroke="#ccc" strokeWidth="3" strokeLinecap="round" />
              <circle cx="132" cy="16" r="3" fill="#e0a93b" />
              <path d="M35 70 L30 40 h35" stroke="#777" strokeWidth="2" fill="none" />
            </svg>
          )}

          {car.carType === 'lada' && (
            // Lada 2105 Cubano Rojo
            <svg width="220" height="95" viewBox="0 0 250 110" className="drop-shadow-xl">
              <ellipse cx="125" cy="98" rx="115" ry="8" fill="rgba(0,0,0,0.5)" />
              <path d="M15 75 L30 52 L70 50 L100 25 L180 25 L215 50 L240 54 L245 78 L235 88 L15 88 Z" fill="#b91c1c" />
              <path d="M102 28 L176 28 L208 50 L102 50 Z" fill="#0284c7" opacity="0.6" />
              <path d="M68 50 L98 30 L98 50 Z" fill="#0284c7" opacity="0.6" />
              <line x1="145" y1="28" x2="145" y2="50" stroke="#b91c1c" strokeWidth="3" />
              <rect x="8" y="78" width="16" height="8" rx="2" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
              <rect x="235" y="78" width="12" height="8" rx="2" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
              <rect x="238" y="60" width="8" height="14" fill="#fbbf24" stroke="#d97706" />
              <rect x="14" y="62" width="6" height="12" fill="#dc2626" />
              <circle cx="55" cy="88" r="16" fill="#18181b" stroke="#52525b" strokeWidth="4" />
              <circle cx="55" cy="88" r="7" fill="#cbd5e1" />
              <circle cx="195" cy="88" r="16" fill="#18181b" stroke="#52525b" strokeWidth="4" />
              <circle cx="195" cy="88" r="7" fill="#cbd5e1" />
            </svg>
          )}

          {car.carType === 'almendron' && (
            // Chevrolet Bel Air 1957 Azul Dos Tonos
            <svg width="240" height="100" viewBox="0 0 270 115" className="drop-shadow-2xl">
              <ellipse cx="135" cy="102" rx="125" ry="9" fill="rgba(0,0,0,0.55)" />
              <path d="M10 74 C15 55 45 52 75 52 L105 28 C125 24 185 24 205 28 L235 52 C255 52 268 62 265 80 L255 94 L15 94 Z" fill="#0284c7" />
              <path d="M110 58 Q175 62 258 72 L256 82 Q175 72 108 66 Z" fill="#f8fafc" />
              <path d="M107 32 C125 27 180 27 202 32 L228 52 L107 52 Z" fill="#bae6fd" opacity="0.65" />
              <path d="M20 74 L260 74" stroke="#e2e8f0" strokeWidth="3" />
              <rect x="250" y="75" width="16" height="14" rx="4" fill="#e2e8f0" stroke="#94a3b8" />
              <rect x="5" y="75" width="15" height="14" rx="4" fill="#e2e8f0" stroke="#94a3b8" />
              <circle cx="60" cy="94" r="18" fill="#111" />
              <circle cx="60" cy="94" r="13" fill="#f8fafc" />
              <circle cx="60" cy="94" r="8" fill="#cbd5e1" stroke="#475569" />
              <circle cx="210" cy="94" r="18" fill="#111" />
              <circle cx="210" cy="94" r="13" fill="#f8fafc" />
              <circle cx="210" cy="94" r="8" fill="#cbd5e1" stroke="#475569" />
            </svg>
          )}

          {car.carType === 'cadillac' && (
            // Cadillac Eldorado 1959 Convertible Rosa
            <svg width="250" height="100" viewBox="0 0 280 115" className="drop-shadow-2xl">
              <ellipse cx="140" cy="104" rx="130" ry="9" fill="rgba(0,0,0,0.55)" />
              <path d="M5 45 Q25 40 45 60 L10 75 Z" fill="#f43f5e" />
              <circle cx="10" cy="46" r="3" fill="#ef4444" />
              <path d="M10 75 L35 56 L100 54 L125 36 L175 36 L210 54 L265 58 L275 80 L260 96 L20 96 Z" fill="#f43f5e" />
              <path d="M125 38 L170 38 L200 54 L120 54 Z" fill="#fdf2f8" />
              <circle cx="160" cy="46" r="6" stroke="#e0a93b" strokeWidth="2" fill="none" />
              <path d="M15 76 L275 76" stroke="#f1f5f9" strokeWidth="3.5" />
              <rect x="262" y="74" width="16" height="15" rx="3" fill="#f1f5f9" stroke="#94a3b8" />
              <circle cx="65" cy="96" r="18" fill="#18181b" />
              <circle cx="65" cy="96" r="13" fill="#fff" />
              <circle cx="65" cy="96" r="7" fill="#e0a93b" />
              <circle cx="220" cy="96" r="18" fill="#18181b" />
              <circle cx="220" cy="96" r="13" fill="#fff" />
              <circle cx="220" cy="96" r="7" fill="#e0a93b" />
            </svg>
          )}

          {car.carType === 'deportivo' && (
            // Corvette Stingray Americano Deportivo
            <svg width="240" height="98" viewBox="0 0 270 110" className="drop-shadow-2xl">
              <ellipse cx="135" cy="100" rx="125" ry="9" fill="rgba(0,0,0,0.6)" />
              <path d="M12 78 Q25 58 60 52 L110 32 Q160 30 195 38 L255 60 Q268 70 264 85 L250 94 L20 94 Z" fill="#eab308" />
              <path d="M112 35 Q155 33 188 40 L212 55 L108 55 Z" fill="#0f172a" opacity="0.85" />
              <path d="M60 52 L260 62 L258 66 L58 56 Z" fill="#18181b" />
              <circle cx="62" cy="94" r="17" fill="#09090b" stroke="#71717a" strokeWidth="3" />
              <circle cx="62" cy="94" r="7" fill="#eab308" />
              <circle cx="218" cy="94" r="17" fill="#09090b" stroke="#71717a" strokeWidth="3" />
              <circle cx="218" cy="94" r="7" fill="#eab308" />
            </svg>
          )}
        </div>
      )}

      {/* HACI CHARACTER SVG WITH ANIMATIONS */}
      <div
        className={`relative z-10 transition-transform duration-100 ${
          isActionCafecito || (isWorking && isActionTriciclo) ? 'animate-work-vibe' : 'animate-haci-idle'
        }`}
      >
        {/* Floor shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 sm:w-36 h-3 bg-black/35 rounded-full blur-[3px] pointer-events-none transition-transform duration-100 scale-95 group-active:scale-105" />

        <svg
          id="haci"
          viewBox="0 0 200 270"
          className={`h-40 sm:h-48 md:h-52 w-auto transition-transform duration-75 drop-shadow-md select-none ${
            isPressed ? 'scale-92 translate-y-1.5' : 'hover:scale-102'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Personaje Haci"
        >
          <defs>
            <radialGradient id="torchGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffea79" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sparkBlueGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="goldChainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <radialGradient id="bulbGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#facc15" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. INVENTIVA CUBANA ACTION: Eureka Lightbulb pop above head */}
          {isActionInventiva && (
            <g transform="translate(100, 16)" className="animate-bulb-pop">
              <circle cx="0" cy="0" r="32" fill="url(#bulbGlowGrad)" />
              {/* Rays of inspiration */}
              <line x1="-30" y1="0" x2="-42" y2="0" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="30" y1="0" x2="42" y2="0" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="-30" x2="0" y2="-42" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="-22" y1="-22" x2="-32" y2="-32" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="22" y1="-22" x2="32" y2="-32" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              {/* Lightbulb glass */}
              <circle cx="0" cy="-6" r="14" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
              <path d="M-8 4 L8 4 L6 10 L-6 10 Z" fill="#ca8a04" />
              <rect x="-5" y="10" width="10" height="3" fill="#a1a1aa" />
              <text x="0" y="-1" textAnchor="middle" fontSize="13" fill="#ca8a04" fontWeight="bold">💡</text>
            </g>
          )}

          {/* 2. NEGOCIADOR ACTION: Fluttering cash bills & deal handshake */}
          {isActionNegociador && (
            <g>
              {/* Dollar bills flutter */}
              <g transform="translate(24, 75)" className="animate-money-flutter">
                <rect x="0" y="0" width="22" height="12" rx="2" fill="#22c55e" stroke="#14532d" strokeWidth="1.5" />
                <circle cx="11" cy="6" r="3.5" fill="#86efac" />
                <text x="11" y="9" textAnchor="middle" fontSize="8" fill="#14532d" fontWeight="bold">$</text>
              </g>
              <g transform="translate(155, 60)" className="animate-money-flutter" style={{ animationDelay: '0.4s' }}>
                <rect x="0" y="0" width="20" height="11" rx="2" fill="#22c55e" stroke="#14532d" strokeWidth="1.5" />
                <circle cx="10" cy="5.5" r="3" fill="#86efac" />
                <text x="10" y="8" textAnchor="middle" fontSize="7" fill="#14532d" fontWeight="bold">$</text>
              </g>
              {/* Handshake icon */}
              <g transform="translate(100, 36)" className="animate-action-badge">
                <circle cx="0" cy="0" r="16" fill="#16553f" stroke="#e0a93b" strokeWidth="2" />
                <text x="0" y="5" textAnchor="middle" fontSize="16">🤝</text>
              </g>
            </g>
          )}

          {/* 3. TRICICLO ACTION: Stack of sandbags and concrete blocks behind */}
          {(isActionTriciclo || (isWorking && activeJobCategory === 'triciclo')) && (
            <g transform="translate(10, 190)">
              {/* Concrete Blocks */}
              <rect x="0" y="24" width="28" height="14" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
              <rect x="4" y="27" width="8" height="8" rx="1" fill="#64748b" />
              <rect x="16" y="27" width="8" height="8" rx="1" fill="#64748b" />
              <rect x="14" y="10" width="28" height="14" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
              {/* Sandbags */}
              <ellipse cx="26" cy="4" rx="14" ry="7" fill="#d97706" opacity="0.9" />
              <ellipse cx="24" cy="2" rx="12" ry="5.5" fill="#f59e0b" />
              <text x="24" y="5" textAnchor="middle" fontSize="7" fill="#78350f" fontWeight="bold">ARENA</text>
            </g>
          )}

          {/* Piernas y Pantalón según ropa equipada */}
          <path d="M62 170 L138 170 L146 245 L108 245 L100 195 L92 245 L54 245 Z" fill={clothing.pantsColor} />
          {clothing.pattern === 'torn' && (
            <rect x="80" y="205" width="22" height="18" fill="#7a8aa0" transform="rotate(-6 91 214)" />
          )}
          {/* Zapatos */}
          <path d="M54 245 h38 v8 h-42 z M108 245 h38 l4 8 h-42 z" fill={clothing.pattern === 'suit' ? '#09090b' : '#222'} />

          {/* Camisa / Torso según la ropa equipada */}
          <path d="M52 100 Q100 88 148 100 L158 175 L42 175 Z" fill={clothing.shirtColor} />

          {/* ROPA PATTERNS & DETAILS */}
          {clothing.pattern === 'torn' && (
            <>
              <path
                d="M42 175 l8 -6 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 6 v8 h-116 z"
                fill={clothing.shirtColor}
              />
              <rect x="112" y="120" width="26" height="24" fill="#6b8f71" transform="rotate(5 125 132)" />
              <path d="M70 108 l10 20 M130 150 l-12 14" stroke="#8d887b" strokeWidth="3" fill="none" />
              <circle cx="88" cy="150" r="8" fill="#c98f62" />
            </>
          )}

          {clothing.pattern === 'tank' && (
            <>
              <path d="M52 100 L72 100 L70 175 L52 175 Z" fill="#c98f62" />
              <path d="M148 100 L128 100 L130 175 L148 175 Z" fill="#c98f62" />
              <path d="M72 100 Q100 115 128 100 L132 175 L68 175 Z" fill={clothing.shirtColor} />
            </>
          )}

          {clothing.pattern === 'tropical' && (
            <>
              <circle cx="78" cy="120" r="6" fill="#facc15" />
              <circle cx="122" cy="135" r="6" fill="#f43f5e" />
              <circle cx="95" cy="155" r="7" fill="#facc15" />
              <path d="M92 98 L100 115 L108 98 Z" fill="#c98f62" />
            </>
          )}

          {clothing.pattern === 'guayabera' && (
            <>
              <line x1="80" y1="102" x2="80" y2="173" stroke="#e2d6be" strokeWidth="2.5" />
              <line x1="120" y1="102" x2="120" y2="173" stroke="#e2d6be" strokeWidth="2.5" />
              <circle cx="100" cy="116" r="3.5" fill="#caa472" />
              <circle cx="100" cy="136" r="3.5" fill="#caa472" />
              <circle cx="100" cy="156" r="3.5" fill="#caa472" />
              <path d="M92 98 L100 110 L108 98 Z" fill="#b97d52" />
            </>
          )}

          {clothing.pattern === 'suit' && (
            <>
              <polygon points="100,105 92,100 108,100" fill="#f8fafc" />
              <polygon points="98,108 102,108 104,155 100,165 96,155" fill="#dc2626" />
              <path d="M70 100 L94 145 L76 175" stroke="#1e3a8a" strokeWidth="4" fill="none" />
              <path d="M130 100 L106 145 L124 175" stroke="#1e3a8a" strokeWidth="4" fill="none" />
            </>
          )}

          {clothing.pattern === 'leather' && (
            <>
              <line x1="100" y1="102" x2="100" y2="175" stroke="#e2e8f0" strokeWidth="2.5" />
              <rect x="98" y="125" width="4" height="8" rx="1" fill="#cbd5e1" />
              <polygon points="82,100 95,115 100,100" fill="#27272a" />
              <polygon points="118,100 105,115 100,100" fill="#27272a" />
            </>
          )}

          {/* Brazos de piel */}
          <path d="M52 104 L30 168 L44 172 L64 118 Z" fill="#c98f62" />
          <path d="M148 104 L170 168 L156 172 L136 118 Z" fill="#c98f62" />

          {/* 4. CALLE 13 ACTION: Percha con ropa de moda en mano izquierda */}
          {(isActionCalle13 || (isWorking && activeJobCategory === 'calle13')) && (
            <g transform="translate(14, 130)">
              {/* Percha / Hanger */}
              <path d="M12 0 L0 12 L24 12 Z" stroke="#ca8a04" strokeWidth="2" fill="none" />
              <circle cx="12" cy="-4" r="3" stroke="#ca8a04" strokeWidth="2" fill="none" />
              {/* Pulóver / Camisa colgada */}
              <rect x="-2" y="12" width="28" height="32" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
              <circle cx="12" cy="18" r="4" fill="#ef4444" />
              <text x="12" y="22" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="bold">13</text>
              {/* Tenis deportivo colgando */}
              <g transform="translate(18, 38)">
                <path d="M0 6 L14 6 L12 0 L4 0 Z" fill="#facc15" stroke="#854d0e" strokeWidth="1" />
                <circle cx="4" cy="4" r="1.5" fill="#fff" />
              </g>
            </g>
          )}

          {/* 5. CAFECITO ACTION: Tacita de café humeante en mano izquierda */}
          {isActionCafecito && (
            <g transform="translate(24, 150)">
              {/* Plato y taza */}
              <ellipse cx="10" cy="16" rx="12" ry="3" fill="#cbd5e1" />
              <rect x="2" y="4" width="16" height="12" rx="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
              <path d="M18 6 Q24 9 18 12" stroke="#94a3b8" strokeWidth="2" fill="none" />
              {/* Café negro */}
              <ellipse cx="10" cy="6" rx="7" ry="2" fill="#3f1e0d" />
              {/* Steam wisps */}
              <g className="animate-steam">
                <path d="M7 2 Q5 -4 7 -8" stroke="#fed7aa" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M13 3 Q15 -3 13 -7" stroke="#fed7aa" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              </g>
              {/* Energy bolts */}
              <polygon points="28,2 24,10 28,10 26,18 32,8 28,8" fill="#facc15" />
            </g>
          )}

          {/* TATUAJES EN LOS BRAZOS / PIEL */}
          {tattoo.tattooType === 'ancla' && (
            <g transform="translate(34, 138) scale(0.7)">
              <line x1="10" y1="4" x2="10" y2="24" stroke="#0f172a" strokeWidth="2.5" />
              <line x1="4" y1="10" x2="16" y2="10" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="10" cy="4" r="3" stroke="#0f172a" strokeWidth="2" fill="none" />
              <path d="M3 20 Q10 28 17 20" stroke="#0f172a" strokeWidth="2.5" fill="none" />
            </g>
          )}

          {tattoo.tattooType === 'bandera' && (
            <g transform="translate(42, 108) scale(0.65)">
              <rect x="0" y="0" width="22" height="13" fill="#1e3a8a" />
              <rect x="0" y="3" width="22" height="3" fill="#fff" />
              <rect x="0" y="8" width="22" height="3" fill="#fff" />
              <polygon points="0,0 10,6.5 0,13" fill="#dc2626" />
              <circle cx="3" cy="6.5" r="1.5" fill="#fff" />
            </g>
          )}

          {tattoo.tattooType === 'fuego' && (
            <g transform="translate(142, 126) scale(0.75)">
              <path d="M5 25 Q12 10 7 2 Q16 12 18 25 Z" fill="#ea580c" />
              <path d="M8 25 Q13 14 10 8 Q15 16 16 25 Z" fill="#facc15" />
            </g>
          )}

          {tattoo.tattooType === 'manga' && (
            <>
              <g transform="translate(32, 120) scale(0.7)">
                <path d="M4 0 L14 8 L6 16 L16 24 L8 32 L18 40" stroke="#09090b" strokeWidth="2.5" fill="none" />
                <circle cx="10" cy="14" r="3" fill="#09090b" />
                <circle cx="10" cy="30" r="3" fill="#09090b" />
              </g>
              <g transform="translate(142, 120) scale(0.7)">
                <path d="M14 0 L4 8 L12 16 L2 24 L10 32 L0 40" stroke="#09090b" strokeWidth="2.5" fill="none" />
                <circle cx="8" cy="14" r="3" fill="#09090b" />
                <circle cx="8" cy="30" r="3" fill="#09090b" />
              </g>
            </>
          )}

          {/* Cuello y Cabeza */}
          <rect x="88" y="82" width="24" height="22" fill="#b97d52" />
          <ellipse cx="100" cy="58" rx="36" ry="40" fill="#c98f62" />

          {/* Cadena de Oro con Brillo Animado */}
          {(hasCadena || isExperienced || isActionCadena) && (
            <g className={isActionCadena ? 'animate-gold-shine' : ''}>
              <path
                d="M84 94 Q100 118 116 94"
                fill="none"
                stroke="url(#goldChainGrad)"
                strokeWidth={isActionCadena ? "5.5" : "3.5"}
                strokeLinecap="round"
              />
              {/* Medallón central */}
              <circle cx="100" cy="108" r={isActionCadena ? "6" : "4"} fill="url(#goldChainGrad)" stroke="#b45309" strokeWidth="1" />
              {/* Star sparkles for Cadena */}
              {isActionCadena && (
                <g transform="translate(100, 108)">
                  <polygon points="0,-10 3,-3 10,0 3,3 0,10 -3,3 -10,0 -3,-3" fill="#fff" />
                </g>
              )}
            </g>
          )}

          {/* Pelo negro */}
          <path
            d="M62 56 Q58 14 100 12 Q144 14 138 56 Q130 36 100 34 Q70 36 62 56 Z"
            fill="#111"
          />
          <path
            d="M72 30 l-8 -10 l14 4 l2 -12 l10 10 l8 -12 l6 12 l12 -8 l-2 12 l12 -2 l-8 12 Z"
            fill="#111"
          />

          {/* Orejas */}
          <ellipse cx="62" cy="62" rx="5" ry="9" fill="#b97d52" />
          <ellipse cx="138" cy="62" rx="5" ry="9" fill="#b97d52" />

          {/* Ojos con animación de parpadeo (animate-blink) */}
          {isMaster ? (
            <g>
              <rect x="74" y="55" width="22" height="15" rx="5" fill="#18181b" stroke="#e0a93b" strokeWidth="1.5" />
              <rect x="104" y="55" width="22" height="15" rx="5" fill="#18181b" stroke="#e0a93b" strokeWidth="1.5" />
              <line x1="96" y1="60" x2="104" y2="60" stroke="#e0a93b" strokeWidth="2" />
              <line x1="68" y1="58" x2="74" y2="58" stroke="#e0a93b" strokeWidth="1.5" />
              <line x1="126" y1="58" x2="132" y2="58" stroke="#e0a93b" strokeWidth="1.5" />
            </g>
          ) : (
            <g className="animate-blink">
              {/* Ojo izquierdo */}
              <circle cx="86" cy="62" r="4.2" fill="#111" />
              <circle cx="87.5" cy="60.5" r="1.3" fill="#fff" />
              {/* Ojo derecho: si es negociador hace guiño ;) */}
              {isActionNegociador ? (
                <path d="M110 63 Q114 67 118 63" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              ) : (
                <>
                  <circle cx="114" cy="62" r="4.2" fill="#111" />
                  <circle cx="115.5" cy="60.5" r="1.3" fill="#fff" />
                </>
              )}
            </g>
          )}

          {/* Nariz */}
          <path d="M99 64 L96 72 L103 72" stroke="#a06742" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Boca sonriente */}
          <path
            d={isMaster || isActionInventiva || isActionNegociador ? "M88 78 Q100 90 112 78" : "M92 80 Q100 86 108 80"}
            stroke="#6b3a22"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Sudor cómico de esfuerzo para Triciclo */}
          {isActionTriciclo && (
            <path d="M128 50 C128 46 132 46 132 50 C132 53 128 53 128 50 Z" fill="#38bdf8" />
          )}

          {/* Soldador: Careta en la frente O BAJADA SOBRE LA CARA SI ESTÁ SOLDANDO */}
          {hasSoldador && (
            isActionSoldar ? (
              // Careta bajada cubriendo la cara para soldar
              <g transform="translate(66, 48)">
                <rect x="0" y="0" width="68" height="34" rx="8" fill="#1f2937" stroke="#e0a93b" strokeWidth="2" />
                {/* Visor de soldadura verde brillante eléctrico */}
                <rect x="18" y="8" width="32" height="14" rx="3" fill="#10b981" stroke="#34d399" strokeWidth="1.5" className="animate-pulse" />
                <rect x="22" y="10" width="24" height="2" fill="#a7f3d0" />
              </g>
            ) : (
              // Careta subida en la frente
              <g transform="translate(72, 24)">
                <rect x="0" y="0" width="56" height="18" rx="6" fill="#2d3748" stroke="#e0a93b" strokeWidth="1.5" />
                <rect x="14" y="4" width="28" height="9" rx="2" fill="#10b981" opacity="0.85" />
              </g>
            )
          )}

          {/* Herramienta de Soldador en mano derecha */}
          {hasSoldador && (
            <g transform="translate(150, 155)">
              <rect x="0" y="0" width="10" height="24" rx="2" fill="#374151" />
              <rect x="2" y="-12" width="6" height="14" fill="#9ca3af" />
              <polygon points="5,-18 2,-12 8,-12" fill="#f59e0b" />
              {/* Flame and dynamic sparks */}
              <circle
                cx="5"
                cy="-20"
                r={isActionSoldar ? "22" : isWorking ? "16" : "10"}
                fill="url(#torchGlow)"
                className={isActionSoldar ? 'animate-ping' : 'animate-pulse'}
              />
              <text x="-4" y="-14" fontSize="18" className="select-none pointer-events-none">🔥</text>

              {/* Arc welding sparks flying outward */}
              {isActionSoldar && (
                <g>
                  <circle cx="5" cy="-22" r="14" fill="url(#sparkBlueGlow)" />
                  <line x1="5" y1="-20" x2="-8" y2="-32" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5" y1="-20" x2="18" y2="-30" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5" y1="-20" x2="22" y2="-12" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5" y1="-20" x2="-12" y2="-16" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5" y1="-20" x2="6" y2="-38" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
