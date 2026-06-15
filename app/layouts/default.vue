<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen w-full overflow-x-hidden relative selection:bg-accent selection:text-white">
    <!-- 极简的顶部导航 - Brutalist Style -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border w-full">
      <div class="container mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-6 h-6 bg-white flex items-center justify-center">
            <span class="font-display font-black text-background text-sm leading-none pt-0.5">N</span>
          </div>
          <span class="font-display font-bold text-xl tracking-tight uppercase">NextGEO</span>
        </div>
        <nav class="hidden md:flex items-center gap-8 text-sm font-mono text-muted">
          <a href="#" class="hover:text-white transition-colors">PRODUCT</a>
          <a href="#" class="hover:text-white transition-colors">CASES</a>
          <a href="#" class="hover:text-white transition-colors">PRICING</a>
        </nav>
      </div>
    </header>

    <main class="pt-16 min-h-screen w-full">
      <slot />
    </main>
  </div>
</template>