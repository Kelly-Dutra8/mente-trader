// ============================================================
// Serviço de Integração com Claude API
// ============================================================

const SYSTEM_PROMPT = `Você é um educador financeiro especializado em Forex e mercados financeiros.

REGRAS OBRIGATÓRIAS:
1. NUNCA prometa lucros ou retornos financeiros
2. SEMPRE enfatize gestão de risco e disciplina
3. NUNCA incentive alavancagem excessiva
4. SEMPRE inclua disclaimer sobre os riscos do mercado
5. Foque em aprendizado, comportamento e disciplina do trader
6. Seja didático, empático e encorajador sem ser irresponsável
7. Responda SEMPRE em português brasileiro
8. Mantenha respostas concisas (máximo 200 palavras)`;

const DISCLAIMER = '\n\n⚠️ **Aviso Legal**: Este feedback é exclusivamente educacional e não constitui recomendação de investimento. Operações no mercado Forex envolvem alto risco de perda de capital. Resultados passados não garantem resultados futuros.';

interface TradeAnalysisParams {
  par: string;
  sl: string;
  tp: string;
  rr: number;
  resultado: 'gain' | 'loss';
  seguiuPlano: boolean;
  capitalSimulado: number;
  riscoPorTrade: string;
  apiKey: string;
}

interface QuizReviewParams {
  respostasErradas: string[];
  apiKey: string;
}

async function callClaudeAPI(
  apiKey: string,
  userMessage: string
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const msg = (error as { error?: { message?: string } }).error?.message || `Erro HTTP ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json() as {
    content: Array<{ type: string; text: string }>;
  };
  const text = data.content?.[0]?.text ?? '';
  return text + DISCLAIMER;
}

/**
 * Analisa um trade simulado e gera feedback educacional
 */
export async function analyzeTradeEducational(
  params: TradeAnalysisParams
): Promise<string> {
  const { par, sl, tp, rr, resultado, seguiuPlano, capitalSimulado, riscoPorTrade, apiKey } = params;

  const resultadoTexto = resultado === 'gain' ? 'LUCRO' : 'PERDA';
  const planoTexto = seguiuPlano ? 'SIM, seguiu o plano' : 'NÃO seguiu o plano';

  const prompt = `Analise este trade simulado de um estudante de Forex e forneça feedback educacional:

**Trade Realizado:**
- Par: ${par}
- Stop Loss: ${sl} pips
- Take Profit: ${tp} pips
- Risk/Reward: 1:${rr.toFixed(2)}
- Resultado: ${resultadoTexto}
- Seguiu o plano: ${planoTexto}
- Capital simulado: R$ ${capitalSimulado.toLocaleString('pt-BR')}
- Risco por trade configurado: ${riscoPorTrade}

Forneça:
1. Avaliação do RR utilizado (bom/ruim e por quê)
2. Comentário sobre disciplina (seguiu ou não o plano)
3. Uma lição educativa baseada no resultado
4. Sugestão de melhoria para o próximo trade

Seja didático e construtivo.`;

  return callClaudeAPI(apiKey, prompt);
}

/**
 * Gera revisão educacional para questões erradas no quiz
 */
export async function generateQuizReview(
  params: QuizReviewParams
): Promise<string> {
  const { respostasErradas, apiKey } = params;

  const prompt = `Um estudante de Forex errou as seguintes questões no quiz de fundamentos:

${respostasErradas.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Por favor:
1. Explique por que cada resposta estava errada
2. Forneça a explicação correta para cada conceito
3. Reforce os fundamentos de gestão de risco
4. Encoraje o estudante a revisar o material

Seja claro, didático e empático.`;

  return callClaudeAPI(apiKey, prompt);
}
