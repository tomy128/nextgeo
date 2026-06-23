import { askLLM } from './llm';

export interface ScoringResult {
  overview: {
    mentionRate: number;
    topPositionRate: number;
    positiveSentiment: number;
    negativeSentiment: number;
  };
  trends: {
    dates: string[];
    mentionData: Record<string, number[]>;
  };
  wordCloud: {
    name: string;
    value: number;
  }[];
  treemap: {
    name: string;
    value: number;
    children?: { name: string; value: number }[];
  }[];
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
    competitorNames: string[];
    labels: string[];
    myBrand: number[];
    competitors: Record<string, number[]>;
  };
}

export async function generateScoring(
  brandOrUrl: string,
  keywords: string,
  competitors: string[],
  websiteContent: string
): Promise<ScoringResult> {
  const hasCompetitor = competitors && competitors.length > 0;
  const competitorPrompt = hasCompetitor 
    ? `and compare them SPECIFICALLY against the provided competitors: ${competitors.join(', ')}.\nDo NOT invent or introduce any other competitors.`
    : `and provide a comprehensive brand profile analysis. Do not invent competitors.`;

  const prompt = `
You are an expert AI Search Engine Evaluator (GEO Specialist).
Analyze the following B2B brand based on your internal knowledge base and the supplementary scraped content (if any) ${competitorPrompt}

Target Brand/URL: ${brandOrUrl}
Core Keywords: ${keywords}
Supplementary Content (Optional):
"""
${websiteContent}
"""

Generate the top-level scoring for a GEO (Generative Engine Optimization) diagnostic report.

**CRITICAL Scoring Rules for Consistency**:
1. You MUST derive the "score" (GEO Score) deterministically based on the brand's known industry presence and the supplementary content.
2. If the brand is largely unknown or generic, score it around 30-40. If it is well-known with clear use cases, score it around 60-80.
3. The "score" must be calculated exactly as: (品牌提及率 * 0.3) + (情感正向度 * 0.3) + (核心卖点穿透率 * 0.4).
4. NEVER output a score drastically different for the same input. Keep it strictly bound to objective quality.
5. ALL text outputs, especially the "reasons" array, MUST be in Simplified Chinese (简体中文). Do not output English reasons.
6. For sentiment, Positive + Negative MUST NOT equal 100. Leave room for Neutral sentiment (e.g., Positive: 60, Negative: 10, meaning Neutral is 30).
7. For "trends.mentionData", "treemap", and "competitorComparison.competitors", you MUST generate data for ALL provided competitors (if any).

Output STRICTLY in the following JSON format:

{
  "overview": {
    "mentionRate": <number 0-100>,
    "topPositionRate": <number 0-100>,
    "positiveSentiment": <number 0-100>,
    "negativeSentiment": <number 0-100>
  },
  "trends": {
    "dates": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
    "mentionData": {
      "<BrandName>": [<7 numbers>],
      "<Competitor1>": [<7 numbers>]
    }
  },
  "wordCloud": [
    { "name": "<keyword>", "value": <number> }
  ],
  "treemap": [
    {
      "name": "行业声量分布",
      "value": 100,
      "children": [
        { "name": "<BrandName>", "value": <number> }
      ]
    }
  ],
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
  "competitorComparison": {
    "brandName": "<Extract EXACT Brand Name>",
    "competitorNames": ["<Competitor1>", "<Competitor2>"],
    "labels": ["品牌提及率", "情感正向度", "信息准确性", "核心卖点穿透率"],
    "myBrand": [<number>, <number>, <number>, <number>],
    "competitors": {
      "<Competitor1>": [<number>, <number>, <number>, <number>]
    }
  }
}
`;

  return askLLM<ScoringResult>(prompt);
}