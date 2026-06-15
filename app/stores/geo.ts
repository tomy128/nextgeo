import { defineStore } from 'pinia'
import type { GeoReportData, FormData } from '~/types/geo'

export const useGeoStore = defineStore('geo', {
  state: () => ({
    formData: {
      url: '',
      keywords: '',
      competitor: ''
    } as FormData,
    isGenerating: false,
    currentStep: '',
    stepMessage: '',
    reportData: null as GeoReportData | null
  }),
  actions: {
    setFormData(data: FormData) {
      this.formData = data
    },
    async generateReport() {
      this.isGenerating = true
      this.reportData = null
      this.currentStep = 'scraping'
      this.stepMessage = '正在连接目标服务器...'
      
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: this.formData.url,
            keywords: this.formData.keywords,
            competitor: this.formData.competitor
          })
        })

        if (!response.body) throw new Error('ReadableStream not supported')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const parts = buffer.split('\n\n')
          buffer = parts.pop() || '' // keep the incomplete part in the buffer

          for (const part of parts) {
            if (part.startsWith('data: ')) {
              const dataStr = part.substring(6)
              try {
                const event = JSON.parse(dataStr)
                
                // Handle SSE events
                if (event.step.endsWith('_start') || event.step === 'scraping') {
                  this.currentStep = event.step
                  if (event.data?.message) {
                    this.stepMessage = event.data.message
                  }
                } else if (event.step === 'scoring') {
                  this.reportData = { ...this.reportData, ...event.data } as GeoReportData
                } else if (event.step === 'diagnostics') {
                  this.reportData = { ...this.reportData, ...event.data } as GeoReportData
                } else if (event.step === 'action') {
                  this.reportData = { ...this.reportData, ...event.data } as GeoReportData
                } else if (event.step === 'complete') {
                  this.isGenerating = false
                } else if (event.step === 'error') {
                  throw new Error(event.data.message)
                }
              } catch (e) {
                console.error('Error parsing SSE event:', e)
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to generate report:', error)
        // Fallback to mock data if API fails so the UI doesn't break
        this.reportData = {
          summary: {
            score: 42,
            status: 'invisible',
            reasons: ['缺少场景化内容', '无竞品对比', '第三方引用极低']
          },
          engineScores: {
            ChatGPT: 71,
            Gemini: 63,
            Claude: 59,
            Perplexity: 48
          },
          competitorComparison: {
            brandName: '目标品牌',
            competitorName: this.formData.competitor || '竞品',
            labels: ['提及率', '情感正向度', '信息准确性', '核心卖点穿透率'],
            myBrand: [20, 60, 40, 30],
            competitor: [80, 85, 90, 75]
          },
          diagnostics: [
            {
              id: '1',
              title: 'API 连接失败',
              description: '无法连接到大模型分析后端，当前展示为演示数据。',
              iconType: 'target'
            }
          ],
          contentGaps: [
            {
              dimension: '特定场景案例',
              missingDescription: '竞品拥有大量特定行业的实操案例，而我方网站仅有通用的功能介绍。'
            }
          ],
          faqSuggestions: [
            {
              question: '我方产品与主流方案的优劣势对比',
              answerFocus: 'AI 需要明确的、客观的参数对比表格来辅助推理。'
            }
          ],
          caseStudySuggestions: [
            {
              type: 'ROI提升案例',
              reason: 'B2B 采购意图搜索中，AI 会优先提取带有明确转化数据的内容。'
            }
          ],
          simulatedQnAs: [
            {
              question: `2024年最佳的 ${this.formData.keywords || '相关工具'} 推荐`,
              answers: [
                {
                  engine: 'ChatGPT',
                  content: '根据您的需求，我推荐 [竞品] 作为首选。\n\n[目标品牌] 目前信息较少，不建议作为企业级首选。',
                  mentioned: false
                }
              ]
            }
          ],
          actionPlan: {
            tasks: [
              {
                priority: 'P0',
                title: `新增《我们 vs ${this.formData.competitor || '竞品'}》对比文章`,
                reason: "比较型内容是 AI 最容易引用的格式，能直接抢占竞品搜索流量。"
              }
            ],
            prediction: {
              currentScore: 42,
              projectedScore: 82,
              increaseRate: "+40%"
            }
          }
        }
      } finally {
        this.isGenerating = false
      }
    }
  }
})