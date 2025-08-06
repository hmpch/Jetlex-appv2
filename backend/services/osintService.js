const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateOSINTReport(query, sources = ['openai'], options = {}) {
  const results = [];
  
  if (sources.includes('openai')) {
    try {
      const openaiResult = await generateOpenAIReport(query, options);
      results.push(openaiResult);
    } catch (error) {
      console.error('Error con OpenAI:', error);
      results.push({
        source: 'OpenAI',
        error: 'Error generando reporte',
        data: null
      });
    }
  }

  return results;
}

async function generateOpenAIReport(query, options = {}) {
  const prompt = `
Actúa como un investigador OSINT especializado en aviación civil y aeronáutica.

CONSULTA: "${query}"

Por favor, proporciona:
1. Análisis detallado del tema consultado
2. Fuentes relevantes y confiables
3. Implicaciones para la industria aeronáutica
4. Recomendaciones estratégicas
5. Alertas o aspectos críticos a considerar

Formato: Informe estructurado y profesional.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Eres un experto investigador OSINT especializado en aviación civil, regulaciones aeronáuticas y análisis estratégico del sector aéreo.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: options.maxTokens || 2000,
    temperature: 0.7
  });

  return {
    source: 'OpenAI GPT-4',
    timestamp: new Date().toISOString(),
    data: response.choices[0].message.content.trim(),
    usage: response.usage
  };
}

module.exports = {
  generateOSINTReport,
  generateOpenAIReport
};