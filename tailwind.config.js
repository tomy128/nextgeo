/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: 'rgba(255, 255, 255, 0.03)',
        surfaceHover: 'rgba(255, 255, 255, 0.06)',
        border: 'rgba(255, 255, 255, 0.08)',
        accent: '#60A5FA',     
        accentGlow: 'rgba(96, 165, 250, 0.3)',
        purple: '#A78BFA',     
        success: '#10B981',    
        warning: '#F59E0B',    
        danger: '#EF4444',     
        muted: '#9CA3AF',      
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 40px -10px var(--tw-shadow-color)',
      }
    },
  },
  plugins: [],
}