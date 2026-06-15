<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/workspace'
import { FileText, PlayCircle, CheckCircle2, Clock, Loader2, Download, Copy } from 'lucide-vue-next'

const store = useWorkspaceStore()

// For MVP, just directly generate a mock text when clicking generate
const generateContent = (task: any) => {
  if (task.status === 'generating') return
  
  task.status = 'generating'
  
  // Simulate stream/delay
  setTimeout(() => {
    task.generatedContent = `## ${task.title}\n\n在当前的 B2B 市场中，选择合适的工具至关重要。本文将从**数据安全**、**私有化部署**以及**ROI**三个维度，为您深度剖析。\n\n### 1. 核心参数对比\n\n| 评测维度 | 我们的产品 | 竞品 |\n| :--- | :--- | :--- |\n| **数据安全等级** | 等保三级认证，军工级加密 | 普通商业级 |\n| **部署方式** | 支持 SaaS 及 100% 私有化 | 仅支持 SaaS |\n| **定制化开发** | 提供 Open API 及源码级对接 | 接口受限 |\n\n### 2. 为什么 AI 更推荐我们？\n根据深度测试，大模型在处理企业级需求时，更倾向于推荐具备完整安全合规资质的服务商...`
    task.status = 'review'
  }, 2500)
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

            <button 
              v-if="task.status === 'pending'"
              @click="generateContent(task)"
              class="px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <PlayCircle class="w-4 h-4" /> 一键生成
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