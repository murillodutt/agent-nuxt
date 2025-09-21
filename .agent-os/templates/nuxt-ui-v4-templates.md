# Nuxt UI v4 Templates - Agent OS

## Context

Templates padronizados para desenvolvimento rápido e consistente com Nuxt UI v4, incluindo componentes, páginas, layouts e padrões de implementação.

## Component Templates

### 1. Basic Component Template

```vue
<!-- .agent-os/templates/component-basic.vue -->
<template>
  <div 
    :class="ui.wrapper"
    v-bind="attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  /**
   * Component variant
   */
  variant?: 'default' | 'primary' | 'secondary'
  /**
   * Component size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Loading state
   */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const attrs = useAttrs()

// Nuxt UI v4 configuration
const ui = computed(() => ({
  wrapper: [
    'inline-flex items-center justify-center',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    // Variant styles
    {
      'bg-white text-gray-900 border border-gray-300': props.variant === 'default',
      'bg-primary-500 text-white': props.variant === 'primary',
      'bg-gray-100 text-gray-900': props.variant === 'secondary'
    },
    // Size styles
    {
      'px-2 py-1 text-xs': props.size === 'xs',
      'px-3 py-1.5 text-sm': props.size === 'sm',
      'px-4 py-2 text-base': props.size === 'md',
      'px-6 py-3 text-lg': props.size === 'lg',
      'px-8 py-4 text-xl': props.size === 'xl'
    },
    // State styles
    {
      'opacity-50 cursor-not-allowed': props.disabled,
      'animate-pulse': props.loading
    }
  ]
}))

// Accessibility
const ariaLabel = computed(() => {
  if (props.loading) return 'Loading...'
  if (props.disabled) return 'Disabled'
  return undefined
})

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!props.disabled && !props.loading) {
      emit('click', event as any)
    }
  }
}
</script>
```

### 2. Form Component Template

```vue
<!-- .agent-os/templates/form-component.vue -->
<template>
  <div :class="ui.wrapper">
    <label 
      v-if="label"
      :for="inputId"
      :class="ui.label"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div :class="ui.inputWrapper">
      <input
        :id="inputId"
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-describedby="errorId"
        :aria-invalid="!!error"
        :class="ui.input"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="loading" :class="ui.loading">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
      </div>
    </div>
    
    <p 
      v-if="error"
      :id="errorId"
      :class="ui.error"
      role="alert"
    >
      {{ error }}
    </p>
    
    <p 
      v-else-if="hint"
      :class="ui.hint"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  required?: boolean
  disabled?: boolean
  loading?: boolean
  error?: string
  hint?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// Generate unique IDs for accessibility
const inputId = useId()
const errorId = `${inputId}-error`

// Two-way binding
const modelValue = useVModel(props, 'modelValue', emit)

// Nuxt UI v4 styling
const ui = computed(() => ({
  wrapper: 'space-y-2',
  label: [
    'block text-sm font-medium',
    props.error ? 'text-red-700' : 'text-gray-700'
  ],
  inputWrapper: 'relative',
  input: [
    'block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset',
    'placeholder:text-gray-400 focus:ring-2 focus:ring-inset',
    'sm:text-sm sm:leading-6 transition-colors',
    // Size variants
    {
      'px-2 py-1 text-xs': props.size === 'xs',
      'px-2.5 py-1.5 text-sm': props.size === 'sm',
      'px-3 py-2 text-base': props.size === 'md',
      'px-4 py-3 text-lg': props.size === 'lg'
    },
    // State variants
    {
      'ring-gray-300 focus:ring-primary-600': !props.error,
      'ring-red-300 focus:ring-red-600 text-red-900': props.error,
      'bg-gray-50 text-gray-500 cursor-not-allowed': props.disabled
    }
  ],
  loading: 'absolute inset-y-0 right-0 flex items-center pr-3',
  error: 'text-sm text-red-600',
  hint: 'text-sm text-gray-500'
}))

// Event handlers
const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}
</script>
```

### 3. Modal Component Template

```vue
<!-- .agent-os/templates/modal-component.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        :class="ui.overlay"
        @click="handleOverlayClick"
      >
        <div
          ref="modalRef"
          :class="ui.modal"
          role="dialog"
          :aria-labelledby="titleId"
          :aria-describedby="descriptionId"
          aria-modal="true"
          @click.stop
        >
          <!-- Header -->
          <div v-if="$slots.header || title" :class="ui.header">
            <slot name="header">
              <h3 :id="titleId" :class="ui.title">
                {{ title }}
              </h3>
            </slot>
            
            <button
              v-if="closable"
              type="button"
              :class="ui.closeButton"
              @click="close"
              aria-label="Close modal"
            >
              <UIcon name="i-heroicons-x-mark" />
            </button>
          </div>
          
          <!-- Body -->
          <div :class="ui.body">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" :class="ui.footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnOverlay?: boolean
  preventClose?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  preventClose: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  open: []
}>()

// Template refs
const modalRef = ref<HTMLElement>()

// Generate unique IDs
const titleId = useId()
const descriptionId = useId()

// Two-way binding
const modelValue = useVModel(props, 'modelValue', emit)

// Nuxt UI v4 styling
const ui = computed(() => ({
  overlay: [
    'fixed inset-0 z-50 flex items-center justify-center',
    'bg-black/50 backdrop-blur-sm p-4'
  ],
  modal: [
    'relative bg-white rounded-lg shadow-xl',
    'max-h-[90vh] overflow-hidden flex flex-col',
    // Size variants
    {
      'max-w-xs': props.size === 'xs',
      'max-w-sm': props.size === 'sm',
      'max-w-md': props.size === 'md',
      'max-w-lg': props.size === 'lg',
      'max-w-4xl': props.size === 'xl',
      'max-w-full h-full': props.size === 'full'
    }
  ],
  header: 'flex items-center justify-between p-6 border-b border-gray-200',
  title: 'text-lg font-semibold text-gray-900',
  closeButton: [
    'p-1 rounded-md text-gray-400 hover:text-gray-600',
    'focus:outline-none focus:ring-2 focus:ring-primary-500'
  ],
  body: 'flex-1 overflow-y-auto p-6',
  footer: 'flex justify-end gap-3 p-6 border-t border-gray-200'
}))

// Modal management
const close = () => {
  if (!props.preventClose) {
    modelValue.value = false
    emit('close')
  }
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closable) {
    close()
  }
}

// Focus management
const focusModal = () => {
  nextTick(() => {
    modalRef.value?.focus()
  })
}

// Watchers
watch(modelValue, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
    focusModal()
    emit('open')
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>
```

## Page Templates

### 1. Standard Page Template

```vue
<!-- .agent-os/templates/page-standard.vue -->
<template>
  <div>
    <!-- SEO Head -->
    <Head>
      <Title>{{ pageTitle }}</Title>
      <Meta name="description" :content="pageDescription" />
      <Meta property="og:title" :content="pageTitle" />
      <Meta property="og:description" :content="pageDescription" />
    </Head>
    
    <!-- Page Header -->
    <header v-if="showHeader" class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ pageTitle }}
            </h1>
            <p v-if="pageDescription" class="mt-2 text-gray-600">
              {{ pageDescription }}
            </p>
          </div>
          
          <div v-if="$slots.actions" class="flex gap-3">
            <slot name="actions" />
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumbs -->
      <nav v-if="breadcrumbs.length" class="mb-6" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li v-for="(crumb, index) in breadcrumbs" :key="index">
            <div class="flex items-center">
              <UIcon 
                v-if="index > 0" 
                name="i-heroicons-chevron-right" 
                class="w-4 h-4 text-gray-400 mr-2" 
              />
              <NuxtLink
                v-if="crumb.to"
                :to="crumb.to"
                class="text-gray-500 hover:text-gray-700"
              >
                {{ crumb.label }}
              </NuxtLink>
              <span v-else class="text-gray-900 font-medium">
                {{ crumb.label }}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      
      <!-- Page Content -->
      <div class="space-y-6">
        <slot />
      </div>
    </main>
    
    <!-- Loading State -->
    <div v-if="loading" class="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
      <div class="text-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-600 mx-auto" />
        <p class="mt-2 text-gray-600">{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Breadcrumb {
  label: string
  to?: string
}

interface Props {
  pageTitle: string
  pageDescription?: string
  showHeader?: boolean
  breadcrumbs?: Breadcrumb[]
  loading?: boolean
  loadingMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  breadcrumbs: () => [],
  loading: false,
  loadingMessage: 'Loading...'
})

// Page metadata
useSeoMeta({
  title: props.pageTitle,
  description: props.pageDescription,
  ogTitle: props.pageTitle,
  ogDescription: props.pageDescription
})
</script>
```

### 2. Dashboard Page Template

```vue
<!-- .agent-os/templates/page-dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              {{ dashboardTitle }}
            </h1>
          </div>
          
          <div class="flex items-center gap-4">
            <slot name="nav-actions" />
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Layout -->
    <div class="flex">
      <!-- Sidebar -->
      <aside v-if="showSidebar" class="w-64 bg-white shadow-sm min-h-screen">
        <nav class="p-4 space-y-2">
          <slot name="sidebar" />
        </nav>
      </aside>
      
      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Stats Grid -->
        <div v-if="stats.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white rounded-lg shadow p-6"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UIcon :name="stat.icon" class="w-8 h-8 text-primary-600" />
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
                <p v-if="stat.change" :class="[
                  'text-sm',
                  stat.change > 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Dashboard Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Stat {
  label: string
  value: string | number
  icon: string
  change?: number
}

interface Props {
  dashboardTitle: string
  showSidebar?: boolean
  stats?: Stat[]
}

const props = withDefaults(defineProps<Props>(), {
  showSidebar: true,
  stats: () => []
})
</script>
```

## Layout Templates

### 1. Default Layout Template

```vue
<!-- .agent-os/templates/layout-default.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center">
              <img src="/logo.svg" alt="Logo" class="h-8 w-auto" />
              <span class="ml-2 text-xl font-bold text-gray-900">
                {{ appName }}
              </span>
            </NuxtLink>
          </div>
          
          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-primary-600"
            >
              {{ item.name }}
            </NuxtLink>
          </nav>
          
          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <slot name="header-actions" />
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main>
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-500 text-sm">
          © {{ currentYear }} {{ appName }}. All rights reserved.
        </div>
      </div>
    </footer>
    
    <!-- Notifications -->
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
interface NavigationItem {
  name: string
  href: string
}

interface Props {
  appName?: string
  navigation?: NavigationItem[]
}

const props = withDefaults(defineProps<Props>(), {
  appName: 'App Name',
  navigation: () => [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]
})

const currentYear = new Date().getFullYear()
</script>
```

## Composable Templates

### 1. API Composable Template

```typescript
// .agent-os/templates/composable-api.ts
export const useApiTemplate = <T = any>(endpoint: string) => {
  const { $fetch } = useNuxtApp()
  
  // State
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Methods
  const fetch = async (params?: Record<string, any>) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch<T>(endpoint, {
        params,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      data.value = response
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const create = async (payload: Partial<T>) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch<T>(endpoint, {
        method: 'POST',
        body: payload
      })
      
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const update = async (id: string | number, payload: Partial<T>) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await $fetch<T>(`${endpoint}/${id}`, {
        method: 'PUT',
        body: payload
      })
      
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const remove = async (id: string | number) => {
    try {
      loading.value = true
      error.value = null
      
      await $fetch(`${endpoint}/${id}`, {
        method: 'DELETE'
      })
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Auto-fetch on mount
  onMounted(() => {
    fetch()
  })
  
  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    fetch,
    create,
    update,
    remove,
    refresh: fetch
  }
}
```

### 2. Form Composable Template

```typescript
// .agent-os/templates/composable-form.ts
export const useFormTemplate = <T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Record<keyof T, (value: any) => string | null>
) => {
  // State
  const values = ref<T>({ ...initialValues })
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})
  const submitting = ref(false)
  
  // Computed
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })
  
  const isDirty = computed(() => {
    return JSON.stringify(values.value) !== JSON.stringify(initialValues)
  })
  
  // Methods
  const validate = (field?: keyof T) => {
    if (!validationRules) return true
    
    const fieldsToValidate = field ? [field] : Object.keys(validationRules) as (keyof T)[]
    
    for (const fieldName of fieldsToValidate) {
      const rule = validationRules[fieldName]
      const value = values.value[fieldName]
      const error = rule(value)
      
      if (error) {
        errors.value[fieldName] = error
      } else {
        delete errors.value[fieldName]
      }
    }
    
    return Object.keys(errors.value).length === 0
  }
  
  const setFieldValue = (field: keyof T, value: any) => {
    values.value[field] = value
    touched.value[field] = true
    validate(field)
  }
  
  const setFieldError = (field: keyof T, error: string) => {
    errors.value[field] = error
  }
  
  const clearFieldError = (field: keyof T) => {
    delete errors.value[field]
  }
  
  const reset = () => {
    values.value = { ...initialValues }
    errors.value = {}
    touched.value = {}
    submitting.value = false
  }
  
  const submit = async (onSubmit: (values: T) => Promise<void> | void) => {
    // Mark all fields as touched
    Object.keys(values.value).forEach(key => {
      touched.value[key as keyof T] = true
    })
    
    // Validate all fields
    if (!validate()) {
      return false
    }
    
    try {
      submitting.value = true
      await onSubmit(values.value)
      return true
    } catch (error) {
      console.error('Form submission error:', error)
      return false
    } finally {
      submitting.value = false
    }
  }
  
  return {
    values,
    errors: readonly(errors),
    touched: readonly(touched),
    submitting: readonly(submitting),
    isValid,
    isDirty,
    validate,
    setFieldValue,
    setFieldError,
    clearFieldError,
    reset,
    submit
  }
}
```

## Testing Templates

### 1. Component Test Template

```typescript
// .agent-os/templates/test-component.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentName from '~/components/ComponentName.vue'

describe('ComponentName', () => {
  let wrapper: any
  
  beforeEach(() => {
    wrapper = mount(ComponentName, {
      props: {
        // Default props
      }
    })
  })
  
  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })
  
  it('displays the correct content', () => {
    expect(wrapper.text()).toContain('Expected text')
  })
  
  it('emits events correctly', async () => {
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
  
  it('handles props correctly', async () => {
    await wrapper.setProps({ variant: 'primary' })
    expect(wrapper.classes()).toContain('primary-variant-class')
  })
  
  it('is accessible', () => {
    // Test ARIA attributes
    expect(wrapper.attributes('role')).toBeDefined()
    expect(wrapper.attributes('aria-label')).toBeDefined()
  })
  
  it('handles keyboard navigation', async () => {
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### 2. Composable Test Template

```typescript
// .agent-os/templates/test-composable.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useComposableName } from '~/composables/useComposableName'

describe('useComposableName', () => {
  let composable: ReturnType<typeof useComposableName>
  
  beforeEach(() => {
    composable = useComposableName()
  })
  
  it('initializes with correct default values', () => {
    expect(composable.data.value).toBeNull()
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBeNull()
  })
  
  it('handles async operations correctly', async () => {
    const promise = composable.fetch()
    expect(composable.loading.value).toBe(true)
    
    await promise
    expect(composable.loading.value).toBe(false)
    expect(composable.data.value).toBeDefined()
  })
  
  it('handles errors gracefully', async () => {
    // Mock error scenario
    try {
      await composable.fetch()
    } catch (error) {
      expect(composable.error.value).toBeTruthy()
      expect(composable.loading.value).toBe(false)
    }
  })
})
```

Estes templates fornecem uma base sólida e consistente para desenvolvimento rápido com Nuxt UI v4, seguindo as melhores práticas de acessibilidade, performance e manutenibilidade.