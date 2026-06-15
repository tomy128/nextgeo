export interface GeoReportData {
  summary: {
    score: number
    status: 'invisible' | 'weak' | 'strong'
    reasons: string[]
  }
  engineScores: Record<string, number>
  competitorComparison: {
    brandName: string
    competitorName?: string
    labels: string[]
    myBrand: number[]
    competitor: number[]
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
  url: string;
  keywords: string;
  competitor: string;
}