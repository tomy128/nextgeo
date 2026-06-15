import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WorkspaceState, ContentTask, SoVDataPoint, DistributionChannel } from '~/types/workspace'

export const useWorkspaceStore = defineStore('workspace', () => {
  const isLoading = ref(false)
  
  // Mock SoV Data (Trend going up to show value)
  const sovHistory = ref<SoVDataPoint[]>([
    { date: 'Mon', deepseek: 12, doubao: 8, kimi: 15, average: 11.6 },
    { date: 'Tue', deepseek: 15, doubao: 12, kimi: 18, average: 15.0 },
    { date: 'Wed', deepseek: 25, doubao: 20, kimi: 30, average: 25.0 },
    { date: 'Thu', deepseek: 45, doubao: 35, kimi: 40, average: 40.0 },
    { date: 'Fri', deepseek: 55, doubao: 50, kimi: 60, average: 55.0 },
    { date: 'Sat', deepseek: 68, doubao: 65, kimi: 70, average: 67.6 },
    { date: 'Sun', deepseek: 75, doubao: 80, kimi: 85, average: 80.0 },
  ])

  const contentTasks = ref<ContentTask[]>([])

  const channels = ref<DistributionChannel[]>([
    { id: '1', name: '知乎', icon: 'Zhihu', weight: 'High', status: 'connected', audience: '高质量专业问答' },
    { id: '2', name: '百家号', icon: 'Baidu', weight: 'High', status: 'disconnected', audience: '百度系 AI 抓取源' },
    { id: '3', name: '搜狐号', icon: 'Sohu', weight: 'Medium', status: 'disconnected', audience: '高权重媒体平台' },
    { id: '4', name: '微信公众号', icon: 'Wechat', weight: 'High', status: 'disconnected', audience: '腾讯元宝核心信源' },
  ])

  // Import tasks from the diagnostic report
  const importTasksFromReport = (tasksFromReport: any[]) => {
    if (contentTasks.value.length > 0) return // Already imported
    
    contentTasks.value = tasksFromReport.map((t, index) => ({
      id: `task-${Date.now()}-${index}`,
      title: t.title,
      type: 'article',
      status: 'pending',
      priority: t.priority,
      reason: t.reason,
      createdAt: new Date().toISOString()
    }))
  }

  return {
    isLoading,
    sovHistory,
    contentTasks,
    channels,
    importTasksFromReport
  }
})
