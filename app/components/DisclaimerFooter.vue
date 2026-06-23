<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
</script>

<template>
  <div class="mt-24 pt-8 border-t border-border/50 flex flex-col md:flex-row items-start md:items-center gap-4 text-slate-500 text-xs">
    <div class="shrink-0 w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
      <AlertTriangle class="w-4 h-4 text-slate-400" />
    </div>
    <div class="space-y-1">
      <p class="font-medium text-slate-400">免责声明 (Disclaimer)</p>
      <p class="leading-relaxed max-w-4xl">
        本报告数据基于主流生成式 AI 引擎 (如 ChatGPT, Claude, Gemini 等) 的公开接口及行业算法模型动态推演得出。由于大语言模型 (LLM) 存在幻觉 (Hallucination) 及底层知识库更新周期的客观限制，分析结果仅供营销优化参考，不代表各大模型官方立场，亦不构成绝对的商业承诺。建议结合企业实际业务情况进行综合判断。
      </p>
    </div>
  </div>
</template>