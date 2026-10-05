/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Business, Job, PerkSkill, YumaMilestone, Achievement, ClothingItem, CarItem, TattooItem } from '../types';

export const CLAVE_STORAGE = "vamonosYuma2";
export const COSTO_SOLDADOR = 100;
export const COSTO_SUBIDA = 1500;

export const COSTO_TRICICLO = 400;
export const COSTO_SUBIDA_TRICICLO = 2000;

export const COSTO_CALLE13 = 800;
export const COSTO_SUBIDA_CALLE13 = 3500;

export const NEGOCIOS: Business[] = [
  { id: "ropa", ic: "👕", n: "Venta de ropa", d: "Ropa que Haci revende en el portal", base: 200, seg: 1 },
  { id: "bici", ic: "🚲", n: "Bicitaxi", d: "Pasajeros por todo Centro Habana", base: 1000, seg: 5 },
  { id: "cafe", ic: "☕", n: "Puesto de café", d: "Cafecito recién colao en la esquina", base: 5000, seg: 20 },
  { id: "casa", ic: "🏠", n: "Casa de alquiler", d: "Cuartos climatizados para visitantes", base: 25000, seg: 90 },
  { id: "paladar", ic: "🍽️", n: "Paladar criolla", d: "Restaurante propio con ropa vieja y congrí", base: 120000, seg: 400 },
  { id: "almendron", ic: "🚗", n: "Taller de almendrones", d: "Mecánica y chapistería de clásicos americanos", base: 500000, seg: 1800 },
  { id: "tabaco", ic: "🍂", n: "Tabaquería selecta", d: "Habanos torcidos a mano de primera calidad", base: 2500000, seg: 8500 },
  { id: "remesas", ic: "📱", n: "Agencia de recargas", d: "Punto de recargas y comunicación con la familia", base: 12000000, seg: 40000 }
];

export const TRABAJOS: Job[] = [
  // 1. TRABAJOS DE SOLDADOR
  {
    id: "ventana",
    ic: "🪟",
    n: "Ventana habanera estándar",
    base: 1500,
    ms: 60000,
    plural: "Ventanas",
    category: "soldador",
    desc: "Estructura de hierro con rejas de seguridad para ventanales de Centro Habana."
  },
  {
    id: "puerta",
    ic: "🚪",
    n: "Puerta habanera de hierro",
    base: 2500,
    ms: 120000,
    plural: "Puertas",
    category: "soldador",
    desc: "Puerta pesada de pasillo con cerradura doble de seguridad."
  },
  {
    id: "reja",
    ic: "🏰",
    n: "Reja colonial de balcón",
    base: 7500,
    ms: 240000,
    plural: "Rejas",
    category: "soldador",
    desc: "Reja ornamental forjada con estilo colonial para casona del Vedado."
  },
  {
    id: "chasis",
    ic: "🚙",
    n: "Chasis de almendrón del 57",
    base: 25000,
    ms: 480000,
    plural: "Chasis",
    category: "soldador",
    desc: "Soldadura pesada del chasis de un Chevrolet americano clásico."
  },

  // 2. FLETES Y DOMICILIOS DE TRICICLO (Arena, Bloques, Cemento y demás)
  {
    id: "flete_arena",
    ic: "🏖️",
    n: "Domicilio de sacos de arena",
    base: 800,
    ms: 30000,
    plural: "Viajes de Arena",
    category: "triciclo",
    desc: "Entrega rápida de 6 sacos de arena sílice pesada para repellar una pared."
  },
  {
    id: "flete_bloques",
    ic: "🧱",
    n: "Acarreo de bloques de hormigón",
    base: 1600,
    ms: 70000,
    plural: "Cargas de Bloques",
    category: "triciclo",
    desc: "Pedaleo fuerte llevando 35 bloques pesados de construcción por la calzada."
  },
  {
    id: "flete_cemento",
    ic: "🏗️",
    n: "Entrega de cemento y cabillas",
    base: 3800,
    ms: 140000,
    plural: "Viajes de Cemento",
    category: "triciclo",
    desc: "Sacos de cemento gris P-350 y atados de cabilla de 3/8 para fundir placa."
  },
  {
    id: "flete_completo",
    ic: "🚚",
    n: "Flete pesado y materiales de obra",
    base: 11000,
    ms: 320000,
    plural: "Fletes Pesados",
    category: "triciclo",
    desc: "Carga combinada: tanque de agua de 55 galones, azulejos, arena y tuberías."
  },

  // 3. VENDEDOR DE CALLE 13 (Pulóveres, Shorts, Camisas, Zapatos)
  {
    id: "venta_pulover",
    ic: "👕",
    n: "Lote de pulóveres estampados",
    base: 1100,
    ms: 40000,
    plural: "Lotes de Pulóveres",
    category: "calle13",
    desc: "Exhibición en Calle 13 de pulóveres frescos de algodón con logos llamativos."
  },
  {
    id: "venta_shorts",
    ic: "🩳",
    n: "Bermudas y shorts playeros",
    base: 2200,
    ms: 85000,
    plural: "Packs de Shorts",
    category: "calle13",
    desc: "Shorts playeros de secado rápido y bermudas de mezclilla de buena costura."
  },
  {
    id: "venta_camisas",
    ic: "👔",
    n: "Percha de camisas de vestir",
    base: 4500,
    ms: 170000,
    plural: "Perchas de Camisas",
    category: "calle13",
    desc: "Camisas de botones de manga corta y tela fresca importada para lucir en la calle."
  },
  {
    id: "venta_zapatos",
    ic: "👟",
    n: "Zapatos tenis y calzado de marca",
    base: 14000,
    ms: 380000,
    plural: "Pares de Zapatos",
    category: "calle13",
    desc: "Tenis deportivos relucientes y mocasines de moda. La mercancía más cotizada de Calle 13."
  }
];

export const HABILIDADES_EXTRA: PerkSkill[] = [
  {
    id: "inventiva",
    n: "Inventiva cubana",
    ic: "💡",
    d: "Resolver con lo que aparezca. Cada clic rinde mucho más.",
    cost: 2500,
    effectText: "+30% de pesos en cada clic",
    multiplierType: "click",
    val: 0.30
  },
  {
    id: "negociador",
    n: "Arte de negociar",
    ic: "🤝",
    d: "El bisne se lleva en la sangre. Regatea mejores precios.",
    cost: 12000,
    effectText: "-12% de costo en todos los negocios",
    multiplierType: "businessDiscount",
    val: 0.12
  },
  {
    id: "cafecito",
    n: "Café colao fuerte",
    ic: "☕",
    d: "Un buchito de café bien cargao para trabajar sin parar.",
    cost: 35000,
    effectText: "-25% en el tiempo de todos los trabajos y fletes",
    multiplierType: "jobSpeed",
    val: 0.25
  },
  {
    id: "cadena",
    n: "Cadena de oro y guayabera",
    ic: "✨",
    d: "El respeto del barrio entero. Haci gana estilo y prestigio.",
    cost: 150000,
    effectText: "+40% de pago adicional en todos los trabajos",
    multiplierType: "click",
    val: 0.40
  }
];

export const ROPA_LISTA: ClothingItem[] = [
  {
    id: "ropa_rota",
    n: "Ropa remendada de solar",
    ic: "👕",
    d: "La ropa humilde con la que Haci empezó a luchar en La Habana.",
    cost: 0,
    clickBonusPct: 0,
    pattern: "torn",
    shirtColor: "#b9b4a6",
    pantsColor: "#4a5568"
  },
  {
    id: "ropa_tirantes",
    n: "Camisilla fresca de tirantes",
    ic: "🎽",
    d: "Ideal para el calor sofocante del mediodía habanero.",
    cost: 600,
    clickBonusPct: 0.10,
    pattern: "tank",
    shirtColor: "#f1f5f9",
    pantsColor: "#334155"
  },
  {
    id: "ropa_tropical",
    n: "Camisa tropical de palmeras",
    ic: "🌺",
    d: "Estilo playero y alegre, perfecta para dar una vuelta por el Malecón.",
    cost: 4000,
    clickBonusPct: 0.25,
    pattern: "tropical",
    shirtColor: "#0284c7",
    pantsColor: "#cbd5e1"
  },
  {
    id: "ropa_guayabera",
    n: "Guayabera blanca habanera",
    ic: "👔",
    d: "La prenda reina de la elegancia criolla con cuatro bolsillos almidonados.",
    cost: 20000,
    clickBonusPct: 0.45,
    pattern: "guayabera",
    shirtColor: "#fdfbf7",
    pantsColor: "#1e293b"
  },
  {
    id: "ropa_traje",
    n: "Traje diplomático de lino",
    ic: "💼",
    d: "Impecable y respetado, parece un embajador o artista de renombre.",
    cost: 95000,
    clickBonusPct: 0.75,
    pattern: "suit",
    shirtColor: "#2563eb",
    pantsColor: "#0f172a"
  },
  {
    id: "ropa_cuero",
    n: "Chaqueta moderna de cuero (Miami Look)",
    ic: "🧥",
    d: "El piquete moderno de La Yuma. Causa sensación dondequiera que llega.",
    cost: 400000,
    clickBonusPct: 1.20,
    pattern: "leather",
    shirtColor: "#18181b",
    pantsColor: "#1e293b"
  }
];

export const CARROS_LISTA: CarItem[] = [
  {
    id: "carro_ninguno",
    n: "A pie por la acera",
    ic: "🚶",
    d: "Caminando a paso firme bajo el sol y sintiendo el asfalto.",
    cost: 0,
    ppsBonus: 0,
    carType: "none"
  },
  {
    id: "carro_bici",
    n: "Bici Flying Pigeon con timbre",
    ic: "🚲",
    d: "La mítica bicicleta china con parrilla trasera reforzada para llevar carga.",
    cost: 1500,
    ppsBonus: 5,
    carType: "bici"
  },
  {
    id: "carro_lada",
    n: "Lada 2105 clásico rojo",
    ic: "🚗",
    d: "El tanque soviético con ventilador en el parabrisas y radio de cassette.",
    cost: 18000,
    ppsBonus: 45,
    carType: "lada"
  },
  {
    id: "carro_almendron",
    n: "Chevrolet Bel Air 1957 azul",
    ic: "🚙",
    d: "El mítico Almendrón cubano con motor adaptado y cromo reluciente.",
    cost: 110000,
    ppsBonus: 320,
    carType: "almendron"
  },
  {
    id: "carro_cadillac",
    n: "Cadillac Eldorado 1959 convertible rosa",
    ic: "🚘",
    d: "Convertible con colosales aletas traseras de tiburón. Pura postal habanera.",
    cost: 500000,
    ppsBonus: 1800,
    carType: "cadillac"
  },
  {
    id: "carro_deportivo",
    n: "Corvette Stingray americano",
    ic: "🏎️",
    d: "Importado y potente. El auto con el que soñaba pasear por Ocean Drive.",
    cost: 2500000,
    ppsBonus: 10000,
    carType: "deportivo"
  }
];

export const TATUAJES_LISTA: TattooItem[] = [
  {
    id: "tat_ninguno",
    n: "Sin tatuajes (Al natural)",
    ic: "✨",
    d: "Piel limpia como vino al mundo, sin tinta en los brazos.",
    cost: 0,
    clickBonusFlat: 0,
    tattooType: "none"
  },
  {
    id: "tat_ancla",
    n: "Ancla marinera del Malecón",
    ic: "⚓",
    d: "Tatuaje marinero clásico en el antebrazo izquierdo.",
    cost: 2500,
    clickBonusFlat: 5,
    tattooType: "ancla"
  },
  {
    id: "tat_bandera",
    n: "Bandera cubana con estrella",
    ic: "🇨🇺",
    d: "Tatuaje del triángulo rojo y la estrella solitaria en el hombro.",
    cost: 12000,
    clickBonusFlat: 20,
    tattooType: "bandera"
  },
  {
    id: "tat_fuego",
    n: "Llama y chispa de soldador",
    ic: "🔥",
    d: "Llamas ardientes de herrería cubriendo el antebrazo derecho.",
    cost: 55000,
    clickBonusFlat: 85,
    tattooType: "fuego"
  },
  {
    id: "tat_manga",
    n: "Manga tribal completa habanera",
    ic: "🐉",
    d: "Ambos brazos cubiertos de arte y respeto callejero inconfundible.",
    cost: 220000,
    clickBonusFlat: 350,
    tattooType: "manga"
  }
];

export const METAS_YUMA: YumaMilestone[] = [
  {
    id: "pasaporte",
    title: "1. Tramitar el Pasaporte Cubano",
    icon: "📘",
    desc: "Hacer la cola en la oficina de identificación y pagar los aranceles.",
    cost: 10000,
    story: "¡Primer paso cumplido! La libreta azul en mano con foto formal sin sonreír."
  },
  {
    id: "papeles",
    title: "2. Legalizar papeles en el Minrex",
    icon: "📜",
    desc: "Certificados de nacimiento, antecedentes y sellos del timbre.",
    cost: 50000,
    story: "¡Sellos pegados y legalizados! Cada papel firmado y timbrado con tinta roja."
  },
  {
    id: "visa",
    title: "3. La Cita Consular y Visado",
    icon: "🏛️",
    desc: "Presentarse con la mejor ropa, responder seguro y salir con la visa aprobada.",
    cost: 250000,
    story: "¡Aprobado asere! Estampada la visa en el pasaporte. El sueño está cerca."
  },
  {
    id: "pasaje",
    title: "4. El Pasaje de Avión",
    icon: "✈️",
    desc: "Boleto aéreo directo a Miami, con equipaje de mano y dos maletas de 50 libras.",
    cost: 1000000,
    story: "¡Boleto confirmado! Asiento de ventana en mano. Haci no cabe de la emoción."
  },
  {
    id: "llegada",
    title: "5. ¡Llegada triunfal a La Yuma!",
    icon: "🗽",
    desc: "Aterrizar en el aeropuerto de Miami, abrazar a la familia y gritar: ¡LO LOGRAMOS!",
    cost: 3000000,
    story: "¡Haci llegó a La Yuma! El sueño se hizo realidad gracias a tu esfuerzo y sudor."
  }
];

export const SISTEMA_LOGROS: Achievement[] = [
  {
    id: "clic_1",
    title: "Primer sudor",
    desc: "Da tu primer clic en Haci.",
    icon: "☝️",
    category: "clic",
    rewardPesos: 100,
    targetCount: 1
  },
  {
    id: "clic_100",
    title: "Muñeca de hierro",
    desc: "Realiza 100 clics de trabajo.",
    icon: "✊",
    category: "clic",
    rewardPesos: 1000,
    targetCount: 100
  },
  {
    id: "clic_500",
    title: "Incansable del Malecón",
    desc: "Realiza 500 clics acumulados.",
    icon: "⚡",
    category: "clic",
    rewardPesos: 5000,
    targetCount: 500
  },
  {
    id: "herrero_on",
    title: "Chispa y Electrodo",
    desc: "Desbloquea el soldador eléctrico.",
    icon: "🔥",
    category: "herrero",
    rewardPesos: 500,
    targetCount: 1
  },
  {
    id: "herrero_5",
    title: "Maestro artesano",
    desc: "Mejora el soldador a Nivel 5.",
    icon: "🛠️",
    category: "herrero",
    rewardPesos: 4000,
    targetCount: 5
  },
  {
    id: "trabajo_1",
    title: "Primera entrega",
    desc: "Completa tu primer trabajo de herrería o flete.",
    icon: "🪟",
    category: "herrero",
    rewardPesos: 1500,
    targetCount: 1
  },
  {
    id: "trabajos_10",
    title: "Hombre de confianza",
    desc: "Completa 10 trabajos o entregas en total.",
    icon: "🚪",
    category: "herrero",
    rewardPesos: 8000,
    targetCount: 10
  },
  {
    id: "negocio_1",
    title: "El primer bisne",
    desc: "Compra tu primer negocio habanero.",
    icon: "👕",
    category: "bisne",
    rewardPesos: 500,
    targetCount: 1
  },
  {
    id: "negocios_10",
    title: "Red de negocios",
    desc: "Posee al menos 10 negocios en total.",
    icon: "🏪",
    category: "bisne",
    rewardPesos: 6000,
    targetCount: 10
  },
  {
    id: "negocios_30",
    title: "Magnate del Vedado",
    desc: "Posee 30 negocios en total.",
    icon: "🏢",
    category: "bisne",
    rewardPesos: 25000,
    targetCount: 30
  },
  {
    id: "estilo_ropa",
    title: "Cambio de pinta",
    desc: "Compra una prenda de ropa nueva para vestir a Haci.",
    icon: "👔",
    category: "estilo",
    rewardPesos: 1200,
    targetCount: 2
  },
  {
    id: "estilo_carro",
    title: "Sobre ruedas",
    desc: "Compra tu primer carro para lucirlo detrás de Haci.",
    icon: "🚗",
    category: "estilo",
    rewardPesos: 4000,
    targetCount: 2
  },
  {
    id: "estilo_tatuaje",
    title: "Marcado con tinta",
    desc: "Hazte tu primer tatuaje en la piel.",
    icon: "💉",
    category: "estilo",
    rewardPesos: 3000,
    targetCount: 2
  },
  {
    id: "estilo_total",
    title: "El más fula de La Habana",
    desc: "Colecciona al menos 3 prendas, 2 carros y 2 tatuajes.",
    icon: "✨",
    category: "estilo",
    rewardPesos: 50000,
    targetCount: 7
  },
  {
    id: "yuma_fin",
    title: "¡Llegamos a La Yuma!",
    desc: "Cumple el gran viaje soñado a Miami.",
    icon: "🗽",
    category: "yuma",
    rewardPesos: 150000,
    targetCount: 1
  }
];

export const SALUDO = "Hola, me llamo Haci. ¿Qué quieres hacer hoy?";

export const DIALOGOS = [
  "Asere, hay que moverse que la cosa está dura.",
  "Un día de estos me voy para la yuma, ya verás.",
  "¿Tú crees que con este soldador me hago rico?",
  "Hoy toca trabajar duro. ¡A darle!",
  "Si ahorro bien, pronto monto mi propio negocio.",
  "Ay, qué calor hace hoy en La Habana.",
  "Me tomo un cafecito colao y seguimos, ¿vale?",
  "Mi sueño es tener mi propio taller.",
  "Con esfuerzo y picardía todo se puede, ¿no?",
  "Una ventana habanera bien hecha vale oro.",
  "Cada peso cuenta, asere, no lo botes por ahí.",
  "Oye, qué rico huele el café del vecino.",
  "Con calma y paso firme, que La Yuma nos espera.",
  "¡Tira el electrodo que aquí no se rinde nadie!",
  "¡Saliendo con el viaje de arena y cemento en el triciclo!",
  "¡Acarreando bloques de hormigón por todo San Lázaro!",
  "¡Llegó la mercancía buena a Calle 13! Pulóveres, shorts y camisas de estreno.",
  "¡Zapatos tenis de paquete, asere! ¡Mira qué pinta tienen en Calle 13!",
  "¡Mira qué nave tengo parqueada ahí atrás, compay!",
  "Con esta pinta nueva ahora sí que parezco un artista.",
  "Ese tatuaje me da fuerza pa' pedalear y soldar sin cansancio.",
  "A trabajar duro que voy a ser puro."
];
