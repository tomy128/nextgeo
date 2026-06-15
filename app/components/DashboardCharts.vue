<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { Info } from 'lucide-vue-next'
import type { GeoReportData } from '~/types/geo'

const props = defineProps<{
  engineScores: GeoReportData['engineScores']
  competitorComparison: GeoReportData['competitorComparison']
  myBrandUrl: string
  competitorUrl: string
}>()

const radarChartRef = ref<HTMLElement | null>(null)
let radarChart: echarts.ECharts | null = null

const metricTooltips: Record<string, string> = {
  '品牌提及率': '大模型在回答相关品类问题时，主动提及您品牌的频率。',
  '情感正向度': '大模型对您品牌的评价倾向（如优势描述、推荐程度）。',
  '信息准确性': '大模型掌握的关于您品牌的功能、定价等信息是否与官网一致。',
  '核心卖点穿透率': '您的核心差异化优势（如AI驱动、高性价比）被大模型吸收和表达的程度。'
}

onMounted(() => {
  if (radarChartRef.value) {
    radarChart = echarts.init(radarChartRef.value)
    radarChart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(11, 15, 25, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        textStyle: { color: '#F3F4F6', fontFamily: 'Plus Jakarta Sans' },
        backdropFilter: 'blur(10px)'
      },
      legend: {
        data: props.competitorUrl ? [props.competitorComparison.brandName || 'Target Brand', props.competitorComparison.competitorName || 'Competitor'] : [props.competitorComparison.brandName || 'Target Brand'],
        bottom: 0,
        textStyle: { color: '#9CA3AF', fontFamily: 'Plus Jakarta Sans', fontSize: 12 },
        icon: 'circle',
        itemGap: 24
      },
      radar: {
        indicator: props.competitorComparison.labels.map((label: string) => ({ name: label, max: 100 })),
        splitNumber: 4,
        axisName: { color: '#D1D5DB', fontFamily: 'Space Grotesk', fontSize: 13, fontWeight: 500 },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)', type: 'dashed' } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } }
      },
      series: [
        {
          name: 'Analysis',
          type: 'radar',
          data: props.competitorUrl ? [
            {
              value: props.competitorComparison.myBrand,
              name: props.competitorComparison.brandName || 'Target Brand',
              itemStyle: { color: '#60A5FA' },
              lineStyle: { color: '#60A5FA', width: 2 },
              areaStyle: { color: 'rgba(96, 165, 250, 0.2)' },
              symbol: 'circle',
              symbolSize: 6
            },
            {
              value: props.competitorComparison.competitor,
              name: props.competitorComparison.competitorName || 'Competitor',
              itemStyle: { color: '#9CA3AF' },
              lineStyle: { color: '#9CA3AF', width: 2, type: 'dashed' },
              areaStyle: { color: 'rgba(156, 163, 175, 0.1)' },
              symbol: 'circle',
              symbolSize: 6
            }
          ] : [
            {
              value: props.competitorComparison.myBrand,
              name: props.competitorComparison.brandName || 'Target Brand',
              itemStyle: { color: '#60A5FA' },
              lineStyle: { color: '#60A5FA', width: 2 },
              areaStyle: { color: 'rgba(96, 165, 250, 0.2)' },
              symbol: 'circle',
              symbolSize: 6
            }
          ]
        }
      ]
    })
  }

  window.addEventListener('resize', () => {
    radarChart?.resize()
  })
})
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 py-8">
    
    <!-- Engine Breakdown -->
    <div class="glass-card rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden group h-full">
      <div class="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] group-hover:bg-accent/10 transition-colors duration-700"></div>
      
      <div class="flex items-center gap-3 mb-10 relative z-10">
        <div class="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-accent flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h3 class="font-display text-2xl font-bold tracking-tight">各引擎推荐率</h3>
      </div>

      <div class="space-y-8 relative z-10 flex-grow">
        <div v-for="(score, engine) in engineScores" :key="engine" class="flex flex-col gap-2">
          <div class="flex justify-between items-end">
            <div class="font-sans text-muted font-medium capitalize">{{ engine }}</div>
            <div class="font-display font-bold text-xl" :class="score < 50 ? 'text-danger' : 'text-white'">
              {{ score }}%
            </div>
          </div>
          <div class="w-full h-2 rounded-full bg-surface border border-border overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-1000 ease-out" 
              :class="score < 50 ? 'bg-danger/80' : score < 80 ? 'bg-warning/80' : 'bg-success/80'"
              :style="`width: ${score}%`"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Competitor Radar -->
    <div class="glass-card rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden group h-full">
      <div class="absolute top-0 left-0 w-64 h-64 bg-purple/5 rounded-full blur-[80px] group-hover:bg-purple/10 transition-colors duration-700"></div>

      <div class="flex items-center gap-3 mb-10 relative z-10">
        <div class="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-purple flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        </div>
        <h3 class="font-display text-2xl font-bold tracking-tight">{{ competitorUrl ? '竞品画像对比' : '品牌画像分析' }}</h3>
      </div>

      <div class="relative w-full h-[320px] z-10 flex items-center justify-center flex-grow">
        <div ref="radarChartRef" class="w-full h-full max-w-[320px] lg:max-w-none"></div>
      </div>

      <!-- 补充维度数据：如果存在竞品则显示条形对比 -->
      <div v-if="competitorUrl" class="mt-8 space-y-5 relative z-10 pt-6 border-t border-border/50">
        <h4 class="font-sans text-sm font-semibold text-gray-300 mb-4">核心指标对比详情</h4>
        <div v-for="(label, idx) in competitorComparison.labels" :key="label" class="space-y-3">
          <div class="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-muted relative group/tooltip">
            <span>{{ label }}</span>
            <Info class="w-3 h-3 text-muted/60 cursor-help hover:text-white transition-colors" />
            <div class="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-lg bg-[#0B0F19]/95 backdrop-blur-xl border border-border text-gray-300 font-sans normal-case shadow-xl z-50 leading-relaxed opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 pointer-events-none text-[11px]">
              {{ metricTooltips[label] || '大模型对该指标的评估得分。' }}
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- 品牌本身 -->
            <div class="flex-grow h-1.5 rounded-full bg-surface border border-border overflow-hidden relative">
              <div 
                class="absolute left-0 top-0 h-full bg-accent/80 rounded-full transition-all duration-1000 ease-out"
                :style="`width: ${competitorComparison.myBrand[idx]}%`"
              ></div>
            </div>
            <span class="text-xs font-mono text-accent w-8 text-right">{{ competitorComparison.myBrand[idx] }}</span>
          </div>
          <div class="flex items-center gap-3">
            <!-- 竞品 -->
            <div class="flex-grow h-1.5 rounded-full bg-surface border border-border overflow-hidden relative">
              <div 
                class="absolute left-0 top-0 h-full bg-muted/60 rounded-full transition-all duration-1000 ease-out"
                :style="`width: ${competitorComparison.competitor[idx]}%`"
              ></div>
            </div>
            <span class="text-xs font-mono text-muted w-8 text-right">{{ competitorComparison.competitor[idx] }}</span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>