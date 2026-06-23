<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGeoStore } from '~/stores/geo'
import LoadingSequence from '~/components/LoadingSequence.vue'
import ReportHeader from '~/components/ReportHeader.vue'
import BrandOverview from '~/components/BrandOverview.vue'
import TrendCharts from '~/components/TrendCharts.vue'
import DashboardCharts from '~/components/DashboardCharts.vue'
import DiagnosticCards from '~/components/DiagnosticCards.vue'
import AdvancedInsights from '~/components/AdvancedInsights.vue'
import SimulatedChat from '~/components/SimulatedChat.vue'
import ActionRoadmap from '~/components/ActionRoadmap.vue'
import DisclaimerFooter from '~/components/DisclaimerFooter.vue'

const router = useRouter()
const store = useGeoStore()
const { isGenerating, reportData, formData } = storeToRefs(store)

const isUnlocked = ref(false)

const handleUnlocked = () => {
  isUnlocked.value = true
}

onMounted(() => {
  if (!formData.value.brandOrUrl) {
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

        <!-- 第 2 层：核心数据看板 (FREE) -->
        <transition name="slide-up">
          <BrandOverview v-if="reportData.overview" :overview="reportData.overview" />
        </transition>

        <transition name="slide-up">
          <TrendCharts 
            v-if="reportData.trends" 
            :trends="reportData.trends"
            :wordCloud="reportData.wordCloud"
            :treemap="reportData.treemap"
          />
        </transition>
        
        <transition name="slide-up">
          <div v-if="reportData.trends" class="mt-8 flex justify-center">
            <button @click="router.push('/distribution')" class="group relative px-8 py-4 bg-surface border border-accent/50 rounded-2xl overflow-hidden hover:border-accent transition-all shadow-glow shadow-accent/20 hover:shadow-accent/40">
              <div class="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite]"></div>
              <div class="relative flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                <span class="font-display font-bold text-white tracking-wide">检测到核心提及率下降：点击启动 PR 节点语料注入</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </div>
            </button>
          </div>
        </transition>
        
        <transition name="slide-up">
          <DashboardCharts 
            v-if="reportData.engineScores"
            :engineScores="reportData.engineScores" 
            :competitorComparison="reportData.competitorComparison"
            :myBrandUrl="formData.brandOrUrl"
            :competitorUrl="formData.competitors[0]"
          />
        </transition>

        <!-- 第 3 层：用户意图洞察 (FREE) -->
        <transition name="slide-up">
          <SimulatedChat v-if="reportData.simulatedQnAs" :simulatedQnAs="reportData.simulatedQnAs" />
        </transition>

        <!-- Skeleton for Simulated Chat -->
        <div v-if="isGenerating && reportData.engineScores && !reportData.simulatedQnAs" class="mt-16 animate-pulse">
          <div class="flex items-center gap-3 mb-8">
            <div class="w-8 h-8 rounded-lg bg-surface border border-border"></div>
            <div class="h-8 w-48 bg-surface border border-border rounded-lg"></div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="h-[280px] bg-surface border border-border rounded-2xl"></div>
            <div class="h-[280px] bg-surface border border-border rounded-2xl"></div>
          </div>
        </div>

        <!-- GATED SECTION (Lock Wall) -->
        <div class="relative mt-24">
          <ActionRoadmap v-if="reportData.actionPlan" :actionPlan="reportData.actionPlan" :isUnlocked="isUnlocked" @unlocked="handleUnlocked" />

          <!-- Skeleton for Action Roadmap -->
          <div v-if="isGenerating && reportData.simulatedQnAs && !reportData.actionPlan" class="animate-pulse">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-8 h-8 rounded-lg bg-surface border border-border"></div>
              <div class="h-8 w-48 bg-surface border border-border rounded-lg"></div>
            </div>
            <div class="space-y-4">
              <div class="h-20 bg-surface border border-border rounded-2xl"></div>
              <div class="h-20 bg-surface border border-border rounded-2xl"></div>
              <div class="h-20 bg-surface border border-border rounded-2xl"></div>
            </div>
          </div>
          
          <!-- Locked Content (Blurred) -->
          <div :class="{ 'opacity-20 pointer-events-none filter blur-sm': !isUnlocked }" class="transition-all duration-500">
            <!-- 第 4 层：深度归因分析 -->
            <transition name="slide-up">
              <DiagnosticCards v-if="reportData.diagnostics" :diagnostics="reportData.diagnostics" class="mt-24" />
            </transition>

            <!-- Skeleton for Diagnostics -->
            <div v-if="isGenerating && reportData.actionPlan && !reportData.diagnostics" class="mt-24 animate-pulse">
              <div class="flex items-center gap-3 mb-8">
                <div class="w-8 h-8 rounded-lg bg-surface border border-border"></div>
                <div class="h-8 w-48 bg-surface border border-border rounded-lg"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="h-48 bg-surface border border-border rounded-2xl"></div>
                <div class="h-48 bg-surface border border-border rounded-2xl"></div>
                <div class="h-48 bg-surface border border-border rounded-2xl"></div>
              </div>
            </div>
            
            <!-- 第 5 层：内容缺口与AI建议 -->
            <transition name="slide-up">
              <AdvancedInsights 
                v-if="reportData.contentGaps"
                :contentGaps="reportData.contentGaps"
                :faqSuggestions="reportData.faqSuggestions"
                :caseStudySuggestions="reportData.caseStudySuggestions"
              />
            </transition>

            <!-- Skeleton for Advanced Insights -->
            <div v-if="isGenerating && reportData.diagnostics && !reportData.contentGaps" class="mt-24 animate-pulse">
              <div class="flex items-center gap-3 mb-8">
                <div class="w-8 h-8 rounded-lg bg-surface border border-border"></div>
                <div class="h-8 w-48 bg-surface border border-border rounded-lg"></div>
              </div>
              <div class="h-[400px] bg-surface border border-border rounded-3xl"></div>
            </div>
          </div>
        </div>
        
        <!-- 底部免责声明 -->
        <DisclaimerFooter />

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

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>