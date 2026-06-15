<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Terminal, ChevronDown, ChevronUp, MessageSquare, Bot } from 'lucide-vue-next'

const props = defineProps<{
  simulatedQnAs: {
    question: string
    answers: {
      engine: string
      content: string
      mentioned: boolean
    }[]
  }[]
}>()

const activeQuestionIndex = ref(0)
const activeEngine = ref<string | null>(null)

onMounted(() => {
  if (props.simulatedQnAs && props.simulatedQnAs.length > 0) {
    const firstQnA = props.simulatedQnAs[0]
    if (firstQnA && firstQnA.answers && firstQnA.answers.length > 0) {
      const firstAnswer = firstQnA.answers[0]
      if (firstAnswer) {
        activeEngine.value = firstAnswer.engine
      }
    }
  }
})

watch(activeQuestionIndex, (newIdx) => {
  const currentQnA = props.simulatedQnAs?.[newIdx]
  if (currentQnA && currentQnA.answers && currentQnA.answers.length > 0) {
    const firstAnswer = currentQnA.answers[0]
    if (firstAnswer) {
      activeEngine.value = firstAnswer.engine
    }
  } else {
    activeEngine.value = null
  }
})

const toggleEngine = (engine: string) => {
  if (activeEngine.value === engine) {
    activeEngine.value = null
  } else {
    activeEngine.value = engine
  }
}
</script>

<template>
  <div class="py-16 md:py-24">
    <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-xs uppercase tracking-widest mb-4">
          现实冲击
        </div>
        <h2 class="font-display text-4xl md:text-5xl font-black tracking-tight">AI 模拟提问结果</h2>
      </div>
      <p class="font-sans text-muted max-w-md text-sm md:text-base leading-relaxed">
        还原真实用户的多维度搜索场景。看看各大 AI 引擎在面对不同视角的提问时，是否会推荐您的产品。
      </p>
    </div>

    <!-- Question Tabs -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button 
        v-for="(qna, idx) in simulatedQnAs" 
        :key="idx"
        @click="activeQuestionIndex = idx"
        class="px-5 py-2.5 rounded-full text-sm font-sans font-medium transition-all duration-300 border"
        :class="activeQuestionIndex === idx 
          ? 'bg-accent text-white border-accent shadow-glow shadow-accent/20' 
          : 'bg-surface text-muted border-border hover:bg-surfaceHover hover:text-gray-300'"
      >
        维度 {{ idx + 1 }}
      </button>
    </div>

    <div class="glass-card rounded-3xl overflow-hidden shadow-glow shadow-accent/5">
      <!-- Query Header -->
      <div class="p-6 md:p-8 border-b border-border bg-surfaceHover flex items-start gap-4">
        <div class="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
          <MessageSquare class="w-6 h-6 text-accent" />
        </div>
        <div>
          <div class="text-xs text-muted mb-2 font-mono uppercase tracking-widest">模拟用户提问</div>
          <div class="text-xl md:text-2xl font-sans font-semibold text-white leading-snug">"{{ simulatedQnAs[activeQuestionIndex]?.question }}"</div>
        </div>
      </div>

      <!-- Engine Responses -->
      <div class="divide-y divide-border/50">
        <div v-for="answer in simulatedQnAs[activeQuestionIndex]?.answers" :key="answer.engine" class="bg-background/50">
          <button 
            @click="toggleEngine(answer.engine)"
            class="w-full p-6 md:px-8 flex items-center justify-between hover:bg-surface transition-colors"
          >
            <div class="flex items-center gap-4 md:gap-8">
              <div class="flex items-center gap-3 w-32 md:w-48 text-left">
                <Bot class="w-5 h-5 text-muted" />
                <span class="text-lg font-display font-bold capitalize">{{ answer.engine }}</span>
              </div>
              <span 
                class="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border flex items-center gap-1.5"
                :class="answer.mentioned ? 'text-success border-success/30 bg-success/10' : 'text-danger border-danger/30 bg-danger/10'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="answer.mentioned ? 'bg-success' : 'bg-danger'"></span>
                {{ answer.mentioned ? '已推荐' : '未提及' }}
              </span>
            </div>
            <div class="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center transition-transform" :class="activeEngine === answer.engine ? 'rotate-180' : ''">
              <ChevronDown class="w-4 h-4 text-muted" />
            </div>
          </button>
          
          <div 
            v-show="activeEngine === answer.engine"
            class="p-6 md:p-8 border-t border-border/50 bg-[#05080f] text-muted text-sm md:text-base font-sans leading-relaxed whitespace-pre-line shadow-inner"
          >
            <div class="flex items-center gap-2 mb-4 font-mono text-xs text-muted/50 uppercase tracking-widest">
              <Terminal class="w-3 h-3" />
              <span>Raw Response Output</span>
            </div>
            <div class="pl-5 border-l-2 border-border/50 text-gray-300">
              {{ answer.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>