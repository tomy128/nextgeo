<script setup lang="ts">
import { AlertCircle, HelpCircle, FileBarChart } from 'lucide-vue-next'
import type { GeoReportData } from '~/types/geo'

defineProps<{
  contentGaps: GeoReportData['contentGaps']
  faqSuggestions: GeoReportData['faqSuggestions']
  caseStudySuggestions: GeoReportData['caseStudySuggestions']
}>()
</script>

<template>
  <section class="mt-24" v-if="contentGaps?.length || faqSuggestions?.length || caseStudySuggestions?.length">
    <div class="mb-12 text-center">
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">内容缺口与 AI 偏好建议</h2>
      <p class="text-xl text-slate-400">大模型更倾向于引用具备特定结构和深度的语料，补齐这些内容可显著提升被推荐概率。</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">

      <!-- 内容缺口分析 -->
      <div v-if="contentGaps?.length" class="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>
        <div class="flex items-center gap-3 mb-6 relative">
          <div class="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle class="w-5 h-5" />
          </div>
          <h3 class="text-xl font-bold text-white">内容缺口</h3>
        </div>
        <ul class="space-y-6 relative">
          <li v-for="(gap, idx) in contentGaps" :key="idx">
            <h4 class="text-white font-medium mb-2">{{ gap.dimension }}</h4>
            <p class="text-sm text-slate-400">{{ gap.missingDescription }}</p>
          </li>
        </ul>
      </div>

      <!-- FAQ 建议 -->
      <div v-if="faqSuggestions?.length" class="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
        <div class="flex items-center gap-3 mb-6 relative">
          <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
            <HelpCircle class="w-5 h-5" />
          </div>
          <h3 class="text-xl font-bold text-white">FAQ 建议</h3>
        </div>
        <ul class="space-y-6 relative">
          <li v-for="(faq, idx) in faqSuggestions" :key="idx">
            <h4 class="text-white font-medium mb-2">{{ faq.question }}</h4>
            <div class="bg-black/30 rounded-md p-3 text-sm text-slate-300 border border-white/5">
              <span class="text-blue-400 font-medium block mb-1">AI 抓取焦点：</span>
              {{ faq.answerFocus }}
            </div>
          </li>
        </ul>
      </div>

      <!-- 案例建议 -->
      <div v-if="caseStudySuggestions?.length" class="bg-surface border border-border rounded-2xl p-8 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none"></div>
        <div class="flex items-center gap-3 mb-6 relative">
          <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
            <FileBarChart class="w-5 h-5" />
          </div>
          <h3 class="text-xl font-bold text-white">案例建议</h3>
        </div>
        <ul class="space-y-6 relative">
          <li v-for="(caseStudy, idx) in caseStudySuggestions" :key="idx">
            <h4 class="text-white font-medium mb-2">{{ caseStudy.type }}</h4>
            <p class="text-sm text-slate-400">{{ caseStudy.reason }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
