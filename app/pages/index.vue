<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGeoStore } from '~/stores/geo'
import { Search, Globe, Target, Plus, X } from 'lucide-vue-next'

const router = useRouter()
const store = useGeoStore()

const form = ref({
  brandOrUrl: '',
  keywords: '',
  competitors: ['']
})

const isSubmitting = ref(false)

const addCompetitor = () => {
  if (form.value.competitors.length < 4) {
    form.value.competitors.push('')
  }
}

const removeCompetitor = (index: number) => {
  form.value.competitors.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.brandOrUrl) return
  
  isSubmitting.value = true
  // Filter out empty competitor inputs before saving to store
  const cleanedForm = {
    ...form.value,
    competitors: form.value.competitors.filter(c => c.trim() !== '')
  }
  store.setFormData(cleanedForm)
  
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
          <div class="bg-[#0B0F19]/80 rounded-[1.25rem] p-5 md:p-6 space-y-5 md:space-y-0 md:grid md:grid-cols-12 md:gap-5 items-start">
            
            <div class="md:col-span-5 space-y-2">
              <label class="block font-sans text-sm font-semibold text-gray-300 ml-1">品牌名称 或 官网 URL<span class="text-danger ml-1">*</span></label>
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe class="w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                </div>
                <input 
                  v-model="form.brandOrUrl"
                  type="text" 
                  required
                  placeholder="如：飞书 或 https://larksuite.com" 
                  class="w-full bg-surface hover:bg-surfaceHover border border-border focus:border-accent/50 rounded-xl py-3 pl-12 pr-4 text-white font-mono placeholder:text-muted/50 outline-none transition-all shadow-inner select-auto"
                />
              </div>
            </div>

            <div class="md:col-span-4 space-y-2">
              <div class="flex items-center justify-between ml-1">
                <!-- （选填，最多4个） -->
                <label class="block font-sans text-sm font-semibold text-gray-300">竞品名称 或 官网 URL</label>
                <button 
                  v-if="form.competitors.length < 4" 
                  type="button" 
                  @click="addCompetitor"
                  class="text-accent hover:text-accent/80 transition-colors flex items-center gap-1 text-xs"
                >
                  <Plus class="w-3 h-3" /> 添加竞品
                </button>
              </div>
              <div class="space-y-2">
                <div v-for="(comp, index) in form.competitors" :key="index" class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Target class="w-5 h-5 text-muted group-focus-within:text-danger transition-colors" />
                  </div>
                  <input 
                    v-model="form.competitors[index]"
                    type="text" 
                    :placeholder="index === 0 ? '如：钉钉 或 https://dingtalk.com' : '另一个竞品'" 
                    class="w-full bg-surface hover:bg-surfaceHover border border-border focus:border-danger/50 rounded-xl py-3 pl-12 pr-10 text-white font-mono placeholder:text-muted/50 outline-none transition-all shadow-inner select-auto"
                  />
                  <button 
                    v-if="form.competitors.length > 1"
                    type="button"
                    @click="removeCompetitor(index)"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-danger transition-colors"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
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