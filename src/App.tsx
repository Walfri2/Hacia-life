/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  CLAVE_STORAGE,
  COSTO_SOLDADOR,
  COSTO_SUBIDA,
  COSTO_TRICICLO,
  COSTO_SUBIDA_TRICICLO,
  COSTO_CALLE13,
  COSTO_SUBIDA_CALLE13,
  NEGOCIOS,
  TRABAJOS,
  HABILIDADES_EXTRA,
  METAS_YUMA,
  ROPA_LISTA,
  CARROS_LISTA,
  TATUAJES_LISTA,
  SISTEMA_LOGROS,
  SALUDO,
  DIALOGOS
} from './data/gameData';
import {
  Business,
  Job,
  PerkSkill,
  YumaMilestone,
  GameState,
  FloatingElement,
  ClothingItem,
  CarItem,
  TattooItem,
  Achievement,
  CharacterAction,
  CharacterActionType
} from './types';
import { sounds } from './utils/audio';
import { HeaderBar } from './components/HeaderBar';
import { HaciCharacter } from './components/HaciCharacter';
import { DialogoBubble } from './components/DialogoBubble';
import { TiendaView } from './components/TiendaView';
import { EstiloTiendaView } from './components/EstiloTiendaView';
import { HabilidadesView } from './components/HabilidadesView';
import { TrabajosView } from './components/TrabajosView';
import { LogrosView } from './components/LogrosView';
import { MetasYumaView } from './components/MetasYumaView';
import { StatsModal } from './components/StatsModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { VictoryModal } from './components/VictoryModal';
import { AchievementToast } from './components/AchievementToast';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { usePWAInstall } from './hooks/usePWAInstall';
import { Store, Sparkles, Hammer, Trophy, Plane, Wrench, ChevronUp, ChevronDown } from 'lucide-react';

const INITIAL_STATE: GameState = {
  pesos: 0,
  nivel: 0,
  nivelTriciclo: 0,
  nivelCalle13: 0,
  trabajo: null,
  hechas: {},
  neg: {},
  perks: {},
  milestones: {},
  ropaEquipada: 'ropa_rota',
  ropaComprada: ['ropa_rota'],
  carroEquipado: 'carro_ninguno',
  carrosComprados: ['carro_ninguno'],
  tatuajeEquipado: 'tat_ninguno',
  tatuajesComprados: ['tat_ninguno'],
  logrosReclamados: {},
  stats: {
    totalClicks: 0,
    totalEarned: 0,
    totalJobsDone: 0,
    startTime: Date.now(),
    hasReachedYuma: false
  },
  soundEnabled: true
};

export default function App() {
  // Load state with robust backwards compatibility
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(CLAVE_STORAGE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          hechas: parsed.hechas || {},
          neg: parsed.neg || {},
          perks: parsed.perks || {},
          milestones: parsed.milestones || {},
          nivelTriciclo: parsed.nivelTriciclo || 0,
          nivelCalle13: parsed.nivelCalle13 || 0,
          ropaEquipada: parsed.ropaEquipada || 'ropa_rota',
          ropaComprada: parsed.ropaComprada || ['ropa_rota'],
          carroEquipado: parsed.carroEquipado || 'carro_ninguno',
          carrosComprados: parsed.carrosComprados || ['carro_ninguno'],
          tatuajeEquipado: parsed.tatuajeEquipado || 'tat_ninguno',
          tatuajesComprados: parsed.tatuajesComprados || ['tat_ninguno'],
          logrosReclamados: parsed.logrosReclamados || {},
          stats: {
            ...INITIAL_STATE.stats,
            ...(parsed.stats || {})
          },
          soundEnabled: parsed.soundEnabled !== undefined ? parsed.soundEnabled : true
        };
      }
    } catch {
      // Fallback to initial
    }
    return INITIAL_STATE;
  });

  type TabType = 'negocios' | 'estilo' | 'taller' | 'logros' | 'yuma';
  const [activeTab, setActiveTab] = useState<TabType | null>('negocios');
  const [tallerSubTab, setTallerSubTab] = useState<'habilidades' | 'trabajos'>('habilidades');
  const [dialogo, setDialogo] = useState<string>(() => {
    return Math.random() < 0.5 ? 'A trabajar duro que voy a ser puro' : SALUDO;
  });
  const [dialogoVisible, setDialogoVisible] = useState<boolean>(true);
  const [floatingItems, setFloatingItems] = useState<FloatingElement[]>([]);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<Achievement | null>(null);
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);

  const handleToggleTab = (tab: TabType) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  };

  const characterZoneRef = useRef<HTMLDivElement>(null);
  const dialogoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousUnlockedIdsRef = useRef<Set<string>>(new Set());

  // Interactive Character Action Animation State
  const [currentAction, setCurrentAction] = useState<CharacterAction | null>(null);
  const actionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerCharacterAction = useCallback(
    (type: CharacterActionType, title: string, badge: string, durationMs = 3800) => {
      if (actionTimerRef.current) {
        clearTimeout(actionTimerRef.current);
      }
      const id = Date.now();
      setCurrentAction({ type, title, badge, id });
      actionTimerRef.current = setTimeout(() => {
        setCurrentAction((curr) => (curr?.id === id ? null : curr));
      }, durationMs);
    },
    []
  );

  // Active job category helper
  const activeJobCategory = useMemo(() => {
    if (!state.trabajo) return null;
    return TRABAJOS.find((j) => j.id === state.trabajo?.id)?.category || null;
  }, [state.trabajo]);

  // Sound manager sync
  useEffect(() => {
    sounds.setEnabled(state.soundEnabled);
  }, [state.soundEnabled]);

  // Save game state
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(state));
    } catch {
      // Storage error ignored
    }
  }, [state]);

  // Dialogue helper
  const decir = useCallback((texto: string, durationMs = 7000) => {
    setDialogo(texto);
    setDialogoVisible(true);
    if (dialogoTimerRef.current) {
      clearTimeout(dialogoTimerRef.current);
    }
    dialogoTimerRef.current = setTimeout(() => {
      setDialogoVisible(false);
    }, durationMs);
  }, []);

  const fraseAleatoria = useCallback(() => {
    const k = Math.floor(Math.random() * DIALOGOS.length);
    decir(DIALOGOS[k]);
  }, [decir]);

  // Idle dialogue timer
  useEffect(() => {
    const interval = setInterval(() => {
      fraseAleatoria();
    }, 45000);
    return () => clearInterval(interval);
  }, [fraseAleatoria]);

  // Currently equipped items
  const equippedClothing = useMemo(() => {
    return ROPA_LISTA.find((r) => r.id === state.ropaEquipada) || ROPA_LISTA[0];
  }, [state.ropaEquipada]);

  const equippedCar = useMemo(() => {
    return CARROS_LISTA.find((c) => c.id === state.carroEquipado) || CARROS_LISTA[0];
  }, [state.carroEquipado]);

  const equippedTattoo = useMemo(() => {
    return TATUAJES_LISTA.find((t) => t.id === state.tatuajeEquipado) || TATUAJES_LISTA[0];
  }, [state.tatuajeEquipado]);

  // Multipliers & bonuses
  const hasInventiva = !!state.perks['inventiva'];
  const hasNegociador = !!state.perks['negociador'];
  const hasCafecito = !!state.perks['cafecito'];
  const hasCadena = !!state.perks['cadena'];

  const clickBonusMultiplier = (hasInventiva ? 0.30 : 0) + equippedClothing.clickBonusPct;
  const businessDiscountMultiplier = hasNegociador ? 0.12 : 0;
  const jobSpeedMultiplier = hasCafecito ? 0.25 : 0;
  const jobPayMultiplier = hasCadena ? 0.40 : 0;

  // Click power: (1 + 5*soldador + 8*triciclo + 12*calle13) * (1 + multipliers) + flat tattoo bonus
  const baseClickPower = 1 + 5 * state.nivel + 8 * state.nivelTriciclo + 12 * state.nivelCalle13;
  const porClic = Math.max(1, Math.round(baseClickPower * (1 + clickBonusMultiplier)) + equippedTattoo.clickBonusFlat);

  // Passive income per second: sum of businesses + car pps bonus
  const businessesIncome = NEGOCIOS.reduce((acc, n) => {
    const count = state.neg[n.id] || 0;
    return acc + n.seg * count;
  }, 0);
  const porSeg = businessesIncome + equippedCar.ppsBonus;

  // Herrero job bonus percent
  const bonusHerrero = state.nivel > 0 ? (state.nivel - 1) * 25 : 0;

  // Total businesses owned
  const totalBusinessesOwned = Object.values(state.neg).reduce((a, b) => a + b, 0);

  // Next milestone calculation for Header mini-progress
  const nextMilestone = (() => {
    const uncompleted = METAS_YUMA.find((m) => !state.milestones[m.id]);
    if (!uncompleted) return null;
    const progress = Math.min(100, (state.pesos / uncompleted.cost) * 100);
    return {
      title: uncompleted.title,
      cost: uncompleted.cost,
      progress
    };
  })();

  // Passive income tick: 10 times a second
  useEffect(() => {
    if (porSeg <= 0) return;
    const interval = setInterval(() => {
      const increment = porSeg / 10;
      setState((prev) => ({
        ...prev,
        pesos: prev.pesos + increment,
        stats: {
          ...prev.stats,
          totalEarned: prev.stats.totalEarned + increment
        }
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [porSeg]);

  // Active Job check tick: checks every 250ms
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const job = prev.trabajo;
        if (!job) return prev;

        if (Date.now() >= job.fin) {
          sounds.playJobDone();
          decir('¡Terminé el trabajo de soldadura! ¡Qué bien quedó, asere!', 6000);
          return {
            ...prev,
            pesos: prev.pesos + job.pago,
            trabajo: null,
            hechas: {
              ...prev.hechas,
              [job.id]: (prev.hechas[job.id] || 0) + 1
            },
            stats: {
              ...prev.stats,
              totalEarned: prev.stats.totalEarned + job.pago,
              totalJobsDone: prev.stats.totalJobsDone + 1
            }
          };
        }
        return prev;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [decir]);

  // Achievements Computation & Real-Time Tracking
  const achievementsWithState = useMemo(() => {
    return SISTEMA_LOGROS.map((ach) => {
      let currentProgress = 0;

      if (ach.id === 'clic_1' || ach.id === 'clic_100' || ach.id === 'clic_500') {
        currentProgress = state.stats.totalClicks;
      } else if (ach.id === 'herrero_on' || ach.id === 'herrero_5') {
        currentProgress = state.nivel;
      } else if (ach.id === 'trabajo_1' || ach.id === 'trabajos_10') {
        currentProgress = state.stats.totalJobsDone;
      } else if (ach.id === 'negocio_1' || ach.id === 'negocios_10' || ach.id === 'negocios_30') {
        currentProgress = totalBusinessesOwned;
      } else if (ach.id === 'estilo_ropa') {
        currentProgress = state.ropaComprada.length;
      } else if (ach.id === 'estilo_carro') {
        currentProgress = state.carrosComprados.length;
      } else if (ach.id === 'estilo_tatuaje') {
        currentProgress = state.tatuajesComprados.length;
      } else if (ach.id === 'estilo_total') {
        const uniqueItems = state.ropaComprada.length + state.carrosComprados.length + state.tatuajesComprados.length;
        currentProgress = uniqueItems;
      } else if (ach.id === 'yuma_fin') {
        currentProgress = state.milestones['llegada'] ? 1 : 0;
      }

      const isUnlocked = currentProgress >= ach.targetCount;
      const isClaimed = !!state.logrosReclamados[ach.id];

      return {
        ...ach,
        currentProgress,
        isUnlocked,
        isClaimed
      };
    });
  }, [
    state.stats.totalClicks,
    state.nivel,
    state.stats.totalJobsDone,
    totalBusinessesOwned,
    state.ropaComprada.length,
    state.carrosComprados.length,
    state.tatuajesComprados.length,
    state.milestones,
    state.logrosReclamados
  ]);

  // Unclaimed rewards count
  const unclaimedAchievementsCount = achievementsWithState.filter(
    (a) => a.isUnlocked && !a.isClaimed
  ).length;

  // Trigger toast notification when an achievement is first unlocked
  useEffect(() => {
    achievementsWithState.forEach((ach) => {
      if (ach.isUnlocked && !previousUnlockedIdsRef.current.has(ach.id)) {
        previousUnlockedIdsRef.current.add(ach.id);
        setActiveToast(ach);
        sounds.playLevelUp();
        try {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.1 } });
        } catch {
          // ignore
        }
      }
    });
  }, [achievementsWithState]);

  // Tap Haci Handler
  const handleCharacterTap = (e: React.PointerEvent<HTMLDivElement>) => {
    sounds.playClave();
    if (state.nivel > 0) {
      sounds.playWeld();
    }

    setState((prev) => ({
      ...prev,
      pesos: prev.pesos + porClic,
      stats: {
        ...prev.stats,
        totalClicks: prev.stats.totalClicks + 1,
        totalEarned: prev.stats.totalEarned + porClic
      }
    }));

    // Floating text coordinates
    const target = characterZoneRef.current;
    if (target) {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = `${Date.now()}_${Math.random()}`;

      setFloatingItems((prev) => [...prev.slice(-15), { id, x, y, text: `+$${porClic}` }]);

      setTimeout(() => {
        setFloatingItems((prev) => prev.filter((item) => item.id !== id));
      }, 850);
    }
  };

  // Buy Business Handler
  const handleBuyBusiness = (business: Business, cost: number) => {
    if (state.pesos < cost) return;
    sounds.playCoin();
    setState((prev) => ({
      ...prev,
      pesos: prev.pesos - cost,
      neg: {
        ...prev.neg,
        [business.id]: (prev.neg[business.id] || 0) + 1
      }
    }));
    decir(`¡Compramos ${business.n}! Ahora tenemos más entradas.`, 4000);
  };

  // Soldador Upgrade
  const handleUpgradeSoldador = () => {
    const isFirst = state.nivel === 0;
    const cost = isFirst ? COSTO_SOLDADOR : COSTO_SUBIDA;
    if (state.pesos < cost) return;

    sounds.playWeld();
    sounds.playLevelUp();
    triggerCharacterAction(
      'soldar_upgrade',
      isFirst ? '¡SOLDADOR ACTIVADO! 🔥' : `¡SOLDADOR NIVEL ${state.nivel + 1}! 🔥`,
      '⚡',
      4200
    );

    setState((prev) => ({
      ...prev,
      pesos: prev.pesos - cost,
      nivel: prev.nivel + 1
    }));

    if (isFirst) {
      decir('¡Ya tenemos soldador! Careta abajo y antorcha prendida para fabricar rejas y ventanas.', 6000);
      try {
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } else {
      decir(`¡Soldador subido al nivel ${state.nivel + 1}! Ahora gano más por clic y en los trabajos.`, 4000);
    }
  };

  // Chófer de Triciclo Upgrade
  const handleUpgradeTriciclo = () => {
    const isFirst = state.nivelTriciclo === 0;
    const cost = isFirst ? COSTO_TRICICLO : COSTO_SUBIDA_TRICICLO;
    if (state.pesos < cost) return;

    sounds.playBike();
    sounds.playLevelUp();
    triggerCharacterAction(
      'triciclo_upgrade',
      isFirst ? '¡TRICICLO LISTO! 🚲' : `¡TRICICLO NIVEL ${state.nivelTriciclo + 1}! 🚲`,
      '🧱',
      4200
    );

    setState((prev) => ({
      ...prev,
      pesos: prev.pesos - cost,
      nivelTriciclo: prev.nivelTriciclo + 1
    }));

    if (isFirst) {
      decir('¡Triciclo de carga listo! A pedalear y repartir sacos de arena, bloques y cemento.', 6000);
      try {
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } else {
      decir(`¡Triciclo en nivel ${state.nivelTriciclo + 1}! Ganamos más por clic y en los fletes.`, 4000);
    }
  };

  // Vendedor de Calle 13 Upgrade
  const handleUpgradeCalle13 = () => {
    const isFirst = state.nivelCalle13 === 0;
    const cost = isFirst ? COSTO_CALLE13 : COSTO_SUBIDA_CALLE13;
    if (state.pesos < cost) return;

    sounds.playMoney();
    sounds.playLevelUp();
    triggerCharacterAction(
      'calle13_upgrade',
      isFirst ? '¡PUESTO EN CALLE 13! 🛍️' : `¡CALLE 13 NIVEL ${state.nivelCalle13 + 1}! 🛍️`,
      '👕',
      4200
    );

    setState((prev) => ({
      ...prev,
      pesos: prev.pesos - cost,
      nivelCalle13: prev.nivelCalle13 + 1
    }));

    if (isFirst) {
      decir('¡Puesto montado en Calle 13! A pregonar pulóveres, shorts, camisas y zapatos de moda.', 6000);
      try {
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } else {
      decir(`¡Puesto de Calle 13 en nivel ${state.nivelCalle13 + 1}! Más ventas y más pesos.`, 4000);
    }
  };

  // Buy Extra Perk
  const handleBuyPerk = (perk: PerkSkill) => {
    if (state.pesos < perk.cost || state.perks[perk.id]) return;

    // Trigger themed animation and sound based on what was learned
    if (perk.id === 'inventiva') {
      sounds.playIdea();
      triggerCharacterAction('inventiva_upgrade', '¡SE ME PRENDIÓ EL BOMBILLO! 💡', '🧠', 4500);
    } else if (perk.id === 'negociador') {
      sounds.playMoney();
      triggerCharacterAction('negociador_upgrade', '¡TREMENDO BISNE, ASERE! 🤝', '💸', 4500);
    } else if (perk.id === 'cafecito') {
      sounds.playCoffee();
      triggerCharacterAction('cafecito_upgrade', '¡BUCHITO DE CAFÉ RECARGAO! ☕', '⚡', 4500);
    } else if (perk.id === 'cadena') {
      sounds.playGleam();
      triggerCharacterAction('cadena_upgrade', '¡EL MÁS FACHOSO DE LA HABANA! 👑', '✨', 4500);
    } else {
      sounds.playCoin();
      triggerCharacterAction('celebration', `¡HABILIDAD: ${perk.n.toUpperCase()}!`, '✨', 4000);
    }

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.55 } });
    } catch {
      // ignore
    }

    setState((prev) => ({
      ...prev,
      pesos: prev.pesos - perk.cost,
      perks: {
        ...prev.perks,
        [perk.id]: true
      }
    }));
    decir(`¡Aprendido "${perk.n}"! ${perk.effectText}`, 5000);
  };

  // Start Job (Soldador, Triciclo o Calle 13)
  const handleStartJob = (job: Job, durationMs: number, payout: number) => {
    if (state.trabajo) return;

    if (job.category === 'soldador') {
      sounds.playWeld();
      triggerCharacterAction('soldar_upgrade', `¡SOLDANDO: ${job.n.toUpperCase()}! 🔥`, '🔧', 4000);
    } else if (job.category === 'triciclo') {
      sounds.playBike();
      triggerCharacterAction('triciclo_upgrade', `¡FLETEANDO: ${job.n.toUpperCase()}! 🚲`, '🧱', 4000);
    } else if (job.category === 'calle13') {
      sounds.playMoney();
      triggerCharacterAction('calle13_upgrade', `¡VENDIENDO: ${job.n.toUpperCase()}! 👕`, '🛍️', 4000);
    } else {
      sounds.playWeld();
    }

    setState((prev) => ({
      ...prev,
      trabajo: {
        id: job.id,
        fin: Date.now() + durationMs,
        pago: payout
      }
    }));
    decir(`A realizar: ${job.n}. ¡Va a quedar de lujo!`, 4000);
  };

  // Cancel Welding Job
  const handleCancelJob = () => {
    if (!state.trabajo) return;
    setState((prev) => ({
      ...prev,
      trabajo: null
    }));
    decir('Trabajo cancelado. No te preocupes, hacemos otro.', 3000);
  };

  // Buy or Equip Clothing
  const handleBuyOrEquipRopa = (item: ClothingItem) => {
    const isBought = state.ropaComprada.includes(item.id) || item.cost === 0;
    if (isBought) {
      sounds.playCoin();
      triggerCharacterAction('calle13_upgrade', `¡LOOK: ${item.n.toUpperCase()}! 👕`, '✨', 3000);
      setState((prev) => ({ ...prev, ropaEquipada: item.id }));
      decir(`¡Me puse la ${item.n}! Mira qué pinta tengo ahora.`, 4000);
      return;
    }
    if (state.pesos < item.cost) return;
    sounds.playCoin();
    triggerCharacterAction('calle13_upgrade', `¡ESTRENO: ${item.n.toUpperCase()}! 👕`, '✨', 3500);
    setState((prev) => ({
      ...prev,
      pesos: prev.pesos - item.cost,
      ropaEquipada: item.id,
      ropaComprada: [...prev.ropaComprada, item.id]
    }));
    decir(`¡Comprada la ${item.n}! Ahora sí que luzco elegante.`, 4000);
  };

  // Buy or Equip Car
  const handleBuyOrEquipCarro = (item: CarItem) => {
    const isBought = state.carrosComprados.includes(item.id) || item.cost === 0;
    if (isBought) {
      sounds.playCoin();
      triggerCharacterAction('celebration', `¡PARQUEADO: ${item.n.toUpperCase()}! 🚗`, '💨', 3000);
      setState((prev) => ({ ...prev, carroEquipado: item.id }));
      decir(`¡Parqueé mi ${item.n} ahí atrás! Qué nave más linda.`, 4000);
      return;
    }
    if (state.pesos < item.cost) return;
    sounds.playCoin();
    triggerCharacterAction('celebration', `¡NUEVA NAVE: ${item.n.toUpperCase()}! 🚗`, '💨', 4000);
    setState((prev) => ({
      ...prev,
      pesos: prev.pesos - item.cost,
      carroEquipado: item.id,
      carrosComprados: [...prev.carrosComprados, item.id]
    }));
    decir(`¡Compré el ${item.n}! Míralo estacionado detrás de mí.`, 4000);
  };

  // Buy or Equip Tattoo
  const handleBuyOrEquipTatuaje = (item: TattooItem) => {
    const isBought = state.tatuajesComprados.includes(item.id) || item.cost === 0;
    if (isBought) {
      sounds.playCoin();
      triggerCharacterAction('cadena_upgrade', `¡LUCIENDO: ${item.n.toUpperCase()}! ⚓`, '💪', 3000);
      setState((prev) => ({ ...prev, tatuajeEquipado: item.id }));
      decir(`¡Luciendo con orgullo mi ${item.n}!`, 4000);
      return;
    }
    if (state.pesos < item.cost) return;
    sounds.playCoin();
    triggerCharacterAction('cadena_upgrade', `¡TINTA FINA: ${item.n.toUpperCase()}! ⚓`, '💪', 4000);
    setState((prev) => ({
      ...prev,
      pesos: prev.pesos - item.cost,
      tatuajeEquipado: item.id,
      tatuajesComprados: [...prev.tatuajesComprados, item.id]
    }));
    decir(`¡Tatuaje hecho! Ese ${item.n} me da fuerza pa' seguir luchando.`, 4000);
  };

  // Claim Achievement Reward
  const handleClaimReward = (ach: Achievement) => {
    if (state.logrosReclamados[ach.id]) return;
    sounds.playCoin();
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }

    setState((prev) => ({
      ...prev,
      pesos: prev.pesos + ach.rewardPesos,
      logrosReclamados: {
        ...prev.logrosReclamados,
        [ach.id]: true
      },
      stats: {
        ...prev.stats,
        totalEarned: prev.stats.totalEarned + ach.rewardPesos
      }
    }));

    decir(`¡Cobrada recompensa de $${ach.rewardPesos.toLocaleString('es-ES')} por "${ach.title}"!`, 4000);
  };

  // Buy Milestone
  const handleBuyMilestone = (m: YumaMilestone) => {
    if (state.pesos < m.cost || state.milestones[m.id]) return;

    if (m.id === 'llegada') {
      sounds.playVictory();
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch {
        // ignore
      }
      setShowVictory(true);
    } else {
      sounds.playLevelUp();
      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }

    setState((prev) => ({
      ...prev,
      pesos: prev.pesos - m.cost,
      milestones: {
        ...prev.milestones,
        [m.id]: true
      }
    }));

    decir(m.story, 8000);
  };

  // Reset Progress
  const handleResetConfirm = () => {
    setState({
      ...INITIAL_STATE,
      stats: {
        ...INITIAL_STATE.stats,
        startTime: Date.now()
      }
    });
    previousUnlockedIdsRef.current.clear();
    setShowResetConfirm(false);
    decir('Empezamos de cero con la misma ilusión. ¡A luchar!', 5000);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a2e22] text-[#fdf8ee] overflow-hidden select-none font-sans">
      {/* Real-time Achievement Toast */}
      <AchievementToast
        achievement={activeToast}
        onDismiss={() => setActiveToast(null)}
        onViewAchievements={() => setActiveTab('logros')}
      />

      {/* Top Header */}
      <HeaderBar
        pesos={state.pesos}
        porClic={porClic}
        porSeg={porSeg}
        soundEnabled={state.soundEnabled}
        onToggleSound={() => setState((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
        onOpenLogros={() => setActiveTab('logros')}
        onOpenStats={() => setShowStats(true)}
        onOpenYuma={() => setActiveTab('yuma')}
        onOpenDrive={() => setShowDriveModal(true)}
        onOpenInstall={() => setShowInstallModal(true)}
        isInstalled={isInstalled}
        unclaimedCount={unclaimedAchievementsCount}
        nextMilestone={nextMilestone}
      />

      {/* Main Container - Responsive layout */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-5xl mx-auto w-full">
        {/* Character / Clicker Zone with Background Car and Tattoos */}
        <section
          ref={characterZoneRef}
          className={`relative flex flex-col items-center justify-between bg-gradient-to-b from-[#0f3d2e] to-[#0a2e22] overflow-hidden transition-all duration-200 ${
            activeTab !== null
              ? 'h-[25vh] min-h-[145px] max-h-[185px] shrink-0 md:flex-1 md:h-full md:max-h-none border-b-3 md:border-b-0 md:border-r-3 border-double border-[#e0a93b]/70 p-1.5 sm:p-3'
              : 'flex-1 h-full p-4 justify-around'
          }`}
        >
          {/* Dialogue Speech Bubble */}
          <div className={`w-full z-20 max-w-sm ${activeTab !== null ? 'mb-0.5 scale-90 origin-top' : 'mb-1'}`}>
            <DialogoBubble
              dialogo={dialogo}
              visible={dialogoVisible}
              onNext={fraseAleatoria}
            />
          </div>

          {/* Interactive Haci SVG Character with equipped clothes, tattoo, and car behind */}
          <div className="relative z-10 my-auto w-full flex items-center justify-center">
            <HaciCharacter
              nivel={state.nivel}
              clothing={equippedClothing}
              car={equippedCar}
              tattoo={equippedTattoo}
              hasCadena={hasCadena}
              isWorking={!!state.trabajo}
              activeJobCategory={activeJobCategory}
              currentAction={currentAction}
              onTap={handleCharacterTap}
            />
          </div>

          {/* Floating Tap Labels */}
          {floatingItems.map((item) => (
            <div
              key={item.id}
              className="float-up absolute z-40 font-serif-vintage font-bold text-lg sm:text-xl text-[#e0a93b] drop-shadow-md pointer-events-none select-none"
              style={{
                left: `${item.x}px`,
                top: `${item.y - 20}px`
              }}
            >
              {item.text}
            </div>
          ))}

          {/* Bottom hint label */}
          <div className="text-[11px] text-[#f6e9c8]/70 z-20 text-center flex items-center gap-1.5">
            <span>{state.nivel === 0 ? 'Toca a Haci para ganar pesos' : 'Toca a Haci para trabajar'}</span>
            {equippedCar.carType !== 'none' && (
              <span className="text-[#e0a93b] font-medium hidden sm:inline">
                · {equippedCar.n} en el fondo
              </span>
            )}
          </div>

          {activeTab === null && (
            <div className="text-xs text-[#e0a93b] bg-[#0a2e22]/90 border border-[#e0a93b]/40 px-3 py-1 rounded-xl shadow-xs animate-pulse text-center">
              👇 Toca abajo para abrir Negocios, Estilo, Trabajos o Logros
            </div>
          )}
        </section>

        {/* Tab Content Station */}
        {activeTab !== null && (
          <section className="flex-1 flex flex-col overflow-hidden bg-[#fdf8ee] text-[#0f3d2e] relative min-h-0">
            {/* Top drawer control bar with clear 'Bajar menú' action */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#f6e9c8] border-b border-[#0f3d2e]/25 text-xs font-serif-vintage text-[#0f3d2e] select-none shrink-0 shadow-2xs">
              <span className="font-bold flex items-center gap-1.5 truncate">
                {activeTab === 'negocios' && '🏪 Negocios Habaneros'}
                {activeTab === 'estilo' && '✨ Boutique, Naves & Tatuajes'}
                {activeTab === 'taller' && '🛠️ Trabajos, Fletes & Ventas'}
                {activeTab === 'logros' && '🏆 Sistema de Logros'}
                {activeTab === 'yuma' && '🗽 Rumbo a La Yuma'}
              </span>
              <button
                onClick={() => setActiveTab(null)}
                className="flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg bg-[#0f3d2e] text-[#fdf8ee] hover:bg-[#16553f] active:scale-95 transition-all cursor-pointer shadow-xs"
                title="Bajar menú para ver a Haci en grande"
              >
                <ChevronDown size={14} />
                <span>Bajar menú</span>
              </button>
            </div>

            {/* 1. NEGOCIOS */}
            {activeTab === 'negocios' && (
              <TiendaView
                negocios={NEGOCIOS}
                negState={state.neg}
                pesos={state.pesos}
                discountMultiplier={businessDiscountMultiplier}
                onBuy={handleBuyBusiness}
                onResetPrompt={() => setShowResetConfirm(true)}
              />
            )}

            {/* 2. BOUTIQUE DE ESTILO, CARROS Y TATUAJES */}
            {activeTab === 'estilo' && (
              <EstiloTiendaView
                pesos={state.pesos}
                ropaLista={ROPA_LISTA}
                ropaEquipada={state.ropaEquipada}
                ropaComprada={state.ropaComprada}
                carrosLista={CARROS_LISTA}
                carroEquipado={state.carroEquipado}
                carrosComprados={state.carrosComprados}
                tatuajesLista={TATUAJES_LISTA}
                tatuajeEquipado={state.tatuajeEquipado}
                tatuajesComprados={state.tatuajesComprados}
                onBuyOrEquipRopa={handleBuyOrEquipRopa}
                onBuyOrEquipCarro={handleBuyOrEquipCarro}
                onBuyOrEquipTatuaje={handleBuyOrEquipTatuaje}
              />
            )}

            {/* 3. TRABAJOS (Soldador, Habilidades y Trabajos) */}
            {activeTab === 'taller' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Taller sub-navigation */}
                <div className="flex items-center gap-1 p-2 bg-[#f6e9c8] border-b border-[#0f3d2e]/20 shrink-0">
                  <button
                    onClick={() => setTallerSubTab('habilidades')}
                    className={`flex-1 py-1 px-3 rounded-lg font-serif-vintage font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      tallerSubTab === 'habilidades'
                        ? 'bg-[#0f3d2e] text-[#fdf8ee] shadow-xs'
                        : 'text-[#0f3d2e]/70 hover:text-[#0f3d2e]'
                    }`}
                  >
                    <Wrench size={13} />
                    <span>Oficios & Habilidades</span>
                  </button>
                  <button
                    onClick={() => setTallerSubTab('trabajos')}
                    className={`flex-1 py-1 px-3 rounded-lg font-serif-vintage font-bold text-xs transition-colors flex items-center justify-center gap-1.5 relative cursor-pointer ${
                      tallerSubTab === 'trabajos'
                        ? 'bg-[#0f3d2e] text-[#fdf8ee] shadow-xs'
                        : 'text-[#0f3d2e]/70 hover:text-[#0f3d2e]'
                    }`}
                  >
                    <Hammer size={13} />
                    <span>Encargos, Fletes & Ventas</span>
                    {state.trabajo && (
                      <span className="w-2 h-2 rounded-full bg-[#10b981] absolute top-1 right-2 animate-pulse" />
                    )}
                  </button>
                </div>

                {tallerSubTab === 'habilidades' ? (
                  <HabilidadesView
                    nivelSoldador={state.nivel}
                    nivelTriciclo={state.nivelTriciclo}
                    nivelCalle13={state.nivelCalle13}
                    pesos={state.pesos}
                    costoSoldador={COSTO_SOLDADOR}
                    costoSubidaSoldador={COSTO_SUBIDA}
                    costoTriciclo={COSTO_TRICICLO}
                    costoSubidaTriciclo={COSTO_SUBIDA_TRICICLO}
                    costoCalle13={COSTO_CALLE13}
                    costoSubidaCalle13={COSTO_SUBIDA_CALLE13}
                    perks={state.perks}
                    extraPerks={HABILIDADES_EXTRA}
                    onUpgradeSoldador={handleUpgradeSoldador}
                    onUpgradeTriciclo={handleUpgradeTriciclo}
                    onUpgradeCalle13={handleUpgradeCalle13}
                    onBuyPerk={handleBuyPerk}
                  />
                ) : (
                  <TrabajosView
                    nivelSoldador={state.nivel}
                    nivelTriciclo={state.nivelTriciclo}
                    nivelCalle13={state.nivelCalle13}
                    trabajos={TRABAJOS}
                    trabajoActivo={state.trabajo}
                    hechas={state.hechas}
                    timeSpeedMultiplier={jobSpeedMultiplier}
                    pagoBonusMultiplier={jobPayMultiplier}
                    onStartJob={handleStartJob}
                    onCancelJob={handleCancelJob}
                    onGoToHabilidades={() => setTallerSubTab('habilidades')}
                  />
                )}
              </div>
            )}

            {/* 4. SISTEMA DE LOGROS */}
            {activeTab === 'logros' && (
              <LogrosView
                achievements={achievementsWithState}
                onClaimReward={handleClaimReward}
              />
            )}

            {/* 5. LA YUMA */}
            {activeTab === 'yuma' && (
              <MetasYumaView
                milestones={METAS_YUMA}
                completedMap={state.milestones}
                pesos={state.pesos}
                onBuyMilestone={handleBuyMilestone}
              />
            )}
          </section>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav
        id="nav"
        className="shrink-0 flex items-center justify-around bg-[#0f3d2e] border-t-3 border-double border-[#e0a93b]/70 select-none py-1 px-1 sm:px-2 max-w-5xl mx-auto w-full"
      >
        {/* Negocios */}
        <button
          onClick={() => handleToggleTab('negocios')}
          className={`flex-1 py-1.5 sm:py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[11px] sm:text-xs font-serif-vintage font-bold transition-all cursor-pointer ${
            activeTab === 'negocios'
              ? 'text-[#e0a93b] border-t-2 border-[#e0a93b]'
              : 'text-[#f6e9c8]/70 hover:text-[#f6e9c8]'
          }`}
        >
          <Store size={17} />
          <span>Negocios</span>
        </button>

        {/* Tienda de Estilo, Carros y Tatuajes */}
        <button
          onClick={() => handleToggleTab('estilo')}
          className={`flex-1 py-1.5 sm:py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[11px] sm:text-xs font-serif-vintage font-bold transition-all cursor-pointer ${
            activeTab === 'estilo'
              ? 'text-[#e0a93b] border-t-2 border-[#e0a93b]'
              : 'text-[#f6e9c8]/70 hover:text-[#f6e9c8]'
          }`}
        >
          <Sparkles size={17} />
          <span>Estilo & Naves</span>
        </button>

        {/* Trabajos (Herrería, Fletes y Ventas) */}
        <button
          onClick={() => handleToggleTab('taller')}
          className={`flex-1 py-1.5 sm:py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[11px] sm:text-xs font-serif-vintage font-bold transition-all relative cursor-pointer ${
            activeTab === 'taller'
              ? 'text-[#e0a93b] border-t-2 border-[#e0a93b]'
              : 'text-[#f6e9c8]/70 hover:text-[#f6e9c8]'
          }`}
        >
          <Hammer size={17} />
          <span>Trabajos</span>
          {state.nivel === 0 && state.pesos >= COSTO_SOLDADOR && (
            <span className="w-2 h-2 rounded-full bg-[#e0a93b] absolute top-1 right-1/4 animate-ping" />
          )}
          {state.trabajo && (
            <span className="w-2 h-2 rounded-full bg-[#10b981] absolute top-1 right-1/4 animate-pulse" />
          )}
        </button>

        {/* Logros */}
        <button
          onClick={() => handleToggleTab('logros')}
          className={`flex-1 py-1.5 sm:py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[11px] sm:text-xs font-serif-vintage font-bold transition-all relative cursor-pointer ${
            activeTab === 'logros'
              ? 'text-[#e0a93b] border-t-2 border-[#e0a93b]'
              : 'text-[#f6e9c8]/70 hover:text-[#f6e9c8]'
          }`}
        >
          <Trophy size={17} />
          <span>Logros</span>
          {unclaimedAchievementsCount > 0 && (
            <span className="w-4 h-4 bg-[#b3262e] text-[#fdf8ee] rounded-full text-[9px] font-bold absolute -top-1 right-2 flex items-center justify-center animate-bounce">
              {unclaimedAchievementsCount}
            </span>
          )}
        </button>

        {/* La Yuma */}
        <button
          onClick={() => handleToggleTab('yuma')}
          className={`flex-1 py-1.5 sm:py-2 px-1 flex flex-col items-center justify-center gap-0.5 text-[11px] sm:text-xs font-serif-vintage font-bold transition-all cursor-pointer ${
            activeTab === 'yuma'
              ? 'text-[#e0a93b] border-t-2 border-[#e0a93b]'
              : 'text-[#f6e9c8]/70 hover:text-[#f6e9c8]'
          }`}
        >
          <Plane size={17} />
          <span>La Yuma</span>
        </button>
      </nav>

      {/* Offline Connectivity Toast & Android Install Modal */}
      <OfflineIndicator />
      <AndroidInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        canInstallDirectly={isInstallable}
        onInstall={install}
      />

      {/* Google Drive Cloud Save & Explorer Modal */}
      <GoogleDriveModal
        isOpen={showDriveModal}
        onClose={() => setShowDriveModal(false)}
        currentState={state}
        onRestoreState={(restored) => setState(restored)}
        onShowMessage={(msg) => decir(msg, 6000)}
      />

      {/* Modals */}
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        pesos={state.pesos}
        totalEarned={state.stats.totalEarned}
        totalClicks={state.stats.totalClicks}
        totalJobsDone={state.stats.totalJobsDone}
        soldadorNivel={state.nivel}
        tricicloNivel={state.nivelTriciclo}
        calle13Nivel={state.nivelCalle13}
        totalBusinesses={totalBusinessesOwned}
        startTime={state.stats.startTime}
      />

      <ResetConfirmModal
        isOpen={showResetConfirm}
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
      />

      <VictoryModal
        isOpen={showVictory}
        onClose={() => setShowVictory(false)}
      />
    </div>
  );
}
