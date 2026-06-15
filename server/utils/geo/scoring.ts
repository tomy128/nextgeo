import { askLLM } from './llm';

export interface ScoringResult {
  summary: {
    score: number;
    status: 'invisible' | 'weak' | 'strong';
    reasons: string[];
  };
  engineScores: {
    ChatGPT: number;
    Gemini: number;
    Claude: number;
    Perplexity: number;
    Doubao: number;
    Qwen: number;
    Kimi: number;
    Ernie: number;
  };
  competitorComparison: {
    brandName: string;
    competitorName?: string;
    labels: string[];
    myBrand: number[];
    competitor: number[];
  };
}

export async function generateScoring(
  url: string,
  keywords: string,
  competitorUrl: string,
  websiteContent: string
): Promise<ScoringResult> {
  const hasCompetitor = !!competitorUrl;
  const competitorPrompt = hasCompetitor 
    ? `and compare them SPECIFICALLY against the provided competitor URL.\nCompetitor URL: ${competitorUrl}\nDo NOT invent or introduce any other competitors (e.g., do not mention SurveyMonkey if it wasn't provided).`
    : `and provide a comprehensive brand profile analysis. Do not invent competitors.`;

  const competitorJsonStructure = hasCompetitor
    ? `"competitorComparison": {
  "brandName": "<Extract EXACT Brand Name from Company URL content>",
  "competitorName": "<Extract EXACT Competitor Brand Name from Competitor URL>",
  "labels": ["品牌提及率", "情感正向度", "信息准确性", "核心卖点穿透率"],
  "myBrand": [<number>, <number>, <number>, <number>],
  "competitor": [<number>, <number>, <number>, <number>]
},`
    : `"competitorComparison": {
  "brandName": "<Extract EXACT Brand Name from Company URL content>",
  "labels": ["品牌提及率", "情感正向度", "信息准确性", "核心卖点穿透率"],
  "myBrand": [<number>, <number>, <number>, <number>]
},`;

  const prompt = `
You are an expert AI Search Engine Evaluator (GEO Specialist).
Analyze the following B2B company based ONLY on their website content ${competitorPrompt}

Company URL: ${url}
Core Keywords: ${keywords}
Scraped Website Content:
"""
${websiteContent}
"""

Generate the top-level scoring for a GEO (Generative Engine Optimization) diagnostic report.

**CRITICAL Scoring Rules for Consistency**:
1. You MUST derive the "score" (GEO Score) deterministically based on the provided website content quality, industry presence implied by the content, and the keywords. 
2. If the website content is generic, score it around 30-40. If it has clear use cases, pricing, and comparisons, score it around 50-60.
3. The "score" must be calculated exactly as: (品牌提及率 * 0.3) + (情感正向度 * 0.3) + (核心卖点穿透率 * 0.4).
4. NEVER output a score drastically different for the same input text. Keep it strictly bound to the text's objective quality.
5. Provide ratings for ChatGPT, Gemini, Claude, Perplexity, Doubao, Qwen, Kimi, Ernie. These should hover around the main score (+/- 15 points based on the engine's known behavior, e.g., Perplexity favors citations).
6. ALL text outputs, especially the "reasons" array, MUST be in Simplified Chinese (简体中文). Do not output English reasons.

Output STRICTLY in the following JSON format:

{
  "summary": {
    "score": <calculated number 0-100>,
    "status": "<one of: 'invisible', 'weak', 'strong'>",
    "reasons": ["<short reason 1>", "<short reason 2>", "<short reason 3>"]
  },
  "engineScores": {
    "ChatGPT": <number 0-100>,
    "Gemini": <number 0-100>,
    "Claude": <number 0-100>,
    "Perplexity": <number 0-100>,
    "Doubao": <number 0-100>,
    "Qwen": <number 0-100>,
    "Kimi": <number 0-100>,
    "Ernie": <number 0-100>
  },
  ${competitorJsonStructure.slice(0, -1)}
}
`;

  return askLLM<ScoringResult>(prompt);
}