# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Type-check and build for production (tsc && vite build)
npm run lint       # Run ESLint on all TS/TSX files
npm run preview    # Preview production build locally
```

There are no tests in this project.

## Architecture

**Mente Trader** is a 6-step educational wizard for Forex trading training, built with React 18 + TypeScript + Vite + Tailwind CSS. It integrates the Claude API for AI-powered trade feedback.

### Wizard Flow

The app is a linear 6-step flow managed by `WizardShell.tsx`:

1. **Step1Onboarding** — Collect user profile (experience level, financial goals, monthly target)
2. **Step2Fundamentos** — Educational lessons + quiz on Forex basics
3. **Step3GestaoRisco** — Configure simulated capital and risk-per-trade percentage
4. **Step4Simulador** — Execute simulated trades with Claude AI feedback (most complex step)
5. **Step5Dashboard** — Performance metrics and Recharts visualizations
6. **Step6Resumo** — Final summary with reset option

### State Management

All global state lives in `src/context/AppContext.tsx` using `useReducer` with **localStorage persistence** (key: `mente_trader_state`). State includes user profile, wizard progress, trade history, metrics, and the Claude API key.

Key state shape:
```typescript
AppState {
  nivelExperiencia, objetivosFinanceiros, metaMensal  // onboarding
  capitalSimulado, riscoPorTrade                       // risk config
  trades: Trade[], metrics: Metrics                    // simulation results
  claudeApiKey: string                                 // entered by user in Step4
  currentStep: number, completedSteps: number[]
  moduloAvancadoBloqueado: boolean  // true when drawdown > 20%
}
```

### Key Logic

**`src/utils/riskCalculator.ts`** — Core trading simulation:
- Calculates RR ratio from stop loss / take profit
- Simulates trade outcomes with probability weights: discipline (+10%), good RR ≥2.0 (+10%), poor RR <1.0 (−15%)
- Computes PnL, drawdown, winrate, and average RR metrics

**`src/services/claudeService.ts`** — Claude API integration:
- Uses `claude-haiku-4-5-20251001` model
- `analyzeTradeEducational()` — Feedback on simulated trade execution
- `generateQuizReview()` — Explanation for incorrect quiz answers
- System prompt enforces: educational tone, no profit promises, Portuguese only, max 200 words
- API key is user-supplied (validated to start with `sk-ant-`)

**`src/data/courseContent.ts`** — Static educational content: 4 lessons and 10+ quiz questions, all in Portuguese.

### Styling

Dark slate theme configured in `tailwind.config.js`. Custom color tokens:
- Backgrounds: `dark-900` (`#0f172a`) through `dark-600` (`#475569`)
- Accent: `accent-500` (`#3b82f6`)
- Profit/Loss: green `#22c55e` / red `#ef4444`

All UI text and content is in **Brazilian Portuguese**.
