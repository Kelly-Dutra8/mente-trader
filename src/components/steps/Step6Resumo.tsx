import React from 'react';
import { Award, Download, RotateCcw, ChevronLeft, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { formatarReais } from '../../utils/riskCalculator';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-700/30 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-white text-right max-w-[60%]">{value}</span>
    </div>
  );
}

export default function Step6Resumo() {
  const { state, prevStep, markStepComplete, resetApp } = useApp();
  const { trades, metrics, capitalSimulado } = state;

  const capitalAtual = metrics.pnlHistory.length > 0
    ? metrics.pnlHistory[metrics.pnlHistory.length - 1]
    : capitalSimulado;
  const pnlTotal = capitalAtual - capitalSimulado;

  const resumo = {
    perfil: {
      nivelExperiencia: state.nivelExperiencia || 'Não informado',
      objetivos: state.objetivosFinanceiros,
      metaMensal: state.metaMensal ? `R$ ${parseInt(state.metaMensal, 10).toLocaleString('pt-BR')}` : 'Não definida',
    },
    gestaoRisco: {
      capitalSimulado: formatarReais(capitalSimulado),
      riscoPorTrade: state.riscoPorTrade,
      moduloAvancadoBloqueado: state.moduloAvancadoBloqueado,
    },
    performance: {
      totalTrades: trades.length,
      wins: trades.filter(t => t.resultado === 'gain').length,
      losses: trades.filter(t => t.resultado === 'loss').length,
      winrate: `${metrics.winrate}%`,
      rrMedio: `1:${metrics.rrMedio}`,
      drawdownMaximo: `${metrics.drawdown}%`,
      vezesSeguiuPlano: `${metrics.vezesSeguiuPlano}%`,
      capitalFinal: formatarReais(capitalAtual),
      pnlTotal: `${pnlTotal >= 0 ? '+' : ''}${formatarReais(pnlTotal)}`,
      retornoPercentual: `${pnlTotal >= 0 ? '+' : ''}${((pnlTotal / capitalSimulado) * 100).toFixed(2)}%`,
    },
    historico: trades.map(t => ({
      par: t.par,
      resultado: t.resultado,
      pnl: formatarReais(t.pnl),
      rr: `1:${t.rr.toFixed(2)}`,
      seguiuPlano: t.seguiuPlano,
      data: new Date(t.timestamp).toLocaleDateString('pt-BR'),
    })),
    geradoEm: new Date().toLocaleString('pt-BR'),
    aviso: 'Documento exclusivamente educacional. Nenhuma operação real foi realizada.',
  };

  function handleDownload() {
    const json = JSON.stringify(resumo, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mente-trader-resumo-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    markStepComplete(6);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
            <Award size={22} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wide">Etapa 6 de 6</p>
            <h2 className="text-2xl font-bold">Resumo Final da Jornada</h2>
          </div>
        </div>
        <p className="text-slate-400 mt-2">
          Parabéns por completar a plataforma Mente Trader! Aqui está seu perfil consolidado.
        </p>
      </div>

      {/* Conquista */}
      {state.completedSteps.length >= 5 && (
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Award size={28} className="text-yellow-400" />
          </div>
          <div>
            <h3 className="font-bold text-yellow-400">Certificado de Conclusão</h3>
            <p className="text-sm text-slate-300 mt-1">
              Você completou o programa educacional Mente Trader com {state.completedSteps.length} de 6 etapas concluídas.
            </p>
          </div>
          <CheckCircle size={24} className="text-yellow-400 ml-auto flex-shrink-0" />
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perfil */}
        <Card>
          <CardBody>
            <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wide mb-4">Perfil do Trader</h3>
            <InfoRow label="Nível de Experiência" value={state.nivelExperiencia || '—'} />
            <InfoRow
              label="Objetivos"
              value={
                state.objetivosFinanceiros.length > 0
                  ? state.objetivosFinanceiros.join(', ')
                  : '—'
              }
            />
            <InfoRow label="Meta Mensal" value={resumo.perfil.metaMensal} />
          </CardBody>
        </Card>

        {/* Gestão de Risco */}
        <Card>
          <CardBody>
            <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wide mb-4">Gestão de Risco</h3>
            <InfoRow label="Capital Simulado" value={resumo.gestaoRisco.capitalSimulado} />
            <InfoRow label="Risco por Trade" value={state.riscoPorTrade} />
            <InfoRow
              label="Módulo Avançado"
              value={
                <span className={state.moduloAvancadoBloqueado ? 'text-red-400' : 'text-green-400'}>
                  {state.moduloAvancadoBloqueado ? '🔒 Bloqueado' : '✅ Disponível'}
                </span>
              }
            />
          </CardBody>
        </Card>

        {/* Performance */}
        <Card className="md:col-span-2">
          <CardBody>
            <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wide mb-4">Performance Simulada</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total de Trades', value: trades.length.toString() },
                { label: 'Vitórias', value: <span className="text-green-400">{resumo.performance.wins}</span> },
                { label: 'Derrotas', value: <span className="text-red-400">{resumo.performance.losses}</span> },
                { label: 'Winrate', value: resumo.performance.winrate },
                { label: 'RR Médio', value: resumo.performance.rrMedio },
                { label: 'Drawdown Máx.', value: resumo.performance.drawdownMaximo },
                { label: 'Seguiu o Plano', value: resumo.performance.vezesSeguiuPlano },
                { label: 'Capital Final', value: resumo.performance.capitalFinal },
                { label: 'P&L Total', value: <span className={pnlTotal >= 0 ? 'text-green-400' : 'text-red-400'}>{resumo.performance.pnlTotal}</span> },
              ].map((item) => (
                <div key={item.label} className="bg-dark-900 rounded-xl p-3 border border-slate-700/30">
                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                  <p className="font-bold text-lg">{item.value}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Aviso Educacional */}
      <div className="bg-dark-800 border border-slate-700/50 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed">
        ⚠️ <strong className="text-slate-400">Aviso Legal:</strong> Todos os dados acima são exclusivamente educacionais e simulados.
        Nenhuma operação real foi realizada. Resultados simulados não garantem desempenho futuro no mercado real.
        O mercado Forex envolve risco substancial de perda de capital. Consulte sempre um profissional financeiro
        habilitado antes de investir.
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="success" size="lg" onClick={handleDownload} fullWidth>
          <Download size={20} />
          Baixar Resumo JSON
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => {
            if (window.confirm('Deseja reiniciar completamente o programa? Todo progresso será perdido.')) {
              resetApp();
            }
          }}
          fullWidth
        >
          <RotateCcw size={20} />
          Reiniciar Programa
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-start pt-2">
        <Button variant="ghost" onClick={prevStep}>
          <ChevronLeft size={18} />
          Voltar
        </Button>
      </div>
    </div>
  );
}
