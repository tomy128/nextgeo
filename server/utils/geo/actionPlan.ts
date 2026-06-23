import { askLLM } from './llm';

export interface ActionPlanResult {
  simulatedQnAs: Array<{
    question: string;
    answers: Array<{
      engine: string;
      content: string;
      mentioned: boolean;
    }>;
  }>;
  actionPlan: {
    tasks: Array<{
      priority: 'P0' | 'P1' | 'P2';
      title: string;
      reason: string;
    }>;
    prediction: {
      currentScore: number;
      projectedScore: number;
      increaseRate: string;
    };
  };
}

export async function generateActionPlan(
  brandOrUrl: string,
  keywords: string,
  websiteContent: string,
  scoringContext: any
): Promise<ActionPlanResult> {
  const currentScore = scoringContext.summary?.score || 40;
  
  const prompt = `
You are an expert AI Search Engine Evaluator (GEO Specialist).
Based on your internal knowledge base regarding this brand and the supplementary scraped content (if any), generate simulated AI search responses and an ACTIONABLE, REALISTIC GEO optimization roadmap.

Target Brand/URL: ${brandOrUrl}
Core Keywords: ${keywords}
Current GEO Score: ${currentScore}
Competitor Info from previous steps: ${JSON.stringify(scoringContext.competitorComparison || {})}

Supplementary Content (Optional):
"""
${websiteContent}
"""

**CRITICAL RULES**:
1. DO NOT invent global competitors. Only use the competitors provided in the Competitor Info.
2. The simulated Q&As must accurately reflect how a real LLM would respond based on the brand's visibility.
3. You MUST generate AT LEAST TWO different dimensions of simulated questions in the "simulatedQnAs" array (e.g., one asking for general best tools, and another asking for a direct comparison or specific use case).
4. The "tasks" array MUST contain dynamically generated, highly specific, and executable GEO optimization tasks.
5. The projectedScore must be mathematically reasonable (e.g., currentScore + 20 to 40 points).
6. Output everything in Simplified Chinese (简体中文).

Output STRICTLY in the following JSON format:

{
  "simulatedQnAs": [
    {
      "question": "<Realistic user query asking for best tools>",
      "answers": [
        {
          "engine": "<Engine name>",
          "content": "<Simulated response>",
          "mentioned": false
        },
        {
          "engine": "<Another engine name>",
          "content": "<Simulated response>",
          "mentioned": true
        }
      ]
    },
    {
      "question": "<Another realistic user query focusing on a DIFFERENT dimension (e.g., direct comparison, pricing, specific feature)>",
      "answers": [
        {
          "engine": "<Engine name>",
          "content": "<Simulated response>",
          "mentioned": true
        },
        {
          "engine": "<Another engine name>",
          "content": "<Simulated response>",
          "mentioned": false
        }
      ]
    }
  ],
  "actionPlan": {
    "tasks": [
      {
        "priority": "P0",
        "title": "<Specific, actionable content creation or technical optimization task>",
        "reason": "<Why this specific task directly impacts AI retrieval for this brand>"
      },
      {
        "priority": "P1",
        "title": "<Another specific task>",
        "reason": "<Reason>"
      }
    ],
    "prediction": {
      "currentScore": ${currentScore},
      "projectedScore": <number 75-95>,
      "increaseRate": "+<number>%"
    }
  }
}
`;

  return askLLM<ActionPlanResult>(prompt);
}