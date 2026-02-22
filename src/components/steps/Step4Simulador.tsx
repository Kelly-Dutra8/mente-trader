import React, { useState } from 'react';
import {
  Activity, ChevronRight, ChevronLeft, Key, Eye, EyeOff,
  TrendingUp, TrendingDown, CheckCircle, XCircle, AlertTriangle, Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { PARES_MOEDA } from '../../data/courseContent';
import { calcularRR, simularResultado, calcularPnL, formatarReais } from '../../utils/riskCalculator';
import { analyzeTradeEducational } from '../../services/claudeService';
import type { ParMoeda } from '../../types';

type Fase = 'api_setup' | 'trade_form' | 'resultado';

export default function Step4Simulador() {
  const { state, addTrade, setClaudeApiKey, nextStep, prevStep, markStepComplete } = useApp();

  const [fase, setFase] = useState<Fase>(state.claudeApiKey ? 'trade_form' : 'api_setup');
  const [apiKeyInput, setApiKeyInput] = useState(state.claudeApiKey);
  const [mostrarKey, setMostrarKey] = useState(false);
  const [erroApiKey, setErroApiKey] = useState('');

  const [par, setPar] = useState<ParMoeda>('EUR/USD');
  const [sl, setSl] = useState('');
  const [tp, setTp] = useState('');
  const [seguiuPlano, setSeguiuPlano] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const [ultimoTrade, setUltimoTrade] = useState<{
    resultado: 'gain' | 'loss';
    pnl: number;
    rr: number;
    feedback: string;
  } | null>(null);
  const [carregandoFeedback, setCarregandoFeedback] = useState(false);

  const rr = calcularRR(sl, tp);

  function salvarApiKey() {
    if (!apiKeyInput.startsWith('sk-ant-')) {
      setErroApiKey('A chave deve começar com "sk-ant-". Verifique sua chave da Claude API.');
      return;
    }
    setClaudeApiKey(apiKeyInput);
    setFase('trade_form');
  }

  function validate(): boolean {
    const errs: string[] = [];
    const slNum = parseFloat(sl);
    const tpNum = parseFloat(tp);
    if (!sl || isNaN(slNum) || slNum <= 0) errs.push('Informe um Stop Loss válido (em pips, número positivo).');
    if (!tp || isNaN(tpNum) || tpNum <= 0) errs.push('Informe um Take Profit válido (em pips, número positivo).');
    if (seguiuPlano === null) errs.push('Informe se seguiu o plano de trading.');
    setErrors(errs);
    return errs.length === 0;
  }

  async function handleSimular() {
    if (!validate()) return;

    const resultado = simularResultado(rr, seguiuPlano!);
    const pnl = calcularPnL(state.capitalSimulado, state.riscoPorTrade, rr, resultado);

    setCarregandoFeedback(true);
    setFase('resultado');

    let feedback = '';
    try {
      feedback = await analyzeTradeEducational({
        par,
        sl,
        tp,
        rr,
        resultado,
        seguiuPlano: seguiuPlano!,
        capitalSimulado: state.capitalSimulado,
        riscoPorTrade: state.riscoPorTrade,
        apiKey: state.claudeApiKey,
      });
    } catch {
      feedback = 'Não foi possível gerar o feedback da IA. Verifique sua API Key e tente novamente.';
    } finally {
      setCarregandoFeedback(false);
    }

    addTrade({ par, sl, tp, rr, resultado, pnl, seguiuPlano: seguiuPlano!, feedback });
    setUltimoTrade({ resultado, pnl, rr, feedback });
  }

  function novoTrade() {
    setSl('');
    setTp('');
    setSeguiuPlano(null);
    setErrors([]);
    setUltimoTrade(null);
    setFase('trade_form');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <Activity size={22} className="text-green-400" />
          </div>
          <div>
            <p className="text-xs text-green-400 font-semibold uppercase tracking-wide">Etapa 4 de 6</p>
            <h2 className="text-2xl font-bold">Simulador de Trade</h2>
          </div>
        </div>
        <p className="text-slate-400 mt-2">
          Simule operações e receba feedback educacional da IA sobre suas decisões.
        </p>
      </div>

      {/* Banner Disclaimer Permanente */}
      <Alert type="warning">
        <strong>⚠️ Aviso Obrigatório:</strong> Este simulador é exclusivamente educacional. Nenhuma operação real
        é executada. Resultados simulados não refletem desempenho real no mercado. O Forex envolve alto risco
        de perda de capital. Nunca invista mais do que pode perder.
      </Alert>

      {/* Fase: API Setup */}
      {fase === 'api_setup' && (
        <Card>
          <CardBody className="space-y-5">
            <div className="flex items-center gap-3">
              <Key size={24} className="text-accent" />
              <div>
                <h3 className="font-semibold">Configurar Claude API</h3>
                <p className="text-sm text-slate-400">Necessária para gerar feedback educacional nos trades</p>
              </div>
            </div>

            <Alert type="warning" title="Segurança">
              Sua API Key é salva apenas no armazenamento local do seu navegador (localStorage). Ela nunca é
              enviada a servidores externos, apenas diretamente à API da Anthropic.
            </Alert>

            <div className="space-y-2">
              <label className="text-sm text-slate-400">Claude API Key</label>
              <div className="relative">
                <input
                  type={mostrarKey ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  value={apiKeyInput}
                  onChange={(e) => { setApiKeyInput(e.target.value); setErroApiKey(''); }}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-white
                    placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                />
                <button
                  onClick={() => setMostrarKey(!mostrarKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {mostrarKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {erroApiKey && <p className="text-red-400 text-xs">{erroApiKey}</p>}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setFase('trade_form')} fullWidth>
                Usar sem IA
              </Button>
              <Button onClick={salvarApiKey} disabled={!apiKeyInput} fullWidth>
                <Key size={16} />
                Salvar e Continuar
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Fase: Formulário de Trade */}
      {fase === 'trade_form' && (
        <div className="space-y-6">
          {/* Histórico resumido */}
          {state.trades.length > 0 && (
            <div className="flex gap-4 text-center">
              <div className="flex-1 bg-dark-800 border border-slate-700 rounded-xl p-3">
                <p className="text-2xl font-bold text-white">{state.trades.length}</p>
                <p className="text-xs text-slate-500">Trades</p>
              </div>
              <div className="flex-1 bg-dark-800 border border-slate-700 rounded-xl p-3">
                <p className="text-2xl font-bold text-green-400">{state.metrics.winrate}%</p>
                <p className="text-xs text-slate-500">Winrate</p>
              </div>
              <div className="flex-1 bg-dark-800 border border-slate-700 rounded-xl p-3">
                <p className={`text-2xl font-bold ${state.metrics.drawdown > 20 ? 'text-red-400' : 'text-white'}`}>
                  {state.metrics.drawdown}%
                </p>
                <p className="text-xs text-slate-500">Drawdown</p>
              </div>
            </div>
          )}

          {state.moduloAvancadoBloqueado && (
            <Alert type="error" title="Módulo Avançado Bloqueado">
              Seu drawdown ultrapassou 20%. O módulo avançado está bloqueado até você revisar sua gestão de risco.
            </Alert>
          )}

          {errors.length > 0 && (
            <Alert type="error">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </Alert>
          )}

          <Card>
            <CardBody className="space-y-5">
              {/* Par de Moedas */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Par de Moedas</label>
                <select
                  value={par}
                  onChange={(e) => setPar(e.target.value as ParMoeda)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 text-white
                    focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                >
                  {PARES_MOEDA.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* SL e TP */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Stop Loss (pips) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="ex: 20"
                    value={sl}
                    onChange={(e) => setSl(e.target.value)}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 text-white
                      placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Take Profit (pips) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="ex: 40"
                    value={tp}
                    onChange={(e) => setTp(e.target.value)}
                    className="w-full bg-dark-900 border border-slate-700 rounded-xl px-4 py-3 text-white
                      placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                  />
                </div>
              </div>

              {/* RR calculado */}
              {rr > 0 && (
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${rr >= 2 ? 'bg-green-500/10 border-green-500/30' : rr >= 1 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className={`text-lg font-bold ${rr >= 2 ? 'text-green-400' : rr >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                    RR 1:{rr.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-400">
                    {rr >= 2 ? '✓ Excelente relação risco/retorno' : rr >= 1.5 ? '✓ Boa relação risco/retorno' : rr >= 1 ? '⚠️ Risco/retorno mínimo aceitável' : '✗ Risco/retorno desfavorável'}
                  </div>
                </div>
              )}

              {/* Seguiu o Plano */}
              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 block">
                  Seguiu seu plano de trading? <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSeguiuPlano(true)}
                    className={[
                      'p-4 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2',
                      seguiuPlano === true
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-dark-900 border-slate-700 text-slate-400 hover:border-green-500/50',
                    ].join(' ')}
                  >
                    <CheckCircle size={18} />
                    Sim, segui o plano
                  </button>
                  <button
                    onClick={() => setSeguiuPlano(false)}
                    className={[
                      'p-4 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center gap-2',
                      seguiuPlano === false
                        ? 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-dark-900 border-slate-700 text-slate-400 hover:border-red-500/50',
                    ].join(' ')}
                  >
                    <XCircle size={18} />
                    Não segui o plano
                  </button>
                </div>
              </div>

              <Button onClick={handleSimular} fullWidth size="lg" variant="success">
                <Activity size={20} />
                Simular Trade
              </Button>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Fase: Resultado */}
      {fase === 'resultado' && ultimoTrade && (
        <div className="space-y-6">
          {/* Card do Resultado */}
          <Card glass>
            <CardBody className="text-center py-8">
              {ultimoTrade.resultado === 'gain' ? (
                <>
                  <TrendingUp size={56} className="text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-400 mb-1">Trade Lucrativo!</h3>
                  <p className="text-4xl font-black text-green-400 mb-2">
                    +{formatarReais(ultimoTrade.pnl)}
                  </p>
                </>
              ) : (
                <>
                  <TrendingDown size={56} className="text-red-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-red-400 mb-1">Trade com Perda</h3>
                  <p className="text-4xl font-black text-red-400 mb-2">
                    {formatarReais(ultimoTrade.pnl)}
                  </p>
                </>
              )}
              <div className="flex justify-center gap-6 text-sm text-slate-400 mt-3">
                <span>Par: <strong className="text-white">{par}</strong></span>
                <span>RR: <strong className="text-white">1:{ultimoTrade.rr.toFixed(2)}</strong></span>
                <span>Total trades: <strong className="text-white">{state.trades.length}</strong></span>
              </div>
            </CardBody>
          </Card>

          {/* Feedback da IA */}
          <Card>
            <CardBody>
              <h4 className="font-semibold text-sm text-accent mb-3 flex items-center gap-2">
                🤖 Feedback Educacional da IA
              </h4>
              {carregandoFeedback ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-accent border-t-transparent rounded-full" />
                  Gerando análise educacional...
                </div>
              ) : (
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {ultimoTrade.feedback}
                </div>
              )}
            </CardBody>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={novoTrade} fullWidth>
              <Plus size={18} />
              Novo Trade
            </Button>
            <Button onClick={() => { markStepComplete(4); nextStep(); }} fullWidth>
              Ver Dashboard
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Navigation (apenas no form) */}
      {fase === 'trade_form' && (
        <div className="flex justify-between pt-4">
          <Button variant="ghost" onClick={prevStep}>
            <ChevronLeft size={18} />
            Voltar
          </Button>
          {state.trades.length > 0 && (
            <Button variant="secondary" onClick={() => { markStepComplete(4); nextStep(); }}>
              Ver Dashboard
              <ChevronRight size={18} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
