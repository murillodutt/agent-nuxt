# Performance Tracking & Metrics - Agent OS

## Visão Geral

Sistema abrangente de monitoramento de performance para aplicações Agent OS, focado em Core Web Vitals, métricas de Nuxt UI v4 e indicadores de qualidade específicos do framework.

## Core Web Vitals Tracking

### Implementação Base
```typescript
// composables/usePerformanceTracking.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB, onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals'

export interface PerformanceMetrics {
  // Core Web Vitals
  cls: number | null
  fid: number | null
  fcp: number | null
  lcp: number | null
  ttfb: number | null
  
  // Custom Metrics
  nuxtHydrationTime: number | null
  componentRenderTime: number | null
  routeTransitionTime: number | null
  bundleSize: number | null
  
  // User Experience
  userInteractionDelay: number | null
  errorRate: number
  crashRate: number
}

export const usePerformanceTracking = () => {
  const metrics = ref<PerformanceMetrics>({
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    nuxtHydrationTime: null,
    componentRenderTime: null,
    routeTransitionTime: null,
    bundleSize: null,
    userInteractionDelay: null,
    errorRate: 0,
    crashRate: 0
  })

  const isTracking = ref(false)
  const sessionId = ref(generateSessionId())

  const startTracking = () => {
    if (process.client && !isTracking.value) {
      isTracking.value = true
      
      // Core Web Vitals
      onCLS((metric) => {
        metrics.value.cls = metric.value
        sendMetric('cls', metric)
      })
      
      onFID((metric) => {
        metrics.value.fid = metric.value
        sendMetric('fid', metric)
      })
      
      onFCP((metric) => {
        metrics.value.fcp = metric.value
        sendMetric('fcp', metric)
      })
      
      onLCP((metric) => {
        metrics.value.lcp = metric.value
        sendMetric('lcp', metric)
      })
      
      onTTFB((metric) => {
        metrics.value.ttfb = metric.value
        sendMetric('ttfb', metric)
      })

      // Custom Nuxt metrics
      trackNuxtMetrics()
      trackComponentMetrics()
      trackUserInteractions()
    }
  }

  const trackNuxtMetrics = () => {
    // Hydration time
    const hydrationStart = performance.mark('nuxt:hydration:start')
    
    onMounted(() => {
      const hydrationEnd = performance.mark('nuxt:hydration:end')
      const hydrationMeasure = performance.measure(
        'nuxt:hydration',
        'nuxt:hydration:start',
        'nuxt:hydration:end'
      )
      
      metrics.value.nuxtHydrationTime = hydrationMeasure.duration
      sendCustomMetric('nuxt_hydration_time', hydrationMeasure.duration)
    })

    // Route transition tracking
    const router = useRouter()
    let routeStartTime: number

    router.beforeEach(() => {
      routeStartTime = performance.now()
    })

    router.afterEach(() => {
      const transitionTime = performance.now() - routeStartTime
      metrics.value.routeTransitionTime = transitionTime
      sendCustomMetric('route_transition_time', transitionTime)
    })
  }

  const trackComponentMetrics = () => {
    // Component render time tracking
    const componentRenderTimes = new Map<string, number>()

    const trackComponentRender = (componentName: string) => {
      const startTime = performance.now()
      
      return () => {
        const endTime = performance.now()
        const renderTime = endTime - startTime
        
        componentRenderTimes.set(componentName, renderTime)
        
        // Track slow components (>16ms for 60fps)
        if (renderTime > 16) {
          sendCustomMetric('slow_component_render', renderTime, {
            component: componentName,
            threshold_exceeded: true
          })
        }
      }
    }

    // Make available globally
    if (process.client) {
      window.__trackComponentRender = trackComponentRender
    }
  }

  const trackUserInteractions = () => {
    let interactionStartTime: number

    const trackInteraction = (eventType: string) => {
      interactionStartTime = performance.now()
      
      // Track interaction delay
      requestIdleCallback(() => {
        const delay = performance.now() - interactionStartTime
        metrics.value.userInteractionDelay = delay
        
        if (delay > 100) { // Slow interaction threshold
          sendCustomMetric('slow_interaction', delay, {
            event_type: eventType,
            threshold_exceeded: true
          })
        }
      })
    }

    // Track common interactions
    document.addEventListener('click', () => trackInteraction('click'))
    document.addEventListener('keydown', () => trackInteraction('keydown'))
    document.addEventListener('scroll', throttle(() => trackInteraction('scroll'), 100))
  }

  const sendMetric = (name: string, metric: any) => {
    const payload = {
      name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
      entries: metric.entries,
      sessionId: sessionId.value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // Send to analytics service
    sendToAnalytics('web_vital', payload)
  }

  const sendCustomMetric = (name: string, value: number, metadata?: Record<string, any>) => {
    const payload = {
      name,
      value,
      metadata,
      sessionId: sessionId.value,
      timestamp: Date.now(),
      url: window.location.href
    }

    sendToAnalytics('custom_metric', payload)
  }

  return {
    metrics: readonly(metrics),
    isTracking: readonly(isTracking),
    startTracking,
    sendCustomMetric
  }
}

// Utility functions
const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const throttle = (func: Function, limit: number) => {
  let inThrottle: boolean
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

const sendToAnalytics = (type: string, payload: any) => {
  // Multiple analytics providers
  
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', type, {
      custom_parameter_1: payload.name,
      custom_parameter_2: payload.value,
      custom_parameter_3: JSON.stringify(payload.metadata || {})
    })
  }
  
  // Custom analytics endpoint
  if (process.client) {
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        payload,
        timestamp: new Date().toISOString()
      })
    }).catch(error => {
      console.error('Failed to send analytics:', error)
    })
  }
  
  // Console logging for development
  if (process.dev) {
    console.log(`[Performance] ${type}:`, payload)
  }
}
```

### Plugin de Performance
```typescript
// plugins/performance.client.ts
export default defineNuxtPlugin(() => {
  const { startTracking } = usePerformanceTracking()
  
  // Start tracking immediately
  startTracking()
  
  // Bundle size tracking
  if (process.client) {
    // Track initial bundle size
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navigationEntry = entry as PerformanceNavigationTiming
          const transferSize = navigationEntry.transferSize || 0
          
          sendToAnalytics('bundle_size', {
            name: 'initial_bundle',
            value: transferSize,
            compressed: true
          })
        }
      }
    })
    
    observer.observe({ entryTypes: ['navigation'] })
  }
})
```

## Métricas Específicas do Nuxt UI

### Component Performance Tracking
```vue
<!-- components/PerformanceTracker.vue -->
<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
interface Props {
  componentName: string
  trackRender?: boolean
  trackInteractions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  trackRender: true,
  trackInteractions: true
})

const { sendCustomMetric } = usePerformanceTracking()
const renderStartTime = ref(0)

onBeforeMount(() => {
  if (props.trackRender) {
    renderStartTime.value = performance.now()
  }
})

onMounted(() => {
  if (props.trackRender) {
    const renderTime = performance.now() - renderStartTime.value
    sendCustomMetric('component_render_time', renderTime, {
      component: props.componentName,
      lifecycle: 'mount'
    })
  }
})

onUpdated(() => {
  if (props.trackRender) {
    const updateTime = performance.now()
    sendCustomMetric('component_update_time', updateTime, {
      component: props.componentName,
      lifecycle: 'update'
    })
  }
})

if (props.trackInteractions) {
  const trackClick = (event: Event) => {
    const startTime = performance.now()
    
    nextTick(() => {
      const responseTime = performance.now() - startTime
      sendCustomMetric('component_interaction_time', responseTime, {
        component: props.componentName,
        interaction: 'click',
        target: (event.target as Element)?.tagName
      })
    })
  }
  
  onMounted(() => {
    const element = getCurrentInstance()?.vnode.el
    if (element) {
      element.addEventListener('click', trackClick)
    }
  })
  
  onUnmounted(() => {
    const element = getCurrentInstance()?.vnode.el
    if (element) {
      element.removeEventListener('click', trackClick)
    }
  })
}
</script>
```

### Nuxt UI Component Metrics
```typescript
// composables/useNuxtUIMetrics.ts
export const useNuxtUIMetrics = () => {
  const componentMetrics = ref(new Map<string, ComponentMetric>())
  
  interface ComponentMetric {
    name: string
    renderCount: number
    averageRenderTime: number
    errorCount: number
    interactionCount: number
    lastUsed: Date
  }

  const trackComponentUsage = (componentName: string, renderTime?: number) => {
    const existing = componentMetrics.value.get(componentName)
    
    if (existing) {
      existing.renderCount++
      if (renderTime) {
        existing.averageRenderTime = (
          (existing.averageRenderTime * (existing.renderCount - 1)) + renderTime
        ) / existing.renderCount
      }
      existing.lastUsed = new Date()
    } else {
      componentMetrics.value.set(componentName, {
        name: componentName,
        renderCount: 1,
        averageRenderTime: renderTime || 0,
        errorCount: 0,
        interactionCount: 0,
        lastUsed: new Date()
      })
    }
    
    // Send to analytics
    sendToAnalytics('component_usage', {
      component: componentName,
      render_time: renderTime,
      total_renders: componentMetrics.value.get(componentName)?.renderCount
    })
  }

  const trackComponentError = (componentName: string, error: Error) => {
    const metric = componentMetrics.value.get(componentName)
    if (metric) {
      metric.errorCount++
    }
    
    sendToAnalytics('component_error', {
      component: componentName,
      error: error.message,
      stack: error.stack
    })
  }

  const getTopComponents = (limit = 10) => {
    return Array.from(componentMetrics.value.values())
      .sort((a, b) => b.renderCount - a.renderCount)
      .slice(0, limit)
  }

  const getSlowComponents = (threshold = 16) => {
    return Array.from(componentMetrics.value.values())
      .filter(metric => metric.averageRenderTime > threshold)
      .sort((a, b) => b.averageRenderTime - a.averageRenderTime)
  }

  return {
    componentMetrics: readonly(componentMetrics),
    trackComponentUsage,
    trackComponentError,
    getTopComponents,
    getSlowComponents
  }
}
```

## Error Tracking & Monitoring

### Error Boundary com Métricas
```typescript
// composables/useErrorTracking.ts
export const useErrorTracking = () => {
  const errorCount = ref(0)
  const errorRate = ref(0)
  const lastError = ref<Error | null>(null)

  const trackError = (error: Error, context?: string, metadata?: Record<string, any>) => {
    errorCount.value++
    lastError.value = error
    
    // Calculate error rate (errors per session)
    const sessionDuration = performance.now()
    errorRate.value = (errorCount.value / sessionDuration) * 1000 * 60 // errors per minute

    const errorData = {
      message: error.message,
      stack: error.stack,
      context,
      metadata,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: generateSessionId(),
      errorCount: errorCount.value,
      errorRate: errorRate.value
    }

    // Send to multiple error tracking services
    sendErrorToServices(errorData)
  }

  const sendErrorToServices = (errorData: any) => {
    // Sentry
    if (typeof Sentry !== 'undefined') {
      Sentry.captureException(new Error(errorData.message), {
        contexts: {
          error_details: errorData
        }
      })
    }

    // Custom error endpoint
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorData)
    }).catch(err => {
      console.error('Failed to send error to tracking service:', err)
    })

    // Console for development
    if (process.dev) {
      console.error('[Error Tracking]', errorData)
    }
  }

  return {
    errorCount: readonly(errorCount),
    errorRate: readonly(errorRate),
    lastError: readonly(lastError),
    trackError
  }
}
```

## Real User Monitoring (RUM)

### User Session Tracking
```typescript
// composables/useSessionTracking.ts
export const useSessionTracking = () => {
  const sessionData = ref({
    id: generateSessionId(),
    startTime: Date.now(),
    pageViews: 0,
    interactions: 0,
    errors: 0,
    device: getDeviceInfo(),
    connection: getConnectionInfo()
  })

  const trackPageView = (route: string) => {
    sessionData.value.pageViews++
    
    sendToAnalytics('page_view', {
      route,
      session_id: sessionData.value.id,
      page_views: sessionData.value.pageViews,
      timestamp: Date.now()
    })
  }

  const trackInteraction = (type: string, target?: string) => {
    sessionData.value.interactions++
    
    sendToAnalytics('user_interaction', {
      type,
      target,
      session_id: sessionData.value.id,
      interactions: sessionData.value.interactions,
      timestamp: Date.now()
    })
  }

  const getSessionSummary = () => {
    const duration = Date.now() - sessionData.value.startTime
    
    return {
      ...sessionData.value,
      duration,
      averageTimePerPage: sessionData.value.pageViews > 0 
        ? duration / sessionData.value.pageViews 
        : 0,
      interactionRate: sessionData.value.interactions / (duration / 1000) // interactions per second
    }
  }

  // Track session end
  onBeforeUnmount(() => {
    const summary = getSessionSummary()
    sendToAnalytics('session_end', summary)
  })

  return {
    sessionData: readonly(sessionData),
    trackPageView,
    trackInteraction,
    getSessionSummary
  }
}

const getDeviceInfo = () => {
  if (!process.client) return {}
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenResolution: `${screen.width}x${screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio
  }
}

const getConnectionInfo = () => {
  if (!process.client || !('connection' in navigator)) return {}
  
  const connection = (navigator as any).connection
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData
  }
}
```

## Performance Dashboard

### Métricas em Tempo Real
```vue
<!-- components/PerformanceDashboard.vue -->
<template>
  <div class="performance-dashboard">
    <div class="dashboard-header">
      <h2>Performance Metrics</h2>
      <UButton @click="refreshMetrics" :loading="isRefreshing">
        Refresh
      </UButton>
    </div>

    <!-- Core Web Vitals -->
    <div class="metrics-grid">
      <UCard title="Core Web Vitals">
        <div class="vitals-grid">
          <div class="vital-item">
            <div class="vital-label">LCP</div>
            <div class="vital-value" :class="getLCPClass(metrics.lcp)">
              {{ formatMetric(metrics.lcp, 'ms') }}
            </div>
          </div>
          
          <div class="vital-item">
            <div class="vital-label">FID</div>
            <div class="vital-value" :class="getFIDClass(metrics.fid)">
              {{ formatMetric(metrics.fid, 'ms') }}
            </div>
          </div>
          
          <div class="vital-item">
            <div class="vital-label">CLS</div>
            <div class="vital-value" :class="getCLSClass(metrics.cls)">
              {{ formatMetric(metrics.cls) }}
            </div>
          </div>
        </div>
      </UCard>

      <!-- Custom Metrics -->
      <UCard title="Nuxt Metrics">
        <div class="custom-metrics">
          <div class="metric-row">
            <span>Hydration Time:</span>
            <span>{{ formatMetric(metrics.nuxtHydrationTime, 'ms') }}</span>
          </div>
          
          <div class="metric-row">
            <span>Route Transition:</span>
            <span>{{ formatMetric(metrics.routeTransitionTime, 'ms') }}</span>
          </div>
          
          <div class="metric-row">
            <span>Component Render:</span>
            <span>{{ formatMetric(metrics.componentRenderTime, 'ms') }}</span>
          </div>
        </div>
      </UCard>

      <!-- Error Tracking -->
      <UCard title="Error Tracking">
        <div class="error-metrics">
          <div class="metric-row">
            <span>Error Count:</span>
            <span class="error-count">{{ errorCount }}</span>
          </div>
          
          <div class="metric-row">
            <span>Error Rate:</span>
            <span class="error-rate">{{ formatMetric(errorRate, '/min') }}</span>
          </div>
          
          <div class="metric-row" v-if="lastError">
            <span>Last Error:</span>
            <span class="last-error">{{ lastError.message }}</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Performance Chart -->
    <UCard title="Performance Trends" class="mt-6">
      <div class="chart-container">
        <!-- Chart implementation would go here -->
        <div class="chart-placeholder">
          Performance chart visualization
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const { metrics } = usePerformanceTracking()
const { errorCount, errorRate, lastError } = useErrorTracking()
const isRefreshing = ref(false)

const refreshMetrics = async () => {
  isRefreshing.value = true
  
  // Refresh metrics
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  isRefreshing.value = false
}

const formatMetric = (value: number | null, unit = '') => {
  if (value === null) return 'N/A'
  return `${Math.round(value * 100) / 100}${unit}`
}

const getLCPClass = (value: number | null) => {
  if (value === null) return 'metric-unknown'
  if (value <= 2500) return 'metric-good'
  if (value <= 4000) return 'metric-needs-improvement'
  return 'metric-poor'
}

const getFIDClass = (value: number | null) => {
  if (value === null) return 'metric-unknown'
  if (value <= 100) return 'metric-good'
  if (value <= 300) return 'metric-needs-improvement'
  return 'metric-poor'
}

const getCLSClass = (value: number | null) => {
  if (value === null) return 'metric-unknown'
  if (value <= 0.1) return 'metric-good'
  if (value <= 0.25) return 'metric-needs-improvement'
  return 'metric-poor'
}
</script>

<style scoped>
.performance-dashboard {
  @apply p-6;
}

.dashboard-header {
  @apply flex justify-between items-center mb-6;
}

.metrics-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.vitals-grid {
  @apply grid grid-cols-3 gap-4;
}

.vital-item {
  @apply text-center;
}

.vital-label {
  @apply text-sm text-gray-600 dark:text-gray-400 mb-1;
}

.vital-value {
  @apply text-2xl font-bold;
}

.metric-good {
  @apply text-green-600;
}

.metric-needs-improvement {
  @apply text-yellow-600;
}

.metric-poor {
  @apply text-red-600;
}

.metric-unknown {
  @apply text-gray-400;
}

.custom-metrics,
.error-metrics {
  @apply space-y-3;
}

.metric-row {
  @apply flex justify-between items-center;
}

.error-count,
.error-rate {
  @apply font-semibold;
}

.last-error {
  @apply text-red-600 text-sm truncate max-w-xs;
}

.chart-container {
  @apply h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded;
}

.chart-placeholder {
  @apply text-gray-500;
}
</style>
```

## Configuração de Alertas

### Sistema de Alertas
```typescript
// utils/performanceAlerts.ts
interface AlertThreshold {
  metric: string
  threshold: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  action?: () => void
}

const alertThresholds: AlertThreshold[] = [
  { metric: 'lcp', threshold: 4000, severity: 'high' },
  { metric: 'fid', threshold: 300, severity: 'high' },
  { metric: 'cls', threshold: 0.25, severity: 'high' },
  { metric: 'error_rate', threshold: 5, severity: 'critical' },
  { metric: 'hydration_time', threshold: 1000, severity: 'medium' }
]

export const checkPerformanceAlerts = (metrics: PerformanceMetrics) => {
  const alerts: Array<{
    metric: string
    value: number
    threshold: number
    severity: string
  }> = []

  alertThresholds.forEach(threshold => {
    const value = metrics[threshold.metric as keyof PerformanceMetrics] as number
    
    if (value && value > threshold.threshold) {
      alerts.push({
        metric: threshold.metric,
        value,
        threshold: threshold.threshold,
        severity: threshold.severity
      })
      
      // Execute action if defined
      if (threshold.action) {
        threshold.action()
      }
    }
  })

  if (alerts.length > 0) {
    sendAlertsToMonitoring(alerts)
  }

  return alerts
}

const sendAlertsToMonitoring = (alerts: any[]) => {
  // Send to monitoring service (Slack, email, etc.)
  console.warn('Performance alerts triggered:', alerts)
  
  // Example: Send to Slack webhook
  if (process.client) {
    fetch('/api/alerts/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ alerts })
    }).catch(error => {
      console.error('Failed to send alerts:', error)
    })
  }
}
```

## Conclusão

Este sistema de performance tracking fornece monitoramento abrangente para aplicações Agent OS, cobrindo Core Web Vitals, métricas específicas do Nuxt UI v4, tracking de erros e monitoramento de usuários reais. As métricas coletadas permitem otimização contínua e manutenção da qualidade da experiência do usuário.