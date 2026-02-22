import type { Trade, Metrics } from '../types';

// ============================================================
// Utilitários de Cálculo de Risco e Métricas
// ============================================================

/**
 * Calcula o valor em reais que será arriscado por trade
 */
export function calcularValorRisco(capital: number, percentual: string): number {
  const pct = parseFloat(percentual.replace('%', '')) / 100;
  return capital * pct;
}

/**
 * Calcula o Risk/Reward ratio
 */
export function calcularRR(sl: string, tp: string): number {
  const slNum = parseFloat(sl);
  const tpNum = parseFloat(tp);
  if (!slNum || slNum <= 0) return 0;
  return Math.abs(tpNum / slNum);
}

/**
 * Simula o resultado de um trade com viés educativo.
 * Trades com RR >= 2 têm maior probabilidade de sucesso para incentivar boas práticas.
 */
export function simularResultado(rr: number, seguiuPlano: boolean): 'gain' | 'loss' {
  // Probabilidade base de acerto: 45%
  let probGain = 0.45;

  // Bônus por seguir o plano
  if (seguiuPlano) probGain += 0.10;

  // Bônus por bom RR
  if (rr >= 2) probGain += 0.10;
  else if (rr < 1) probGain -= 0.15;

  return Math.random() < probGain ? 'gain' : 'loss';
}

/**
 * Calcula o PnL em R$ de um trade
 */
export function calcularPnL(
  capital: number,
  percentualRisco: string,
  rr: number,
  resultado: 'gain' | 'loss'
): number {
  const risco = calcularValorRisco(capital, percentualRisco);
  if (resultado === 'gain') return risco * rr;
  return -risco;
}

/**
 * Calcula todas as métricas do dashboard a partir do histórico de trades
 */
export function calcularMetrics(
  trades: Trade[],
  capitalInicial: number
): Metrics {
  if (trades.length === 0) {
    return {
      winrate: 0,
      rrMedio: 0,
      drawdown: 0,
      pnlHistory: [capitalInicial],
      vezesSeguiuPlano: 0,
    };
  }

  const wins = trades.filter(t => t.resultado === 'gain').length;
  const winrate = (wins / trades.length) * 100;

  const rrMedio = trades.reduce((acc, t) => acc + t.rr, 0) / trades.length;

  const seguiuPlano = trades.filter(t => t.seguiuPlano).length;
  const vezesSeguiuPlano = (seguiuPlano / trades.length) * 100;

  // Histórico de capital acumulado
  const pnlHistory: number[] = [capitalInicial];
  let capitalAtual = capitalInicial;
  for (const trade of trades) {
    capitalAtual += trade.pnl;
    pnlHistory.push(Math.max(0, capitalAtual));
  }

  // Drawdown máximo
  let peakCapital = capitalInicial;
  let maxDrawdown = 0;
  for (const capital of pnlHistory) {
    if (capital > peakCapital) peakCapital = capital;
    const dd = ((peakCapital - capital) / peakCapital) * 100;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }

  return {
    winrate: Math.round(winrate * 10) / 10,
    rrMedio: Math.round(rrMedio * 100) / 100,
    drawdown: Math.round(maxDrawdown * 10) / 10,
    pnlHistory,
    vezesSeguiuPlano: Math.round(vezesSeguiuPlano * 10) / 10,
  };
}

/**
 * Formata valor em reais
 */
export function formatarReais(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata número com 2 casas decimais
 */
export function formatarNumero(valor: number, decimais = 2): string {
  return valor.toFixed(decimais);
}

/**
 * Gera ID único para trades
 */
export function gerarId(): string {
  return `trade_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
