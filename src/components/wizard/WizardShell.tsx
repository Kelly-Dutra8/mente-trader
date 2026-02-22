import React from 'react';
import { CheckCircle, Circle, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Step1Onboarding from '../steps/Step1Onboarding';
import Step2Fundamentos from '../steps/Step2Fundamentos';
import Step3GestaoRisco from '../steps/Step3GestaoRisco';
import Step4Simulador from '../steps/Step4Simulador';
import Step5Dashboard from '../steps/Step5Dashboard';
import Step6Resumo from '../steps/Step6Resumo';

const STEPS = [
  { number: 1, label: 'Onboarding' },
  { number: 2, label: 'Fundamentos' },
  { number: 3, label: 'Gestão de Risco' },
  { number: 4, label: 'Simulador' },
  { number: 5, label: 'Dashboard' },
  { number: 6, label: 'Resumo' },
];

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1: return <Step1Onboarding />;
    case 2: return <Step2Fundamentos />;
    case 3: return <Step3GestaoRisco />;
    case 4: return <Step4Simulador />;
    case 5: return <Step5Dashboard />;
    case 6: return <Step6Resumo />;
    default: return null;
  }
}

export default function WizardShell() {
  const { state, goToStep } = useApp();
  const { currentStep, completedSteps } = state;

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-dark-900/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">Mente Trader</h1>
              <p className="text-xs text-slate-500 mt-0.5">Educação Forex Profissional</p>
            </div>
          </div>

          {/* Step indicator (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {STEPS.map((step, index) => {
              const isCompleted = completedSteps.includes(step.number);
              const isCurrent = currentStep === step.number;
              const isClickable = completedSteps.includes(step.number) || step.number === currentStep;

              return (
                <React.Fragment key={step.number}>
                  {index > 0 && (
                    <div
                      className={`h-px w-6 ${isCompleted ? 'bg-accent' : 'bg-slate-700'}`}
                    />
                  )}
                  <button
                    onClick={() => isClickable && goToStep(step.number)}
                    disabled={!isClickable}
                    title={step.label}
                    className={[
                      'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all',
                      isCurrent
                        ? 'bg-accent text-white ring-2 ring-accent/40'
                        : isCompleted
                        ? 'bg-green-600/20 text-green-400 border border-green-600/40 cursor-pointer hover:bg-green-600/30'
                        : 'bg-dark-700 text-slate-500 border border-slate-700 cursor-default',
                    ].join(' ')}
                  >
                    {isCompleted ? <CheckCircle size={14} /> : step.number}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>{STEPS[currentStep - 1]?.label}</span>
            <span>Etapa {currentStep}/6</span>
          </div>
          <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <StepContent step={currentStep} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 text-center">
        <p className="text-xs text-slate-600">
          ⚠️ Plataforma exclusivamente educacional. Nenhuma operação real é realizada.
          Investimentos em Forex envolvem alto risco de perda.
        </p>
      </footer>
    </div>
  );
}
