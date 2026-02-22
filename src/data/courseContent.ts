import type { QuizQuestion } from '../types';

// ============================================================
// Conteúdo Educacional — Módulo Fundamentos
// ============================================================

export const FUNDAMENTOS_CONTENT = [
  {
    titulo: 'O que é o Mercado Forex?',
    conteudo: `O mercado Forex (Foreign Exchange) é o maior mercado financeiro do mundo, com volume diário superior a 7 trilhões de dólares. Ao contrário das bolsas de valores tradicionais, o Forex opera 24 horas por dia, 5 dias por semana, conectando bancos, instituições financeiras, governos e traders individuais de todo o mundo.

Nesse mercado, as moedas são sempre negociadas em pares — por exemplo, EUR/USD significa que você está comprando euros e vendendo dólares. A variação de preço é medida em pips (normalmente o quarto decimal do preço).`,
  },
  {
    titulo: 'Por que a Maioria dos Traders Perde Dinheiro?',
    conteudo: `Estudos mostram que entre 70% e 80% dos traders de varejo perdem capital. Os principais motivos são:

• **Falta de gestão de risco**: Arriscar valores excessivos por operação.
• **Overtrading**: Abrir muitas posições sem critério definido.
• **Psicologia instável**: Tomar decisões baseadas em emoção (medo e ganância).
• **Ausência de plano**: Operar sem estratégia ou stop loss definidos.
• **Expectativas irreais**: Buscar enriquecimento rápido em vez de consistência.

A boa notícia é que todos esses fatores são controláveis com disciplina e educação.`,
  },
  {
    titulo: 'O Tripé do Trader Profissional',
    conteudo: `Todo trader consistentemente lucrativo sustenta seu sucesso em três pilares:

**1. Estratégia** — Um conjunto de regras claras para entrada e saída de operações, baseadas em análise técnica ou fundamentalista.

**2. Gestão de Risco** — Definir quanto do capital será arriscado por operação (recomendado: 1% a 2%) e sempre utilizar stop loss.

**3. Psicologia** — Controlar emoções, manter disciplina mesmo em sequências de perdas e nunca aumentar o risco para "recuperar" perdas.

Sem esses três elementos trabalhando juntos, qualquer lucro é fruto do acaso, não de habilidade.`,
  },
  {
    titulo: 'Gestão de Risco: A Base de Tudo',
    conteudo: `A gestão de risco é o único fator que separa traders que sobrevivem dos que destroem suas contas.

**Regra do 1%**: Nunca arrisque mais de 1% a 2% do seu capital por operação. Com essa regra, mesmo com 10 perdas consecutivas, você ainda terá mais de 80% do capital para continuar operando.

**Risk/Reward (RR)**: Para cada operação, a recompensa potencial deve ser pelo menos 1,5x a 2x o risco assumido. Um trader com winrate de 40% ainda pode ser lucrativo com RR médio de 2:1.

**Drawdown**: É a queda máxima do capital a partir de um pico. Drawdowns acima de 20% são sinais de alerta grave e indicam necessidade de revisão da estratégia.`,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    pergunta: 'Qual é o principal fator que separa traders consistentes dos que perdem dinheiro?',
    opcoes: [
      'Ter acesso a informações privilegiadas do mercado',
      'Gestão de risco é essencial',
      'Operar com alavancagem máxima para maximizar lucros',
      'Seguir dicas de grupos de Telegram',
    ],
    correta: 1,
  },
  {
    id: 2,
    pergunta: 'Por que um trader com winrate de 40% pode ser lucrativo?',
    opcoes: [
      'Porque opera em mercados menos competitivos',
      'Porque nunca sofre perdas consecutivas',
      'Mercado é imprevisível',
      'Porque usa robôs de alta frequência',
    ],
    correta: 2,
  },
  {
    id: 3,
    pergunta: 'O que é drawdown?',
    opcoes: [
      'Uma estratégia de entrada em tendência',
      'O lucro máximo obtido em um período',
      'A alavancagem utilizada em uma operação',
      'A queda máxima do capital a partir de um pico',
    ],
    correta: 3,
  },
  {
    id: 4,
    pergunta: 'Qual a recomendação de risco máximo por operação para traders iniciantes?',
    opcoes: [
      '10% do capital',
      '5% do capital',
      '1% a 2% do capital',
      '50% do capital para recuperar perdas rápido',
    ],
    correta: 2,
  },
];

export const PARES_MOEDA = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD'] as const;

export const PERCENTUAIS_RISCO = ['0.5%', '1%', '2%', '5%'] as const;

export const NIVEIS_EXPERIENCIA = [
  {
    valor: 'Nunca operei',
    emoji: '🌱',
    descricao: 'Estou começando do zero e quero aprender os fundamentos.',
  },
  {
    valor: 'Estudando há menos de 6 meses',
    emoji: '📚',
    descricao: 'Já li sobre o assunto mas ainda não entrei ao vivo.',
  },
  {
    valor: 'Estudando há mais de 6 meses',
    emoji: '📈',
    descricao: 'Tenho base teórica sólida e já fiz simulações.',
  },
  {
    valor: 'Já opero',
    emoji: '💼',
    descricao: 'Já tenho conta em corretora e faço operações reais.',
  },
] as const;

export const OBJETIVOS_DISPONIVEIS = [
  'Renda extra',
  'Independência financeira',
  'Proteção de patrimônio',
  'Especulação consciente',
  'Aprender sobre mercados',
] as const;
