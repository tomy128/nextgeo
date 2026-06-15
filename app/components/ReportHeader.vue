<script setup lang="ts">
import { computed, ref } from 'vue'
import { Info } from 'lucide-vue-next'

const props = defineProps<{
  summary: {
    score: number
    status: 'invisible' | 'weak' | 'strong'
    reasons: string[]
  }
}>()

const statusConfig = {
  invisible: { text: '隐形状态', color: 'text-danger', glowColor: 'bg-danger' },
  weak: { text: '弱势状态', color: 'text-warning', glowColor: 'bg-warning' },
  strong: { text: '强势状态', color: 'text-success', glowColor: 'bg-success' }
}

const currentStatus = computed(() => statusConfig[props.summary.status])

const scoreColor = computed(() => {
  if (props.summary.score < 50) return 'text-danger'
  if (props.summary.score < 80) return 'text-warning'
  return 'text-success'
})

const showTooltip = ref(false)
</script>

<template>
  <div class="text-center space-y-12 py-16 relative">
    
    <!-- Decorative background glow for score -->
    <div 
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none transition-colors duration-1000"
      :class="currentStatus.glowColor"
    ></div>

    <div class="space-y-6 relative z-10" v-motion-slide-visible-bottom>
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface text-muted font-mono text-xs uppercase tracking-widest backdrop-blur-md relative group">
        AI 搜索可见度 (GEO Score)
        <div class="relative flex items-center justify-center cursor-help">
          <Info class="w-3.5 h-3.5 text-muted group-hover:text-white transition-colors" />
          
          <div 
            class="absolute top-full mt-3 left-1/2 -translate-x-1/2 w-72 p-4 rounded-xl bg-[#0B0F19]/95 backdrop-blur-xl border border-border text-left text-gray-300 font-sans text-xs normal-case shadow-2xl z-[100] leading-relaxed opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none"
          >
            <!-- 向上箭头 -->
            <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0B0F19]/95 border-t border-l border-border transform rotate-45"></div>
            
            <div class="relative z-10">
              <p class="font-bold text-white mb-2 font-display text-sm">评分计算说明</p>
              <p class="mb-2"><strong>GEO Score:</strong> 综合加权计算得出。<br/>(品牌提及率 30% + 情感正向度 30% + 核心卖点穿透率 40%)</p>
              <p class="mb-2"><strong>各引擎推荐率:</strong> 基于深度模型对官网公开信息的丰富度、行业可见度及各大引擎特征偏好模拟推演生成。</p>
              <p class="text-warning opacity-90"><strong class="font-medium text-white">请注意:</strong> 大语言模型存在合理的误差范围，且不同模型偏好不同，推荐率结果仅供作为优化依据和参考。</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex items-baseline justify-center">
        <div class="font-display text-[8rem] md:text-[12rem] leading-[0.8] font-black tracking-tighter" :class="scoreColor">
          {{ summary.score }}
        </div>
        <div class="font-display text-4xl md:text-6xl font-bold text-muted/30 ml-2 mb-8">/100</div>
      </div>
    </div>

    <h1 class="font-sans text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-4xl mx-auto relative z-10" v-motion-slide-visible-bottom :delay="100">
      您的产品在 AI 搜索中处于
      <span :class="currentStatus.color" class="inline-block">{{ currentStatus.text }}。</span>
    </h1>
    
    <div class="pt-8 flex flex-wrap justify-center gap-4 relative z-10" v-motion-slide-visible-bottom :delay="200">
      <div class="w-full text-sm font-mono text-muted mb-2 uppercase tracking-widest">主要原因</div>
      <div 
        v-for="(reason, index) in summary.reasons" 
        :key="index"
        class="px-5 py-2.5 rounded-xl bg-surface border border-border text-white text-sm font-sans font-medium shadow-sm flex items-center gap-2"
      >
        <span class="w-1.5 h-1.5 rounded-full" :class="scoreColor"></span>
        {{ reason }}
      </div>
    </div>
  </div>
</template>