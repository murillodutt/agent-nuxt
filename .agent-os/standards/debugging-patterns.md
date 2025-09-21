# Padrões de Debugging e Error Handling - Nuxt 4 + UI v4

**Data:** 22/09/2025 00:05:00 (America/Sao_Paulo)  
**Objetivo:** Estabelecer padrões estruturados de debugging e tratamento de erros para desenvolvimento Nuxt 4 + UI v4 assistido por LLM.

## Estratégias de Debugging

### 1. Debugging Estruturado por Camadas

#### Client-Side Debugging

```typescript
// composables/useDebugger.ts
export const useDebugger = (context: string) => {
  const isDebugEnabled = process.dev || useRuntimeConfig().public.debugMode
  
  const debug = (message: string, data?: any) => {
    if (!isDebugEnabled) return
    
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.group(`[${timestamp}] [DEBUG] ${context}`)
    console.log(message)
    if (data) {
      console.log('Data:', data)
    }
    console.trace('Stack trace')
    console.groupEnd()
  }
  
  const error = (message: string, error?: Error, data?: any) => {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.group(`[${timestamp}] [ERROR] ${context}`)
    console.error(message)
    if (error) {
      console.error('Error object:', error)
      console.error('Stack:', error.stack)
    }
    if (data) {
      console.error('Additional data:', data)
    }
    console.groupEnd()
    
    // Send to error tracking service in production
    if (process.client && !process.dev) {
      $fetch('/api/errors/track', {
        method: 'POST',
        body: {
          context,
          message,
          error: error?.message,
          stack: error?.stack,
          data,
          timestamp,
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      }).catch(console.error)
    }
  }
  
  const warn = (message: string, data?: any) => {
    if (!isDebugEnabled) return
    
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.warn(`[${timestamp}] [WARN] ${context}: ${message}`, data)
  }
  
  const performance = {
    start: (label: string) => {
      if (isDebugEnabled && 'performance' in window) {
        performance.mark(`${context}-${label}-start`)
      }
    },
    
    end: (label: string) => {
      if (isDebugEnabled && 'performance' in window) {
        performance.mark(`${context}-${label}-end`)
        performance.measure(
          `${context}-${label}`,
          `${context}-${label}-start`,
          `${context}-${label}-end`
        )
        
        const measure = performance.getEntriesByName(`${context}-${label}`)[0]
        debug(`Performance: ${label} took ${measure.duration.toFixed(2)}ms`)
      }
    }
  }
  
  return {
    debug,
    error,
    warn,
    performance
  }
}
```

#### Server-Side Debugging

```typescript
// server/utils/logger.ts
import { createConsola } from 'consola'

const logger = createConsola({
  level: process.env.NODE_ENV === 'production' ? 1 : 4,
  formatOptions: {
    colors: true,
    date: true
  }
})

export const createServerLogger = (context: string) => {
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
  
  return {
    info: (message: string, data?: any) => {
      logger.info(`[${getTimestamp()}] [${context}] ${message}`, data)
    },
    
    warn: (message: string, data?: any) => {
      logger.warn(`[${getTimestamp()}] [${context}] ${message}`, data)
    },
    
    error: (message: string, error?: Error, data?: any) => {
      logger.error(`[${getTimestamp()}] [${context}] ${message}`, {
        error: error?.message,
        stack: error?.stack,
        data
      })
    },
    
    debug: (message: string, data?: any) => {
      logger.debug(`[${getTimestamp()}] [${context}] ${message}`, data)
    },
    
    success: (message: string, data?: any) => {
      logger.success(`[${getTimestamp()}] [${context}] ${message}`, data)
    }
  }
}
```

### 2. Error Handling Patterns

#### Global Error Handler

```typescript
// plugins/error-handler.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  const { $toast } = nuxtApp
  
  // Global Vue error handler
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.group(`[${timestamp}] [GLOBAL ERROR] Vue Error Handler`)
    console.error('Error:', error)
    console.error('Component:', instance)
    console.error('Info:', info)
    console.groupEnd()
    
    // Show user-friendly error message
    $toast.add({
      id: `error-${Date.now()}`,
      title: 'Erro inesperado',
      description: 'Algo deu errado. Nossa equipe foi notificada.',
      color: 'red',
      timeout: 5000
    })
    
    // Track error
    trackError(error, { component: instance, info })
  }
  
  // Global unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.group(`[${timestamp}] [GLOBAL ERROR] Unhandled Promise Rejection`)
    console.error('Reason:', event.reason)
    console.error('Promise:', event.promise)
    console.groupEnd()
    
    // Prevent default browser error handling
    event.preventDefault()
    
    // Show user-friendly error message
    $toast.add({
      id: `promise-error-${Date.now()}`,
      title: 'Erro de conexão',
      description: 'Verifique sua conexão com a internet.',
      color: 'orange',
      timeout: 5000
    })
    
    // Track error
    trackError(new Error(event.reason), { type: 'unhandledrejection' })
  })
  
  // Global JavaScript error handler
  window.addEventListener('error', (event) => {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.group(`[${timestamp}] [GLOBAL ERROR] JavaScript Error`)
    console.error('Message:', event.message)
    console.error('Source:', event.filename)
    console.error('Line:', event.lineno)
    console.error('Column:', event.colno)
    console.error('Error:', event.error)
    console.groupEnd()
    
    // Track error
    trackError(event.error || new Error(event.message), {
      source: event.filename,
      line: event.lineno,
      column: event.colno
    })
  })
})

// Error tracking function
const trackError = async (error: Error, context?: any) => {
  try {
    await $fetch('/api/errors/track', {
      method: 'POST',
      body: {
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    })
  } catch (trackingError) {
    console.error('Failed to track error:', trackingError)
  }
}
```

#### API Error Handler

```typescript
// composables/useApiErrorHandler.ts
export const useApiErrorHandler = () => {
  const { $toast } = useNuxtApp()
  
  const handleApiError = (error: any, context?: string) => {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.group(`[${timestamp}] [API ERROR] ${context || 'API Request'}`)
    console.error('Error:', error)
    console.groupEnd()
    
    // Determine error type and show appropriate message
    let title = 'Erro de conexão'
    let description = 'Verifique sua conexão com a internet.'
    let color = 'red'
    
    if (error?.status) {
      switch (error.status) {
        case 400:
          title = 'Dados inválidos'
          description = 'Verifique os dados informados e tente novamente.'
          color = 'orange'
          break
        case 401:
          title = 'Não autorizado'
          description = 'Faça login novamente para continuar.'
          color = 'yellow'
          // Redirect to login
          navigateTo('/login')
          break
        case 403:
          title = 'Acesso negado'
          description = 'Você não tem permissão para esta ação.'
          color = 'red'
          break
        case 404:
          title = 'Não encontrado'
          description = 'O recurso solicitado não foi encontrado.'
          color = 'gray'
          break
        case 422:
          title = 'Dados inválidos'
          description = error.data?.message || 'Verifique os dados informados.'
          color = 'orange'
          break
        case 429:
          title = 'Muitas tentativas'
          description = 'Aguarde um momento antes de tentar novamente.'
          color = 'yellow'
          break
        case 500:
          title = 'Erro interno'
          description = 'Nosso time foi notificado. Tente novamente em alguns instantes.'
          color = 'red'
          break
        case 503:
          title = 'Serviço indisponível'
          description = 'Estamos em manutenção. Tente novamente em breve.'
          color = 'blue'
          break
        default:
          title = 'Erro inesperado'
          description = error.data?.message || 'Algo deu errado. Tente novamente.'
      }
    }
    
    // Show toast notification
    $toast.add({
      id: `api-error-${Date.now()}`,
      title,
      description,
      color,
      timeout: error.status === 401 ? 3000 : 5000
    })
    
    return {
      title,
      description,
      status: error?.status,
      isRetryable: [408, 429, 500, 502, 503, 504].includes(error?.status)
    }
  }
  
  const withErrorHandling = async <T>(
    apiCall: () => Promise<T>,
    context?: string,
    options?: {
      retries?: number
      retryDelay?: number
      showToast?: boolean
    }
  ): Promise<T | null> => {
    const { retries = 0, retryDelay = 1000, showToast = true } = options || {}
    
    let lastError: any
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await apiCall()
      } catch (error) {
        lastError = error
        
        if (attempt < retries) {
          const timestamp = new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
          
          console.log(`[${timestamp}] [API RETRY] Attempt ${attempt + 1}/${retries + 1} failed, retrying in ${retryDelay}ms`)
          
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          continue
        }
        
        if (showToast) {
          handleApiError(error, context)
        }
        
        throw error
      }
    }
    
    return null
  }
  
  return {
    handleApiError,
    withErrorHandling
  }
}
```

### 3. Component-Level Error Handling

```vue
<!-- components/SafeComponent.vue -->
<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" class="safe-component-loading">
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-3/4 mt-2" />
    </div>
    
    <!-- Error state -->
    <UAlert
      v-else-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="errorTitle"
      :description="errorDescription"
    >
      <template #actions>
        <UButton
          variant="outline"
          size="xs"
          @click="retry"
          :loading="isRetrying"
        >
          Tentar novamente
        </UButton>
      </template>
    </UAlert>
    
    <!-- Success state -->
    <div v-else-if="data">
      <slot :data="data" />
    </div>
    
    <!-- Empty state -->
    <div v-else class="safe-component-empty">
      <slot name="empty">
        <UAlert
          icon="i-heroicons-information-circle"
          color="blue"
          variant="soft"
          title="Nenhum dado encontrado"
          description="Não há informações para exibir no momento."
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
interface Props {
  asyncFn: () => Promise<T>
  errorTitle?: string
  errorDescription?: string
  retries?: number
  retryDelay?: number
  cacheKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  errorTitle: 'Erro ao carregar dados',
  errorDescription: 'Ocorreu um erro ao carregar as informações.',
  retries: 2,
  retryDelay: 1000
})

const data = ref<T | null>(null)
const error = ref<Error | null>(null)
const isLoading = ref(false)
const isRetrying = ref(false)

const { handleApiError } = useApiErrorHandler()

const load = async (isRetry = false) => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  if (isRetry) {
    isRetrying.value = true
  } else {
    isLoading.value = true
  }
  
  error.value = null
  
  try {
    console.log(`[${timestamp}] [SAFE COMPONENT] Loading data...`)
    
    data.value = await props.asyncFn()
    
    console.log(`[${timestamp}] [SAFE COMPONENT] ✓ Data loaded successfully`)
    
  } catch (err) {
    error.value = err as Error
    
    console.log(`[${timestamp}] [SAFE COMPONENT] ✗ Failed to load data:`, err)
    
    // Don't show toast for component-level errors (component handles UI)
    handleApiError(err, 'SafeComponent', { showToast: false })
    
  } finally {
    isLoading.value = false
    isRetrying.value = false
  }
}

const retry = async () => {
  await load(true)
}

// Load data on mount
onMounted(() => {
  load()
})

// Computed properties for error display
const errorTitle = computed(() => {
  if (!error.value) return props.errorTitle
  
  if (error.value.message.includes('network')) {
    return 'Erro de conexão'
  }
  
  if (error.value.message.includes('timeout')) {
    return 'Tempo limite excedido'
  }
  
  return props.errorTitle
})

const errorDescription = computed(() => {
  if (!error.value) return props.errorDescription
  
  if (error.value.message.includes('network')) {
    return 'Verifique sua conexão com a internet e tente novamente.'
  }
  
  if (error.value.message.includes('timeout')) {
    return 'A operação demorou mais do que o esperado. Tente novamente.'
  }
  
  return props.errorDescription
})
</script>

<style scoped>
.safe-component-loading,
.safe-component-empty {
  @apply p-4;
}
</style>
```

### 4. Form Error Handling

```vue
<!-- components/SafeForm.vue -->
<template>
  <UForm
    ref="formRef"
    :schema="schema"
    :state="formState"
    class="space-y-4"
    @submit="handleSubmit"
    @error="handleFormError"
  >
    <slot 
      :form-state="formState"
      :errors="formErrors"
      :is-submitting="isSubmitting"
      :clear-errors="clearErrors"
    />
    
    <!-- Global form error -->
    <UAlert
      v-if="globalError"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      :title="globalError.title"
      :description="globalError.description"
      :closable="true"
      @close="globalError = null"
    />
  </UForm>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
interface Props {
  schema: any
  initialState?: Partial<T>
  onSubmit: (data: T) => Promise<void>
  validateOnChange?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  validateOnChange: true
})

const emit = defineEmits<{
  success: [data: T]
  error: [error: any]
}>()

const formRef = ref()
const formState = reactive<Partial<T>>(props.initialState || {})
const formErrors = reactive<Record<string, string>>({})
const globalError = ref<{ title: string; description: string } | null>(null)
const isSubmitting = ref(false)

const { handleApiError } = useApiErrorHandler()

const handleSubmit = async (event: { data: T }) => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  isSubmitting.value = true
  globalError.value = null
  clearErrors()
  
  try {
    console.log(`[${timestamp}] [SAFE FORM] Submitting form...`)
    
    await props.onSubmit(event.data)
    
    console.log(`[${timestamp}] [SAFE FORM] ✓ Form submitted successfully`)
    
    emit('success', event.data)
    
  } catch (error) {
    console.log(`[${timestamp}] [SAFE FORM] ✗ Form submission failed:`, error)
    
    // Handle validation errors from server
    if (error?.status === 422 && error?.data?.errors) {
      handleServerValidationErrors(error.data.errors)
    } else {
      // Handle other errors
      const errorInfo = handleApiError(error, 'Form Submission', { showToast: false })
      globalError.value = {
        title: errorInfo.title,
        description: errorInfo.description
      }
    }
    
    emit('error', error)
    
  } finally {
    isSubmitting.value = false
  }
}

const handleFormError = (event: any) => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  console.log(`[${timestamp}] [SAFE FORM] ⚠ Form validation errors:`, event.errors)
  
  clearErrors()
  
  event.errors.forEach((error: any) => {
    if (error.path) {
      formErrors[error.path] = error.message
    }
  })
}

const handleServerValidationErrors = (errors: Record<string, string[]>) => {
  clearErrors()
  
  Object.entries(errors).forEach(([field, messages]) => {
    formErrors[field] = messages[0] // Take first error message
  })
}

const clearErrors = () => {
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
  globalError.value = null
}

const reset = () => {
  Object.keys(formState).forEach(key => {
    delete formState[key as keyof T]
  })
  
  if (props.initialState) {
    Object.assign(formState, props.initialState)
  }
  
  clearErrors()
  formRef.value?.clear()
}

// Expose methods to parent
defineExpose({
  reset,
  clearErrors,
  formState,
  formErrors
})
</script>
```

---

**Última Atualização:** 22/09/2025 00:05:00 (America/Sao_Paulo)  
**Versão:** 1.0.0  
**Status:** Padrões de Debugging Implementados  
**Responsável:** Dutt eCommerce Website Design

Este sistema de debugging e error handling fornece estruturas robustas e padronizadas para identificação, tratamento e resolução de problemas em aplicações Nuxt 4 + UI v4, otimizado para máxima eficiência de LLMs.
