import React, { useState } from 'react';
import { Target, ChevronRight, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { NIVEIS_EXPERIENCIA, OBJETIVOS_DISPONIVEIS } from '../../data/courseContent';
import type { NivelExperiencia, ObjetivoFinanceiro } from '../../types';

export default function Step1Onboarding() {
  const { state, setNivelExperiencia, toggleObjetivo, setMetaMensal, nextStep, markStepComplete } = useApp();
  const [errors, setErrors] = useState<string[]>([]);

  function formatMeta(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (!digits) return '';
    const num = parseInt(digits, 10);
    return num.toLocaleString('pt-BR');
  }

  function handleMetaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, '');
    setMetaMensal(digits ? digits : '');
  }

  function validate(): boolean {
    const errs: string[] = [];
    if (!state.nivelExperiencia) errs.push('Selecione seu nível de experiência.');
    if (state.objetivosFinanceiros.length === 0) errs.push('Selecione pelo menos um objetivo.');
    setErrors(errs);
    return errs.length === 0;
  }

  function handleNext() {
    if (!validate()) return;
    markStepComplete(1);
    nextStep();
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Target size={22} className="text-accent" />
          </div>
          <div>
            <p className="text-xs text-accent font-semibold uppercase tracking-wide">Etapa 1 de 6</p>
            <h2 className="text-2xl font-bold">Onboarding Estratégico</h2>
          </div>
        </div>
        <p className="text-slate-400 mt-2">
          Vamos entender seu perfil para personalizar sua jornada de aprendizado.
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert type="error">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Alert>
      )}

      {/* Nível de Experiência */}
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Qual é o seu nível de experiência com Forex?
          <span className="text-red-400 ml-1">*</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NIVEIS_EXPERIENCIA.map((nivel) => (
            <Card
              key={nivel.valor}
              hoverable
              selected={state.nivelExperiencia === nivel.valor}
              onClick={() => setNivelExperiencia(nivel.valor as NivelExperiencia)}
            >
              <CardBody className="flex items-start gap-4 py-4">
                <span className="text-3xl">{nivel.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{nivel.valor}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{nivel.descricao}</p>
                </div>
                {state.nivelExperiencia === nivel.valor && (
                  <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {state.operadorExperiente && (
          <Alert type="info" className="mt-3">
            Como você já opera, o módulo avançado estará disponível após concluir a Gestão de Risco (Etapa 3), desde que seu drawdown seja controlado.
          </Alert>
        )}
      </section>

      {/* Objetivos */}
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Quais são seus objetivos financeiros?
          <span className="text-red-400 ml-1">*</span>
          <span className="text-xs text-slate-500 ml-2 font-normal">(selecione todos que se aplicam)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OBJETIVOS_DISPONIVEIS.map((obj) => {
            const selected = state.objetivosFinanceiros.includes(obj as ObjetivoFinanceiro);
            return (
              <label
                key={obj}
                className={[
                  'flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200',
                  selected
                    ? 'border-accent bg-accent/10 ring-1 ring-accent/30'
                    : 'border-slate-700 bg-dark-800 hover:border-accent/40 hover:bg-dark-700/60',
                ].join(' ')}
              >
                <div
                  className={[
                    'w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all',
                    selected ? 'bg-accent border-accent' : 'border-slate-600 bg-transparent',
                  ].join(' ')}
                >
                  {selected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selected}
                  onChange={() => toggleObjetivo(obj as ObjetivoFinanceiro)}
                />
                <span className="text-sm font-medium">{obj}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Meta Mensal */}
      <section>
        <h3 className="text-lg font-semibold mb-2">Meta de retorno mensal</h3>
        <p className="text-sm text-slate-400 mb-4">
          Opcional — defina uma meta realista para acompanhar seu progresso.
        </p>
        <div className="relative max-w-xs">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
            <DollarSign size={16} />
            <span className="text-sm font-medium">R$</span>
          </div>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={state.metaMensal ? parseInt(state.metaMensal, 10).toLocaleString('pt-BR') : ''}
            onChange={handleMetaChange}
            className="w-full bg-dark-800 border border-slate-700 rounded-xl pl-14 pr-4 py-3 text-white placeholder-slate-600
              focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
          />
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={handleNext}>
          Próxima Etapa
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
