<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGeoStore } from '~/stores/geo'
import { useWorkspaceStore } from '~/stores/workspace'
import { Target, CheckCircle2, Lock, ArrowRight, Loader2, Mail } from 'lucide-vue-next'
import type { GeoReportData } from '~/types/geo'

const props = defineProps<{
  actionPlan: GeoReportData['actionPlan']
}>()

const emit = defineEmits<{
  (e: 'unlocked'): void
}>()

const store = useGeoStore()
const workspaceStore = useWorkspaceStore()
const router = useRouter()

const isUnlocked = ref(false)
const email = ref('')
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const handleUnlock = async () => {
  if (!email.value || !email.value.includes('@')) {
    submitError.value = '请输入有效的企业邮箱'
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  try {
    const response = await $fetch<{ success: boolean; data: any }>('/api/leads', {
      method: 'POST',
      body: {
        email: email.value,
        websiteUrl: store.formData.url || 'unknown'
      }
    })

    if (response.success) {
      submitSuccess.value = true
      setTimeout(() => {
        isUnlocked.value = true
        emit('unlocked')
      }, 1500)
    }
  } catch (err: any) {
    submitError.value = err.data?.statusMessage || '提交失败，请重试'
  } finally {
    isSubmitting.value = false
  }
}

const enterWorkspace = () => {
  if (props.actionPlan?.tasks) {
    workspaceStore.importTasksFromReport(props.actionPlan.tasks)
  }
  router.push('/workspace')
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'P0': return 'bg-danger text-white border-danger/50 shadow-glow shadow-danger/20'
    case 'P1': return 'bg-warning text-black border-warning/50 shadow-glow shadow-warning/20'
    case 'P2': return 'bg-surface text-muted border-border'
    default: return 'bg-surface text-white border-border'
  }
}
</script>

<template>
  <div class="py-16 md:py-24 relative">
    <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-success/30 bg-success/10 text-success font-mono text-xs uppercase tracking-widest mb-4">
          行动计划
        </div>
        <h2 class="font-display text-4xl md:text-5xl font-black tracking-tight">GEO 优化路线图</h2>
      </div>
      <p class="font-sans text-muted max-w-md text-sm md:text-base leading-relaxed">
        根据 AI 模型偏好反向推导的高优先级执行清单，快速修复信息缺口。
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
      
      <!-- 锁定的覆盖层 -->
      <div v-if="!isUnlocked" class="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-background/60 rounded-3xl border border-border/50">
        <div class="max-w-md w-full mx-4 glass-card rounded-3xl p-8 md:p-10 text-center shadow-glow shadow-accent/20">
          <div v-if="!submitSuccess">
            <div class="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-6">
              <Lock class="w-8 h-8 text-accent" />
            </div>
            <h3 class="font-display text-2xl font-bold text-white mb-3">解锁完整优化方案</h3>
            <p class="font-sans text-muted text-sm mb-8">输入企业邮箱，获取针对您品牌的定制化 AI 推荐提升指南及 PDF 报告。</p>
            
            <form @submit.prevent="handleUnlock" class="space-y-4">
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail class="w-5 h-5 text-muted group-focus-within:text-accent transition-colors" />
                </div>
                <input 
                  v-model="email"
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  class="w-full bg-surface hover:bg-surfaceHover border border-border focus:border-accent/50 rounded-xl py-4 pl-12 pr-4 text-white font-sans placeholder:text-muted/50 outline-none transition-all shadow-inner"
                />
              </div>
              <p v-if="submitError" class="text-danger text-sm text-left pl-2">{{ submitError }}</p>
              
              <button 
                type="submit" 
                :disabled="isSubmitting"
                class="w-full h-[56px] rounded-xl bg-gradient-to-r from-accent to-purple text-white font-sans font-bold hover:shadow-glow hover:shadow-accent/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin relative z-10" />
                <span class="relative z-10">{{ isSubmitting ? '正在验证...' : '立即解锁' }}</span>
              </button>
            </form>
          </div>
          <div v-else class="py-8 animate-fade-in-up">
            <div class="w-20 h-20 rounded-full bg-success/20 border border-success/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 class="w-10 h-10 text-success" />
            </div>
            <h3 class="font-display text-2xl font-bold text-white mb-2">解锁成功</h3>
            <p class="font-sans text-muted">正在为您生成完整报告...</p>
          </div>
        </div>
      </div>

      <!-- 任务列表 -->
      <div class="lg:col-span-7 space-y-4" :class="{ 'opacity-20 pointer-events-none filter blur-sm': !isUnlocked }">
        <div 
          v-for="(task, index) in actionPlan.tasks" 
          :key="task.title"
          class="glass-card rounded-2xl p-6 md:p-8 hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex flex-col md:flex-row md:items-start gap-6">
            <div 
              class="font-mono text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border inline-flex items-center justify-center flex-shrink-0"
              :class="getPriorityColor(task.priority)"
            >
              {{ task.priority }}
            </div>
            <div>
              <h4 class="font-display text-xl font-bold mb-2 text-white">{{ task.title }}</h4>
              <p class="font-sans text-muted text-sm md:text-base leading-relaxed">{{ task.reason }}</p>
            </div>
          </div>
        </div>

        <div class="mt-12 p-6 bg-accent/10 border border-accent/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none"></div>
          <div class="relative z-10">
            <h3 class="text-xl font-bold text-white mb-2">一键执行优化处方</h3>
            <p class="text-slate-400 text-sm max-w-lg">我们已为您自动生成了上述优化任务的 AI 语料框架。进入 GEO 工作台，即可一键生成 EEAT 级别的高质量软文，并自动分发至高权重平台。</p>
          </div>
          <div class="relative z-10 shrink-0">
            <button @click="enterWorkspace" class="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(var(--color-accent),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-accent),0.5)] transition-all flex items-center gap-2">
              进入 GEO 工作台
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <!-- 预测与转化区 -->
      <div class="lg:col-span-5 flex flex-col gap-6 sticky top-8" :class="{ 'opacity-20 pointer-events-none filter blur-sm': !isUnlocked }">
        <div class="glass-card rounded-3xl p-8 md:p-10 flex flex-col justify-center relative overflow-hidden flex-grow group">
          <div class="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent opacity-50"></div>
          <div class="absolute top-0 right-0 w-64 h-64 bg-success/10 rounded-full blur-[80px] group-hover:bg-success/20 transition-colors duration-700"></div>
          
          <h3 class="font-mono text-success text-sm tracking-widest uppercase mb-10 flex items-center gap-2 relative z-10">
            <TrendingUp class="w-4 h-4" />
            AI 推荐概率预测
          </h3>
          
          <div class="flex flex-col justify-center space-y-10 relative z-10">
            <div class="flex items-center justify-between w-full">
              <div class="text-left">
                <p class="font-sans text-muted text-sm mb-2">当前推荐率</p>
                <div class="font-display text-5xl font-bold text-muted">
                  {{ actionPlan.prediction.currentScore }}<span class="text-3xl">%</span>
                </div>
              </div>
              
              <div class="flex-grow flex items-center justify-center px-4 relative">
                <div class="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent absolute"></div>
                <div class="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center z-10 shadow-glow shadow-success/20">
                  <ArrowRight class="w-5 h-5 text-success" />
                </div>
              </div>
              
              <div class="text-right">
                <p class="font-sans text-success font-medium text-sm mb-2">预计优化后</p>
                <div class="font-display text-6xl font-black text-white text-glow">
                  {{ actionPlan.prediction.projectedScore }}<span class="text-4xl">%</span>
                </div>
              </div>
            </div>
            
            <div class="w-full pt-6 border-t border-border/50 flex justify-between items-center">
              <span class="font-sans text-muted text-sm">预估可见度提升</span>
              <span class="font-display text-success font-bold text-2xl">
                {{ actionPlan.prediction.increaseRate }}
              </span>
            </div>
          </div>
        </div>

        <button class="w-full h-[80px] rounded-2xl bg-white text-black hover:bg-success hover:text-white transition-all duration-500 flex items-center justify-center gap-3 group shadow-glow shadow-white/10 hover:shadow-success/40 relative overflow-hidden flex-shrink-0">
          <div class="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span class="font-sans font-bold text-xl relative z-10">
            联系专家进行落地
          </span>
          <ArrowUpRight class="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>