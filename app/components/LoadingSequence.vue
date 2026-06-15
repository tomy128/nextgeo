<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { Bot, Search, BrainCircuit, Activity, FileCheck, CheckCircle2 } from 'lucide-vue-next'
import { useGeoStore } from '~/stores/geo'
import { storeToRefs } from 'pinia'

const store = useGeoStore()
const { currentStep, stepMessage } = storeToRefs(store)

const steps = [
  { id: 'scraping', icon: Search, label: '官网全量语料抓取' },
  { id: 'scoring_start', icon: Activity, label: '大模型综合可见度打分' },
  { id: 'diagnostics_start', icon: BrainCircuit, label: '多维度归因与内容缺口分析' },
  { id: 'action_start', icon: FileCheck, label: '模拟 AI 问答与生成处方' }
]

const currentStepIndex = computed(() => {
  const index = steps.findIndex(s => s.id === currentStep.value)
  return index === -1 ? 0 : index
})
</script>

<template>
  <div class="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
    <div class="bg-surface border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
      <!-- Background Glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-accent/20 blur-3xl rounded-full pointer-events-none"></div>

      <div class="text-center mb-8 relative">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-4">
          <Bot class="w-8 h-8 animate-pulse" />
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">GEO Agent 诊断中</h2>
        <p class="text-slate-400 text-sm h-5 transition-all duration-300">{{ stepMessage }}</p>
      </div>

      <div class="space-y-6 relative">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          class="flex items-center gap-4 transition-all duration-500"
          :class="{
            'opacity-100': index <= currentStepIndex,
            'opacity-40': index > currentStepIndex
          }"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300"
            :class="{
              'bg-accent border-accent text-white': index < currentStepIndex,
              'bg-accent/20 border-accent text-accent animate-pulse': index === currentStepIndex,
              'bg-transparent border-slate-700 text-slate-500': index > currentStepIndex
            }"
          >
            <CheckCircle2 v-if="index < currentStepIndex" class="w-5 h-5" />
            <component :is="step.icon" v-else class="w-5 h-5" />
          </div>
          
          <div class="flex-1">
            <h4 
              class="font-medium transition-colors duration-300"
              :class="index <= currentStepIndex ? 'text-white' : 'text-slate-500'"
            >
              {{ step.label }}
            </h4>
            <div class="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                class="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                :style="{ width: index < currentStepIndex ? '100%' : (index === currentStepIndex ? '50%' : '0%') }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>