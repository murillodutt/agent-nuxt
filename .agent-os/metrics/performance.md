# Métricas de Performance - Agent OS

## Visão Geral
Sistema de monitoramento e métricas de performance para aplicações Nuxt com foco em Nuxt UI v4, garantindo experiência otimizada do usuário e conformidade com padrões de performance web.

## Core Web Vitals

### 1. Largest Contentful Paint (LCP)
**Meta**: ≤ 2.5 segundos

#### Implementação de Monitoramento
```typescript
// utils/performance/lcp-monitor.ts
export class LCPMonitor {
  private observer: PerformanceObserver | null = null
  private lcpValue: number = 0
  
  constructor(private callback?: (value: number) => void) {
    this.initObserver()
  }
  
  private initObserver() {
    if (typeof window === 'undefined') return
    
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry
      
      this.lcpValue = lastEntry.startTime
      this.callback?.(this.lcpValue)
      
      // Log para desenvolvimento
      if (process.dev) {
        console.log(`LCP: ${this.lcpValue.toFixed(2)}ms`)
        
        if (this.lcpValue > 2500) {
          console.warn('[AVISO] LCP acima do recomendado (2.5s)')
        }
      }
    })
    
    this.observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }
  
  getLCP(): number {
    return this.lcpValue
  }
  
  disconnect() {
    this.observer?.disconnect()
  }
}

// Plugin Nuxt
export default defineNuxtPlugin(() => {
  if (process.client) {
    const lcpMonitor = new LCPMonitor((value) => {
      // Enviar para analytics
      $fetch('/api/metrics/lcp', {
        method: 'POST',
        body: { value, url: window.location.pathname }
      }).catch(() => {})
    })
    
    // Cleanup
    onBeforeUnmount(() => {
      lcpMonitor.disconnect()
    })
  }
})
```

#### Otimizações para LCP
```typescript
// composables/useLCPOptimization.ts
export function useLCPOptimization() {
  const preloadCriticalResources = () => {
    // Preload de fontes críticas
    const criticalFonts = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-var-italic.woff2'
    ]
    
    criticalFonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = font
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }
  
  const optimizeImages = () => {
    // Lazy loading para imagens não críticas
    const images = document.querySelectorAll('img[data-lazy]')
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.lazy || ''
          img.removeAttribute('data-lazy')
          imageObserver.unobserve(img)
        }
      })
    })
    
    images.forEach(img => imageObserver.observe(img))
  }
  
  const prioritizeCriticalCSS = () => {
    // Inline CSS crítico
    const criticalCSS = `
      /* Critical styles for above-the-fold content */
      .hero-section { display: flex; align-items: center; min-height: 60vh; }
      .navigation { position: sticky; top: 0; z-index: 50; }
      .loading-skeleton { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    `
    
    const style = document.createElement('style')
    style.textContent = criticalCSS
    document.head.appendChild(style)
  }
  
  return {
    preloadCriticalResources,
    optimizeImages,
    prioritizeCriticalCSS
  }
}
```

### 2. First Input Delay (FID)
**Meta**: ≤ 100 milissegundos

#### Implementação de Monitoramento
```typescript
// utils/performance/fid-monitor.ts
export class FIDMonitor {
  private observer: PerformanceObserver | null = null
  private fidValue: number = 0
  
  constructor(private callback?: (value: number) => void) {
    this.initObserver()
  }
  
  private initObserver() {
    if (typeof window === 'undefined') return
    
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry: any) => {
        if (entry.processingStart && entry.startTime) {
          this.fidValue = entry.processingStart - entry.startTime
          this.callback?.(this.fidValue)
          
          if (process.dev) {
            console.log(`FID: ${this.fidValue.toFixed(2)}ms`)
            
            if (this.fidValue > 100) {
              console.warn('[AVISO] FID acima do recomendado (100ms)')
            }
          }
        }
      })
    })
    
    this.observer.observe({ entryTypes: ['first-input'] })
  }
  
  getFID(): number {
    return this.fidValue
  }
  
  disconnect() {
    this.observer?.disconnect()
  }
}
```

#### Otimizações para FID
```typescript
// composables/useFIDOptimization.ts
export function useFIDOptimization() {
  const deferNonCriticalJS = () => {
    // Defer de scripts não críticos
    const nonCriticalScripts = document.querySelectorAll('script[data-defer]')
    
    const loadScript = (script: HTMLScriptElement) => {
      const newScript = document.createElement('script')
      newScript.src = script.dataset.src || ''
      newScript.async = true
      document.head.appendChild(newScript)
    }
    
    // Carregar após interação do usuário
    const loadOnInteraction = () => {
      nonCriticalScripts.forEach(script => {
        loadScript(script as HTMLScriptElement)
      })
      
      // Remove listeners após primeira interação
      document.removeEventListener('click', loadOnInteraction)
      document.removeEventListener('scroll', loadOnInteraction)
      document.removeEventListener('keydown', loadOnInteraction)
    }
    
    document.addEventListener('click', loadOnInteraction, { once: true })
    document.addEventListener('scroll', loadOnInteraction, { once: true })
    document.addEventListener('keydown', loadOnInteraction, { once: true })
  }
  
  const optimizeEventHandlers = () => {
    // Debounce para eventos frequentes
    const debounce = (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout
      return function executedFunction(...args: any[]) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }
    
    // Throttle para scroll events
    const throttle = (func: Function, limit: number) => {
      let inThrottle: boolean
      return function executedFunction(...args: any[]) {
        if (!inThrottle) {
          func.apply(this, args)
          inThrottle = true
          setTimeout(() => inThrottle = false, limit)
        }
      }
    }
    
    return { debounce, throttle }
  }
  
  const useWebWorkers = () => {
    // Mover processamento pesado para Web Workers
    const createWorker = (workerFunction: Function) => {
      const blob = new Blob([`(${workerFunction.toString()})()`], {
        type: 'application/javascript'
      })
      
      return new Worker(URL.createObjectURL(blob))
    }
    
    const heavyComputationWorker = createWorker(() => {
      self.onmessage = function(e) {
        const { data, operation } = e.data
        
        let result
        switch (operation) {
          case 'sort':
            result = data.sort()
            break
          case 'filter':
            result = data.filter((item: any) => item.active)
            break
          default:
            result = data
        }
        
        self.postMessage(result)
      }
    })
    
    return { heavyComputationWorker }
  }
  
  return {
    deferNonCriticalJS,
    optimizeEventHandlers,
    useWebWorkers
  }
}
```

### 3. Cumulative Layout Shift (CLS)
**Meta**: ≤ 0.1

#### Implementação de Monitoramento
```typescript
// utils/performance/cls-monitor.ts
export class CLSMonitor {
  private observer: PerformanceObserver | null = null
  private clsValue: number = 0
  private sessionValue: number = 0
  private sessionEntries: any[] = []
  
  constructor(private callback?: (value: number) => void) {
    this.initObserver()
  }
  
  private initObserver() {
    if (typeof window === 'undefined') return
    
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          this.sessionEntries.push(entry)
          this.sessionValue += entry.value
          
          // Calcular CLS da sessão
          this.clsValue = Math.max(this.clsValue, this.sessionValue)
          
          this.callback?.(this.clsValue)
          
          if (process.dev) {
            console.log(`CLS: ${this.clsValue.toFixed(4)}`)
            
            if (this.clsValue > 0.1) {
              console.warn('[AVISO] CLS acima do recomendado (0.1)')
              console.log('Elementos afetados:', entry.sources)
            }
          }
        }
      })
    })
    
    this.observer.observe({ entryTypes: ['layout-shift'] })
  }
  
  getCLS(): number {
    return this.clsValue
  }
  
  disconnect() {
    this.observer?.disconnect()
  }
}
```

#### Otimizações para CLS
```typescript
// composables/useCLSOptimization.ts
export function useCLSOptimization() {
  const reserveSpace = () => {
    // Reservar espaço para imagens
    const images = document.querySelectorAll('img:not([width]):not([height])')
    
    images.forEach((img: HTMLImageElement) => {
      // Definir aspect ratio baseado em dados conhecidos
      const aspectRatio = img.dataset.aspectRatio || '16/9'
      img.style.aspectRatio = aspectRatio
      img.style.width = '100%'
      img.style.height = 'auto'
    })
  }
  
  const preventFontSwap = () => {
    // Usar font-display: swap com fallbacks adequados
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        src: url('/fonts/inter-var.woff2') format('woff2');
        font-display: swap;
        font-weight: 100 900;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
    `
    document.head.appendChild(style)
  }
  
  const stabilizeAnimations = () => {
    // Usar transform e opacity para animações
    const animatedElements = document.querySelectorAll('[data-animate]')
    
    animatedElements.forEach(element => {
      const el = element as HTMLElement
      el.style.willChange = 'transform, opacity'
      
      // Evitar animações que causam reflow
      const animation = el.dataset.animate
      if (animation === 'slideIn') {
        el.style.transform = 'translateX(-100%)'
        el.style.opacity = '0'
        
        // Animar usando transform
        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.3s ease, opacity 0.3s ease'
          el.style.transform = 'translateX(0)'
          el.style.opacity = '1'
        })
      }
    })
  }
  
  const preloadCriticalContent = () => {
    // Preload de conteúdo crítico above-the-fold
    const criticalImages = document.querySelectorAll('img[data-critical]')
    
    criticalImages.forEach((img: HTMLImageElement) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = img.src
      link.as = 'image'
      document.head.appendChild(link)
    })
  }
  
  return {
    reserveSpace,
    preventFontSwap,
    stabilizeAnimations,
    preloadCriticalContent
  }
}
```

## Métricas de Aplicação

### 1. Bundle Size Monitoring
```typescript
// utils/performance/bundle-monitor.ts
export class BundleMonitor {
  private bundleSize: number = 0
  private chunkSizes: Map<string, number> = new Map()
  
  async analyzeBundleSize() {
    if (process.client) {
      // Analisar tamanho dos chunks carregados
      const scripts = document.querySelectorAll('script[src]')
      
      for (const script of scripts) {
        const src = (script as HTMLScriptElement).src
        if (src.includes('/_nuxt/')) {
          try {
            const response = await fetch(src, { method: 'HEAD' })
            const size = parseInt(response.headers.get('content-length') || '0')
            
            const chunkName = src.split('/').pop() || 'unknown'
            this.chunkSizes.set(chunkName, size)
            this.bundleSize += size
          } catch (error) {
            console.warn(`Erro ao analisar chunk: ${src}`)
          }
        }
      }
      
      this.reportBundleMetrics()
    }
  }
  
  private reportBundleMetrics() {
    if (process.dev) {
      console.group('📦 Bundle Analysis')
      console.log(`Total Bundle Size: ${(this.bundleSize / 1024).toFixed(2)} KB`)
      
      this.chunkSizes.forEach((size, chunk) => {
        console.log(`${chunk}: ${(size / 1024).toFixed(2)} KB`)
      })
      
      console.groupEnd()
      
      // Alertas para bundles grandes
      if (this.bundleSize > 500 * 1024) { // 500KB
        console.warn('[AVISO] Bundle size muito grande (>500KB)')
      }
    }
    
    // Enviar métricas para analytics
    $fetch('/api/metrics/bundle', {
      method: 'POST',
      body: {
        totalSize: this.bundleSize,
        chunks: Object.fromEntries(this.chunkSizes),
        url: window.location.pathname
      }
    }).catch(() => {})
  }
  
  getBundleSize(): number {
    return this.bundleSize
  }
  
  getChunkSizes(): Map<string, number> {
    return this.chunkSizes
  }
}
```

### 2. Memory Usage Monitoring
```typescript
// utils/performance/memory-monitor.ts
export class MemoryMonitor {
  private memoryInfo: any = null
  private intervalId: NodeJS.Timeout | null = null
  
  startMonitoring(interval: number = 30000) { // 30 segundos
    if (typeof window === 'undefined') return
    
    this.intervalId = setInterval(() => {
      this.collectMemoryInfo()
    }, interval)
    
    // Coleta inicial
    this.collectMemoryInfo()
  }
  
  private collectMemoryInfo() {
    if ('memory' in performance) {
      this.memoryInfo = {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        timestamp: Date.now()
      }
      
      if (process.dev) {
        const usedMB = (this.memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)
        const totalMB = (this.memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)
        
        console.log(`🧠 Memory Usage: ${usedMB}MB / ${totalMB}MB`)
        
        // Alerta para uso alto de memória
        const usagePercent = (this.memoryInfo.usedJSHeapSize / this.memoryInfo.jsHeapSizeLimit) * 100
        if (usagePercent > 80) {
          console.warn(`[AVISO] Alto uso de memória: ${usagePercent.toFixed(1)}%`)
        }
      }
      
      // Enviar métricas
      this.reportMemoryMetrics()
    }
  }
  
  private reportMemoryMetrics() {
    if (!this.memoryInfo) return
    
    $fetch('/api/metrics/memory', {
      method: 'POST',
      body: {
        ...this.memoryInfo,
        url: window.location.pathname
      }
    }).catch(() => {})
  }
  
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
  
  getMemoryInfo() {
    return this.memoryInfo
  }
}
```

### 3. Component Performance Monitoring
```typescript
// utils/performance/component-monitor.ts
export class ComponentMonitor {
  private renderTimes: Map<string, number[]> = new Map()
  private mountTimes: Map<string, number> = new Map()
  
  measureRender(componentName: string, renderFn: Function) {
    const startTime = performance.now()
    
    const result = renderFn()
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Armazenar tempo de render
    if (!this.renderTimes.has(componentName)) {
      this.renderTimes.set(componentName, [])
    }
    
    this.renderTimes.get(componentName)!.push(renderTime)
    
    if (process.dev && renderTime > 16) { // 16ms = 60fps
      console.warn(`[AVISO] Render lento: ${componentName} (${renderTime.toFixed(2)}ms)`)
    }
    
    return result
  }
  
  measureMount(componentName: string) {
    const startTime = performance.now()
    
    return {
      finish: () => {
        const endTime = performance.now()
        const mountTime = endTime - startTime
        
        this.mountTimes.set(componentName, mountTime)
        
        if (process.dev) {
          console.log(`[RAPIDO] ${componentName} mounted in ${mountTime.toFixed(2)}ms`)
          
          if (mountTime > 100) {
            console.warn(`[AVISO] Mount lento: ${componentName}`)
          }
        }
        
        // Enviar métricas
        this.reportComponentMetrics(componentName, mountTime)
      }
    }
  }
  
  private reportComponentMetrics(componentName: string, mountTime: number) {
    const renderTimes = this.renderTimes.get(componentName) || []
    const avgRenderTime = renderTimes.length > 0 
      ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length 
      : 0
    
    $fetch('/api/metrics/component', {
      method: 'POST',
      body: {
        componentName,
        mountTime,
        avgRenderTime,
        renderCount: renderTimes.length,
        url: window.location.pathname
      }
    }).catch(() => {})
  }
  
  getComponentStats(componentName: string) {
    const renderTimes = this.renderTimes.get(componentName) || []
    const mountTime = this.mountTimes.get(componentName) || 0
    
    return {
      mountTime,
      renderTimes,
      avgRenderTime: renderTimes.length > 0 
        ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length 
        : 0,
      renderCount: renderTimes.length
    }
  }
  
  getAllStats() {
    const stats: Record<string, any> = {}
    
    this.mountTimes.forEach((mountTime, componentName) => {
      stats[componentName] = this.getComponentStats(componentName)
    })
    
    return stats
  }
}
```

## API de Métricas

### 1. Endpoint de Coleta
```typescript
// server/api/metrics/[type].post.ts
export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  const body = await readBody(event)
  
  // Validar tipo de métrica
  const validTypes = ['lcp', 'fid', 'cls', 'bundle', 'memory', 'component']
  if (!validTypes.includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tipo de métrica inválido'
    })
  }
  
  // Processar métricas baseado no tipo
  switch (type) {
    case 'lcp':
      await processLCPMetrics(body)
      break
    case 'fid':
      await processFIDMetrics(body)
      break
    case 'cls':
      await processCLSMetrics(body)
      break
    case 'bundle':
      await processBundleMetrics(body)
      break
    case 'memory':
      await processMemoryMetrics(body)
      break
    case 'component':
      await processComponentMetrics(body)
      break
  }
  
  return { success: true }
})

async function processLCPMetrics(data: any) {
  // Armazenar métricas LCP
  const storage = useStorage('redis')
  
  const key = `metrics:lcp:${new Date().toISOString().split('T')[0]}`
  const existing = await storage.getItem(key) || []
  
  existing.push({
    ...data,
    timestamp: Date.now(),
    userAgent: getHeader(event, 'user-agent')
  })
  
  await storage.setItem(key, existing)
  
  // Alertas para valores críticos
  if (data.value > 4000) { // 4 segundos
    await sendAlert('LCP Crítico', `LCP de ${data.value}ms na página ${data.url}`)
  }
}

async function processFIDMetrics(data: any) {
  // Similar ao LCP, mas para FID
  const storage = useStorage('redis')
  
  const key = `metrics:fid:${new Date().toISOString().split('T')[0]}`
  const existing = await storage.getItem(key) || []
  
  existing.push({
    ...data,
    timestamp: Date.now()
  })
  
  await storage.setItem(key, existing)
  
  if (data.value > 300) { // 300ms
    await sendAlert('FID Crítico', `FID de ${data.value}ms na página ${data.url}`)
  }
}

async function processCLSMetrics(data: any) {
  // Processar métricas CLS
  const storage = useStorage('redis')
  
  const key = `metrics:cls:${new Date().toISOString().split('T')[0]}`
  const existing = await storage.getItem(key) || []
  
  existing.push({
    ...data,
    timestamp: Date.now()
  })
  
  await storage.setItem(key, existing)
  
  if (data.value > 0.25) { // 0.25 = Poor
    await sendAlert('CLS Crítico', `CLS de ${data.value} na página ${data.url}`)
  }
}

async function sendAlert(title: string, message: string) {
  // Implementar sistema de alertas (Slack, email, etc.)
  console.warn(`🚨 ${title}: ${message}`)
  
  // Exemplo: enviar para Slack
  if (process.env.SLACK_WEBHOOK_URL) {
    await $fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      body: {
        text: `${title}: ${message}`,
        channel: '#performance-alerts'
      }
    })
  }
}
```

### 2. Dashboard de Métricas
```typescript
// server/api/metrics/dashboard.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const days = parseInt(query.days as string) || 7
  
  const storage = useStorage('redis')
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000))
  
  const metrics = {
    lcp: await getMetricsForPeriod('lcp', startDate, endDate),
    fid: await getMetricsForPeriod('fid', startDate, endDate),
    cls: await getMetricsForPeriod('cls', startDate, endDate),
    bundle: await getMetricsForPeriod('bundle', startDate, endDate),
    memory: await getMetricsForPeriod('memory', startDate, endDate),
    component: await getMetricsForPeriod('component', startDate, endDate)
  }
  
  // Calcular estatísticas
  const stats = {
    lcp: calculateStats(metrics.lcp, 'value'),
    fid: calculateStats(metrics.fid, 'value'),
    cls: calculateStats(metrics.cls, 'value'),
    bundle: calculateStats(metrics.bundle, 'totalSize'),
    memory: calculateStats(metrics.memory, 'usedJSHeapSize'),
    component: calculateComponentStats(metrics.component)
  }
  
  return {
    metrics,
    stats,
    period: { startDate, endDate, days }
  }
})

async function getMetricsForPeriod(type: string, startDate: Date, endDate: Date) {
  const storage = useStorage('redis')
  const metrics = []
  
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const key = `metrics:${type}:${currentDate.toISOString().split('T')[0]}`
    const dayMetrics = await storage.getItem(key) || []
    metrics.push(...dayMetrics)
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return metrics
}

function calculateStats(data: any[], field: string) {
  if (data.length === 0) return null
  
  const values = data.map(item => item[field]).filter(v => v != null)
  if (values.length === 0) return null
  
  values.sort((a, b) => a - b)
  
  return {
    count: values.length,
    min: values[0],
    max: values[values.length - 1],
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    median: values[Math.floor(values.length / 2)],
    p75: values[Math.floor(values.length * 0.75)],
    p90: values[Math.floor(values.length * 0.90)],
    p95: values[Math.floor(values.length * 0.95)]
  }
}

function calculateComponentStats(data: any[]) {
  const componentStats: Record<string, any> = {}
  
  data.forEach(item => {
    const { componentName } = item
    if (!componentStats[componentName]) {
      componentStats[componentName] = {
        mountTimes: [],
        renderTimes: []
      }
    }
    
    if (item.mountTime) {
      componentStats[componentName].mountTimes.push(item.mountTime)
    }
    
    if (item.avgRenderTime) {
      componentStats[componentName].renderTimes.push(item.avgRenderTime)
    }
  })
  
  // Calcular estatísticas para cada componente
  Object.keys(componentStats).forEach(componentName => {
    const stats = componentStats[componentName]
    
    stats.mountStats = calculateStats(
      stats.mountTimes.map(t => ({ mountTime: t })), 
      'mountTime'
    )
    
    stats.renderStats = calculateStats(
      stats.renderTimes.map(t => ({ renderTime: t })), 
      'renderTime'
    )
  })
  
  return componentStats
}
```

## Plugin de Performance

### 1. Plugin Principal
```typescript
// plugins/performance.client.ts
export default defineNuxtPlugin(() => {
  // Inicializar monitores
  const lcpMonitor = new LCPMonitor()
  const fidMonitor = new FIDMonitor()
  const clsMonitor = new CLSMonitor()
  const bundleMonitor = new BundleMonitor()
  const memoryMonitor = new MemoryMonitor()
  const componentMonitor = new ComponentMonitor()
  
  // Inicializar otimizações
  const { preloadCriticalResources, optimizeImages, prioritizeCriticalCSS } = useLCPOptimization()
  const { deferNonCriticalJS, optimizeEventHandlers } = useFIDOptimization()
  const { reserveSpace, preventFontSwap, stabilizeAnimations } = useCLSOptimization()
  
  // Aplicar otimizações
  onMounted(() => {
    preloadCriticalResources()
    optimizeImages()
    prioritizeCriticalCSS()
    deferNonCriticalJS()
    reserveSpace()
    preventFontSwap()
    stabilizeAnimations()
  })
  
  // Iniciar monitoramento
  bundleMonitor.analyzeBundleSize()
  memoryMonitor.startMonitoring()
  
  // Cleanup
  onBeforeUnmount(() => {
    lcpMonitor.disconnect()
    fidMonitor.disconnect()
    clsMonitor.disconnect()
    memoryMonitor.stopMonitoring()
  })
  
  // Disponibilizar globalmente
  return {
    provide: {
      performance: {
        lcpMonitor,
        fidMonitor,
        clsMonitor,
        bundleMonitor,
        memoryMonitor,
        componentMonitor
      }
    }
  }
})
```

### 2. Composable de Performance
```typescript
// composables/usePerformance.ts
export function usePerformance() {
  const { $performance } = useNuxtApp()
  
  const measureComponent = (name: string, fn: Function) => {
    return $performance.componentMonitor.measureRender(name, fn)
  }
  
  const measureMount = (name: string) => {
    return $performance.componentMonitor.measureMount(name)
  }
  
  const getMetrics = () => {
    return {
      lcp: $performance.lcpMonitor.getLCP(),
      fid: $performance.fidMonitor.getFID(),
      cls: $performance.clsMonitor.getCLS(),
      bundleSize: $performance.bundleMonitor.getBundleSize(),
      memory: $performance.memoryMonitor.getMemoryInfo(),
      components: $performance.componentMonitor.getAllStats()
    }
  }
  
  const reportCustomMetric = async (name: string, value: number, metadata?: any) => {
    await $fetch('/api/metrics/custom', {
      method: 'POST',
      body: {
        name,
        value,
        metadata,
        url: window.location.pathname,
        timestamp: Date.now()
      }
    })
  }
  
  return {
    measureComponent,
    measureMount,
    getMetrics,
    reportCustomMetric
  }
}
```

## Configuração Nuxt

### 1. Configuração de Performance
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Otimizações de build
  nitro: {
    compressPublicAssets: true,
    minify: true
  },
  
  // Otimizações de CSS
  css: ['~/assets/css/critical.css'],
  
  // Configuração de fontes
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    },
    display: 'swap',
    preload: true
  },
  
  // Configuração de imagens
  image: {
    quality: 80,
    format: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },
  
  // PWA para cache
  pwa: {
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
            }
          }
        }
      ]
    }
  },
  
  // Configuração de performance
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false
  }
})
```

---

*Este sistema de métricas de performance garante monitoramento contínuo e otimização proativa da aplicação Nuxt com Nuxt UI v4, mantendo os Core Web Vitals dentro dos padrões recomendados e fornecendo insights detalhados sobre o desempenho da aplicação.*