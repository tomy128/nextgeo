<script setup lang="ts">
import { ref } from 'vue'
import { LayoutDashboard, FileText, Share2, Settings, LogOut, Sparkles } from 'lucide-vue-next'

const activeTab = ref('dashboard')

const navigation = [
  { id: 'dashboard', name: '数据大盘', icon: LayoutDashboard },
  { id: 'content', name: 'AI 语料工厂', icon: FileText },
  { id: 'distribution', name: '分发矩阵', icon: Share2 },
]
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-surface border-r border-border flex flex-col hidden md:flex">
      <div class="p-6 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
          <Sparkles class="w-5 h-5 text-accent" />
        </div>
        <span class="text-xl font-display font-bold text-white tracking-tight">GEO Copilot</span>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-4">
        <button
          v-for="item in navigation"
          :key="item.id"
          @click="activeTab = item.id"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium"
          :class="[
            activeTab === item.id 
              ? 'bg-accent/10 text-accent border border-accent/20' 
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.name }}
        </button>
      </nav>

      <div class="p-4 mt-auto border-t border-border">
        <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
          <Settings class="w-5 h-5" />
          系统设置
        </button>
        <button class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium mt-1">
          <LogOut class="w-5 h-5" />
          退出登录
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="md:hidden bg-surface border-b border-border p-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Sparkles class="w-5 h-5 text-accent" />
        <span class="font-display font-bold text-white">GEO Copilot</span>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 bg-surface/50 backdrop-blur-sm border-b border-border flex items-center px-8 shrink-0">
        <h1 class="text-xl font-bold text-white">
          {{ navigation.find(n => n.id === activeTab)?.name }}
        </h1>
        <div class="ml-auto flex items-center gap-4">
          <div class="px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-medium flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            全网 AI 引擎监控中
          </div>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-auto p-8">
        <div class="max-w-6xl mx-auto">
          <!-- Views will be injected here -->
          <WorkspaceOverview v-if="activeTab === 'dashboard'" />
          <WorkspaceContentHub v-else-if="activeTab === 'content'" />
          <WorkspaceDistribution v-else-if="activeTab === 'distribution'" />
        </div>
      </div>
    </main>
  </div>
</template>