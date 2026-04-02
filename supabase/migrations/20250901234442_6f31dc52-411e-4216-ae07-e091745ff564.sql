-- Insert mock puppies data based on the existing mock data from the application

-- Calculate birth dates based on age (approximate)
INSERT INTO public.puppies (
  name, breed, age, birth_date, color, gender, status, weight, height, 
  description, temperament, health_status, vaccination_status, 
  microchip, pedigree, price, parents, achievements, images, 
  is_active, is_available_for_sale
) VALUES 
-- Pastor Australiano puppies
(
  'Apollo', 'australian_shepherd', '8 semanas', 
  CURRENT_DATE - INTERVAL '8 weeks',
  'Blue Merle', 'male', 'disponivel', 3.5, 25.0,
  'Filhote lindo com excelente temperamento, olhos azuis marcantes.',
  'Dócil, brincalhão, inteligente',
  'Saudável, em perfeitas condições',
  'Primeira dose aplicada, segunda dose agendada',
  'Chip 982000000001',
  'CBKC - Registro em andamento',
  3500.00,
  '{"father": "Thor", "mother": "Luna"}',
  '{}',
  '{}',
  true, true
),
(
  'Athena', 'australian_shepherd', '10 semanas',
  CURRENT_DATE - INTERVAL '10 weeks', 
  'Red Tri', 'female', 'disponivel', 4.0, 27.0,
  'Fêmea com estrutura excepcional e movimentação perfeita.',
  'Equilibrada, sociável, ativa',
  'Excelente condição física',
  'Duas doses aplicadas, protocolo em dia',
  'Chip 982000000002',
  'CBKC - Registro confirmado',
  4000.00,
  '{"father": "Thor", "mother": "Stella"}',
  '{}',
  '{}',
  true, true
),
(
  'Ares', 'australian_shepherd', '7 semanas',
  CURRENT_DATE - INTERVAL '7 weeks',
  'Black Tri', 'male', 'reservado', 3.2, 24.0,
  'Macho robusto com temperamento equilibrado.',
  'Calmo, protetor, leal',
  'Saudável, desenvolvimento normal',
  'Primeira dose em andamento',
  NULL,
  'CBKC - Registro em processo',
  3200.00,
  '{"father": "Thor", "mother": "Luna"}',
  '{}',
  '{}',
  true, true
),

-- Lulu da Pomerânia puppies
(
  'Princesa', 'pomeranian', '9 semanas',
  CURRENT_DATE - INTERVAL '9 weeks',
  'Orange Sable', 'female', 'disponivel', 1.2, 15.0,
  'Fêmea pequena e delicada com pelagem exuberante.',
  'Alegre, carinhosa, vivaz',
  'Perfeita saúde, sem complicações',
  'Protocolo vacinal completo para idade',
  'Chip 982000000003',
  'CBKC - Registro ativo',
  2800.00,
  '{"father": "Simba", "mother": "Bella"}',
  '{}',
  '{}',
  true, true
),
(
  'Duque', 'pomeranian', '8 semanas',
  CURRENT_DATE - INTERVAL '8 weeks',
  'Cream', 'male', 'vendido', 1.1, 14.0,
  'Macho com personalidade marcante e pelagem cremosa.',
  'Corajoso, esperto, fiel',
  'Ótima saúde geral',
  'Vacinação em dia',
  NULL,
  'CBKC - Registro confirmado',
  2500.00,
  '{"father": "Simba", "mother": "Mila"}',
  '{}',
  '{}',
  true, false
),

-- Rottweiler puppies
(
  'Titan', 'rottweiler', '12 semanas',
  CURRENT_DATE - INTERVAL '12 weeks',
  'Preto e Fogo', 'male', 'disponivel', 8.5, 35.0,
  'Macho imponente com excelente estrutura óssea.',
  'Confiante, protetor, disciplinado',
  'Excelente condição física e estrutural',
  'Protocolo completo até a idade',
  'Chip 982000000004',
  'CBKC - Pedigree confirmado',
  2200.00,
  '{"father": "Kaiser", "mother": "Hera"}',
  '{}',
  '{}',
  true, true
),
(
  'Valquíria', 'rottweiler', '10 semanas',
  CURRENT_DATE - INTERVAL '10 weeks',
  'Preto e Fogo', 'female', 'reservado', 7.8, 32.0,
  'Fêmea com temperamento protetor e lealdade excepcional.',
  'Leal, inteligente, vigilante',
  'Desenvolvimento perfeito',
  'Duas doses aplicadas',
  'Chip 982000000005',
  'CBKC - Registro em processo',
  2000.00,
  '{"father": "Kaiser", "mother": "Hera"}',
  '{}',
  '{}',
  true, true
),

-- Sold puppies (histórico)
(
  'Bruno', 'australian_shepherd', '16 semanas',
  CURRENT_DATE - INTERVAL '16 weeks',
  'Blue Merle', 'male', 'vendido', 6.2, 30.0,
  'Filhote vendido em fevereiro para família em São Paulo.',
  'Sociável, inteligente, adaptável',
  'Vendido em perfeita saúde',
  'Protocolo vacinal completo',
  'Chip 982000000006',
  'CBKC - Registro transferido',
  3500.00,
  '{"father": "Max", "mother": "Bella"}',
  '{}',
  '{}',
  true, false
),
(
  'Lola', 'pomeranian', '14 semanas',
  CURRENT_DATE - INTERVAL '14 weeks',
  'Orange', 'female', 'vendido', 2.1, 18.0,
  'Filhote vendido em fevereiro para família no Rio de Janeiro.',
  'Carinhosa, brincalhona, alegre',
  'Vendido em perfeita saúde',
  'Todas as vacinas em dia',
  'Chip 982000000007',
  'CBKC - Registro transferido',
  2800.00,
  '{"father": "Rex", "mother": "Nina"}',
  '{}',
  '{}',
  true, false
);