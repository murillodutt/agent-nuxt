# Padrões de Logging e Monitoramento de Performance - Nuxt 4

**Data:** 22/09/2025 00:15:00 (America/Sao_Paulo)  
**Objetivo:** Estabelecer padrões abrangentes de logging e monitoramento de performance para aplicações Nuxt 4, otimizado para desenvolvimento assistido por LLM.

## Sistema de Logging Estruturado

### 1. Configuração Base de Logging

```typescript
// utils/logger.ts
import { createConsola } from 'consola'

export interface LogLevel {
  TRACE: 0
  DEBUG: 1
  INFO: 2
  WARN: 3
  ERROR: 4
  FATAL: 5
}

export interface LogEntry {
  timestamp: string
  level: keyof LogLevel
  context: string
  message: string
  data?: any
  error?: {
    name: string
    message: string
    stack?: string
  }
  performance?: {
    duration: number
    memory: number
  }
  request?: {
    method: string
    url: string
    userAgent: string
    ip: string
  }
}

class StructuredLogger {
  private consola = createConsola({
    level: this.getLogLevel(),
    formatOptions: {
      colors: true,
      date: true,
      compact: false
    }
  })

  private getLogLevel(): number {
    const level = process.env.LOG_LEVEL || (process.dev ? 'DEBUG' : 'INFO')
    const levels: Record<string, number> = {
      TRACE: 0,
      DEBUG: 1,
      INFO: 2,
      WARN: 3,
      ERROR: 4,
      FATAL: 5
    }
    return levels[level] || 2
  }

  private createLogEntry(
    level: keyof LogLevel,
    context: string,
    message: string,
    data?: any,
    error?: Error
  ): LogEntry {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const entry: LogEntry = {
      timestamp,
      level,
      context,
      message,
      data
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    }

    // Add performance metrics if available
    if (process.client && 'performance' in window) {
      const memory = (performance as any).memory
      if (memory) {
        entry.performance = {
          duration: performance.now(),
          memory: memory.usedJSHeapSize
        }
      }
    }

    return entry
  }

  private async persistLog(entry: LogEntry): Promise<void> {
    // In production, send logs to external service
    if (process.client && !process.dev && entry.level !== 'DEBUG' && entry.level !== 'TRACE') {
      try {
        await $fetch('/api/logs', {
          method: 'POST',
          body: entry
        })
      } catch (error) {
        console.error('Failed to persist log:', error)
      }
    }

    // In development or server-side, also save to local file
    if (process.server) {
      // Implementation for server-side log persistence
      await this.saveToFile(entry)
    }
  }

  private async saveToFile(entry: LogEntry): Promise<void> {
    if (process.server) {
      try {
        const fs = await import('fs/promises')
        const path = await import('path')
        
        const logDir = path.join(process.cwd(), 'logs')
        const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`)
        
        // Ensure log directory exists
        try {
          await fs.mkdir(logDir, { recursive: true })
        } catch (error) {
          // Directory might already exist
        }
        
        const logLine = JSON.stringify(entry) + '\n'
        await fs.appendFile(logFile, logLine)
      } catch (error) {
        console.error('Failed to save log to file:', error)
      }
    }
  }

  public trace(context: string, message: string, data?: any): void {
    const entry = this.createLogEntry('TRACE', context, message, data)
    this.consola.trace(`[${context}] ${message}`, data)
    this.persistLog(entry)
  }

  public debug(context: string, message: string, data?: any): void {
    const entry = this.createLogEntry('DEBUG', context, message, data)
    this.consola.debug(`[${context}] ${message}`, data)
    this.persistLog(entry)
  }

  public info(context: string, message: string, data?: any): void {
    const entry = this.createLogEntry('INFO', context, message, data)
    this.consola.info(`[${context}] ${message}`, data)
    this.persistLog(entry)
  }

  public warn(context: string, message: string, data?: any): void {
    const entry = this.createLogEntry('WARN', context, message, data)
    this.consola.warn(`[${context}] ${message}`, data)
    this.persistLog(entry)
  }

  public error(context: string, message: string, error?: Error, data?: any): void {
    const entry = this.createLogEntry('ERROR', context, message, data, error)
    this.consola.error(`[${context}] ${message}`, { error, data })
    this.persistLog(entry)
  }

  public fatal(context: string, message: string, error?: Error, data?: any): void {
    const entry = this.createLogEntry('FATAL', context, message, data, error)
    this.consola.fatal(`[${context}] ${message}`, { error, data })
    this.persistLog(entry)
  }
}

export const logger = new StructuredLogger()
```

### 2. Composable de Logging para Componentes

```typescript
// composables/useLogger.ts
export const useLogger = (context: string) => {
  const getTimestamp = () => {
    return new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const logComponentLifecycle = (lifecycle: string, data?: any) => {
    logger.debug(context, `Component lifecycle: ${lifecycle}`, data)
  }

  const logUserAction = (action: string, data?: any) => {
    logger.info(context, `User action: ${action}`, {
      ...data,
      timestamp: getTimestamp(),
      component: context
    })
  }

  const logPerformance = (operation: string, startTime: number, data?: any) => {
    const duration = Date.now() - startTime
    logger.info(context, `Performance: ${operation} completed in ${duration}ms`, {
      ...data,
      duration,
      operation
    })
  }

  const logError = (message: string, error: Error, data?: any) => {
    logger.error(context, message, error, {
      ...data,
      component: context,
      timestamp: getTimestamp()
    })
  }

  const logApiCall = (method: string, url: string, duration?: number, status?: number) => {
    const level = status && status >= 400 ? 'error' : 'info'
    const message = `API ${method.toUpperCase()} ${url} ${status ? `(${status})` : ''}`
    
    if (level === 'error') {
      logger.error(context, message, undefined, { method, url, duration, status })
    } else {
      logger.info(context, message, { method, url, duration, status })
    }
  }

  return {
    trace: (message: string, data?: any) => logger.trace(context, message, data),
    debug: (message: string, data?: any) => logger.debug(context, message, data),
    info: (message: string, data?: any) => logger.info(context, message, data),
    warn: (message: string, data?: any) => logger.warn(context, message, data),
    error: (message: string, error?: Error, data?: any) => logger.error(context, message, error, data),
    fatal: (message: string, error?: Error, data?: any) => logger.fatal(context, message, error, data),
    
    // Specialized logging methods
    logComponentLifecycle,
    logUserAction,
    logPerformance,
    logError,
    logApiCall
  }
}
```

### 3. Middleware de Logging para APIs

```typescript
// server/middleware/logging.ts
export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  // Generate unique request ID
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  setHeader(event, 'X-Request-ID', requestId)

  // Extract request information
  const method = event.node.req.method
  const url = event.node.req.url
  const userAgent = getHeader(event, 'user-agent') || 'unknown'
  const ip = getClientIP(event) || 'unknown'

  // Log request start
  logger.info('API', `Request started: ${method} ${url}`, {
    requestId,
    method,
    url,
    userAgent,
    ip,
    timestamp
  })

  // Handle response logging
  event.node.res.on('finish', () => {
    const duration = Date.now() - startTime
    const statusCode = event.node.res.statusCode

    const logLevel = statusCode >= 400 ? 'error' : 'info'
    const message = `Request completed: ${method} ${url} (${statusCode}) in ${duration}ms`

    if (logLevel === 'error') {
      logger.error('API', message, undefined, {
        requestId,
        method,
        url,
        statusCode,
        duration,
        userAgent,
        ip
      })
    } else {
      logger.info('API', message, {
        requestId,
        method,
        url,
        statusCode,
        duration,
        userAgent,
        ip
      })
    }

    // Log slow requests
    if (duration > 2000) {
      logger.warn('API', `Slow request detected: ${duration}ms`, {
        requestId,
        method,
        url,
        duration,
        threshold: 2000
      })
    }
  })

  // Handle request errors
  event.node.req.on('error', (error) => {
    logger.error('API', `Request error: ${method} ${url}`, error, {
      requestId,
      method,
      url,
      userAgent,
      ip
    })
  })
})
```

## Sistema de Monitoramento de Performance

### 1. Performance Monitoring Composable

```typescript
// composables/usePerformanceMonitor.ts
export const usePerformanceMonitor = (context: string) => {
  const logger = useLogger(context)
  const metrics = reactive({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    timeToInteractive: 0
  })

  const startTiming = (label: string): PerformanceTimer => {
    const startTime = performance.now()
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0

    return {
      end: () => {
        const endTime = performance.now()
        const endMemory = (performance as any).memory?.usedJSHeapSize || 0
        const duration = endTime - startTime
        const memoryDelta = endMemory - startMemory

        logger.logPerformance(label, startTime, {
          duration,
          memoryUsed: memoryDelta,
          startMemory,
          endMemory
        })

        return {
          duration,
          memoryDelta
        }
      }
    }
  }

  const measureAsync = async <T>(
    label: string,
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    const timer = startTiming(label)
    
    try {
      const result = await asyncFn()
      timer.end()
      return result
    } catch (error) {
      const { duration } = timer.end()
      logger.error(`${label} failed after ${duration.toFixed(2)}ms`, error as Error)
      throw error
    }
  }

  const collectWebVitals = () => {
    if (!process.client) return

    // Import web-vitals dynamically
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        metrics.cumulativeLayoutShift = metric.value
        logger.info('Core Web Vitals: CLS', { value: metric.value, rating: metric.rating })
      })

      getFID((metric) => {
        metrics.firstInputDelay = metric.value
        logger.info('Core Web Vitals: FID', { value: metric.value, rating: metric.rating })
      })

      getFCP((metric) => {
        metrics.firstContentfulPaint = metric.value
        logger.info('Core Web Vitals: FCP', { value: metric.value, rating: metric.rating })
      })

      getLCP((metric) => {
        metrics.largestContentfulPaint = metric.value
        logger.info('Core Web Vitals: LCP', { value: metric.value, rating: metric.rating })
      })

      getTTFB((metric) => {
        logger.info('Core Web Vitals: TTFB', { value: metric.value, rating: metric.rating })
      })
    })

    // Custom TTI measurement
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming
            metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.navigationStart
            
            logger.info('Page Load Performance', {
              pageLoadTime: metrics.pageLoadTime,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.navigationStart,
              firstByte: navEntry.responseStart - navEntry.navigationStart,
              domComplete: navEntry.domComplete - navEntry.navigationStart
            })
          }
        }
      })
      
      observer.observe({ entryTypes: ['navigation'] })
    }
  }

  const monitorResourceLoading = () => {
    if (!process.client || !('PerformanceObserver' in window)) return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming
        
        // Log slow resources
        if (resource.duration > 1000) {
          logger.warn('Slow Resource Loading', {
            name: resource.name,
            duration: resource.duration,
            size: resource.transferSize,
            type: resource.initiatorType
          })
        }

        // Log large resources
        if (resource.transferSize > 500000) { // > 500KB
          logger.warn('Large Resource Detected', {
            name: resource.name,
            size: resource.transferSize,
            duration: resource.duration,
            type: resource.initiatorType
          })
        }
      }
    })

    observer.observe({ entryTypes: ['resource'] })
  }

  const monitorMemoryUsage = () => {
    if (!process.client || !(performance as any).memory) return

    const checkMemory = () => {
      const memory = (performance as any).memory
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024)
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024)
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024)

      // Log memory usage every 30 seconds
      logger.debug('Memory Usage', {
        used: usedMB,
        total: totalMB,
        limit: limitMB,
        percentage: Math.round((usedMB / limitMB) * 100)
      })

      // Warn if memory usage is high
      if (usedMB / limitMB > 0.8) {
        logger.warn('High Memory Usage Detected', {
          used: usedMB,
          limit: limitMB,
          percentage: Math.round((usedMB / limitMB) * 100)
        })
      }
    }

    // Check immediately and then every 30 seconds
    checkMemory()
    setInterval(checkMemory, 30000)
  }

  const generatePerformanceReport = () => {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    const report = {
      timestamp,
      context,
      metrics: { ...metrics },
      navigation: process.client ? performance.getEntriesByType('navigation')[0] : null,
      resources: process.client ? performance.getEntriesByType('resource').length : 0,
      memory: process.client && (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round((performance as any).memory.jsHeapSizeLimit / 1024 / 1024)
      } : null
    }

    logger.info('Performance Report Generated', report)
    return report
  }

  // Initialize monitoring on client
  if (process.client) {
    onMounted(() => {
      collectWebVitals()
      monitorResourceLoading()
      monitorMemoryUsage()
    })
  }

  return {
    metrics: readonly(metrics),
    startTiming,
    measureAsync,
    collectWebVitals,
    monitorResourceLoading,
    monitorMemoryUsage,
    generatePerformanceReport
  }
}

interface PerformanceTimer {
  end: () => { duration: number; memoryDelta: number }
}
```

### 2. Component Performance Monitoring

```vue
<!-- components/MonitoredComponent.vue -->
<template>
  <div>
    <slot :performance="performanceData" />
  </div>
</template>

<script setup>
interface Props {
  trackRender?: boolean
  trackInteractions?: boolean
  trackApiCalls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  trackRender: true,
  trackInteractions: true,
  trackApiCalls: true
})

const performanceMonitor = usePerformanceMonitor('MonitoredComponent')
const performanceData = reactive({
  renderTime: 0,
  mountTime: 0,
  interactionCount: 0,
  apiCallCount: 0,
  lastUpdate: null as Date | null
})

let renderTimer: ReturnType<typeof performanceMonitor.startTiming> | null = null
let mountTimer: ReturnType<typeof performanceMonitor.startTiming> | null = null

// Track component lifecycle
onBeforeMount(() => {
  if (props.trackRender) {
    mountTimer = performanceMonitor.startTiming('component-mount')
  }
})

onMounted(() => {
  if (mountTimer) {
    const { duration } = mountTimer.end()
    performanceData.mountTime = duration
    performanceData.lastUpdate = new Date()
  }
})

onBeforeUpdate(() => {
  if (props.trackRender) {
    renderTimer = performanceMonitor.startTiming('component-render')
  }
})

onUpdated(() => {
  if (renderTimer) {
    const { duration } = renderTimer.end()
    performanceData.renderTime = duration
    performanceData.lastUpdate = new Date()
  }
})

// Track user interactions
const trackInteraction = (eventType: string, target?: string) => {
  if (props.trackInteractions) {
    performanceData.interactionCount++
    performanceMonitor.logger.logUserAction(`${eventType}${target ? ` on ${target}` : ''}`, {
      eventType,
      target,
      interactionCount: performanceData.interactionCount
    })
  }
}

// Track API calls
const trackApiCall = async <T>(
  apiCall: () => Promise<T>,
  label: string
): Promise<T> => {
  if (props.trackApiCalls) {
    performanceData.apiCallCount++
    return await performanceMonitor.measureAsync(`api-${label}`, apiCall)
  }
  return await apiCall()
}

// Expose methods to parent
defineExpose({
  trackInteraction,
  trackApiCall,
  generateReport: performanceMonitor.generatePerformanceReport
})
</script>
```

### 3. API Performance Monitoring

```typescript
// server/api/performance/report.post.ts
export default defineEventHandler(async (event) => {
  const logger = useLogger('PerformanceAPI')
  const body = await readBody(event)

  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  try {
    // Validate performance data
    const performanceData = {
      timestamp: body.timestamp || timestamp,
      context: body.context || 'unknown',
      metrics: body.metrics || {},
      navigation: body.navigation || null,
      resources: body.resources || 0,
      memory: body.memory || null,
      userAgent: getHeader(event, 'user-agent'),
      ip: getClientIP(event)
    }

    // Log performance data
    logger.info('Client Performance Report Received', performanceData)

    // Store in database or send to monitoring service
    await storePerformanceData(performanceData)

    // Check for performance issues and alert if necessary
    await checkPerformanceThresholds(performanceData)

    return {
      success: true,
      message: 'Performance data recorded successfully'
    }
  } catch (error) {
    logger.error('Failed to process performance report', error as Error, { body })
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process performance report'
    })
  }
})

async function storePerformanceData(data: any) {
  // Implementation for storing performance data
  // This could be a database, file system, or external service
  
  if (process.env.PERFORMANCE_STORAGE === 'database') {
    // Store in database
    // await database.performanceReports.create(data)
  } else if (process.env.PERFORMANCE_STORAGE === 'file') {
    // Store in file system
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const reportDir = path.join(process.cwd(), 'performance-reports')
    const reportFile = path.join(reportDir, `performance-${new Date().toISOString().split('T')[0]}.jsonl`)
    
    try {
      await fs.mkdir(reportDir, { recursive: true })
      await fs.appendFile(reportFile, JSON.stringify(data) + '\n')
    } catch (error) {
      console.error('Failed to store performance data to file:', error)
    }
  }
}

async function checkPerformanceThresholds(data: any) {
  const thresholds = {
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    memoryUsage: 80 // 80%
  }

  const alerts = []

  // Check Core Web Vitals
  if (data.metrics.largestContentfulPaint > thresholds.lcp) {
    alerts.push(`LCP threshold exceeded: ${data.metrics.largestContentfulPaint}ms > ${thresholds.lcp}ms`)
  }

  if (data.metrics.firstInputDelay > thresholds.fid) {
    alerts.push(`FID threshold exceeded: ${data.metrics.firstInputDelay}ms > ${thresholds.fid}ms`)
  }

  if (data.metrics.cumulativeLayoutShift > thresholds.cls) {
    alerts.push(`CLS threshold exceeded: ${data.metrics.cumulativeLayoutShift} > ${thresholds.cls}`)
  }

  // Check memory usage
  if (data.memory && data.memory.used / data.memory.limit > thresholds.memoryUsage / 100) {
    alerts.push(`Memory usage threshold exceeded: ${Math.round((data.memory.used / data.memory.limit) * 100)}% > ${thresholds.memoryUsage}%`)
  }

  // Send alerts if any thresholds are exceeded
  if (alerts.length > 0) {
    await sendPerformanceAlert(alerts, data)
  }
}

async function sendPerformanceAlert(alerts: string[], data: any) {
  const logger = useLogger('PerformanceAlert')
  
  logger.warn('Performance thresholds exceeded', {
    alerts,
    context: data.context,
    timestamp: data.timestamp,
    userAgent: data.userAgent
  })

  // Send to monitoring service, Slack, email, etc.
  // Implementation depends on your alerting setup
}
```

### 4. Dashboard de Monitoramento

```vue
<!-- pages/admin/performance.vue -->
<template>
  <div class="performance-dashboard">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Performance Dashboard</h1>
          <UButton @click="refreshData" :loading="isLoading">
            Refresh
          </UButton>
        </div>
      </template>

      <!-- Real-time metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <UCard>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600">
              {{ metrics.averageLCP.toFixed(0) }}ms
            </div>
            <div class="text-sm text-gray-600">Average LCP</div>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-3xl font-bold text-blue-600">
              {{ metrics.averageFID.toFixed(0) }}ms
            </div>
            <div class="text-sm text-gray-600">Average FID</div>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-3xl font-bold text-purple-600">
              {{ metrics.averageCLS.toFixed(3) }}
            </div>
            <div class="text-sm text-gray-600">Average CLS</div>
          </div>
        </UCard>

        <UCard>
          <div class="text-center">
            <div class="text-3xl font-bold text-orange-600">
              {{ metrics.memoryUsage.toFixed(1) }}%
            </div>
            <div class="text-sm text-gray-600">Memory Usage</div>
          </div>
        </UCard>
      </div>

      <!-- Performance trends chart -->
      <UCard class="mb-6">
        <template #header>
          <h3 class="text-lg font-semibold">Performance Trends (Last 24h)</h3>
        </template>
        
        <div class="h-64">
          <!-- Chart implementation would go here -->
          <div class="flex items-center justify-center h-full text-gray-500">
            Performance Chart Placeholder
          </div>
        </div>
      </UCard>

      <!-- Recent alerts -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Recent Performance Alerts</h3>
        </template>

        <div class="space-y-2">
          <UAlert
            v-for="alert in recentAlerts"
            :key="alert.id"
            :color="alert.severity === 'high' ? 'red' : 'orange'"
            :title="alert.title"
            :description="alert.description"
          >
            <template #actions>
              <div class="text-xs text-gray-500">
                {{ formatTime(alert.timestamp) }}
              </div>
            </template>
          </UAlert>
        </div>
      </UCard>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Performance Dashboard',
  description: 'Monitor application performance metrics',
  middleware: 'admin'
})

const isLoading = ref(false)
const metrics = reactive({
  averageLCP: 0,
  averageFID: 0,
  averageCLS: 0,
  memoryUsage: 0
})

const recentAlerts = ref([])

const { data: performanceData } = await useLazyFetch('/api/performance/metrics', {
  server: false,
  default: () => ({
    metrics: { averageLCP: 0, averageFID: 0, averageCLS: 0, memoryUsage: 0 },
    alerts: []
  })
})

const refreshData = async () => {
  isLoading.value = true
  
  try {
    const { data } = await $fetch('/api/performance/metrics')
    Object.assign(metrics, data.metrics)
    recentAlerts.value = data.alerts
  } catch (error) {
    console.error('Failed to refresh performance data:', error)
  } finally {
    isLoading.value = false
  }
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  })
}

// Update metrics from fetched data
watchEffect(() => {
  if (performanceData.value) {
    Object.assign(metrics, performanceData.value.metrics)
    recentAlerts.value = performanceData.value.alerts
  }
})

// Auto-refresh every 30 seconds
onMounted(() => {
  const interval = setInterval(refreshData, 30000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.performance-dashboard {
  @apply p-6 max-w-7xl mx-auto;
}
</style>
```

---

**Última Atualização:** 22/09/2025 00:15:00 (America/Sao_Paulo)  
**Versão:** 1.0.0  
**Status:** Sistema de Logging e Monitoramento Implementado  
**Responsável:** Dutt eCommerce Website Design

Este sistema abrangente de logging e monitoramento de performance fornece visibilidade completa sobre aplicações Nuxt 4, permitindo identificação proativa de problemas e otimização contínua da experiência do usuário.
