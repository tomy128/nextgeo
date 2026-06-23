<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/workspace'
import { useGeoStore } from '~/stores/geo'
import { FileText, PlayCircle, CheckCircle2, Clock, Loader2, Download, Copy, AlertCircle } from 'lucide-vue-next'

const store = useWorkspaceStore()
const geoStore = useGeoStore()

const generateContent = async (task: any) => {
  if (task.status === 'generating') return
  
  task.status = 'generating'
  task.error = null
  task.generatedContent = ''
  
  try {
    const leadIdCookie = useCookie('lead_id')
    if (!leadIdCookie.value) {
      throw new Error('未授权，请先解锁报告')
    }

    const response = await fetch('/api/generate-corpus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        leadId: leadIdCookie.value,
        websiteUrl: geoStore.formData.brandOrUrl || 'unknown',
        taskContext: {
          title: task.title,
          reason: task.reason
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.statusMessage || '生成失败')
    }

    // Handle Streaming Response
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    
    if (!reader) throw new Error('无法读取响应流')

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.text) {
              task.generatedContent += data.text
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }
    }
    
    task.status = 'review'
  } catch (err: any) {
    task.status = 'error'
    task.error = err.message
  }
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white">AI 语料工厂</h2>
        <p class="text-sm text-slate-400 mt-1">基于诊断报告动态生成的 EEAT 语料任务，点击即可一键生成。</p>
      </div>
    </div>

    <div v-if="store.contentTasks.length === 0" class="text-center py-20 bg-surface border border-border rounded-2xl">
      <FileText class="w-12 h-12 text-slate-600 mx-auto mb-4" />
      <p class="text-slate-400">暂无待处理的语料任务</p>
      <p class="text-sm text-slate-500 mt-1">请先在诊断报告中生成行动计划。</p>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div 
        v-for="task in store.contentTasks" 
        :key="task.id"
        class="bg-surface border border-border rounded-xl p-6 transition-all duration-300"
        :class="{ 'ring-1 ring-accent border-accent/50': task.status === 'review' }"
      >
        <!-- Task Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span 
                class="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono"
                :class="{
                  'bg-red-500/20 text-red-400': task.priority === 'P0',
                  'bg-yellow-500/20 text-yellow-400': task.priority === 'P1',
                  'bg-blue-500/20 text-blue-400': task.priority === 'P2'
                }"
              >{{ task.priority }}</span>
              <h3 class="text-lg font-bold text-white">{{ task.title }}</h3>
            </div>
            <p class="text-sm text-slate-400">{{ task.reason }}</p>
          </div>
          
          <div class="shrink-0 flex items-center gap-3">
            <div v-if="task.status === 'pending'" class="flex items-center text-slate-400 text-sm gap-1.5 mr-2">
              <Clock class="w-4 h-4" /> 待生成
            </div>
            <div v-else-if="task.status === 'generating'" class="flex items-center text-accent text-sm gap-1.5 mr-2">
              <Loader2 class="w-4 h-4 animate-spin" /> RAG 检索生成中...
            </div>
            <div v-else-if="task.status === 'review'" class="flex items-center text-success text-sm gap-1.5 mr-2">
              <CheckCircle2 class="w-4 h-4" /> 已生成待审核
            </div>
            <div v-else-if="task.status === 'error'" class="flex items-center text-danger text-sm gap-1.5 mr-2">
              <AlertCircle class="w-4 h-4" /> {{ task.error || '生成失败' }}
            </div>

            <button 
              v-if="task.status === 'pending' || task.status === 'error'"
              @click="generateContent(task)"
              class="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <PlayCircle class="w-4 h-4" /> {{ task.status === 'error' ? '重新生成' : '一键生成' }}
            </button>
          </div>
        </div>

        <!-- Generated Content Preview -->
        <div v-if="task.generatedContent" class="mt-6 pt-6 border-t border-border animate-in fade-in slide-in-from-top-2">
          <div class="bg-black/50 border border-border rounded-lg p-5">
            <div class="prose prose-invert max-w-none prose-sm">
              <div v-html="task.generatedContent.replace(/\n/g, '<br/>')"></div>
            </div>
          </div>
          
          <div class="flex items-center justify-end gap-3 mt-4">
            <button class="px-4 py-2 bg-surface hover:bg-white/5 border border-border text-white rounded-lg text-sm transition-colors flex items-center gap-2">
              <Copy class="w-4 h-4" /> 复制 Markdown
            </button>
            <button class="px-4 py-2 bg-surface hover:bg-white/5 border border-border text-white rounded-lg text-sm transition-colors flex items-center gap-2">
              <Download class="w-4 h-4" /> 下载文档
            </button>
            <button class="px-4 py-2 bg-success/20 hover:bg-success/30 border border-success/30 text-success rounded-lg text-sm transition-colors font-medium ml-2">
              推送到分发矩阵
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>