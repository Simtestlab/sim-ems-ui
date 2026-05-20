declare module 'echarts-for-react' {
  import * as React from 'react'

  export interface EChartsProps {
    option?: any
    style?: React.CSSProperties
    lazyUpdate?: boolean
    notMerge?: boolean
    showLoading?: boolean
    onChartReady?: (chart: any) => void
    onEvents?: Record<string, (...args: any[]) => void>
    opts?: any
    theme?: any
    echarts?: any
  }

  const ReactECharts: React.ComponentType<EChartsProps>
  export default ReactECharts
}

declare module 'echarts' {
  const echarts: any
  export = echarts
}
