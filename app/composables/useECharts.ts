import { use } from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

let initialized = false

export function useECharts() {
  if (!initialized && typeof window !== 'undefined') {
    use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer])
    initialized = true
  }
}