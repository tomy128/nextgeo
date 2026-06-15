<script setup lang="ts">
import { Target, Scale, FileText } from 'lucide-vue-next'

defineProps<{
  diagnostics: {
    id: string
    title: string
    description: string
    iconType: 'target' | 'scale' | 'file-text'
  }[]
}>()

const getIcon = (type: string) => {
  switch (type) {
    case 'target': return Target
    case 'scale': return Scale
    case 'file-text': return FileText
    default: return Target
  }
}
</script>

<template>
  <div class="py-16 md:py-24 relative">
    <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple/30 bg-purple/10 text-purple font-mono text-xs uppercase tracking-widest mb-4">
          问题诊断
        </div>
        <h2 class="font-display text-4xl md:text-5xl font-black tracking-tight">AI 为什么不推荐你？</h2>
      </div>
      <p class="font-sans text-muted max-w-md text-sm md:text-base leading-relaxed">
        基于各大主流 AI 引擎偏好的多维归因分析。修复这些核心病灶是提升可见度的第一步。
      </p>
    </div>

    <div class="w-full">
      <div class="flex flex-nowrap md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory md:snap-none hide-scrollbar gap-6">
        <div 
          v-for="(item, index) in diagnostics" 
          :key="item.id"
          class="w-[85vw] md:w-auto flex-shrink-0 md:flex-shrink snap-center md:snap-align-none glass-card rounded-3xl p-8 md:p-10 flex flex-col relative group"
        >
          <!-- Dossier Number Background -->
          <div class="absolute top-4 right-6 font-display text-[6rem] font-black text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none select-none">
            {{ index + 1 }}
          </div>
          
          <div class="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center mb-8 flex-shrink-0 group-hover:border-purple/50 group-hover:bg-purple/10 transition-all duration-300">
            <component :is="getIcon(item.iconType)" class="w-7 h-7 text-muted group-hover:text-purple transition-colors duration-300" />
          </div>
          
          <h3 class="font-display text-2xl font-bold mb-4 text-white tracking-wide relative z-10">{{ item.title }}</h3>
          <p class="font-sans text-muted leading-relaxed flex-grow text-sm md:text-base relative z-10">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>