# Padrões Nuxt UI v4 - Agent OS

## Visão Geral
Padrões de desenvolvimento específicos para Nuxt UI v4, garantindo consistência, acessibilidade e performance em todos os componentes gerados pelo Agent OS.

## Estrutura de Componentes

### Anatomia Padrão de Componente
```vue
<template>
  <!-- Container principal com classes base -->
  <div :class="containerClasses">
    <!-- Slot para conteúdo customizável -->
    <slot name="prepend" />
    
    <!-- Conteúdo principal -->
    <div class="component-content">
      <slot />
    </div>
    
    <!-- Slot para conteúdo adicional -->
    <slot name="append" />
  </div>
</template>

<script setup lang="ts">
// Definição de tipos TypeScript obrigatória
interface ComponentProps {
  variant?: 'default' | 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

// Props com valores padrão
const props = withDefaults(defineProps<ComponentProps>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  loading: false
})

// Classes computadas para reatividade
const containerClasses = computed(() => [
  'component-base',
  `component-${props.variant}`,
  `component-${props.size}`,
  {
    'component-disabled': props.disabled,
    'component-loading': props.loading
  }
])
</script>
```

## Sistema de Nomenclatura

### Convenções de Nomes
```typescript
// Componentes: PascalCase
const componentNames = {
  button: 'UButton',
  input: 'UInput',
  modal: 'UModal',
  card: 'UCard',
  table: 'UTable'
}

// Props: camelCase
interface StandardProps {
  isVisible: boolean
  hasError: boolean
  itemCount: number
  maxLength: number
}

// Classes CSS: kebab-case com prefixo
const cssClasses = {
  base: 'u-component',
  variant: 'u-component--primary',
  state: 'u-component--disabled',
  element: 'u-component__element'
}

// Composables: camelCase com prefixo use
const composables = {
  theme: 'useTheme',
  toast: 'useToast',
  modal: 'useModal',
  form: 'useForm'
}
```

### Estrutura de Arquivos
```
components/
├── ui/
│   ├── Button/
│   │   ├── UButton.vue
│   │   ├── UButton.stories.ts
│   │   ├── UButton.test.ts
│   │   └── index.ts
│   ├── Input/
│   │   ├── UInput.vue
│   │   ├── UInputGroup.vue
│   │   ├── UInput.stories.ts
│   │   ├── UInput.test.ts
│   │   └── index.ts
│   └── index.ts
```

## Padrões de Props

### Props Obrigatórias
```typescript
// Todas as props devem ter tipos explícitos
interface BaseComponentProps {
  // Identificação única (quando necessário)
  id?: string
  
  // Classes CSS customizadas
  class?: string | string[] | Record<string, boolean>
  
  // Acessibilidade
  ariaLabel?: string
  ariaDescribedby?: string
  
  // Estados comuns
  disabled?: boolean
  loading?: boolean
  readonly?: boolean
}

// Props específicas por tipo de componente
interface InteractiveProps extends BaseComponentProps {
  // Elementos interativos
  tabindex?: number
  autofocus?: boolean
}

interface FormProps extends BaseComponentProps {
  // Elementos de formulário
  name?: string
  required?: boolean
  placeholder?: string
  value?: any
}
```

### Validação de Props
```typescript
// Validadores customizados
const sizeValidator = (value: string) => {
  return ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
}

const variantValidator = (value: string) => {
  return ['default', 'primary', 'secondary', 'success', 'warning', 'error'].includes(value)
}

// Implementação em componente
defineProps<{
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}>()
```

## Sistema de Slots

### Slots Padrão
```vue
<template>
  <div class="component-wrapper">
    <!-- Slot de ícone/prepend -->
    <slot name="leading" />
    
    <!-- Conteúdo principal -->
    <div class="component-content">
      <slot />
    </div>
    
    <!-- Slot de ação/append -->
    <slot name="trailing" />
    
    <!-- Slot condicional para estados -->
    <slot v-if="loading" name="loading">
      <USpinner />
    </slot>
    
    <slot v-if="hasError" name="error">
      <UAlert variant="error" />
    </slot>
  </div>
</template>
```

### Slots com Escopo
```vue
<template>
  <div>
    <!-- Slot com dados do componente -->
    <slot 
      name="item" 
      v-for="(item, index) in items"
      :key="item.id"
      :item="item"
      :index="index"
      :isSelected="selectedItems.includes(item.id)"
      :select="() => selectItem(item.id)"
      :deselect="() => deselectItem(item.id)"
    />
    
    <!-- Slot de fallback -->
    <slot name="empty" v-if="items.length === 0">
      <div class="empty-state">
        <p>Nenhum item encontrado</p>
      </div>
    </slot>
  </div>
</template>
```

## Padrões de Eventos

### Eventos Padrão
```typescript
// Definição de eventos
interface ComponentEmits {
  // Eventos de mudança de estado
  'update:modelValue': [value: any]
  'change': [value: any, previousValue: any]
  
  // Eventos de interação
  'click': [event: MouseEvent]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  
  // Eventos de validação
  'validate': [isValid: boolean, errors: string[]]
  'error': [error: Error | string]
  
  // Eventos de ciclo de vida
  'mounted': []
  'updated': []
  'destroyed': []
}

// Implementação
const emit = defineEmits<ComponentEmits>()

// Uso com validação
const handleChange = (newValue: any) => {
  const previousValue = modelValue.value
  
  // Validação antes da emissão
  if (validateValue(newValue)) {
    emit('update:modelValue', newValue)
    emit('change', newValue, previousValue)
  } else {
    emit('error', 'Valor inválido')
  }
}
```

## Padrões de Estilo

### Classes Base
```scss
// Estrutura base para todos os componentes
.u-component {
  // Reset e normalização
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  
  // Tipografia base
  font-family: theme('fontFamily.sans');
  font-size: theme('fontSize.base');
  line-height: theme('lineHeight.normal');
  
  // Transições suaves
  transition: all 150ms ease-in-out;
  
  // Estados de foco acessíveis
  &:focus {
    outline: none;
  }
  
  &:focus-visible {
    outline: 2px solid theme('colors.primary.500');
    outline-offset: 2px;
  }
  
  // Estados de interação
  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  // Estado desabilitado
  &:disabled,
  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}
```

### Variantes de Componente
```scss
// Sistema de variantes consistente
.u-button {
  @apply u-component;
  
  // Variante sólida
  &--solid {
    &.u-button--primary {
      @apply bg-primary-600 text-white;
      @apply hover:bg-primary-700;
      @apply focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
    }
    
    &.u-button--secondary {
      @apply bg-gray-600 text-white;
      @apply hover:bg-gray-700;
      @apply focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
    }
  }
  
  // Variante outline
  &--outline {
    &.u-button--primary {
      @apply border border-primary-600 text-primary-600;
      @apply hover:bg-primary-600 hover:text-white;
      @apply focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
    }
  }
  
  // Tamanhos
  &--sm {
    @apply px-2.5 py-1.5 text-xs;
  }
  
  &--md {
    @apply px-3 py-2 text-sm;
  }
  
  &--lg {
    @apply px-4 py-2.5 text-base;
  }
}
```

## Padrões de Composables

### Estrutura Base de Composable
```typescript
// composables/useComponent.ts
export const useComponent = (options?: ComponentOptions) => {
  // Estado reativo
  const state = reactive({
    isVisible: false,
    isLoading: false,
    hasError: false,
    data: null
  })
  
  // Computed properties
  const isReady = computed(() => !state.isLoading && !state.hasError)
  const isEmpty = computed(() => !state.data || (Array.isArray(state.data) && state.data.length === 0))
  
  // Métodos
  const show = () => {
    state.isVisible = true
  }
  
  const hide = () => {
    state.isVisible = false
  }
  
  const toggle = () => {
    state.isVisible = !state.isVisible
  }
  
  const setLoading = (loading: boolean) => {
    state.isLoading = loading
  }
  
  const setError = (error: string | Error | null) => {
    state.hasError = !!error
    if (error) {
      console.error('Component error:', error)
    }
  }
  
  // Lifecycle
  onMounted(() => {
    // Inicialização
  })
  
  onUnmounted(() => {
    // Limpeza
  })
  
  // Return público
  return {
    // Estado (readonly)
    ...toRefs(readonly(state)),
    
    // Computed
    isReady,
    isEmpty,
    
    // Métodos
    show,
    hide,
    toggle,
    setLoading,
    setError
  }
}
```

### Composables Específicos
```typescript
// useToast.ts
export const useToast = () => {
  const toasts = ref<Toast[]>([])
  
  const add = (toast: Partial<Toast>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      title: '',
      description: '',
      variant: 'default',
      duration: 5000,
      ...toast
    }
    
    toasts.value.push(newToast)
    
    if (newToast.duration > 0) {
      setTimeout(() => remove(id), newToast.duration)
    }
    
    return id
  }
  
  const remove = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const clear = () => {
    toasts.value = []
  }
  
  // Métodos de conveniência
  const success = (message: string, options?: Partial<Toast>) => {
    return add({ description: message, variant: 'success', ...options })
  }
  
  const error = (message: string, options?: Partial<Toast>) => {
    return add({ description: message, variant: 'error', ...options })
  }
  
  const warning = (message: string, options?: Partial<Toast>) => {
    return add({ description: message, variant: 'warning', ...options })
  }
  
  const info = (message: string, options?: Partial<Toast>) => {
    return add({ description: message, variant: 'info', ...options })
  }
  
  return {
    toasts: readonly(toasts),
    add,
    remove,
    clear,
    success,
    error,
    warning,
    info
  }
}
```

## Padrões de Testes

### Testes de Componente
```typescript
// Button.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UButton from './UButton.vue'

describe('UButton', () => {
  it('renderiza corretamente', () => {
    const wrapper = mount(UButton, {
      props: {
        variant: 'primary'
      },
      slots: {
        default: 'Clique aqui'
      }
    })
    
    expect(wrapper.text()).toBe('Clique aqui')
    expect(wrapper.classes()).toContain('u-button--primary')
  })
  
  it('emite evento de click', async () => {
    const wrapper = mount(UButton)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
  
  it('não emite evento quando desabilitado', async () => {
    const wrapper = mount(UButton, {
      props: {
        disabled: true
      }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeUndefined()
  })
  
  it('aplica classes de acessibilidade', () => {
    const wrapper = mount(UButton, {
      props: {
        ariaLabel: 'Botão de teste'
      }
    })
    
    expect(wrapper.attributes('aria-label')).toBe('Botão de teste')
  })
})
```

### Testes de Acessibilidade
```typescript
// accessibility.test.ts
import { mount } from '@vue/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import UButton from './UButton.vue'

expect.extend(toHaveNoViolations)

describe('Acessibilidade UButton', () => {
  it('não deve ter violações de acessibilidade', async () => {
    const wrapper = mount(UButton, {
      slots: {
        default: 'Botão acessível'
      }
    })
    
    const results = await axe(wrapper.element)
    expect(results).toHaveNoViolations()
  })
  
  it('deve ser navegável por teclado', async () => {
    const wrapper = mount(UButton)
    const button = wrapper.find('button')
    
    // Simular navegação por Tab
    await button.trigger('keydown', { key: 'Tab' })
    expect(document.activeElement).toBe(button.element)
    
    // Simular ativação por Enter
    await button.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('click')).toHaveLength(1)
    
    // Simular ativação por Space
    await button.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('click')).toHaveLength(2)
  })
})
```

## Padrões de Performance

### Lazy Loading
```vue
<template>
  <div>
    <!-- Componente carregado sob demanda -->
    <Suspense>
      <template #default>
        <LazyComponent v-if="shouldLoad" />
      </template>
      <template #fallback>
        <USkeleton />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
// Importação lazy
const LazyComponent = defineAsyncComponent(() => import('./LazyComponent.vue'))

// Carregamento condicional
const shouldLoad = ref(false)

// Intersection Observer para carregamento sob demanda
const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      shouldLoad.value = true
      stop() // Para de observar após carregar
    }
  }
)
</script>
```

### Otimização de Renderização
```vue
<script setup lang="ts">
// Memoização de computed properties caras
const expensiveComputation = computed(() => {
  return heavyCalculation(props.data)
})

// Debounce para inputs
const debouncedValue = refDebounced(inputValue, 300)

// Throttle para eventos de scroll
const { throttledFn } = useThrottleFn(handleScroll, 16) // 60fps

// Virtual scrolling para listas grandes
const { list, containerProps, wrapperProps } = useVirtualList(
  items,
  {
    itemHeight: 50,
    overscan: 5
  }
)
</script>
```

## Documentação de Componentes

### Storybook Stories
```typescript
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
import UButton from './UButton.vue'

const meta: Meta<typeof UButton> = {
  title: 'Components/Button',
  component: UButton,
  parameters: {
    docs: {
      description: {
        component: 'Componente de botão acessível e customizável'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error']
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl']
    }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default'
  },
  render: (args) => ({
    components: { UButton },
    setup() {
      return { args }
    },
    template: '<UButton v-bind="args">Botão Padrão</UButton>'
  })
}

export const AllVariants: Story = {
  render: () => ({
    components: { UButton },
    template: `
      <div class="space-y-4">
        <UButton variant="default">Default</UButton>
        <UButton variant="primary">Primary</UButton>
        <UButton variant="secondary">Secondary</UButton>
        <UButton variant="success">Success</UButton>
        <UButton variant="warning">Warning</UButton>
        <UButton variant="error">Error</UButton>
      </div>
    `
  })
}
```

## Checklist de Qualidade

### Antes de Criar Componente
- [ ] Definir interface TypeScript completa
- [ ] Implementar acessibilidade WCAG 2.1 AA
- [ ] Criar testes unitários e de acessibilidade
- [ ] Documentar no Storybook
- [ ] Validar performance
- [ ] Revisar padrões de nomenclatura
- [ ] Implementar estados de loading/error
- [ ] Testar responsividade
- [ ] Validar contraste de cores
- [ ] Implementar navegação por teclado

### Após Implementação
- [ ] Executar testes automatizados
- [ ] Validar com axe-core
- [ ] Testar em diferentes navegadores
- [ ] Validar com screen readers
- [ ] Medir performance (Lighthouse)
- [ ] Revisar código com equipe
- [ ] Atualizar documentação
- [ ] Criar exemplos de uso
- [ ] Validar integração com tema
- [ ] Testar modo escuro