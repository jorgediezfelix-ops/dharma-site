/*  DHARMA · catálogo de producto
 *  Fuente: "CATALOGO xolo enero 2026" (nueva colección) y
 *          "CATALOGODHARMA2025-6 c liquidacion" (líneas caballero, dama y liquidación).
 *  Nombres, técnicas, materiales y tallas están tomados textualmente de los catálogos.
 *
 *  AJUSTAR ANTES DE PUBLICAR: los precios son de referencia, no vienen en los catálogos.
 *  Cambia PRECIOS y, si alguna pieza tiene precio propio, añade "price" a ese producto.
 */

const PRECIOS = {
  '2026': 690,        // nueva colección
  caballero: 790,     // colección 2025 · caballero
  dama: 790,          // colección 2025 · dama
  liquidacion: 490    // hasta agotar existencias
};

const LINEAS = {
  '2026': {
    id: '2026',
    nombre: 'NUEVA COLECCIÓN',
    numero: '01',
    año: '2026',
    titulo: 'LO QUE<br>VIENE.',
    claim: 'Treinta y tres símbolos nuevos: lucha libre, calacas, dioses y guiños pop impresos sobre algodón negro.',
    material: 'PLAYERA 100% ALGODÓN',
    tallas: ['S', 'M', 'L', 'XL'],
    img: 'img/prod/craneo-de-yute.jpg'
  },
  caballero: {
    id: 'caballero',
    nombre: 'CABALLERO',
    numero: '02',
    año: '2025',
    titulo: 'EL ORIGEN<br>CAMINA<br>CONTIGO.',
    claim: 'Corte recto y gráficos de gran formato sobre algodón peinado. La línea donde nacieron nuestras técnicas de relieve.',
    material: 'ALGODÓN PEINADO',
    tallas: ['CH', 'MD', 'GD', 'XL', 'XXL'],
    img: 'img/editorial-caballero.jpg'
  },
  dama: {
    id: 'dama',
    nombre: 'DAMA',
    numero: '03',
    año: '2025',
    titulo: 'EL COLOR<br>SE LLEVA<br>PUESTO.',
    claim: 'Corte entallado, cuello redondo y acabados con pedrería, shimmer y puff sobre algodón peinado.',
    material: 'ALGODÓN PEINADO',
    tallas: ['CH', 'MD', 'GD', 'XL', 'XXL'],
    img: 'img/editorial-dama.jpg'
  },
  liquidacion: {
    id: 'liquidacion',
    nombre: 'LIQUIDACIÓN',
    numero: '04',
    año: '2025',
    titulo: 'HASTA<br>AGOTAR<br>EXISTENCIAS.',
    claim: 'Últimas piezas de temporadas anteriores. Cuando se acaban, no vuelven.',
    material: 'ALGODÓN PEINADO',
    tallas: ['CH', 'MD', 'GD', 'XL', 'XXL'],
    img: 'img/editorial-liquidacion.jpg'
  }
};

// Técnicas de serigrafía tal como se nombran en los catálogos.
const TECNICAS = {
  FLOCK: { nombre: 'FLOCK', claim: 'TACTO TERCIOPELO', desc: 'Fibras cortas adheridas al diseño: superficie mate, profunda y suave al tacto.' },
  NEON: { nombre: 'TINTAS NEÓN', claim: 'BRILLA CON LUZ UV', desc: 'Pigmentos fluorescentes que reaccionan a la luz negra y encienden el gráfico.' },
  CORROSION: { nombre: 'CORROSIÓN', claim: 'CERO TACTO', desc: 'La tinta decolora la fibra en lugar de montarse sobre ella: el dibujo es la tela.' },
  GEL: { nombre: 'GEL', claim: 'BRILLO HÚMEDO', desc: 'Capa transparente con volumen que atrapa la luz y da sensación líquida.' },
  PLASTISOL: { nombre: 'PLASTISOL', claim: 'COLOR SÓLIDO', desc: 'Opacidad total y bordes limpios sobre negro, con máxima resistencia al lavado.' },
  PEDRERIA: { nombre: 'PEDRERÍA', claim: 'DESTELLO APLICADO', desc: 'Cristales aplicados pieza por pieza que dibujan luz sobre el gráfico.' },
  DENSIDAD: { nombre: 'ALTA DENSIDAD', claim: 'RELIEVE PRECISO', desc: 'Capas controladas de tinta que construyen un relieve de canto vivo.' },
  SHIMMER: { nombre: 'SHIMMER', claim: 'REFLEJO METÁLICO', desc: 'Partículas nacaradas que cambian de tono según cómo caiga la luz.' },
  PUFF: { nombre: 'TINTA PUFF', claim: 'VOLUMEN INFLADO', desc: 'La tinta crece con el calor y levanta el dibujo del plano de la tela.' },
  DESCARGA: { nombre: 'DESCARGA', claim: 'TINTA EN LA FIBRA', desc: 'Se retira el color del algodón y se tiñe en un solo paso: acabado suave y sin capa.' },
  SERIGRAFIA: { nombre: 'SERIGRAFÍA', claim: 'IMPRESIÓN MANUAL', desc: 'Impresión artesanal cuadro por cuadro en nuestro taller de la Ciudad de México.' }
};

/*  Destinos turísticos donde México recibe al mundo.
 *  "picks" es curaduría editorial: las piezas que mejor cuentan cada destino.
 *  Las latitudes coinciden con las de destinos.html.
 */
const DESTINOS = {
  cabo: {
    numero: '01', nombre: 'LOS CABOS', estado: 'BAJA CALIFORNIA SUR', coord: '23.05° N',
    claim: 'Desierto y océano en la misma postal.',
    img: 'img/dest-cabo.jpg',
    picks: ['iguana-floreada', 'jaguar-de-palma', 'hecho-en-mexico']
  },
  vallarta: {
    numero: '02', nombre: 'PUERTO VALLARTA', estado: 'JALISCO', coord: '20.65° N',
    claim: 'Mariachi, agave y costa.',
    img: 'img/dest-vallarta.jpg',
    picks: ['mariachi', 'sonata', 'vale-m']
  },
  cozumel: {
    numero: '03', nombre: 'COZUMEL', estado: 'QUINTANA ROO', coord: '20.42° N',
    claim: 'Arrecife caribeño y memoria maya.',
    img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=85',
    picks: ['acuatica', 'ojos-azules', 'penacho-jaguar']
  },
  pueblos: {
    numero: '04', nombre: 'PUEBLOS MÁGICOS', estado: 'TODO MÉXICO', coord: '132 DESTINOS',
    claim: 'Cantera, fiesta y oficio.',
    img: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1400&q=85',
    picks: ['craneo-de-yute', 'recuerdo-calacas', 'perro-huichol']
  }
};

const PRODUCTS = {
  /* ——————————————————— NUEVA COLECCIÓN 2026 ——————————————————— */
  'the-frida': {
    name: 'THE FRIDA', linea: '2026', tema: 'ICÓNICOS', tecnica: 'PLASTISOL',
    tagline: 'ARTE · RESILIENCIA · IDENTIDAD',
    desc: 'La carta de lotería que nunca existió: Frida vuelta calaca, rodeada de rosas, papel picado y el sello #MEXICO. Color pleno sobre negro.'
  },
  'colibri-2026': {
    name: 'COLIBRÍ', linea: '2026', tema: 'NATURALEZA', tecnica: 'PLASTISOL',
    tagline: 'MOVIMIENTO · LUZ · VITALIDAD',
    desc: 'El mensajero de los muertos suspendido en un aro de greca. Plumaje en turquesa, coral y violeta que parece vibrar sobre la tela.'
  },
  'mario-guerrero': {
    name: 'MARIO GUERRERO', linea: '2026', tema: 'POP', tecnica: 'PLASTISOL',
    tagline: 'JUEGO · PENACHO · NOSTALGIA',
    desc: 'El plomero más famoso del mundo convertido en guerrero mexica, con penacho de plumas y grecas de fondo. Puro guiño ochentero.'
  },
  'ojos-azules': {
    name: 'OJOS AZULES', linea: '2026', tema: 'ANCESTRALES', tecnica: 'SERIGRAFIA',
    tagline: 'ACECHO · NOCHE · PODER',
    desc: 'Jaguar de trazo geométrico impreso negro sobre negro; solo los ojos turquesa rompen la oscuridad. Tono sobre tono para quien mira dos veces.'
  },
  'xolo-flock': {
    name: 'XOLO FLOCK', linea: '2026', tema: 'ANCESTRALES', tecnica: 'FLOCK',
    tagline: 'GUARDIÁN · TRÁNSITO · LEALTAD',
    desc: 'El perro que acompaña a los muertos, con collar de grecas rojas y acabado terciopelo. Se ve fuerte y se siente suave.'
  },
  'ajolote-flock': {
    name: 'AJOLOTE FLOCK', linea: '2026', tema: 'NATURALEZA', tecnica: 'FLOCK',
    tagline: 'REGENERACIÓN · AGUA · FUTURO',
    desc: 'El anfibio de Xochimilco dibujado con líneas de greca en azul y verde, sobre un tacto de terciopelo que invita a tocarlo.'
  },
  furioso: {
    name: 'FURIOSO', linea: '2026', tema: 'ANCESTRALES', tecnica: 'SERIGRAFIA',
    tagline: 'RUGIDO · FUERZA · TERRITORIO',
    desc: 'Jaguar de frente, colmillos abiertos y ornamento ritual alrededor. Grises sobre negro para una pieza que no necesita gritar.'
  },
  'jaguar-azteca': {
    name: 'JAGUAR AZTECA', linea: '2026', tema: 'ANCESTRALES', tecnica: 'PLASTISOL',
    tagline: 'FUERZA · PROTECCIÓN · LIDERAZGO',
    desc: 'Perfil de jaguar con penacho de plumas rojas y azules y volutas de fuego. Nuestra pieza más pedida, ahora en color pleno.'
  },
  mariachi: {
    name: 'MARIACHI', linea: '2026', tema: 'ICÓNICOS', tecnica: 'PLASTISOL',
    tagline: 'CANTO · FIESTA · MEMORIA',
    desc: 'Calaca de traje charro con la guitarra al pecho y un verso de Cielito Lindo escrito a mano alrededor.'
  },
  'xolo-2026': {
    name: 'XOLO', linea: '2026', tema: 'ANCESTRALES', tecnica: 'PLASTISOL',
    tagline: 'COMPAÑÍA · ORIGEN · CASA',
    desc: 'Retrato del xoloitzcuintle con collar de fiesta en rojo, turquesa y amarillo sobre un calendario apenas insinuado.'
  },
  'luchador-2026': {
    name: 'LUCHADOR', linea: '2026', tema: 'ICÓNICOS', tecnica: 'PLASTISOL',
    tagline: 'MÁSCARA · ARENA · LEYENDA',
    desc: 'Máscara de lucha resuelta como mosaico prehispánico, con disco solar detrás. El ring y el templo en la misma imagen.'
  },
  'jaguar-de-palma': {
    name: 'JAGUAR DE PALMA', linea: '2026', tema: 'NATURALEZA', tecnica: 'PLASTISOL',
    tagline: 'OFICIO · TEJIDO · COLOR',
    desc: 'Un jaguar tejido con tiras de palma teñida, como los canastos de mercado. Artesanía convertida en retrato.'
  },
  'iguana-floreada': {
    name: 'IGUANA FLOREADA', linea: '2026', tema: 'NATURALEZA', tecnica: 'PLASTISOL',
    tagline: 'SOL · PACIENCIA · TERRITORIO',
    desc: 'Iguana naranja con el lomo sembrado de flores y grecas turquesa. Costa, calor y talavera en una sola pieza.'
  },
  'luchador-jaguar': {
    name: 'LUCHADOR JAGUAR', linea: '2026', tema: 'ICÓNICOS', tecnica: 'PLASTISOL',
    tagline: 'RITUAL · MÁSCARA · LINAJE',
    desc: 'Dos máscaras en una: el jaguar coronando al luchador, con penacho de plumas y ojo de venado al costado.'
  },
  'espiritu-tribal': {
    name: 'ESPÍRITU TRIBAL', linea: '2026', tema: 'ANCESTRALES', tecnica: 'PLASTISOL',
    tagline: 'ESPÍRITU · TRÁNSITO · DANZA',
    desc: 'Cráneo con penacho de plumas escurridas en arcoíris. Trazo suelto, color saturado y una energía casi líquida.'
  },
  'el-guerrero': {
    name: 'EL GUERRERO', linea: '2026', tema: 'ANCESTRALES', tecnica: 'PLASTISOL',
    tagline: 'ESCUDO · TEMPLO · VALOR',
    desc: 'Guerrero mexica con escudo de calendario y serpiente emplumada al fondo, entre salpicaduras de color y pirámides.'
  },
  'hecho-en-mexico': {
    name: 'HECHO EN MÉX.', linea: '2026', tema: 'ICÓNICOS', tecnica: 'SERIGRAFIA',
    tagline: 'ORGULLO · ORIGEN · SELLO',
    desc: 'Águila de alas abiertas y placa esculpida con la leyenda Hecho en México. Grises y jade sobre negro: relieve sin color.'
  },
  'luchador-mexa': {
    name: 'LUCHADOR MEXA', linea: '2026', tema: 'ICÓNICOS', tecnica: 'SERIGRAFIA',
    tagline: 'CARRETERA · NOCHE · BARRIO',
    desc: 'Luchador al volante bajo un letrero de Welcome to México, con vochos y pirámide a la luna. Ilustración a lápiz en escala de grises.'
  },
  'craneo-de-yute': {
    name: 'CRÁNEO DE YUTE', linea: '2026', tema: 'ICÓNICOS', tecnica: 'PLASTISOL',
    tagline: 'FIESTA · OFICIO · COLOR',
    desc: 'Calavera y sombrero tejidos con hilo de colores, textura de bordado llevada al límite del color pleno.'
  },
  'penacho-jaguar': {
    name: 'PENACHO JAGUAR', linea: '2026', tema: 'ANCESTRALES', tecnica: 'SERIGRAFIA',
    tagline: 'RITO · PIEDRA · LINAJE',
    desc: 'Jaguar tallado en piedra con penacho de plumas y ojos de jade. Volumen a puro gris sobre negro.'
  },
  'super-quetzalcoatl': {
    name: 'SUPER QUETZALCÓATL', linea: '2026', tema: 'POP', tecnica: 'SERIGRAFIA',
    tagline: 'MITO · CÓMIC · VUELO',
    desc: 'La serpiente emplumada dentro del escudo más reconocible del cómic, tallada como estela de piedra sobre un estallido azul.'
  },
  'storm-azteca': {
    name: 'STORM AZTECA', linea: '2026', tema: 'POP', tecnica: 'SERIGRAFIA',
    tagline: 'GALAXIA · GRECA · IMPERIO',
    desc: 'El casco del soldado imperial cubierto de grecas y plumas rojas. Ciencia ficción con genealogía mexica.'
  },
  acuatica: {
    name: 'ACUÁTICA', linea: '2026', tema: 'NATURALEZA', tecnica: 'DESCARGA',
    tagline: 'BUCEO · ARRECIFE · CALMA',
    desc: 'Un tanque de buceo convertido en acuario: corales, tiburones y peces de arrecife dentro del cristal. Tinta descargada, tacto de tela.'
  },
  'catrina-2026': {
    name: 'CATRINA', linea: '2026', tema: 'ICÓNICOS', tecnica: 'DESCARGA',
    tagline: 'MUERTE · FLORES · TERNURA',
    desc: 'Catrina de vestido bordado y corona de rosas rojas y azules, dibujada con trazo redondo. Suave al tacto por la técnica de descarga.'
  },
  'mariachi-calavera': {
    name: 'MARIACHI CALAVERA', linea: '2026', tema: 'ICÓNICOS', tecnica: 'DESCARGA',
    tagline: 'SERENATA · PLAZA · NOCHE',
    desc: 'Calaca de mariachi con guitarra roja dentro de un marco de plata labrada. Detalle fino sin capa de tinta encima.'
  },
  'ajolotiux-hilos': {
    name: 'AJOLOTIUX HILOS', linea: '2026', tema: 'NATURALEZA', tecnica: 'DESCARGA',
    tagline: 'HILO · AGUA · SONRISA',
    desc: 'Ajolote construido con hilos de colores y un sol huichol en el vientre. Nuestra pieza más luminosa en descarga.'
  },
  sonata: {
    name: 'SONATA', linea: '2026', tema: 'ICÓNICOS', tecnica: 'DESCARGA',
    tagline: 'MÚSICA · CANTERA · FIESTA',
    desc: 'Cinco calacas de mariachi tocando frente a una parroquia iluminada. La serenata completa en una sola escena.'
  },
  'recuerdo-calacas': {
    name: 'RECUERDO CALACAS', linea: '2026', tema: 'ICÓNICOS', tecnica: 'DESCARGA',
    tagline: 'FOTO · PUEBLO · MEMORIA',
    desc: 'La foto de familia del Día de Muertos: mariachi, guerrero, luchador y catrinas posando bajo el papel picado.'
  },
  personistagram: {
    name: 'PERSONISTAGRAM', linea: '2026', tema: 'POP', tecnica: 'DESCARGA',
    tagline: 'SELFIE · IRONÍA · HOY',
    desc: 'Todos los personajes del imaginario mexicano tomándose una selfie. Un chiste sobre nosotros mismos, impreso en descarga.'
  },
  'vale-m': {
    name: 'VALE M', linea: '2026', tema: 'POP', tecnica: 'DESCARGA',
    tagline: 'TEQUILA · ACTITUD · CANTINA',
    desc: 'Bad to the Bone: calaca de sarape y sombrero brindando con tequila y la leyenda Me Vale Madres. Sin traducción posible.'
  },
  'el-borracho': {
    name: 'EL BORRACHO', linea: '2026', tema: 'POP', tecnica: 'PLASTISOL',
    tagline: 'LOTERÍA · CALLE · HUMOR',
    desc: 'La carta 25 de la lotería reinterpretada con trazo de cómic y colores de barrio. Marco blanco, color pleno.'
  },
  'perro-huichol': {
    name: 'PERRO HUICHOL', linea: '2026', tema: 'POP', tecnica: 'PLASTISOL',
    tagline: 'ARTE · GLOBO · CHAQUIRA',
    desc: 'El perro-globo del arte contemporáneo vestido de chaquira huichol. Plastisol con gel para que el color levante brillo.'
  },
  'storm-huichol': {
    name: 'STORM HUICHOL', linea: '2026', tema: 'POP', tecnica: 'PLASTISOL',
    tagline: 'GALAXIA · CHAQUIRA · MITO',
    desc: 'El casco más temido de la galaxia cubierto de chaquira wixárika: flores, venados y peyote en formación de combate.'
  },

  /* ——————————————————— COLECCIÓN 2025 · CABALLERO ——————————————————— */
  'craneo-de-flock': {
    name: 'CRÁNEO DE FLOCK', linea: 'caballero', tema: 'ICÓNICOS', tecnica: 'FLOCK',
    tagline: 'RITUAL · TACTO · NOCHE',
    desc: 'Calavera ornamentada impresa en flock verde sobre negro: se ve casi tono sobre tono y se siente como terciopelo.'
  },
  'ajolote-neon': {
    name: 'AJOLOTE', linea: 'caballero', tema: 'NATURALEZA', tecnica: 'NEON',
    tagline: 'REGENERACIÓN · AGUA · FUTURO',
    desc: 'Ajolote de línea fina con luna neón detrás. Combina flock y tintas fluorescentes: de día es sobrio, con luz UV se enciende.',
    tecnicas: ['FLOCK', 'NEON']
  },
  'calavera-sugar': {
    name: 'CALAVERA SUGAR', linea: 'caballero', tema: 'ICÓNICOS', tecnica: 'CORROSION',
    tagline: 'AZÚCAR · COLOR · OFRENDA',
    desc: 'Calavera de azúcar en turquesa, magenta y oro impresa por corrosión: el color queda dentro de la fibra, sin nada al tacto.'
  },
  calendario: {
    name: 'CALENDARIO', linea: 'caballero', tema: 'ANCESTRALES', tecnica: 'GEL',
    tagline: 'TIEMPO · PIEDRA · CENTRO',
    desc: 'La piedra del sol reducida a su geometría esencial, con capa de gel que le da brillo húmedo y volumen.'
  },
  'luchador-gel': {
    name: 'LUCHADOR', linea: 'caballero', tema: 'ICÓNICOS', tecnica: 'GEL',
    tagline: 'MÁSCARA · ESTRELLAS · GLORIA',
    desc: 'Máscara de lucha en verde jade y rojo rodeada de estrellas, con gel y plastisol para un brillo de reflector.',
    tecnicas: ['GEL', 'PLASTISOL']
  },
  'jaguar-de-terciopelo': {
    name: 'JAGUAR DE TERCIOPELO', linea: 'caballero', tema: 'ANCESTRALES', tecnica: 'FLOCK',
    tagline: 'ACECHO · TACTO · SELVA',
    desc: 'Jaguar de frente en azul petróleo con lengua roja, impreso en flock. Textura de pelaje real bajo la mano.'
  },
  'balam-pedreria': {
    name: 'BALAM PEDRERÍA', linea: 'caballero', tema: 'ANCESTRALES', tecnica: 'PEDRERIA',
    tagline: 'JAGUAR · JOYA · MISTERIO',
    desc: 'Balam en verde profundo con cristales aplicados a mano que dibujan sus bigotes y ornamentos. Corrosión más pedrería.',
    tecnicas: ['CORROSION', 'PEDRERIA']
  },
  quetzalcoatl: {
    name: 'QUETZALCÓATL', linea: 'caballero', tema: 'ANCESTRALES', tecnica: 'GEL',
    tagline: 'SERPIENTE · VIENTO · CREACIÓN',
    desc: 'La serpiente emplumada desplegada en diagonal, con plumas de mil colores y acabado brillante de gel y plastisol.',
    tecnicas: ['GEL', 'PLASTISOL']
  },
  'xolo-alta-densidad': {
    name: 'XOLO', linea: 'caballero', tema: 'ANCESTRALES', tecnica: 'DENSIDAD',
    tagline: 'GUARDIÁN · RELIEVE · MEMORIA',
    desc: 'Xoloitzcuintle sentado, resuelto como alebrije, con tintas de alta densidad que se sienten al pasar la mano.',
    fits: ['caballero', 'dama']
  },
  'guerrero-quetzalcoatl': {
    name: 'GUERRERO QUETZALCÓATL', linea: 'caballero', tema: 'POP', tecnica: 'GEL',
    tagline: 'JUEGO · MITO · BRILLO',
    desc: 'Personaje de videojuego con armadura mexica y penacho, en gel y plastisol de brillo intenso sobre grecas grises.',
    tecnicas: ['GEL', 'PLASTISOL']
  },
  'cohetera-pedreria': {
    name: 'COHETERA PEDRERÍA', linea: 'caballero', tema: 'ICÓNICOS', tecnica: 'PEDRERIA',
    tagline: 'FIESTA · PÓLVORA · PUEBLO',
    desc: 'Calavera hecha de calacas coheteras y castillos de pirotecnia, con pedrería que remata los destellos.',
    tecnicas: ['PLASTISOL', 'PEDRERIA']
  },
  'jaguar-pedreria': {
    name: 'JAGUAR', linea: 'caballero', tema: 'ANCESTRALES', tecnica: 'PEDRERIA',
    tagline: 'RAYO · CRISTAL · NOCHE',
    desc: 'Jaguar dibujado íntegramente con cristales y un rayo naranja cruzándole el rostro. Puro destello sobre negro.'
  },

  /* ——————————————————— COLECCIÓN 2025 · DAMA ——————————————————— */
  'catrina-corrosion': {
    name: 'CATRINA', linea: 'dama', tema: 'ICÓNICOS', tecnica: 'CORROSION',
    tagline: 'ELEGANCIA · FLORES · MUERTE',
    desc: 'Catrina de mirada fija entre cempasúal y rosas, impresa por corrosión: color intenso con tacto suave.'
  },
  'frida-pedreria': {
    name: 'FRIDA PEDRERÍA', linea: 'dama', tema: 'ICÓNICOS', tecnica: 'PEDRERIA',
    tagline: 'ARTE · MIRADA · JOYA',
    desc: 'Retrato de Frida construido con cristales, con la corona de flores en colores de bordado. Brilla con cada movimiento.'
  },
  'colibri-shimmer': {
    name: 'COLIBRÍ', linea: 'dama', tema: 'NATURALEZA', tecnica: 'SHIMMER',
    tagline: 'VUELO · LUZ · JARDÍN',
    desc: 'Colibrí entre flores en morado, turquesa y naranja, con shimmer y tinta puff: relieve suave y reflejo metálico.',
    tecnicas: ['SHIMMER', 'PUFF']
  },
  tehuanita: {
    name: 'TEHUANITA', linea: 'dama', tema: 'ICÓNICOS', tecnica: 'SERIGRAFIA',
    tagline: 'ISTMO · TRAJE · ORGULLO',
    desc: 'Tehuana de trenzas y huipil bordado entre rosas, impresa en varios colores y brillos sobre negro.'
  },

  /* ——————————————————— LIQUIDACIÓN ——————————————————— */
  'guerrero-jaguar': {
    name: 'GUERRERO JAGUAR', linea: 'liquidacion', tema: 'ANCESTRALES', tecnica: 'DENSIDAD',
    tagline: 'CASCO · FUEGO · VALOR',
    desc: 'Cráneo con casco de jaguar y penacho de plumas rojas, en corrosión y alta densidad: contorno delineado y tinta suave.',
    tecnicas: ['CORROSION', 'DENSIDAD']
  },
  'mascara-de-fuego': {
    name: 'MÁSCARA DE FUEGO', linea: 'liquidacion', tema: 'ANCESTRALES', tecnica: 'GEL',
    tagline: 'FUEGO · MÁSCARA · GLORIA',
    desc: 'La máscara que abrió la línea caballero: barroca, en grises metálicos y llamas naranjas, con gel de brillo intenso.',
    tecnicas: ['GEL', 'PLASTISOL'],
    editorial: 'img/editorial-caballero.jpg'
  }
};

// Completa cada producto con lo que se puede derivar de su línea.
for (const [id, p] of Object.entries(PRODUCTS)) {
  p.id = id;
  p.img = p.img || `img/prod/${id}.jpg`;
  p.tecnicas = p.tecnicas || [p.tecnica];
  p.material = LINEAS[p.linea].material;
  p.tallas = p.tallas || LINEAS[p.linea].tallas;
  p.price = p.price || PRECIOS[p.linea];
  p.lineaNombre = LINEAS[p.linea].nombre;
  p.tecnicaNombre = p.tecnicas.map(t => TECNICAS[t].nombre).join(' + ');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, LINEAS, TECNICAS, PRECIOS, DESTINOS };
}
