import React from 'react';
import {
  BarChart2, ChevronRight, ChevronLeft, TrendingUp, TrendingDown,
  Target, AlertTriangle, CheckCircle, Lock
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { formatarReais } from '../../utils/riskCalculator';

function MetricCard({
  label,
  value,
  sub,
  color = 'white',
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  icon: React.ElementType;
}) {
  return (
    <Card glass>
      <CardBody className="py-5">
        <div className="flex items-center gap-3 mb-3">
          <Icon size={18} className="text-slate-500" />
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</span>
        </div>
        <p className={`text-3xl font-bold text-${color}`}>{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </CardBody>
    </Card>
  );
}

export default function Step5Dashboard() {
  const { state, goToStep, nextStep, prevStep, markStepComplete } = useApp();
  const { trades, metrics, capitalSimulado, moduloAvancadoBloqueado } = state;

  // Dados para o gráfico
  const chartData = metrics.pnlHistory.map((capital, i) => ({
    trade: i === 0 ? 'Início' : `T${i}`,
    capital,
    referencia: capitalSimulado,
  }));

  // Lógica de recomendação
  function getRecomendacao(): { tipo: 'danger' | 'warning' | 'success' | 'info'; titulo: string; descricao: string; acao?: { label: string; step: number } } {
    if (moduloAvancadoBloqueado || metrics.drawdown > 20) {
      return {
        tipo: 'danger',
        titulo: '🔒 Módulo Avançado Bloqueado',
        descricao: `Seu drawdown atingiu ${metrics.drawdown}% (limite: 20%). É essencial revisar sua gestão de risco antes de continuar. Retorne à Etapa 3 para ajustar seu perfil de risco.`,
        acao: { label: 'Revisar Gestão de Risco', step: 3 },
      };
    }
    if (metrics.winrate < 40) {
      return {
        tipo: 'warning',
        titulo: '⚠️ Winrate Abaixo do Esperado',
        descricao: `Seu winrate de ${metrics.winrate}% está abaixo de 40%. Recomendamos revisar o Módulo de Risco para entender como um bom RR pode compensar um winrate baixo.`,
        acao: { label: 'Revisar Módulo de Risco', step: 3 },
      };
    }
    return {
      tipo: 'success',
      titulo: '✅ Bom Desempenho!',
      descricao: `Você está no caminho certo! Winrate de ${metrics.winrate}% com drawdown controlado de ${metrics.drawdown}%. Continue praticando para consolidar a consistência.`,
    };
  }

  const recomendacao = getRecomendacao();

  const capitalAtual = metrics.pnlHistory.length > 0
    ? metrics.pnlHistory[metrics.pnlHistory.length - 1]
    : capitalSimulado;

  const pnlTotal = capitalAtual - capitalSimulado;

  if (trades.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <BarChart2 size={22} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide">Etapa 5 de 6</p>
              <h2 className="text-2xl font-bold">Dashboard de Performance</h2>
            </div>
          </div>
        </div>

        <Card glass>
          <CardBody className="text-center py-12">
            <BarChart2 size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">Nenhum trade simulado ainda</h3>
            <p className="text-sm text-slate-500 mb-6">
              Volte para o Simulador e faça pelo menos um trade para ver seu dashboard.
            </p>
            <Button onClick={() => goToStep(4)} variant="secondary">
              Ir para o Simulador
            </Button>
          </CardBody>
        </Card>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={prevStep}>
            <ChevronLeft size={18} />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <BarChart2 size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide">Etapa 5 de 6</p>
            <h2 className="text-2xl font-bold">Dashboard de Performance</h2>
          </div>
        </div>
        <p className="text-slate-400 mt-2">
          Análise completa das suas {trades.length} simulação{trades.length !== 1 ? 'ões' : ''}.
        </p>
      </div>

      {/* Módulo Avançado Bloqueado */}
      {moduloAvancadoBloqueado && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <Lock size={20} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-400">Módulo Avançado Bloqueado</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Drawdown {metrics.drawdown}% excedeu o limite de 20%. Revise sua gestão de risco.
            </p>
          </div>
        </div>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Winrate"
          value={`${metrics.winrate}%`}
          sub={`${trades.filter(t => t.resultado === 'gain').length}/${trades.length} wins`}
          color={metrics.winrate >= 50 ? 'green-400' : metrics.winrate >= 40 ? 'yellow-400' : 'red-400'}
          icon={Target}
        />
        <MetricCard
          label="RR Médio"
          value={`1:${metrics.rrMedio}`}
          sub={metrics.rrMedio >= 1.5 ? 'Bom RR' : 'Risco/retorno baixo'}
          color={metrics.rrMedio >= 2 ? 'green-400' : metrics.rrMedio >= 1.5 ? 'yellow-400' : 'red-400'}
          icon={TrendingUp}
        />
        <MetricCard
          label="Drawdown Máx."
          value={`${metrics.drawdown}%`}
          sub={metrics.drawdown > 20 ? 'Risco alto!' : metrics.drawdown > 10 ? 'Atenção' : 'Controlado'}
          color={metrics.drawdown > 20 ? 'red-400' : metrics.drawdown > 10 ? 'yellow-400' : 'green-400'}
          icon={TrendingDown}
        />
        <MetricCard
          label="Seguiu o Plano"
          value={`${metrics.vezesSeguiuPlano}%`}
          sub="das operações"
          color={metrics.vezesSeguiuPlano >= 80 ? 'green-400' : metrics.vezesSeguiuPlano >= 60 ? 'yellow-400' : 'red-400'}
          icon={CheckCircle}
        />
      </div>

      {/* P&L Total */}
      <Card glass>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Capital Atual</p>
              <p className="text-3xl font-black">{formatarReais(capitalAtual)}</p>
              <p className={`text-sm font-semibold mt-1 ${pnlTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pnlTotal >= 0 ? '+' : ''}{formatarReais(pnlTotal)} ({pnlTotal >= 0 ? '+' : ''}{((pnlTotal / capitalSimulado) * 100).toFixed(1)}%)
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Capital Inicial</p>
              <p className="text-xl font-bold text-slate-400">{formatarReais(capitalSimulado)}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Gráfico P&L */}
      <Card>
        <CardBody>
          <h3 className="font-semibold text-sm text-slate-300 mb-4">Evolução do Capital</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="trade" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: 12 }}
                  formatter={(value: number) => [formatarReais(value), 'Capital']}
                />
                <ReferenceLine y={capitalSimulado} stroke="#475569" strokeDasharray="4 4" label={{ value: 'Início', fill: '#64748b', fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="capital"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6, fill: '#60a5fa' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      {/* Histórico de Trades */}
      <Card>
        <CardBody>
          <h3 className="font-semibold text-sm text-slate-300 mb-4">Histórico de Trades</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {[...trades].reverse().map((trade, i) => (
              <div
                key={trade.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${trade.resultado === 'gain' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}
              >
                <div className="flex items-center gap-3">
                  {trade.resultado === 'gain' ? (
                    <TrendingUp size={16} className="text-green-400" />
                  ) : (
                    <TrendingDown size={16} className="text-red-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{trade.par}</p>
                    <p className="text-xs text-slate-500">SL:{trade.sl} | TP:{trade.tp} | RR:1:{trade.rr.toFixed(1)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${trade.resultado === 'gain' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}{formatarReais(trade.pnl)}
                  </p>
                  <p className="text-xs text-slate-600">
                    {trade.seguiuPlano ? '✓ Seguiu plano' : '✗ Sem plano'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recomendação */}
      <Alert type={recomendacao.tipo} title={recomendacao.titulo}>
        <p>{recomendacao.descricao}</p>
        {recomendacao.acao && (
          <button
            onClick={() => goToStep(recomendacao.acao!.step)}
            className="mt-2 text-xs underline hover:no-underline"
          >
            → {recomendacao.acao.label}
          </button>
        )}
      </Alert>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={prevStep}>
          <ChevronLeft size={18} />
          Voltar
        </Button>
        <Button onClick={() => { markStepComplete(5); nextStep(); }}>
          Ver Resumo Final
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
