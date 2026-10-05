/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Business {
  id: string;
  n: string;
  ic: string;
  d: string;
  base: number;
  seg: number;
}

export interface Job {
  id: string;
  n: string;
  ic: string;
  base: number;
  ms: number;
  plural: string;
  category: 'soldador' | 'triciclo' | 'calle13';
  desc?: string;
}

export interface ActiveJob {
  id: string;
  fin: number;
  pago: number;
}

export interface YumaMilestone {
  id: string;
  title: string;
  icon: string;
  desc: string;
  cost: number;
  story: string;
}

export interface PerkSkill {
  id: string;
  n: string;
  ic: string;
  d: string;
  cost: number;
  effectText: string;
  multiplierType: 'click' | 'businessDiscount' | 'jobSpeed';
  val: number;
}

export interface ClothingItem {
  id: string;
  n: string;
  ic: string;
  d: string;
  cost: number;
  clickBonusPct: number;
  pattern: 'torn' | 'tank' | 'tropical' | 'guayabera' | 'suit' | 'leather';
  shirtColor: string;
  pantsColor: string;
}

export interface CarItem {
  id: string;
  n: string;
  ic: string;
  d: string;
  cost: number;
  ppsBonus: number;
  carType: 'none' | 'bici' | 'lada' | 'almendron' | 'cadillac' | 'deportivo';
}

export interface TattooItem {
  id: string;
  n: string;
  ic: string;
  d: string;
  cost: number;
  clickBonusFlat: number;
  tattooType: 'none' | 'ancla' | 'bandera' | 'fuego' | 'manga';
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  category: 'clic' | 'bisne' | 'herrero' | 'estilo' | 'yuma';
  rewardPesos: number;
  targetCount: number;
}

export interface FloatingElement {
  id: string;
  x: number;
  y: number;
  text: string;
  isSparkle?: boolean;
}

export type CharacterActionType =
  | 'soldar_upgrade'
  | 'triciclo_upgrade'
  | 'calle13_upgrade'
  | 'inventiva_upgrade'
  | 'negociador_upgrade'
  | 'cafecito_upgrade'
  | 'cadena_upgrade'
  | 'tap'
  | 'celebration'
  | null;

export interface CharacterAction {
  type: CharacterActionType;
  title: string;
  badge: string;
  id: number;
}

export interface GameState {
  pesos: number;
  nivel: number; // nivel soldador
  nivelTriciclo: number; // nivel chófer de triciclo
  nivelCalle13: number; // nivel vendedor calle 13
  trabajo: ActiveJob | null;
  hechas: Record<string, number>;
  neg: Record<string, number>;
  perks: Record<string, boolean>;
  milestones: Record<string, boolean>;
  ropaEquipada: string;
  ropaComprada: string[];
  carroEquipado: string;
  carrosComprados: string[];
  tatuajeEquipado: string;
  tatuajesComprados: string[];
  logrosReclamados: Record<string, boolean>;
  stats: {
    totalClicks: number;
    totalEarned: number;
    totalJobsDone: number;
    startTime: number;
    hasReachedYuma: boolean;
  };
  soundEnabled: boolean;
}
