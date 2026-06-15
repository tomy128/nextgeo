<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGeoStore } from '~/stores/geo'
import { Search, Globe, Target } from 'lucide-vue-next'

const router = useRouter()
const store = useGeoStore()

const form = ref({
  url: '',
  keywords: '',
  competitor: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!form.value.url) return
  
  isSubmitting.value = true
  store.setFormData(form.value)
  
  router.push('/report')
}
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex flex-col relative overflow-hidden">
    <!-- Ambient glowing orbs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" style="animation-delay: 2s;"></div>

    <div class="flex-grow flex items-center justify-center px-4 sm:px-6 py-6 md:py-8 relative z-10">
      <div class="max-w-5xl w-full" v-motion-slide-visible-bottom>
        
        <div class="text-center mb-8 md:mb-10 space-y-4 md:space-y-6">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-accent font-mono text-xs uppercase tracking-widest backdrop-blur-md mb-4">
            <span class="w-2 h-2 rounded-full bg-accent animate-ping"></span>
            Generative Engine Optimization
          </div>
          <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
            在 AI 搜索时代 <br/>
            <span class="text-gradient">你的品牌可见吗？</span>
          </h1>
          <p class="font-sans text-lg md:text-xl text-muted max-w-2xl mx-auto font-medium">
            30秒生成神级 GEO 诊断报告，透视 ChatGPT、Claude、Perplexity 对您品牌的真实推荐意愿。
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="glass-card rounded-3xl p-2 max-w-4xl mx-auto shadow-glow shadow-accent/10">
          <div class="bg-[#0B0F19]/80 rounded-[1.25rem] p-5 md:p-6 space-y-5 md:space-y-0 md:grid md:grid-cols-12 md:gap-5 items-end">
            
            <div class="md:col-span-5 space-y-2">
              <label class="block font-sans text-sm font-semibold text-gray-300 ml-1">企业官网 URL <span class="text-accent">*</span></label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe class="w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                </div>
                <input 
                  v-model="form.url"
                  type="url" 
                  required
                  placeholder="https://yourcompany.com" 
                  class="w-full bg-surface hover:bg-surfaceHover border border-border focus:border-accent/50 rounded-xl py-3 pl-12 pr-4 text-white font-mono placeholder:text-muted/50 outline-none transition-all shadow-inner select-auto"
                />
              </div>
            </div>

            <div class="md:col-span-4 space-y-2">
              <label class="block font-sans text-sm font-semibold text-gray-300 ml-1">竞品官网 URL（选填）</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Target class="w-5 h-5 text-muted group-focus-within:text-danger transition-colors" />
                </div>
                <input 
                  v-model="form.competitor"
                  type="url" 
                  placeholder="https://competitor.com" 
                  class="w-full bg-surface hover:bg-surfaceHover border border-border focus:border-danger/50 rounded-xl py-3 pl-12 pr-4 text-white font-mono placeholder:text-muted/50 outline-none transition-all shadow-inner select-auto"
                />
              </div>
            </div>

            <div class="md:col-span-3 space-y-2">
              <label class="block font-sans text-sm font-semibold text-gray-300 ml-1">核心业务关键词（选填）</label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search class="w-5 h-5 text-muted group-focus-within:text-purple transition-colors" />
                </div>
                <input 
                  v-model="form.keywords"
                  type="text" 
                  placeholder="如: AI CRM 系统" 
                  class="w-full bg-surface hover:bg-surfaceHover border border-border focus:border-purple/50 rounded-xl py-3 pl-12 pr-4 text-white font-sans placeholder:text-muted/50 outline-none transition-all shadow-inner select-auto"
                />
              </div>
            </div>

            <div class="md:col-span-12 mt-4">
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full h-14 rounded-xl bg-gradient-to-r from-accent to-purple text-white font-sans font-bold text-lg hover:shadow-glow hover:shadow-accent/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span class="relative z-10">{{ isSubmitting ? '分析中...' : '生成报告' }}</span>
                <ArrowRight v-if="!isSubmitting" class="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
          </div>
        </form>

        <div class="mt-8 text-center flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm font-mono text-muted/60">
          <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-muted/40"></span> ChatGPT</div>
          <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-muted/40"></span> Claude</div>
          <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-muted/40"></span> Gemini</div>
          <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-muted/40"></span> Perplexity</div>
          <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-muted/40"></span> Doubao (豆包)</div>
          <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-muted/40"></span> Qwen (千问)</div>
          <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-muted/40"></span> Kimi</div>
          <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-muted/40"></span> Ernie (文心一言)</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ArrowRight } from 'lucide-vue-next'
export default {
  components: { ArrowRight }
}
</script>