export interface GeoReportData {
  overview: {
    mentionRate: number
    topPositionRate: number
    positiveSentiment: number
    negativeSentiment: number
  }
  trends: {
    dates: string[]
    mentionData: Record<string, number[]> // e.g., { 'MyBrand': [10, 20], 'Competitor1': [5, 15] }
  }
  wordCloud: {
    name: string
    value: number
  }[]
  treemap: {
    name: string
    value: number
    children?: { name: string; value: number }[]
  }[]
  summary: {
    score: number
    status: 'invisible' | 'weak' | 'strong'
    reasons: string[]
  }
  engineScores: Record<string, number>
  competitorComparison: {
    brandName: string
    competitorNames: string[]
    labels: string[]
    myBrand: number[]
    competitors: Record<string, number[]>
  }
  diagnostics: {
    id: string
    title: string
    description: string
    iconType: 'target' | 'scale' | 'file-text'
  }[]
  simulatedQnAs: {
    question: string
    answers: {
      engine: string
      content: string
      mentioned: boolean
    }[]
  }[]
  contentGaps: {
    dimension: string
    missingDescription: string
  }[]
  faqSuggestions: {
    question: string
    answerFocus: string
  }[]
  caseStudySuggestions: {
    type: string
    reason: string
  }[]
  actionPlan: {
    tasks: {
      priority: 'P0' | 'P1' | 'P2'
      title: string
      reason: string
    }[]
    prediction: {
      currentScore: number
      projectedScore: number
      increaseRate: string
    }
  }
}

export interface FormData {
  brandOrUrl: string;
  keywords: string;
  competitors: string[];
}