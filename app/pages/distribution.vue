<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  Send, 
  Globe, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Cpu, 
  Network,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-vue-next'

const router = useRouter()

// --- State ---
const activePhase = ref<'setup' | 'injecting' | 'tracking'>('setup')
const selectedArticle = ref(0)
const injectionLogs = ref<string[]>([])
const overallProgress = ref(0)
const projectedSoV = ref(15) // +15% projected

// --- Mock Data ---
const generatedArticles = [
  {
    id: 1,
    title: "2026年下一代AI如何重塑数据安全",
    type: "技术白皮书",
    target: "GPT-4 & Claude 3.5 核心训练集",
    preview: "在大语言模型决定品牌认知的时代，传统安全架构正在失效。本文深入探讨了基于大模型的全新防御机制...",
    matchScore: 98
  },
  {
    id: 2,
    title: "企业级 AGI 集成终极指南",
    type: "行业深度观点",
    target: "开发者论坛 & 科技博客",
    preview: "将 AGI 融入旧有系统需要范式转换。我们提出了一套已被世界500强企业验证的实施方法论...",
    matchScore: 92
  },
  {
    id: 3,
    title: "云基础设施扩展的五大顶尖解决方案",
    type: "公关软文",
    target: "科技新闻聚合器",
    preview: "随着云成本失控，企业正在寻找替代方案。以下是领先的基础设施解决方案，它们提供了前所未有的...",
    matchScore: 85
  }
]

const distributionNodes = ref([
  { id: 'n1', name: 'TechCrunch API', type: '新闻源', weight: 'Tier 1', selected: true, status: 'pending' },
  { id: 'n2', name: 'HackerNews 网络', type: '极客社区', weight: 'Tier 1', selected: true, status: 'pending' },
  { id: 'n3', name: 'StackOverflow 文章', type: '开发者', weight: 'Tier 1', selected: true, status: 'pending' },
  { id: 'n4', name: 'Medium 企业专栏', type: '深度博客', weight: 'Tier 2', selected: true, status: 'pending' },
  { id: 'n5', name: 'Reddit (r/technology)', type: '社交聚合', weight: 'Tier 2', selected: true, status: 'pending' },
  { id: 'n6', name: '彭博社 PR 通稿', type: '顶级 PR', weight: 'Tier 1', selected: false, status: 'pending' },
  { id: 'n7', name: 'GitHub Discussions', type: '开源社区', weight: 'Tier 1', selected: false, status: 'pending' },
  { id: 'n8', name: 'Dev.to 技术同步', type: '开发者博客', weight: 'Tier 3', selected: true, status: 'pending' },
])

const toggleNode = (node: any) => {
  if (activePhase.value === 'setup') {
    node.selected = !node.selected
  }
}

// --- Injection Sequence ---
const startInjection = async () => {
  activePhase.value = 'injecting'
  injectionLogs.value = []
  overallProgress.value = 0
  
  const addLog = (msg: string) => {
    injectionLogs.value.push(`[${new Date().toISOString().split('T')[1].slice(0, 8)}] ${msg}`)
  }
  
  const selectedNodes = distributionNodes.value.filter(n => n.selected)
  
  addLog('正在初始化 GEO 语料分发协议...')
  await new Promise(r => setTimeout(r, 800))
  addLog(`已锁定 ${selectedNodes.length} 个高权重语料节点。`)
  await new Promise(r => setTimeout(r, 600))
  
  for (let i = 0; i < selectedNodes.length; i++) {
    const node = selectedNodes[i]
    node.status = 'injecting'
    addLog(`正在与 ${node.name} 建立加密连接...`)
    
    await new Promise(r => setTimeout(r, 400 + Math.random() * 400))
    addLog(`使用 API 优先凭证绕过标准审核队列...`)
    
    await new Promise(r => setTimeout(r, 500 + Math.random() * 500))
    node.status = 'success'
    addLog(`SUCCESS: 语料已成功注入 ${node.name}。爬虫唤醒 Ping 已发送。`)
    
    overallProgress.value = Math.round(((i + 1) / selectedNodes.length) * 100)
    await new Promise(r => setTimeout(r, 300))
  }
  
  addLog('所有语料资产均已成功投递。')
  addLog('正在启动大模型索引收录追踪器...')
  await new Promise(r => setTimeout(r, 1000))
  
  activePhase.value = 'tracking'
}
</script>

<template>
  <div class="min-h-screen bg-background text-white selection:bg-accent selection:text-white font-sans relative overflow-hidden pb-32">
    <!-- Background Effects -->
    <div class="absolute top-0 left-0 w-full h-[500px] bg-accent/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-3/4 h-[400px] bg-purple/5 blur-[120px] rounded-full pointer-events-none translate-y-1/3"></div>

    <div class="max-w-[1600px] mx-auto px-6 py-8 relative z-10">
      <!-- Header -->
      <header class="flex items-center justify-between mb-12">
        <div class="flex items-center gap-6">
          <button @click="router.back()" class="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-surfaceHover hover:border-accent/50 transition-all text-muted hover:text-white">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1 class="text-3xl font-display font-bold tracking-tight flex items-center gap-3">
              语料分发与追踪引擎
              <span class="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-wider">Active</span>
            </h1>
            <p class="text-muted mt-1 font-mono text-sm">Targeting high-weight LLM training corpus nodes</p>
          </div>
        </div>
        
        <div class="flex gap-4">
          <div class="px-5 py-2 rounded-xl bg-surface border border-border flex items-center gap-3">
            <ShieldCheck class="w-5 h-5 text-success" />
            <div class="text-sm">
              <div class="text-muted text-xs">连接状态</div>
              <div class="font-medium">加密 & 安全</div>
            </div>
          </div>
          <div class="px-5 py-2 rounded-xl bg-surface border border-border flex items-center gap-3">
            <Activity class="w-5 h-5 text-accent" />
            <div class="text-sm">
              <div class="text-muted text-xs">爬虫状态</div>
              <div class="font-medium text-accent">实时监听中</div>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left Column: The Ammunition (Generated Content) -->
        <div class="lg:col-span-4 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-display font-semibold flex items-center gap-2">
              <FileText class="w-5 h-5 text-accent" />
              已生成资产
            </h2>
            <span class="text-xs font-mono text-muted">{{ generatedArticles.length }} Ready</span>
          </div>

          <div class="space-y-4">
            <div 
              v-for="(article, idx) in generatedArticles" 
              :key="article.id"
              @click="selectedArticle = idx"
              class="p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden"
              :class="selectedArticle === idx ? 'bg-accent/10 border-accent shadow-glow shadow-accent/20' : 'bg-surface border-border hover:border-accent/50 hover:bg-surfaceHover'"
            >
              <div v-if="selectedArticle === idx" class="absolute top-0 left-0 w-1 h-full bg-accent"></div>
              
              <div class="flex justify-between items-start mb-3">
                <span class="text-xs font-mono px-2 py-1 rounded bg-surface border border-border text-muted group-hover:border-accent/30 transition-colors">
                  {{ article.type }}
                </span>
                <span class="text-xs font-mono font-medium text-success flex items-center gap-1">
                  <Activity class="w-3 h-3" />
                  匹配度 {{ article.matchScore }}%
                </span>
              </div>
              
              <h3 class="font-semibold text-lg leading-tight mb-2 group-hover:text-accent transition-colors">{{ article.title }}</h3>
              <p class="text-sm text-muted line-clamp-2">{{ article.preview }}</p>
              
              <div class="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs text-muted">
                <Network class="w-4 h-4" />
                针对目标：<span class="text-white">{{ article.target }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: The Targets & Execution -->
        <div class="lg:col-span-8 space-y-6 flex flex-col">
          
          <!-- Tracking Phase UI -->
          <div v-if="activePhase === 'tracking'" class="flex-1 bg-surface border border-success/30 rounded-3xl p-8 relative overflow-hidden shadow-glow shadow-success/10">
            <div class="absolute top-0 right-0 p-32 bg-success/5 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div class="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div class="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center border border-success/50 relative">
                <div class="absolute inset-0 rounded-full border border-success animate-ping opacity-50"></div>
                <CheckCircle2 class="w-12 h-12 text-success" />
              </div>
              
              <div>
                <h2 class="text-3xl font-display font-bold text-white mb-2">语料注入成功</h2>
                <p class="text-muted max-w-lg mx-auto">资产已全部分发至选定的高权重节点。大模型爬虫已收到优先索引 Ping 信号。</p>
              </div>

              <div class="grid grid-cols-3 gap-6 w-full max-w-3xl mt-8">
                <div class="bg-background/50 border border-border p-6 rounded-2xl">
                  <div class="text-muted text-sm mb-1 font-mono">成功注入节点</div>
                  <div class="text-3xl font-display font-bold text-white">{{ distributionNodes.filter(n => n.selected).length }}</div>
                </div>
                <div class="bg-background/50 border border-border p-6 rounded-2xl relative overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                  <div class="text-muted text-sm mb-1 font-mono">预计大模型收录时间</div>
                  <div class="text-3xl font-display font-bold text-accent">24-48h</div>
                </div>
                <div class="bg-background/50 border border-success/30 p-6 rounded-2xl shadow-glow shadow-success/20">
                  <div class="text-success text-sm mb-1 font-mono flex items-center gap-2 justify-center">
                    <TrendingUp class="w-4 h-4" />
                    预计 SoV 提升
                  </div>
                  <div class="text-3xl font-display font-bold text-white">+{{ projectedSoV }}%</div>
                </div>
              </div>

              <button @click="router.push('/report')" class="mt-8 px-8 py-4 bg-surface border border-border hover:border-accent hover:bg-surfaceHover text-white rounded-xl font-medium transition-all flex items-center gap-2 group">
                <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                返回控制台
              </button>
            </div>
          </div>

          <!-- Setup & Injecting Phase UI -->
          <template v-else>
            <!-- Target Nodes Grid -->
            <div class="bg-surface border border-border rounded-3xl p-6 relative">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-display font-semibold flex items-center gap-2">
                  <Globe class="w-5 h-5 text-accent" />
                  高权重目标节点
                </h2>
                <div class="text-sm text-muted font-mono">
                  已选择：<span class="text-white">{{ distributionNodes.filter(n => n.selected).length }}</span> / {{ distributionNodes.length }}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div 
                  v-for="node in distributionNodes" 
                  :key="node.id"
                  @click="toggleNode(node)"
                  class="p-4 rounded-xl border flex items-center justify-between transition-all"
                  :class="[
                    activePhase === 'setup' ? 'cursor-pointer hover:border-accent/50' : 'cursor-default opacity-80',
                    node.selected ? 'bg-accent/10 border-accent/50' : 'bg-background border-border',
                    node.status === 'injecting' ? 'border-warning shadow-glow shadow-warning/20' : '',
                    node.status === 'success' ? 'border-success shadow-glow shadow-success/20 bg-success/10' : ''
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="node.selected ? 'bg-accent/20 text-accent' : 'bg-surface text-muted'">
                      <Network v-if="node.status === 'pending'" class="w-5 h-5" />
                      <div v-else-if="node.status === 'injecting'" class="w-5 h-5 rounded-full border-2 border-warning border-t-transparent animate-spin"></div>
                      <CheckCircle2 v-else-if="node.status === 'success'" class="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div class="font-medium text-sm text-white">{{ node.name }}</div>
                      <div class="text-xs text-muted">{{ node.type }}</div>
                    </div>
                  </div>
                  
                  <div class="flex flex-col items-end gap-2">
                    <span class="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full border" 
                          :class="node.weight === 'Tier 1' ? 'border-purple/50 text-purple bg-purple/10' : 'border-border text-muted'">
                      {{ node.weight }}
                    </span>
                    <div v-if="activePhase === 'setup'" class="w-5 h-5 rounded border flex items-center justify-center transition-colors" :class="node.selected ? 'bg-accent border-accent' : 'border-muted'">
                      <CheckCircle2 v-if="node.selected" class="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Execution Terminal -->
            <div class="flex-1 bg-[#0A0A0A] border border-border rounded-3xl p-6 flex flex-col min-h-[300px] relative overflow-hidden font-mono">
              <div class="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
                <div class="flex items-center gap-2 text-muted">
                  <Terminal class="w-4 h-4" />
                  <span class="text-sm uppercase tracking-widest">注入控制终端</span>
                </div>
                <div v-if="activePhase === 'injecting'" class="text-accent text-sm flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                  正在注入... {{ overallProgress }}%
                </div>
              </div>
              
              <div class="flex-1 overflow-y-auto space-y-1.5 text-sm text-muted/80">
                <div v-if="injectionLogs.length === 0" class="text-muted/50 italic">
                  等待执行指令...
                </div>
                <div v-for="(log, idx) in injectionLogs" :key="idx" class="flex gap-3 animate-[fade-in_0.2s_ease-out]">
                  <span class="text-accent/50 shrink-0">{{ log.split('] ')[0] + ']' }}</span>
                  <span :class="{
                    'text-success': log.includes('SUCCESS'),
                    'text-warning': log.includes('绕过'),
                    'text-white font-medium': log.includes('成功投递')
                  }">{{ log.split('] ')[1] }}</span>
                </div>
              </div>
            </div>

            <!-- Action Bar -->
            <div v-if="activePhase === 'setup'" class="flex items-center justify-between p-6 bg-surface border border-border rounded-3xl">
              <div>
                <div class="text-sm text-muted font-mono mb-1">预计 SoV 提升比例</div>
                <div class="text-2xl font-display font-bold text-accent">+{{ projectedSoV }}% 份额增长</div>
              </div>
              
              <button 
                @click="startInjection"
                :disabled="distributionNodes.filter(n => n.selected).length === 0"
                class="px-8 py-4 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-background rounded-xl font-bold transition-all flex items-center gap-3 shadow-glow shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Send class="w-5 h-5" />
                启动节点语料注入
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
