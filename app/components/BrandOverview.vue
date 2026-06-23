<script setup lang="ts">
import { TrendingUp, Award, Smile, Frown } from 'lucide-vue-next'

defineProps<{
  overview: {
    mentionRate: number
    topPositionRate: number
    positiveSentiment: number
    negativeSentiment: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-accent/50 transition-colors">
      <div class="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
      <div class="flex items-center gap-3 mb-4 text-slate-400">
        <TrendingUp class="w-5 h-5 text-accent" />
        <h3 class="text-sm font-medium">综合提及率</h3>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-3xl font-display font-bold text-white">{{ overview.mentionRate }}</span>
        <span class="text-slate-500">%</span>
      </div>
      <p class="text-xs text-slate-500 mt-2">在各大模型中的平均曝光概率</p>
    </div>

    <div class="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-purple/50 transition-colors">
      <div class="absolute top-0 right-0 w-24 h-24 bg-purple/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
      <div class="flex items-center gap-3 mb-4 text-slate-400">
        <Award class="w-5 h-5 text-purple" />
        <h3 class="text-sm font-medium">首位提及率</h3>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-3xl font-display font-bold text-white">{{ overview.topPositionRate }}</span>
        <span class="text-slate-500">%</span>
      </div>
      <p class="text-xs text-slate-500 mt-2">被模型作为首选推荐的概率</p>
    </div>

    <div class="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-success/50 transition-colors">
      <div class="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
      <div class="flex items-center gap-3 mb-4 text-slate-400">
        <Smile class="w-5 h-5 text-success" />
        <h3 class="text-sm font-medium">正面情绪占比</h3>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-3xl font-display font-bold text-white">{{ overview.positiveSentiment }}</span>
        <span class="text-slate-500">%</span>
      </div>
      <p class="text-xs text-slate-500 mt-2">AI 对品牌的正面评价比例</p>
    </div>

    <div class="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-danger/50 transition-colors">
      <div class="absolute top-0 right-0 w-24 h-24 bg-danger/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
      <div class="flex items-center gap-3 mb-4 text-slate-400">
        <Frown class="w-5 h-5 text-danger" />
        <h3 class="text-sm font-medium">负面情绪占比</h3>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-3xl font-display font-bold text-white">{{ overview?.negativeSentiment || 0 }}</span>
        <span class="text-slate-500">%</span>
      </div>
      <p class="text-xs text-slate-500 mt-2">AI 提及品牌时的负面倾向</p>
    </div>
  </div>
  
  <div class="text-xs text-slate-500 text-right mb-6 -mt-2">
    * 注意：正面与负面情绪占比之和未达100%，是因为模型中存在大量客观、中立的情感描述。
  </div>
</template>