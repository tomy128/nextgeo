<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGeoStore } from '~/stores/geo'
import LoadingSequence from '~/components/LoadingSequence.vue'
import ReportHeader from '~/components/ReportHeader.vue'
import DashboardCharts from '~/components/DashboardCharts.vue'
import DiagnosticCards from '~/components/DiagnosticCards.vue'
import AdvancedInsights from '~/components/AdvancedInsights.vue'
import SimulatedChat from '~/components/SimulatedChat.vue'
import ActionRoadmap from '~/components/ActionRoadmap.vue'

const router = useRouter()
const store = useGeoStore()
const { isGenerating, reportData, formData } = storeToRefs(store)

const isUnlocked = ref(false)

const handleUnlocked = () => {
  isUnlocked.value = true
}

onMounted(() => {
  if (!formData.value.url) {
    router.push('/')
    return
  }
  
  if (!reportData.value) {
    store.generateReport()
  }
})
</script>

<template>
  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto selection:bg-accent selection:text-white relative">
    <ClientOnly>
      <!-- We render the loading sequence overlay if we are still generating AND we don't have enough data to show the first section yet -->
      <transition name="fade" mode="out-in">
        <LoadingSequence v-if="isGenerating && !reportData?.summary" />
      </transition>
      
      <!-- We start rendering the report immediately as soon as we have summary data -->
      <div v-if="reportData?.summary" class="pb-32 transition-all duration-700">
        
        <!-- Small floating progress indicator when partial report is visible -->
        <div v-if="isGenerating" class="fixed top-4 right-4 bg-surface/90 backdrop-blur border border-accent/30 rounded-full px-4 py-2 flex items-center gap-3 z-50 shadow-glow shadow-accent/20">
          <div class="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
          <span class="text-sm text-accent font-medium">{{ store.stepMessage }}</span>
        </div>

        <!-- 第 1 层：顶通定调 (Requires scoring step) -->
        <transition name="slide-up">
          <ReportHeader v-if="reportData.summary" :summary="reportData.summary" />
        </transition>
        
        <!-- 第 2 层：数据对比 (Requires scoring step) -->
        <transition name="slide-up">
          <DashboardCharts 
            v-if="reportData.engineScores"
            :engineScores="reportData.engineScores" 
            :competitorComparison="reportData.competitorComparison"
            :myBrandUrl="formData.url"
            :competitorUrl="formData.competitor"
          />
        </transition>

        <!-- Skeleton for Diagnostics / Content Gaps -->
        <div v-if="isGenerating && !reportData.diagnostics" class="mt-24 space-y-6 animate-pulse">
           <div class="h-8 w-64 bg-surface border border-border rounded-lg mx-auto mb-12"></div>
           <div class="flex gap-6 overflow-hidden">
             <div class="h-64 w-80 shrink-0 bg-surface border border-border rounded-2xl"></div>
             <div class="h-64 w-80 shrink-0 bg-surface border border-border rounded-2xl"></div>
             <div class="h-64 w-80 shrink-0 bg-surface border border-border rounded-2xl"></div>
           </div>
        </div>
        
        <!-- 第 3 层：归因分析 (Requires diagnostics step) -->
        <transition name="slide-up">
          <DiagnosticCards v-if="reportData.diagnostics" :diagnostics="reportData.diagnostics" />
        </transition>
        
        <!-- P1 阶段：内容缺口与AI建议 (Requires diagnostics step) -->
        <transition name="slide-up">
          <AdvancedInsights 
            v-if="reportData.contentGaps"
            :contentGaps="reportData.contentGaps"
            :faqSuggestions="reportData.faqSuggestions"
            :caseStudySuggestions="reportData.caseStudySuggestions"
          />
        </transition>

        <!-- Skeleton for Simulated Chat & Action Plan -->
        <div v-if="isGenerating && reportData.diagnostics && !reportData.simulatedQnAs" class="mt-24 space-y-6 animate-pulse">
           <div class="h-8 w-64 bg-surface border border-border rounded-lg mx-auto mb-12"></div>
           <div class="max-w-4xl mx-auto space-y-4">
             <div class="h-20 w-full bg-surface border border-border rounded-2xl"></div>
             <div class="h-20 w-full bg-surface border border-border rounded-2xl"></div>
           </div>
        </div>
        
        <!-- 第 4 层：模拟真实回答 (Requires action step) -->
        <transition name="slide-up">
          <SimulatedChat v-if="reportData.simulatedQnAs" :simulatedQnAs="reportData.simulatedQnAs" />
        </transition>
        
        <!-- 第 5 层：行动计划与转化 (Requires action step) -->
        <transition name="slide-up">
          <ActionRoadmap v-if="reportData.actionPlan" :actionPlan="reportData.actionPlan" @unlocked="handleUnlocked" />
        </transition>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
</style>