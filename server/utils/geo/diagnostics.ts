import { askLLM } from './llm';

export interface DiagnosticsResult {
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    iconType: string;
  }>;
  contentGaps: Array<{
    dimension: string;
    missingDescription: string;
  }>;
  faqSuggestions: Array<{
    question: string;
    answerFocus: string;
  }>;
  caseStudySuggestions: Array<{
    type: string;
    reason: string;
  }>;
}

export async function generateDiagnostics(
  url: string,
  keywords: string,
  websiteContent: string,
  scoringContext: any
): Promise<DiagnosticsResult> {
  const prompt = `
You are an expert AI Search Engine Evaluator (GEO Specialist).
Based ONLY on the following company website content and their initial GEO Score (${scoringContext.summary?.score}), provide a deep-dive diagnostic analysis.

Company URL: ${url}
Core Keywords: ${keywords}
Scraped Website Content:
"""
${websiteContent}
"""
Competitor Info from previous step: ${JSON.stringify(scoringContext.competitorComparison || {})}

Identify WHY AI models might ignore or downrank them, and what content gaps exist.

**CRITICAL RULES**:
1. DO NOT invent or mention competitors that are not explicitly part of the Competitor Info (e.g., if analyzing "问卷网" and "问卷星", do NOT mention "SurveyMonkey" or "Typeform").
2. Base all your gaps and suggestions STRICTLY on the actual provided website content. If the content is short, state that the lack of detailed content is the gap.
3. Be brutally honest but highly specific to the provided context.

Output STRICTLY in the following JSON format:

{
  "diagnostics": [
    {
      "id": "1",
      "title": "<Short diagnostic title, e.g. 定位模糊>",
      "description": "<Detailed explanation of why AI models ignore them>",
      "iconType": "target"
    },
    {
      "id": "2",
      "title": "<Title 2>",
      "description": "<Description 2>",
      "iconType": "scale"
    },
    {
      "id": "3",
      "title": "<Title 3>",
      "description": "<Description 3>",
      "iconType": "file-text"
    }
  ],
  "contentGaps": [
    {
      "dimension": "<e.g., '特定场景', '技术文档', '评测对比', '实施细节'>",
      "missingDescription": "<Detailed description of what the competitor has but the target brand is missing, leading to lower AI preference>"
    }
  ],
  "faqSuggestions": [
    {
      "question": "<A question highly likely to be asked by users via AI engines>",
      "answerFocus": "<What key points AI expects in the answer to reference this brand>"
    }
  ],
  "caseStudySuggestions": [
    {
      "type": "<e.g., '金融合规场景', 'ROI提升案例', '短周期交付案例'>",
      "reason": "<Why AI prefers this specific type of case study to answer complex queries>"
    }
  ]
}
`;

  return askLLM<DiagnosticsResult>(prompt);
}