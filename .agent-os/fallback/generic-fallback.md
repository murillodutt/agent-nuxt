# Generic Fallback Strategies - Agent OS

## Visão Geral

Este documento define estratégias de fallback genéricas para situações não cobertas pelos padrões específicos do Agent OS, garantindo robustez e continuidade operacional em cenários inesperados.

## Estratégias de Fallback

### 1. Fallback de Componentes

#### Componente Não Encontrado
```vue
<template>
  <div class="fallback-component">
    <div class="fallback-icon">
      <UIcon name="i-heroicons-exclamation-triangle" />
    </div>
    <div class="fallback-content">
      <h3>Componente Indisponível</h3>
      <p>O componente solicitado não pôde ser carregado.</p>
      <UButton @click="retry" variant="outline">
        Tentar Novamente
      </UButton>
    </div>
  </div>
</template>

<script setup>
const retry = () => {
  window.location.reload()
}
</script>

<style scoped>
.fallback-component {
  @apply flex flex-col items-center justify-center p-8 text-center;
  @apply border border-gray-200 dark:border-gray-700 rounded-lg;
  @apply bg-gray-50 dark:bg-gray-800;
}

.fallback-icon {
  @apply text-yellow-500 text-4xl mb-4;
}

.fallback-content h3 {
  @apply text-lg font-semibold mb-2;
}

.fallback-content p {
  @apply text-gray-600 dark:text-gray-400 mb-4;
}
</style>
```

#### Lazy Loading Fallback
```vue
<template>
  <div class="loading-fallback">
    <USkeleton class="h-4 w-full mb-2" />
    <USkeleton class="h-4 w-3/4 mb-2" />
    <USkeleton class="h-4 w-1/2" />
  </div>
</template>

<style scoped>
.loading-fallback {
  @apply p-4 space-y-2;
}
</style>
```

### 2. Fallback de Dados

#### API Error Fallback
```typescript
// composables/useApiWithFallback.ts
export const useApiWithFallback = <T>(
  url: string,
  options: {
    fallbackData?: T
    retryAttempts?: number
    retryDelay?: number
    cacheKey?: string
  } = {}
) => {
  const {
    fallbackData = null,
    retryAttempts = 3,
    retryDelay = 1000,
    cacheKey
  } = options

  const data = ref<T | null>(fallbackData)
  const error = ref<Error | null>(null)
  const pending = ref(false)
  const retryCount = ref(0)

  const fetchData = async (): Promise<void> => {
    pending.value = true
    error.value = null

    try {
      const response = await $fetch<T>(url)
      data.value = response
      
      // Cache successful response
      if (cacheKey && process.client) {
        localStorage.setItem(cacheKey, JSON.stringify(response))
      }
    } catch (err) {
      error.value = err as Error
      
      // Try cached data first
      if (cacheKey && process.client) {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          try {
            data.value = JSON.parse(cached)
            console.warn('Using cached data due to API error:', err)
            return
          } catch (parseError) {
            console.error('Failed to parse cached data:', parseError)
          }
        }
      }
      
      // Retry logic
      if (retryCount.value < retryAttempts) {
        retryCount.value++
        setTimeout(() => {
          fetchData()
        }, retryDelay * retryCount.value)
      } else {
        // Use fallback data if all retries failed
        data.value = fallbackData
        console.error('API request failed after all retries:', err)
      }
    } finally {
      pending.value = false
    }
  }

  const refresh = () => {
    retryCount.value = 0
    fetchData()
  }

  // Initial fetch
  fetchData()

  return {
    data: readonly(data),
    error: readonly(error),
    pending: readonly(pending),
    refresh
  }
}
```

#### Offline Data Fallback
```typescript
// composables/useOfflineFallback.ts
export const useOfflineFallback = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    maxAge?: number // milliseconds
    fallbackData?: T
  } = {}
) => {
  const { maxAge = 5 * 60 * 1000, fallbackData = null } = options
  
  const data = ref<T | null>(fallbackData)
  const isOnline = ref(navigator.onLine)
  const lastUpdated = ref<Date | null>(null)

  // Monitor online status
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  const loadFromCache = (): T | null => {
    if (!process.client) return null
    
    try {
      const cached = localStorage.getItem(`offline_${key}`)
      const timestamp = localStorage.getItem(`offline_${key}_timestamp`)
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp)
        if (age < maxAge) {
          lastUpdated.value = new Date(parseInt(timestamp))
          return JSON.parse(cached)
        }
      }
    } catch (error) {
      console.error('Failed to load from cache:', error)
    }
    
    return null
  }

  const saveToCache = (value: T) => {
    if (!process.client) return
    
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(value))
      localStorage.setItem(`offline_${key}_timestamp`, Date.now().toString())
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to save to cache:', error)
    }
  }

  const fetchData = async () => {
    if (!isOnline.value) {
      // Load from cache when offline
      const cached = loadFromCache()
      if (cached) {
        data.value = cached
      }
      return
    }

    try {
      const result = await fetcher()
      data.value = result
      saveToCache(result)
    } catch (error) {
      console.error('Fetch failed, trying cache:', error)
      const cached = loadFromCache()
      if (cached) {
        data.value = cached
      }
    }
  }

  // Initial load
  fetchData()

  // Refetch when coming back online
  watch(isOnline, (online) => {
    if (online) {
      fetchData()
    }
  })

  return {
    data: readonly(data),
    isOnline: readonly(isOnline),
    lastUpdated: readonly(lastUpdated),
    refresh: fetchData
  }
}
```

### 3. Fallback de Navegação

#### Route Not Found Fallback
```vue
<!-- pages/[...slug].vue -->
<template>
  <div class="not-found-fallback">
    <div class="container mx-auto px-4 py-16 text-center">
      <div class="max-w-md mx-auto">
        <UIcon 
          name="i-heroicons-document-magnifying-glass" 
          class="text-6xl text-gray-400 mb-6"
        />
        
        <h1 class="text-3xl font-bold mb-4">
          Página Não Encontrada
        </h1>
        
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <div class="space-y-4">
          <UButton 
            @click="goHome" 
            variant="primary" 
            size="lg"
            class="w-full sm:w-auto"
          >
            Voltar ao Início
          </UButton>
          
          <UButton 
            @click="goBack" 
            variant="outline" 
            size="lg"
            class="w-full sm:w-auto ml-0 sm:ml-4"
          >
            Página Anterior
          </UButton>
        </div>
        
        <!-- Search suggestions -->
        <div class="mt-12">
          <h3 class="text-lg font-semibold mb-4">
            Páginas Populares
          </h3>
          <div class="grid gap-2">
            <UButton
              v-for="suggestion in suggestions"
              :key="suggestion.path"
              :to="suggestion.path"
              variant="ghost"
              class="justify-start"
            >
              <UIcon :name="suggestion.icon" class="mr-2" />
              {{ suggestion.title }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

const suggestions = [
  { path: '/', title: 'Página Inicial', icon: 'i-heroicons-home' },
  { path: '/dashboard', title: 'Dashboard', icon: 'i-heroicons-chart-bar' },
  { path: '/profile', title: 'Perfil', icon: 'i-heroicons-user' },
  { path: '/settings', title: 'Configurações', icon: 'i-heroicons-cog-6-tooth' }
]

const goHome = () => {
  navigateTo('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/')
  }
}

// SEO
useSeoMeta({
  title: 'Página Não Encontrada - 404',
  description: 'A página solicitada não foi encontrada.',
  robots: 'noindex,nofollow'
})
</script>
```

### 4. Fallback de Estado

#### Error Boundary
```vue
<!-- components/ErrorBoundary.vue -->
<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-content">
      <UIcon name="i-heroicons-exclamation-circle" class="error-icon" />
      
      <h2>Algo deu errado</h2>
      
      <p v-if="!isProduction">
        {{ error?.message }}
      </p>
      
      <div class="error-actions">
        <UButton @click="retry" variant="primary">
          Tentar Novamente
        </UButton>
        
        <UButton @click="reportError" variant="outline">
          Reportar Erro
        </UButton>
      </div>
      
      <details v-if="!isProduction" class="error-details">
        <summary>Detalhes Técnicos</summary>
        <pre>{{ error?.stack }}</pre>
      </details>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup>
interface Props {
  fallback?: Component
  onError?: (error: Error) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: undefined,
  onError: undefined
})

const hasError = ref(false)
const error = ref<Error | null>(null)
const isProduction = process.env.NODE_ENV === 'production'

const retry = () => {
  hasError.value = false
  error.value = null
  nextTick(() => {
    // Force re-render of child components
    window.location.reload()
  })
}

const reportError = () => {
  if (error.value) {
    // Send error to monitoring service
    console.error('Error reported:', error.value)
    
    // You could integrate with services like Sentry here
    // Sentry.captureException(error.value)
  }
}

// Error handling
onErrorCaptured((err, instance, info) => {
  console.error('Error captured:', err, info)
  
  hasError.value = true
  error.value = err
  
  if (props.onError) {
    props.onError(err)
  }
  
  return false // Prevent error from propagating
})
</script>

<style scoped>
.error-boundary {
  @apply min-h-screen flex items-center justify-center p-4;
}

.error-content {
  @apply max-w-md text-center;
}

.error-icon {
  @apply text-red-500 text-6xl mb-4;
}

.error-content h2 {
  @apply text-2xl font-bold mb-4;
}

.error-content p {
  @apply text-gray-600 dark:text-gray-400 mb-6;
}

.error-actions {
  @apply space-x-4 mb-6;
}

.error-details {
  @apply text-left mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded;
}

.error-details pre {
  @apply text-xs overflow-auto;
}
</style>
```

### 5. Fallback de Performance

#### Slow Network Fallback
```typescript
// composables/useNetworkAwareness.ts
export const useNetworkAwareness = () => {
  const connection = ref<NetworkInformation | null>(null)
  const isSlowConnection = ref(false)
  const shouldReduceQuality = ref(false)

  onMounted(() => {
    if ('connection' in navigator) {
      connection.value = (navigator as any).connection
      
      const updateConnectionInfo = () => {
        if (connection.value) {
          const effectiveType = connection.value.effectiveType
          isSlowConnection.value = effectiveType === 'slow-2g' || effectiveType === '2g'
          shouldReduceQuality.value = isSlowConnection.value || connection.value.saveData
        }
      }
      
      updateConnectionInfo()
      connection.value.addEventListener('change', updateConnectionInfo)
      
      onUnmounted(() => {
        connection.value?.removeEventListener('change', updateConnectionInfo)
      })
    }
  })

  return {
    connection: readonly(connection),
    isSlowConnection: readonly(isSlowConnection),
    shouldReduceQuality: readonly(shouldReduceQuality)
  }
}
```

#### Reduced Motion Fallback
```typescript
// composables/useReducedMotion.ts
export const useReducedMotion = () => {
  const prefersReducedMotion = ref(false)

  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
    
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.value = e.matches
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handleChange)
    })
  })

  return {
    prefersReducedMotion: readonly(prefersReducedMotion)
  }
}
```

## Implementação Global

### Plugin de Fallback
```typescript
// plugins/fallback.client.ts
export default defineNuxtPlugin(() => {
  // Global error handler
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    // You could send to monitoring service here
    // trackError(event.error)
  })

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // Prevent default browser behavior
    event.preventDefault()
    
    // You could send to monitoring service here
    // trackError(event.reason)
  })

  // Network status monitoring
  const updateOnlineStatus = () => {
    const isOnline = navigator.onLine
    
    if (!isOnline) {
      // Show offline notification
      console.warn('Application is offline')
    }
  }

  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})
```

### Middleware de Fallback
```typescript
// middleware/fallback.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Check if route exists
  const router = useRouter()
  const routes = router.getRoutes()
  
  const routeExists = routes.some(route => {
    return route.path === to.path || route.name === to.name
  })
  
  if (!routeExists && to.path !== '/404') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Página não encontrada'
    })
  }
})
```

## Monitoramento e Métricas

### Tracking de Fallbacks
```typescript
// utils/fallbackTracking.ts
export const trackFallback = (
  type: 'component' | 'data' | 'navigation' | 'error',
  context: string,
  details?: Record<string, any>
) => {
  const event = {
    type: 'fallback_triggered',
    fallback_type: type,
    context,
    details,
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
    url: window.location.href
  }
  
  // Send to analytics
  console.log('Fallback triggered:', event)
  
  // You could integrate with analytics services here
  // gtag('event', 'fallback_triggered', event)
  // mixpanel.track('Fallback Triggered', event)
}
```

## Testes de Fallback

### Testes Unitários
```typescript
// tests/fallback.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorBoundary from '~/components/ErrorBoundary.vue'

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: {
        default: '<div>Child content</div>'
      }
    })
    
    expect(wrapper.text()).toContain('Child content')
  })
  
  it('should render error UI when error occurs', async () => {
    const wrapper = mount(ErrorBoundary)
    
    // Simulate error
    await wrapper.vm.$nextTick()
    wrapper.vm.hasError = true
    wrapper.vm.error = new Error('Test error')
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Algo deu errado')
  })
})
```

## Conclusão

Este sistema de fallback genérico garante que a aplicação Agent OS mantenha funcionalidade básica mesmo em cenários de falha, proporcionando uma experiência de usuário robusta e confiável. As estratégias implementadas cobrem os principais pontos de falha e fornecem alternativas graciosamente degradadas.