import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AppState, AppContextValue, NivelExperiencia, ObjetivoFinanceiro, PercentualRisco, Trade } from '../types';
import { calcularMetrics, gerarId } from '../utils/riskCalculator';

// ============================================================
// Estado Inicial
// ============================================================

const INITIAL_STATE: AppState = {
  nivelExperiencia: '',
  objetivosFinanceiros: [],
  metaMensal: '',
  capitalSimulado: 1000,
  riscoPorTrade: '1%',
  trades: [],
  metrics: {
    winrate: 0,
    rrMedio: 0,
    drawdown: 0,
    pnlHistory: [],
    vezesSeguiuPlano: 0,
  },
  claudeApiKey: '',
  currentStep: 1,
  completedSteps: [],
  moduloAvancadoBloqueado: false,
  operadorExperiente: false,
};

const STORAGE_KEY = 'mente_trader_state';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as AppState;
      return { ...INITIAL_STATE, ...parsed };
    }
  } catch {
    // ignora erros de parse
  }
  return INITIAL_STATE;
}

// ============================================================
// Actions
// ============================================================

type Action =
  | { type: 'SET_NIVEL'; payload: NivelExperiencia }
  | { type: 'TOGGLE_OBJETIVO'; payload: ObjetivoFinanceiro }
  | { type: 'SET_META_MENSAL'; payload: string }
  | { type: 'SET_CAPITAL'; payload: number }
  | { type: 'SET_RISCO'; payload: PercentualRisco }
  | { type: 'ADD_TRADE'; payload: Trade }
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'MARK_STEP_COMPLETE'; payload: number }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_NIVEL': {
      const operadorExperiente = action.payload === 'Já opero';
      return { ...state, nivelExperiencia: action.payload, operadorExperiente };
    }

    case 'TOGGLE_OBJETIVO': {
      const current = state.objetivosFinanceiros;
      const exists = current.includes(action.payload);
      return {
        ...state,
        objetivosFinanceiros: exists
          ? current.filter(o => o !== action.payload)
          : [...current, action.payload],
      };
    }

    case 'SET_META_MENSAL':
      return { ...state, metaMensal: action.payload };

    case 'SET_CAPITAL':
      return { ...state, capitalSimulado: action.payload };

    case 'SET_RISCO':
      return { ...state, riscoPorTrade: action.payload };

    case 'ADD_TRADE': {
      const newTrades = [...state.trades, action.payload];
      const metrics = calcularMetrics(newTrades, state.capitalSimulado);
      const moduloAvancadoBloqueado = metrics.drawdown > 20;
      return { ...state, trades: newTrades, metrics, moduloAvancadoBloqueado };
    }

    case 'SET_API_KEY':
      return { ...state, claudeApiKey: action.payload };

    case 'GO_TO_STEP':
      return { ...state, currentStep: action.payload };

    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 6) };

    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };

    case 'MARK_STEP_COMPLETE': {
      const alreadyDone = state.completedSteps.includes(action.payload);
      return {
        ...state,
        completedSteps: alreadyDone
          ? state.completedSteps
          : [...state.completedSteps, action.payload],
      };
    }

    case 'RESET':
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ============================================================
// Context
// ============================================================

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Persiste no localStorage sempre que o estado mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignora erros de quota
    }
  }, [state]);

  const value: AppContextValue = {
    state,
    setNivelExperiencia: (nivel) => dispatch({ type: 'SET_NIVEL', payload: nivel }),
    toggleObjetivo: (obj) => dispatch({ type: 'TOGGLE_OBJETIVO', payload: obj }),
    setMetaMensal: (valor) => dispatch({ type: 'SET_META_MENSAL', payload: valor }),
    setCapitalSimulado: (capital) => dispatch({ type: 'SET_CAPITAL', payload: capital }),
    setRiscoPorTrade: (risco) => dispatch({ type: 'SET_RISCO', payload: risco }),
    addTrade: (trade) => {
      dispatch({
        type: 'ADD_TRADE',
        payload: { ...trade, id: gerarId(), timestamp: Date.now() },
      });
    },
    setClaudeApiKey: (key) => dispatch({ type: 'SET_API_KEY', payload: key }),
    goToStep: (step) => dispatch({ type: 'GO_TO_STEP', payload: step }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_STEP' }),
    markStepComplete: (step) => dispatch({ type: 'MARK_STEP_COMPLETE', payload: step }),
    resetApp: () => dispatch({ type: 'RESET' }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
