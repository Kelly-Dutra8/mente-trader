// ============================================================
// Tipos e Interfaces — Mente Trader
// ============================================================

export type NivelExperiencia =
  | 'Nunca operei'
  | 'Estudando há menos de 6 meses'
  | 'Estudando há mais de 6 meses'
  | 'Já opero';

export type ObjetivoFinanceiro =
  | 'Renda extra'
  | 'Independência financeira'
  | 'Proteção de patrimônio'
  | 'Especulação consciente'
  | 'Aprender sobre mercados';

export type ParMoeda = 'EUR/USD' | 'GBP/USD' | 'USD/JPY' | 'XAU/USD';

export type ResultadoTrade = 'gain' | 'loss';

export type PercentualRisco = '0.5%' | '1%' | '2%' | '5%';

export interface Trade {
  id: string;
  par: ParMoeda;
  sl: string;
  tp: string;
  rr: number;
  resultado: ResultadoTrade;
  pnl: number;           // em R$ simulados
  seguiuPlano: boolean;
  feedback?: string;     // resposta da Claude API
  timestamp: number;
}

export interface Metrics {
  winrate: number;        // 0–100
  rrMedio: number;
  drawdown: number;       // percentual máximo de queda
  pnlHistory: number[];   // capital acumulado por trade
  vezesSeguiuPlano: number; // 0–100 %
}

export interface AppState {
  // Etapa 1
  nivelExperiencia: NivelExperiencia | '';
  objetivosFinanceiros: ObjetivoFinanceiro[];
  metaMensal: string;

  // Etapa 3
  capitalSimulado: number;
  riscoPorTrade: PercentualRisco;

  // Etapa 4
  trades: Trade[];

  // Métricas calculadas
  metrics: Metrics;

  // Claude API
  claudeApiKey: string;

  // Wizard
  currentStep: number;
  completedSteps: number[];

  // Flags
  moduloAvancadoBloqueado: boolean;
  operadorExperiente: boolean;
}

export interface AppContextValue {
  state: AppState;
  setNivelExperiencia: (nivel: NivelExperiencia) => void;
  toggleObjetivo: (obj: ObjetivoFinanceiro) => void;
  setMetaMensal: (valor: string) => void;
  setCapitalSimulado: (capital: number) => void;
  setRiscoPorTrade: (risco: PercentualRisco) => void;
  addTrade: (trade: Omit<Trade, 'id' | 'timestamp'>) => void;
  setClaudeApiKey: (key: string) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepComplete: (step: number) => void;
  resetApp: () => void;
}

export interface QuizQuestion {
  id: number;
  pergunta: string;
  opcoes: string[];
  correta: number; // índice da resposta correta
}
