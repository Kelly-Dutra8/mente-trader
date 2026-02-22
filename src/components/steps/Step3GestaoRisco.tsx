import React, { useState } from 'react';
import { Shield, ChevronRight, ChevronLeft, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { PERCENTUAIS_RISCO } from '../../data/courseContent';
import { calcularValorRisco, formatarReais } from '../../utils/riskCalculator';
import type { PercentualRisco } from '../../types';

export default function Step3GestaoRisco() {
  const { state, setCapitalSimulado, setRiscoPorTrade, nextStep, prevStep, markStepComplete } = useApp();
  const [capitalInput, setCapitalInput] = useState(
    state.capitalSimulado ? state.capitalSimulado.toString() : ''
  );
  const [modalAberto, setModalAberto] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const valorRisco = state.capitalSimulado > 0
    ? calcularValorRisco(state.capitalSimulado, state.riscoPorTrade)
    : 0;

  const riscoAlto = state.riscoPorTrade === '5%';

  function handleCapitalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '');
    setCapitalInput(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num > 0) {
      setCapitalSimulado(num);
    }
  }

  function validate(): boolean {
    const errs: string[] = [];
    if (!state.capitalSimulado || state.capitalSimulado <= 0) {
      errs.push('Informe um capital simulado válido (maior que zero).');
    }
    setErrors(errs);
    return errs.length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    if (riscoAlto) {
      setModalAberto(true);
      return;
    }
    markStepComplete(3);
    nextStep();
  }

  function confirmarRiscoAlto() {
    setModalAberto(false);
    markStepComplete(3);
    nextStep();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
            <Shield size={22} className="text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-orange-400 font-semibold uppercase tracking-wide">Etapa 3 de 6</p>
            <h2 className="text-2xl font-bold">Gestão de Risco Obrigatória</h2>
          </div>
        </div>
        <p className="text-slate-400 mt-2">
          Configure seu perfil de risco. Esta etapa é fundamental para operar com segurança.
        </p>
      </div>

      {errors.length > 0 && (
        <Alert type="error">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Alert>
      )}

      {/* Capital Simulado */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Capital Simulado</h3>
        <p className="text-sm text-slate-400 mb-4">
          Defina o valor em reais que você usará nas simulações. Este valor não é real.
        </p>
        <div className="relative max-w-sm">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
            R$
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="1.000"
            value={capitalInput ? parseInt(capitalInput, 10).toLocaleString('pt-BR') : ''}
            onChange={handleCapitalChange}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600
              focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
          />
        </div>
      </section>

      {/* Percentual de Risco */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Percentual de Risco por Trade</h3>
        <p className="text-sm text-slate-400 mb-4">
          Selecione qual percentual do seu capital você está disposto a arriscar em cada operação.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PERCENTUAIS_RISCO.map((pct) => {
            const selected = state.riscoPorTrade === pct;
            const isRisky = pct === '5%';
            return (
              <button
                key={pct}
                onClick={() => setRiscoPorTrade(pct as PercentualRisco)}
                className={[
                  'p-4 rounded-xl border font-bold text-lg transition-all duration-200',
                  selected
                    ? isRisky
                      ? 'bg-red-600/20 border-red-500 text-red-400 ring-1 ring-red-500/40'
                      : 'bg-accent/20 border-accent text-accent ring-1 ring-accent/40'
                    : 'bg-dark-800 border-slate-700 text-slate-300 hover:border-slate-500',
                ].join(' ')}
              >
                {pct}
                {isRisky && <div className="text-xs font-normal text-red-400 mt-1">⚠️ Alto Risco</div>}
                {pct === '1%' && <div className="text-xs font-normal text-green-400 mt-1">✓ Recomendado</div>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Cálculo do Valor de Risco */}
      {state.capitalSimulado > 0 && (
        <Card glass>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Valor arriscado por trade</p>
                <p className={`text-2xl font-bold ${riscoAlto ? 'text-red-400' : 'text-white'}`}>
                  {formatarReais(valorRisco)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {state.riscoPorTrade} de {formatarReais(state.capitalSimulado)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Capital restante após 10 perdas</p>
                <p className="text-lg font-semibold text-slate-200">
                  {formatarReais(state.capitalSimulado - valorRisco * 10)}
                </p>
              </div>
            </div>

            {riscoAlto && (
              <Alert type="warning" className="mt-4">
                <strong>Atenção!</strong> Riscar 5% por operação é considerado agressivo. Com 10 perdas
                consecutivas, você perderia 50% do capital. Profissionais recomendam no máximo 2% por trade.
              </Alert>
            )}
          </CardBody>
        </Card>
      )}

      {/* Boas Práticas */}
      <Alert type="info" title="Regras de Ouro da Gestão de Risco">
        <ul className="list-disc list-inside space-y-1 mt-1">
          <li>Nunca arrisque mais de 1-2% por operação</li>
          <li>Sempre defina o Stop Loss antes de entrar no trade</li>
          <li>Mantenha o Risk/Reward mínimo de 1:1.5</li>
          <li>Pare de operar se atingir 5% de drawdown diário</li>
        </ul>
      </Alert>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={prevStep}>
          <ChevronLeft size={18} />
          Voltar
        </Button>
        <Button onClick={handleNext}>
          Próxima Etapa
          <ChevronRight size={18} />
        </Button>
      </div>

      {/* Modal Risco Alto */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-400">Alerta: Risco Elevado</h3>
                <p className="text-xs text-slate-500">Aviso Educativo</p>
              </div>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed space-y-3 mb-6">
              <p>
                Você selecionou <strong className="text-red-400">5% de risco por trade</strong>. Isso significa que em uma sequência de apenas <strong>14 perdas consecutivas</strong>, você perderia mais de 50% do seu capital.
              </p>
              <p>
                Traders profissionais raramente arriscam mais de 1-2% por operação, pois isso permite sobreviver a longos períodos de drawdown e manter a estabilidade emocional.
              </p>
              <p className="text-yellow-400 font-medium">
                Esta plataforma é educacional. Prosseguir com risco alto é permitido para fins de aprendizado.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setModalAberto(false)} fullWidth>
                Revisar Risco
              </Button>
              <Button variant="danger" onClick={confirmarRiscoAlto} fullWidth>
                Entendi, Prosseguir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
