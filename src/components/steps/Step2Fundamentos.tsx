import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, ChevronLeft, CheckCircle, XCircle, Brain } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { FUNDAMENTOS_CONTENT, QUIZ_QUESTIONS } from '../../data/courseContent';
import { generateQuizReview } from '../../services/claudeService';

export default function Step2Fundamentos() {
  const { state, nextStep, prevStep, markStepComplete } = useApp();
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [leituraConfirmada, setLeituraConfirmada] = useState(false);
  const [quizAtivo, setQuizAtivo] = useState(false);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [quizEnviado, setQuizEnviado] = useState(false);
  const [quizAprovado, setQuizAprovado] = useState(false);
  const [revisaoIA, setRevisaoIA] = useState('');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [erroIA, setErroIA] = useState('');

  const totalCorretas = QUIZ_QUESTIONS.filter(
    (q) => respostas[q.id] === q.correta
  ).length;
  const scorePercent = (totalCorretas / QUIZ_QUESTIONS.length) * 100;

  async function handleEnviarQuiz() {
    if (Object.keys(respostas).length < QUIZ_QUESTIONS.length) return;

    setQuizEnviado(true);
    const aprovado = scorePercent >= 75; // 3 de 4 corretas
    setQuizAprovado(aprovado);

    if (!aprovado) {
      const erradas = QUIZ_QUESTIONS
        .filter((q) => respostas[q.id] !== q.correta)
        .map((q) => `Pergunta: "${q.pergunta}" — Resposta incorreta: "${q.opcoes[respostas[q.id] ?? 0]}"`);

      if (state.claudeApiKey) {
        setCarregandoIA(true);
        try {
          const revisao = await generateQuizReview({
            respostasErradas: erradas,
            apiKey: state.claudeApiKey,
          });
          setRevisaoIA(revisao);
        } catch (err) {
          setErroIA('Não foi possível gerar a revisão automática. Revise o material acima e tente novamente.');
        } finally {
          setCarregandoIA(false);
        }
      }
    }
  }

  function resetQuiz() {
    setRespostas({});
    setQuizEnviado(false);
    setQuizAprovado(false);
    setRevisaoIA('');
    setErroIA('');
  }

  function handleNext() {
    if (!quizAprovado) return;
    markStepComplete(2);
    nextStep();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <BookOpen size={22} className="text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-purple-400 font-semibold uppercase tracking-wide">Etapa 2 de 6</p>
            <h2 className="text-2xl font-bold">Fundamentos do Mercado</h2>
          </div>
        </div>
        <p className="text-slate-400 mt-2">
          Leia o conteúdo abaixo e confirme a leitura para desbloquear o quiz.
        </p>
      </div>

      {/* Conteúdo em Accordion */}
      <div className="space-y-3">
        {FUNDAMENTOS_CONTENT.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-700/50 bg-dark-800 overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between p-5 text-left hover:bg-dark-700/50 transition-colors"
              onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
            >
              <span className="font-semibold text-sm pr-4">{item.titulo}</span>
              {openAccordion === index ? (
                <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronDown size={18} className="text-slate-500 flex-shrink-0 rotate-[-90deg]" />
              )}
            </button>
            {openAccordion === index && (
              <div className="px-5 pb-5 border-t border-slate-700/30">
                <div className="mt-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {item.conteudo}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmação de Leitura */}
      {!quizAtivo && (
        <Card glass>
          <CardBody>
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                className={[
                  'w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 mt-0.5 transition-all',
                  leituraConfirmada ? 'bg-accent border-accent' : 'border-slate-600',
                ].join(' ')}
                onClick={() => setLeituraConfirmada(!leituraConfirmada)}
              >
                {leituraConfirmada && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input type="checkbox" className="sr-only" checked={leituraConfirmada} onChange={() => setLeituraConfirmada(!leituraConfirmada)} />
              <span className="text-sm text-slate-300">
                Confirmo que li e compreendi o conteúdo dos fundamentos do mercado Forex.
              </span>
            </label>

            {leituraConfirmada && !quizAtivo && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <Button
                  onClick={() => setQuizAtivo(true)}
                  fullWidth
                  size="lg"
                >
                  <Brain size={18} />
                  Iniciar Quiz de Verificação
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Quiz */}
      {quizAtivo && !quizEnviado && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain size={20} className="text-purple-400" />
              Quiz de Verificação
            </h3>
            <span className="text-sm text-slate-500">
              {Object.keys(respostas).length}/{QUIZ_QUESTIONS.length} respondidas
            </span>
          </div>

          {QUIZ_QUESTIONS.map((q, qi) => (
            <Card key={q.id}>
              <CardBody>
                <p className="font-medium text-sm mb-4">
                  <span className="text-accent mr-2">{qi + 1}.</span>
                  {q.pergunta}
                </p>
                <div className="space-y-2">
                  {q.opcoes.map((opcao, oi) => (
                    <label
                      key={oi}
                      className={[
                        'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                        respostas[q.id] === oi
                          ? 'border-accent bg-accent/10'
                          : 'border-slate-700 hover:border-accent/40 hover:bg-dark-700/50',
                      ].join(' ')}
                    >
                      <div
                        className={[
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                          respostas[q.id] === oi ? 'border-accent' : 'border-slate-600',
                        ].join(' ')}
                      >
                        {respostas[q.id] === oi && (
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        className="sr-only"
                        checked={respostas[q.id] === oi}
                        onChange={() => setRespostas({ ...respostas, [q.id]: oi })}
                      />
                      <span className="text-sm">{opcao}</span>
                    </label>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}

          <Button
            onClick={handleEnviarQuiz}
            disabled={Object.keys(respostas).length < QUIZ_QUESTIONS.length}
            fullWidth
            size="lg"
          >
            Enviar Respostas
          </Button>
        </div>
      )}

      {/* Resultado do Quiz */}
      {quizEnviado && (
        <div className="space-y-4">
          <Card>
            <CardBody>
              <div className="text-center py-4">
                {quizAprovado ? (
                  <>
                    <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-green-400 mb-1">Parabéns! Quiz Aprovado</h3>
                    <p className="text-slate-400 text-sm">
                      Você acertou {totalCorretas} de {QUIZ_QUESTIONS.length} questões ({Math.round(scorePercent)}%)
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle size={48} className="text-red-400 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-red-400 mb-1">Quiz Reprovado</h3>
                    <p className="text-slate-400 text-sm">
                      Você acertou {totalCorretas} de {QUIZ_QUESTIONS.length} questões ({Math.round(scorePercent)}%). Mínimo: 75%
                    </p>
                  </>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Gabarito */}
          <div className="space-y-3">
            {QUIZ_QUESTIONS.map((q, qi) => {
              const escolhida = respostas[q.id] ?? -1;
              const correta = escolhida === q.correta;
              return (
                <Card key={q.id}>
                  <CardBody className="py-4">
                    <div className="flex items-start gap-2">
                      {correta ? (
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          <span className="text-slate-500 mr-1">{qi + 1}.</span>
                          {q.pergunta}
                        </p>
                        {!correta && (
                          <p className="text-xs text-green-400 mt-1">
                            ✓ Correta: {q.opcoes[q.correta]}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Revisão da IA */}
          {!quizAprovado && (
            <div className="space-y-3">
              {carregandoIA && (
                <Alert type="info">
                  <span className="animate-pulse">Gerando revisão personalizada com IA...</span>
                </Alert>
              )}
              {revisaoIA && (
                <Card glass>
                  <CardBody>
                    <h4 className="font-semibold text-sm text-purple-400 mb-3">🤖 Revisão da IA Educacional</h4>
                    <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {revisaoIA}
                    </div>
                  </CardBody>
                </Card>
              )}
              {erroIA && <Alert type="warning">{erroIA}</Alert>}

              <Button variant="secondary" onClick={resetQuiz} fullWidth>
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={prevStep}>
          <ChevronLeft size={18} />
          Voltar
        </Button>
        <Button onClick={handleNext} disabled={!quizAprovado}>
          Próxima Etapa
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
