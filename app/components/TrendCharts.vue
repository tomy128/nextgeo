<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, TreemapChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import 'echarts-wordcloud' // Echarts wordcloud plugin

use([
  CanvasRenderer,
  LineChart,
  TreemapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const props = defineProps<{
  trends: {
    dates: string[]
    mentionData: Record<string, number[]>
  }
  wordCloud: { name: string; value: number }[]
  treemap: { name: string; value: number; children?: any[] }[]
}>()

// Line Chart: Mention Trends
const trendChartOption = computed(() => {
  const series = Object.entries(props.trends.mentionData).map(([name, data]) => ({
    name,
    type: 'line',
    smooth: true,
    showSymbol: false,
    lineStyle: { width: 3 },
    data
  }))

  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', backgroundColor: '#1E293B', textStyle: { color: '#fff' } },
    legend: { textStyle: { color: '#94A3B8' }, bottom: 0 },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.trends.dates,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#1E293B', type: 'dashed' } },
      axisLabel: { color: '#94A3B8' }
    },
    series
  }
})

// Treemap Chart: Share of Voice
const treemapOption = computed(() => {
  return {
    backgroundColor: 'transparent',
    tooltip: { formatter: '{b}: {c}' },
    series: [
      {
        type: 'treemap',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: { show: true, formatter: '{b}\n\n{c}%', fontSize: 14, fontWeight: 'bold' },
        itemStyle: {
          borderColor: '#0B0F19',
          borderWidth: 2,
          gapWidth: 2
        },
        data: props.treemap
      }
    ]
  }
})

// WordCloud Chart
const wordCloudOption = computed(() => {
  return {
    backgroundColor: 'transparent',
    tooltip: { show: true },
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        keepAspect: true,
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        sizeRange: [14, 40],
        rotationRange: [-45, 45],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          color: function () {
            // Random colors for word cloud
            const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F43F5E', '#F59E0B', '#F59E0B', '#64748B']
            return colors[Math.floor(Math.random() * colors.length)]
          }
        },
        data: props.wordCloud
      }
    ]
  }
})
</script>

<template>
  <div class="space-y-6 mb-12">
    <!-- Trend Line Chart -->
    <div class="glass-card rounded-3xl p-6 md:p-8">
      <div class="mb-6">
        <h3 class="text-xl font-bold text-white mb-2">全网大模型提及趋势 (Share of Voice)</h3>
        <p class="text-sm text-slate-400">追踪过去 7 天内，品牌与竞品在主流 AI 引擎中的曝光度变化。</p>
      </div>
      <div class="h-[300px] w-full">
        <ClientOnly>
          <VChart :option="trendChartOption" autoresize />
        </ClientOnly>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Treemap -->
      <div class="glass-card rounded-3xl p-6 md:p-8">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-white mb-2">行业声量分布</h3>
          <p class="text-sm text-slate-400">当前在行业核心关键词下的声量份额区块占比。</p>
        </div>
        <div class="h-[250px] w-full">
          <ClientOnly>
            <VChart :option="treemapOption" autoresize />
          </ClientOnly>
        </div>
      </div>

      <!-- Word Cloud -->
      <div class="glass-card rounded-3xl p-6 md:p-8">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-white mb-2">AI 关联意图词云</h3>
          <p class="text-sm text-slate-400">大模型在提及您的品牌时，最常关联的上下文意图。</p>
        </div>
        <div class="h-[250px] w-full">
          <ClientOnly>
            <VChart :option="wordCloudOption" autoresize />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>