-- =====================================================================
--  RASTRO PERFUMERÍA — CATÁLOGO DE DECANTS
--
--  Un solo archivo, sólo decants, sin fotos.
--  Se pega entero en el SQL Editor de Neon y se le da Run.
--
--  Antes de la primera vez:  pnpm db:push   (crea las tablas)
--
--  ---------------------------------------------------------------
--  SE PUEDE CORRER LAS VECES QUE QUIERAS.
--  No duplica: actualiza por slug.
--
--  NO TOCA NINGUNA FOTO. Este archivo no nombra la columna image_url
--  ni escribe en product_images, así que las fotos que subas desde
--  /admin quedan intactas aunque lo corras de nuevo.
--  ---------------------------------------------------------------
--
--  PRECIOS EN CENTAVOS, enteros:  $8.500 -> 850000
--  Si ponés 8500 estás vendiendo a $85.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Las dos familias
-- ---------------------------------------------------------------------
INSERT INTO categories (name, slug, sort_order, active) VALUES
  ('Árabes',    'arabes',    1, true),
  ('Diseñador', 'disenador', 2, true)
ON CONFLICT (slug) DO NOTHING;


-- ---------------------------------------------------------------------
-- 2. Los 17 decants
--
--    gender:  'masculino' | 'femenino' | 'unisex' | ''
--             Define en cuál de las 3 tarjetas de la home aparece.
--             Con '' no aparece en ninguna.
-- ---------------------------------------------------------------------
INSERT INTO products
  (external_id, slug, name, brand, concentration, description, occasions,
   notes, presentation, search_terms, kind, gender, category_id,
   active, featured, sort_order)
VALUES
  (349145593, 'decant-9pm', 'Decant 9pm', 'Afnan', 'EDP',
   'Perfume dulce, calido y seductor, con un aroma que combina frutas, especias y vainilla. Es de esos perfumes que se sienten rapidamente y dejan una estela agradable y llamativa. Ideal si buscas un perfume para salir y queres que se note.',
   'Ideal para salidas nocturnas, citas, fiestas, reuniones y eventos especiales. Se disfruta especialmente en noches frescas o frias. No es la opcion mas recomendable para dias muy calurosos.',
   'Salida: manzana, canela, lavanda y bergamota. Corazon: muguet y flor de azahar.',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   '9 pm 9pm pm 9 pm9',
   'decant', 'masculino', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 0),

  (350226704, 'decant-honor-glory', 'Decant Honor & Glory', 'Lattafa', 'EDP',
   'Perfume dulce, cremoso y tropical, con un aroma muy llamativo y diferente. Combina pina, canela, vainilla y coco, creando una sensacion que recuerda a un postre tropical. Es una fragancia con mucha personalidad y excelente presencia.',
   'Ideal para citas, salidas, reuniones, fiestas y ocasiones especiales. Funciona muy bien durante otono e invierno, aunque tambien puede disfrutarse en noches templadas. Recomendado para quienes buscan un perfume dulce y original.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'Honor and glory Honor y Glory Honor y gloria unisex',
   'decant', 'unisex', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 1),

  (350226723, 'decant-khamra', 'Decant Khamra', 'Lattafa', 'EDP',
   'Perfume dulce, calido y especiado, con un aroma muy envolvente. Combina canela, datiles, praline y vainilla, creando una fragancia que recuerda a postres y bebidas dulces. Es intenso, duradero y con mucha presencia.',
   'Ideal para citas, cenas, fiestas, salidas nocturnas y ocasiones especiales. Es especialmente recomendable para otono e invierno y para quienes disfrutan de perfumes dulces e intensos.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'camra chamra kamra unisex',
   'decant', 'unisex', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 2),

  (350226814, 'decant-asad-bourbon', 'Decant Asad Bourbon', 'Lattafa', 'EDP',
   'Perfume calido, dulce y elegante, con un aroma envolvente que combina vainilla, cacao y especias. Tiene un perfil gourmand, es decir, recuerda a aromas dulces y deliciosos, pero manteniendo un estilo sofisticado y masculino.',
   'Ideal para citas, cenas, fiestas y climas frios. Se luce especialmente en otono e invierno o durante noches frescas. Si te gustan los perfumes dulces y llamativos, es una excelente opcion.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'asad asad borbun asad bourboun asad buorbon asad burbon asad burboun',
   'decant', 'masculino', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 3),

  (350226828, 'decant-asad', 'Decant Asad', 'Lattafa', 'EDP',
   'Perfume intenso, calido y especiado, con un aroma dulce y profundo. Combina especias, vainilla, tabaco y ambar para crear una fragancia potente y masculina. Es una excelente opcion para quienes buscan un perfume que tenga presencia y dure muchas horas.',
   'Perfecto para salidas nocturnas, citas, fiestas, reuniones. Se destaca especialmente durante otono e invierno y en noches frescas.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'adad asad',
   'decant', 'masculino', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 4),

  (350226859, 'decant-odyssey-aqua', 'Decant Odyssey Aqua', 'Armaf', 'EDP',
   'Perfume fresco, acuatico y citrico, con un aroma limpio y revitalizante. Es una fragancia facil de usar y muy versatil, ideal para quienes prefieren perfumes frescos que transmitan una sensacion de limpieza y energia.',
   'Ideal para el dia a dia, trabajo, universidad, salidas informales, actividades al aire libre y dias de calor. Tambien es una muy buena opcion para usar despues de una ducha o durante el verano.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'acqua acua oddisey oddysei oddysey oddyssey odisei odisey odysei odysey odyssey',
   'decant', 'masculino', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 5),

  (350227487, 'decant-the-most-wanted-intense-edp', 'Decant Azzaro The Most Wanted Intense EDP', 'Azzaro', 'EDP',
   'Perfume masculino intenso, dulce y seductor. Combina especias, caramelo y ambar para crear un aroma calido, elegante y llamativo. Es una fragancia con mucha presencia, ideal para quienes buscan algo que se haga notar.',
   'Ideal para citas, salidas nocturnas, cenas, fiestas y eventos especiales. Se luce especialmente en otono e invierno y durante noches frescas.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'azaro azzaro intense azzaro tmw tmw',
   'decant', 'masculino', (SELECT id FROM categories WHERE slug = 'disenador'),
   true, false, 6),

  (350227497, 'decant-invictus-edt', 'Decant Invictus EDT', 'Paco Rabanne', 'EDT',
   'Perfume masculino fresco, dulce y deportivo, con una combinacion de citricos, notas acuaticas y un fondo amaderado. Es una fragancia energetica y juvenil, facil de usar y con un aroma que suele resultar muy agradable.',
   'Excelente para uso diario, universidad, trabajo, salidas, reuniones y actividades informales. Funciona especialmente bien durante primavera y verano y en dias de calor.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'invicto invictus',
   'decant', 'masculino', (SELECT id FROM categories WHERE slug = 'disenador'),
   true, false, 7),

  (350227510, 'decant-le-male-edt', 'Decant Le Male EDT', 'Jean Paul Gaultier', 'EDT',
   'Perfume masculino clasico, dulce y limpio, con una combinacion muy caracteristica de lavanda, menta y vainilla. Tiene un aroma calido y seductor, pero al mismo tiempo transmite una sensacion de limpieza. Es una fragancia reconocida y muy facil de identificar.',
   'Ideal para citas, salidas, cenas, reuniones y ocasiones especiales. Tambien puede utilizarse en el dia a dia. Funciona especialmente bien en otono, invierno y noches frescas.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'le male le mal lemale gaultier gautier',
   'decant', 'masculino', (SELECT id FROM categories WHERE slug = 'disenador'),
   true, false, 8),

  (350227726, 'decant-swy-intensely', 'Decant Stronger With You Intensely', 'Emporio Armani', 'EDP',
   'Perfume masculino dulce, calido e intenso, con un aroma envolvente que combina vainilla, caramelo, canela y castana. Tiene un estilo muy seductor y juvenil, ideal para quienes buscan una fragancia dulce que deje una buena impresion.',
   'Perfecto para citas, salidas nocturnas, cenas, fiestas y eventos especiales. Se destaca principalmente en otono e invierno y durante noches frescas.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'intensly stronger intense swy intense swy intensely',
   'decant', 'masculino', (SELECT id FROM categories WHERE slug = 'disenador'),
   true, false, 9),

  (350227737, 'decant-bad-boy-cobalt-elixit', 'Decant Bad Boy Cobalt Elixir', 'Carolina Herrera', 'EDP',
   'Perfume masculino intenso, moderno y elegante, con un aroma dulce, amaderado y ligeramente especiado. Tiene mucha presencia y un perfil seductor, ideal para quienes buscan una fragancia que se haga notar.',
   'Ideal para salidas nocturnas, citas romanticas, cenas, fiestas y eventos especiales. Se destaca especialmente en otono e invierno y durante noches frescas.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'bad boy cobalt elixir badboy cobalto',
   'decant', 'masculino', (SELECT id FROM categories WHERE slug = 'disenador'),
   true, false, 10),

  (350228533, 'decant-angham', 'Decant Angham', 'Lattafa', 'EDP',
   'Perfume femenino dulce, cremoso y elegante. Combina citricos, frutas y flores con una base calida de vainilla, praline y almizcle. Tiene un aroma femenino y moderno, ideal para quienes buscan algo dulce pero sofisticado.',
   'Ideal para citas, salidas, cenas, reuniones y ocasiones especiales. Tambien puede utilizarse en el dia a dia si te gustan los perfumes dulces. Se adapta muy bien a otono, invierno y noches frescas.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'amgam amgan amgham amghan angam anghan',
   'decant', 'femenino', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 11),

  (350228551, 'decant-fakhar-rose', 'Decant Fakhar Rose', 'Lattafa', 'EDP',
   'Perfume femenino, floral y elegante, con un aroma fresco y ligeramente dulce. Las flores blancas se combinan con frutas y notas suaves para crear una fragancia femenina, delicada y moderna, pero con buena presencia.',
   'Perfecto para uso diario, trabajo, universidad, salidas, reuniones y citas. Es una fragancia versatil que puede utilizarse durante todo el ano, especialmente durante primavera y verano.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'facar rose fachar rose fakar rose',
   'decant', 'femenino', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 12),

  (350228655, 'decant-yara', 'Decant Yara', 'Lattafa', 'EDP',
   'Perfume femenino dulce, suave y cremoso, con un aroma frutal y floral. Tiene una sensacion delicada y agradable, con notas de vainilla y almizcle que le aportan un acabado calido y reconfortante. Es una fragancia facil de llevar y muy versatil.',
   'Perfecto para uso diario, universidad, trabajo, salidas, citas y reuniones. Es una excelente opcion para primavera y otono, aunque puede utilizarse durante todo el ano.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'iara jara',
   'decant', 'femenino', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 13),

  (350228698, 'decant-yara-candy', 'Decant Yara Candy', 'Lattafa', 'EDP',
   'Perfume femenino dulce, frutal y divertido, inspirado en el mundo de los dulces y las golosinas. Tiene un aroma alegre y juvenil, con frutas y vainilla que le dan un toque cremoso y adictivo. Es una excelente opcion para quienes disfrutan de perfumes dulces y faciles de reconocer.',
   'Ideal para salidas, citas, reuniones, fiestas, universidad y uso diario. Funciona especialmente bien durante primavera y verano, aunque tambien puede utilizarse durante todo el ano.',
   '',
   'Decants de 5ml y 10ml. Trabajamos con perfumes originales y preparamos cada decant cuidadosamente en frascos atomizadores practicos y seguros. Cuidando cada detalle de la presentacion y la experiencia.',
   'candi candy iara candy',
   'decant', 'femenino', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 14),

  (NULL, 'decant-9am-dive', 'Decant 9AM Dive', 'Afnan', 'EDP',
   '',
   '',
   '',
   'Decants de 5 ml y 10 ml, preparados a partir del frasco original.',
   '9 am 9am am 9 am9 dive',
   'decant', 'unisex', (SELECT id FROM categories WHERE slug = 'arabes'),
   true, false, 15),

  (NULL, 'decant-ysl-y', 'Decant Yves Saint Laurent Y', 'Yves Saint Laurent', 'EDP',
   '',
   '',
   '',
   'Decants de 5 ml y 10 ml, preparados a partir del frasco original.',
   'ysl y ive saint laurent isl',
   'decant', '', (SELECT id FROM categories WHERE slug = 'disenador'),
   true, false, 16)

ON CONFLICT (slug) DO UPDATE SET
  external_id   = EXCLUDED.external_id,
  name          = EXCLUDED.name,
  brand         = EXCLUDED.brand,
  concentration = EXCLUDED.concentration,
  description   = EXCLUDED.description,
  occasions     = EXCLUDED.occasions,
  notes         = EXCLUDED.notes,
  presentation  = EXCLUDED.presentation,
  search_terms  = EXCLUDED.search_terms,
  kind          = EXCLUDED.kind,
  gender        = EXCLUDED.gender,
  category_id   = EXCLUDED.category_id,
  active        = EXCLUDED.active,
  sort_order    = EXCLUDED.sort_order;
-- image_url e image_id NO figuran acá: tus fotos no se tocan nunca.


-- ---------------------------------------------------------------------
-- 3. Medidas y precios — EN CENTAVOS
--
--    Se borran las medidas viejas de estos 17 y se vuelven a crear,
--    así correrlo dos veces no deja precios duplicados.
-- ---------------------------------------------------------------------
DELETE FROM variants WHERE product_id IN (
  SELECT id FROM products WHERE slug IN (
    'decant-9pm', 'decant-honor-glory', 'decant-khamra',
    'decant-asad-bourbon', 'decant-asad', 'decant-odyssey-aqua',
    'decant-the-most-wanted-intense-edp', 'decant-invictus-edt',
    'decant-le-male-edt', 'decant-swy-intensely',
    'decant-bad-boy-cobalt-elixit', 'decant-angham',
    'decant-fakhar-rose', 'decant-yara', 'decant-yara-candy',
    'decant-9am-dive', 'decant-ysl-y'
  )
);

INSERT INTO variants (product_id, label, ml, price_cents, stock, sort_order, active)
SELECT p.id, v.label, v.ml, v.price_cents, NULL, v.sort_order, true
FROM (VALUES
  ('decant-9pm',                        '5 ml',   5, 1000000, 0),
  ('decant-9pm',                        '10 ml', 10, 1800000, 1),
  ('decant-honor-glory',                '5 ml',   5, 1000000, 0),
  ('decant-honor-glory',                '10 ml', 10, 1800000, 1),
  ('decant-khamra',                     '5 ml',   5, 1000000, 0),
  ('decant-khamra',                     '10 ml', 10, 1800000, 1),
  ('decant-asad-bourbon',               '5 ml',   5,  850000, 0),
  ('decant-asad-bourbon',               '10 ml', 10, 1500000, 1),
  ('decant-asad',                       '5 ml',   5,  850000, 0),
  ('decant-asad',                       '10 ml', 10, 1500000, 1),
  ('decant-odyssey-aqua',               '5 ml',   5, 1000000, 0),
  ('decant-odyssey-aqua',               '10 ml', 10, 1800000, 1),
  ('decant-the-most-wanted-intense-edp','5 ml',   5, 2000000, 0),
  ('decant-the-most-wanted-intense-edp','10 ml', 10, 3800000, 1),
  ('decant-invictus-edt',               '5 ml',   5, 1500000, 0),
  ('decant-invictus-edt',               '10 ml', 10, 2800000, 1),
  ('decant-le-male-edt',                '5 ml',   5, 2000000, 0),
  ('decant-le-male-edt',                '10 ml', 10, 3800000, 1),
  ('decant-swy-intensely',              '5 ml',   5, 2000000, 0),
  ('decant-swy-intensely',              '10 ml', 10, 3800000, 1),
  ('decant-bad-boy-cobalt-elixit',      '5 ml',   5, 2000000, 0),
  ('decant-bad-boy-cobalt-elixit',      '10 ml', 10, 3800000, 1),
  ('decant-angham',                     '5 ml',   5, 1000000, 0),
  ('decant-angham',                     '10 ml', 10, 1800000, 1),
  ('decant-fakhar-rose',                '5 ml',   5, 1000000, 0),
  ('decant-fakhar-rose',                '10 ml', 10, 1800000, 1),
  ('decant-yara',                       '5 ml',   5, 1000000, 0),
  ('decant-yara',                       '10 ml', 10, 1800000, 1),
  ('decant-yara-candy',                 '5 ml',   5, 1000000, 0),
  ('decant-yara-candy',                 '10 ml', 10, 1800000, 1),
  ('decant-9am-dive',                   '5 ml',   5, 1000000, 0),
  ('decant-9am-dive',                   '10 ml', 10, 1800000, 1),
  ('decant-ysl-y',                      '5 ml',   5, 2000000, 0),
  ('decant-ysl-y',                      '10 ml', 10, 3800000, 1)
) AS v(slug, label, ml, price_cents, sort_order)
JOIN products p ON p.slug = v.slug;


-- ---------------------------------------------------------------------
-- 4. OPCIONAL — stock por mililitros
--
--    Descomentalo sólo si querés que la web lleve la cuenta del frasco.
--    Con 100 ml se pueden armar 20 decants de 5 o 10 de 10, y vender
--    uno descuenta del otro. Si queda comentado, no se controla stock
--    y nunca aparece "agotado".
--
--    Ojo: esto afirma que HOY tenés el frasco lleno de los 17.
--    Si no es así, corregí producto por producto desde /admin.
-- ---------------------------------------------------------------------
-- UPDATE products SET ml_stock = 100, ml_bottle = 100
-- WHERE kind = 'decant' AND active = true;


-- ---------------------------------------------------------------------
-- 5. Control
-- ---------------------------------------------------------------------
SELECT
  (SELECT count(*) FROM products WHERE kind = 'decant' AND active) AS decants_visibles,
  (SELECT count(*) FROM variants v JOIN products p ON p.id = v.product_id
     WHERE p.kind = 'decant')                                      AS medidas,
  (SELECT count(*) FROM categories)                                AS familias;
-- Tiene que dar: 17 decants, 34 medidas, 2 familias.
