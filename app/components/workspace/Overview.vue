<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/workspace'
import { TrendingUp, Target, Activity } from 'lucide-vue-next'
import { computed } from 'vue'

const store = useWorkspaceStore()

// We'll use a simple CSS grid to mock a bar chart for now, avoiding heavy chart libs initially
const maxSoV = 100
const recentData = computed(() => store.sovHistory)
</script>

<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden">
        <div class="absolute right-0 top-0 w-24 h-24 bg-accent/5 rounded-bl-full pointer-events-none"></div>
        <div class="flex items-center gap-3 mb-4 text-slate-400">
          <TrendingUp class="w-5 h-5 text-accent" />
          <h3 class="font-medium">综合 Share of Voice</h3>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-display font-bold text-white">80.0%</span>
          <span class="text-sm font-medium text-success flex items-center">
            +12.4% <TrendingUp class="w-3 h-3 ml-1" />
          </span>
        </div>
        <p class="text-xs text-slate-500 mt-2">较上周对比</p>
      </div>

      <div class="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden">
        <div class="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
        <div class="flex items-center gap-3 mb-4 text-slate-400">
          <Target class="w-5 h-5 text-blue-400" />
          <h3 class="font-medium">核心词霸榜数</h3>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-display font-bold text-white">4</span>
          <span class="text-sm text-slate-400">/ 10 词</span>
        </div>
        <p class="text-xs text-slate-500 mt-2">目前稳定占据首屏推荐</p>
      </div>

      <div class="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden">
        <div class="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none"></div>
        <div class="flex items-center gap-3 mb-4 text-slate-400">
          <Activity class="w-5 h-5 text-purple-400" />
          <h3 class="font-medium">知识库健康度</h3>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-display font-bold text-white">优</span>
        </div>
        <div class="w-full bg-black/50 h-1.5 rounded-full mt-3 overflow-hidden">
          <div class="bg-purple-500 h-full rounded-full w-[85%]"></div>
        </div>
      </div>
    </div>

    <!-- Trend Chart Mock -->
    <div class="bg-surface border border-border rounded-2xl p-6">
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-lg font-bold text-white">AI 引擎推荐率趋势 (7天)</h3>
        <select class="bg-black/50 border border-border rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none">
          <option>全部引擎</option>
          <option>DeepSeek</option>
          <option>豆包</option>
          <option>Kimi</option>
        </select>
      </div>

      <!-- Simple CSS Bar Chart -->
      <div class="h-64 flex items-end gap-2 md:gap-6">
        <div 
          v-for="(point, idx) in recentData" 
          :key="idx"
          class="flex-1 flex flex-col items-center justify-end h-full group relative"
        >
          <!-- Tooltip -->
          <div class="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-border text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-10">
            {{ point.average.toFixed(1) }}%
          </div>
          <!-- Bar -->
          <div class="w-full max-w-[48px] bg-accent/20 hover:bg-accent/40 border border-accent/30 rounded-t-sm transition-all duration-500 ease-out relative overflow-hidden" :style="{ height: `${point.average}%` }">
            <div class="absolute top-0 left-0 right-0 h-1 bg-accent/50"></div>
          </div>
          <!-- Label -->
          <span class="text-xs text-slate-400 mt-3">{{ point.date }}</span>
        </div>
      </div>
    </div>

  </div>
</template>