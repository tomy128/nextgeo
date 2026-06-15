<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/workspace'
import { Link2, Unlink, ExternalLink } from 'lucide-vue-next'

const store = useWorkspaceStore()
</script>

<template>
  <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white">权威分发矩阵</h2>
        <p class="text-sm text-slate-400 mt-1">绑定高权重自媒体与技术社区账号，一键将 AI 语料铺设至大模型核心信源。</p>
      </div>
      <button class="px-4 py-2 bg-surface hover:bg-white/5 border border-border text-white rounded-lg text-sm transition-colors">
        添加自定义渠道
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="channel in store.channels" 
        :key="channel.id"
        class="bg-surface border border-border rounded-xl p-6 flex flex-col"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <!-- Icon placeholder -->
            <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xl font-bold text-white">
              {{ channel.name.charAt(0) }}
            </div>
            <div>
              <h3 class="text-lg font-bold text-white flex items-center gap-2">
                {{ channel.name }}
                <span 
                  class="px-2 py-0.5 rounded text-[10px] font-mono border"
                  :class="channel.weight === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'"
                >权重: {{ channel.weight }}</span>
              </h3>
              <p class="text-xs text-slate-400 mt-1">目标受众: {{ channel.audience }}</p>
            </div>
          </div>
          
          <div 
            class="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border"
            :class="channel.status === 'connected' ? 'bg-success/10 text-success border-success/20' : 'bg-surface text-slate-400 border-border'"
          >
            <component :is="channel.status === 'connected' ? Link2 : Unlink" class="w-3.5 h-3.5" />
            {{ channel.status === 'connected' ? '已绑定' : '未绑定' }}
          </div>
        </div>

        <div class="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div class="text-xs text-slate-500">
            <span v-if="channel.status === 'connected'">已分发: 12 篇语料</span>
            <span v-else>请授权绑定账号以开启一键分发</span>
          </div>
          <button 
            class="text-sm font-medium transition-colors flex items-center gap-1.5"
            :class="channel.status === 'connected' ? 'text-accent hover:text-accent/80' : 'text-slate-300 hover:text-white'"
          >
            {{ channel.status === 'connected' ? '渠道设置' : '去绑定' }}
            <ExternalLink v-if="channel.status !== 'connected'" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>