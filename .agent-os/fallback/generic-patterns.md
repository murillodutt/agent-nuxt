# Padrões Genéricos de Fallback - Agent OS

## Visão Geral
Padrões de fallback para situações onde componentes específicos do Nuxt UI v4 não estão disponíveis ou quando é necessário implementar funcionalidades customizadas mantendo consistência com os padrões estabelecidos.

## Princípios de Fallback

### 1. Consistência Visual
- Manter a mesma linguagem visual do Nuxt UI v4
- Usar tokens de design consistentes (cores, espaçamento, tipografia)
- Preservar comportamentos de interação esperados
- Garantir acessibilidade em todos os fallbacks

### 2. Compatibilidade Funcional
- Manter a mesma API de props quando possível
- Preservar eventos e slots esperados
- Garantir compatibilidade com composables do Nuxt UI
- Suportar temas e modo escuro

### 3. Performance
- Implementar lazy loading quando apropriado
- Otimizar para tree-shaking
- Minimizar dependências externas
- Usar técnicas de otimização do Vue 3

## Padrões de Componentes Base

### 1. Estrutura de Componente Genérico
```vue
<template>
  <component
    :is="tag"
    :class="componentClasses"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    v-bind="$attrs"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot name="leading" />
    
    <span v-if="$slots.default" class="component-content">
      <slot />
    </span>
    
    <slot name="trailing" />
  </component>
</template>

<script setup lang="ts">
interface Props {
  // Props base para todos os componentes
  variant?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  disabled?: boolean
  loading?: boolean
  tag?: string
  
  // Acessibilidade
  ariaLabel?: string
  ariaDescribedby?: string
  
  // Customização
  class?: string
  ui?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  color: 'primary',
  disabled: false,
  loading: false,
  tag: 'div'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  keydown: [event: KeyboardEvent]
}>()

// Composables base
const { ui, attrs } = useUI('component', toRef(props, 'ui'), config)
const { size, rounded } = useInjectButtonGroup({ ui, props })

// Classes computadas
const componentClasses = computed(() => {
  return twMerge(clsx(
    ui.value.base,
    ui.value.variant[props.variant],
    ui.value.size[size.value],
    ui.value.color[props.color],
    props.disabled && ui.value.disabled,
    props.loading && ui.value.loading,
    props.class
  ))
})

// Handlers de eventos
const handleClick = (event: MouseEvent) => {
  if (props.disabled || props.loading) return
  emit('click', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.loading) return
  
  // Suporte básico a teclado
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick(event as any)
  }
  
  emit('keydown', event)
}

// Configuração UI padrão
const config = {
  base: 'inline-flex items-center justify-center gap-x-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  variant: {
    solid: 'text-white shadow-sm',
    outline: 'border border-current bg-transparent',
    ghost: 'bg-transparent',
    link: 'text-current underline-offset-4 hover:underline'
  },
  size: {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-2.5 py-1.5',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2.5',
    xl: 'text-base px-6 py-3'
  },
  color: {
    primary: 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500',
    success: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
    error: 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
  },
  disabled: 'opacity-50 cursor-not-allowed',
  loading: 'cursor-wait'
}
</script>
```

### 2. Padrão de Input Genérico
```vue
<template>
  <div :class="wrapperClasses">
    <label
      v-if="label"
      :for="inputId"
      :class="labelClasses"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1" aria-label="obrigatório">*</span>
    </label>
    
    <div :class="inputWrapperClasses">
      <slot name="leading" />
      
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        :aria-invalid="!!error"
        :aria-describedby="ariaDescribedby"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <slot name="trailing" />
    </div>
    
    <div v-if="help || error" :class="helpClasses">
      <p v-if="error" :id="`${inputId}-error`" class="text-red-500" role="alert">
        {{ error }}
      </p>
      <p v-else-if="help" :id="`${inputId}-help`" class="text-gray-500">
        {{ help }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  help?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'outline' | 'none'
  color?: string
  ui?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'outline',
  color: 'primary'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

// Refs e composables
const inputRef = ref<HTMLInputElement>()
const inputId = useId()

// Classes computadas
const wrapperClasses = computed(() => 'space-y-2')

const labelClasses = computed(() => 
  'block text-sm font-medium text-gray-700 dark:text-gray-300'
)

const inputWrapperClasses = computed(() => 
  'relative flex items-center'
)

const inputClasses = computed(() => {
  const base = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6'
  
  const variants = {
    outline: 'ring-gray-300 focus:ring-primary-600',
    none: 'ring-transparent focus:ring-transparent'
  }
  
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
    xl: 'px-6 py-3 text-base'
  }
  
  const states = {
    error: 'ring-red-300 focus:ring-red-600',
    disabled: 'bg-gray-50 text-gray-500 cursor-not-allowed',
    readonly: 'bg-gray-50'
  }
  
  return clsx(
    base,
    variants[props.variant],
    sizes[props.size],
    props.error && states.error,
    props.disabled && states.disabled,
    props.readonly && states.readonly
  )
})

const helpClasses = computed(() => 'mt-1 text-sm')

// Computed para aria-describedby
const ariaDescribedby = computed(() => {
  const ids = []
  if (props.help) ids.push(`${inputId}-help`)
  if (props.error) ids.push(`${inputId}-error`)
  return ids.length > 0 ? ids.join(' ') : undefined
})

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

// Métodos públicos
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
})
</script>
```

### 3. Padrão de Modal Genérico
```vue
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        :class="overlayClasses"
        @click="handleOverlayClick"
        @keydown.esc="handleEscape"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            v-if="modelValue"
            ref="modalRef"
            :class="modalClasses"
            role="dialog"
            :aria-modal="true"
            :aria-labelledby="titleId"
            :aria-describedby="descriptionId"
            tabindex="-1"
          >
            <!-- Header -->
            <div v-if="$slots.header || title" :class="headerClasses">
              <slot name="header">
                <h3 :id="titleId" :class="titleClasses">
                  {{ title }}
                </h3>
              </slot>
              
              <button
                v-if="!preventClose"
                type="button"
                :class="closeButtonClasses"
                :aria-label="`Fechar ${title || 'modal'}`"
                @click="close"
              >
                <Icon name="heroicons:x-mark-20-solid" />
              </button>
            </div>
            
            <!-- Body -->
            <div :class="bodyClasses">
              <p v-if="description" :id="descriptionId" :class="descriptionClasses">
                {{ description }}
              </p>
              
              <slot />
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" :class="footerClasses">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title?: string
  description?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  preventClose?: boolean
  ui?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  preventClose: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

// Refs e IDs
const modalRef = ref<HTMLElement>()
const titleId = useId()
const descriptionId = useId()

// Gerenciamento de foco
const { trapped } = useFocusTrap(modalRef, {
  immediate: false,
  escapeDeactivates: false,
  returnFocusOnDeactivate: true
})

// Watchers
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    trapped.value = true
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      modalRef.value?.focus()
    })
  } else {
    trapped.value = false
    document.body.style.overflow = ''
  }
})

// Classes computadas
const overlayClasses = computed(() => 
  'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'
)

const modalClasses = computed(() => {
  const base = 'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-full overflow-auto'
  
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full w-full h-full'
  }
  
  return clsx(base, sizes[props.size])
})

const headerClasses = computed(() => 
  'flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'
)

const titleClasses = computed(() => 
  'text-lg font-semibold text-gray-900 dark:text-white'
)

const closeButtonClasses = computed(() => 
  'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
)

const bodyClasses = computed(() => 'p-6')

const descriptionClasses = computed(() => 
  'text-sm text-gray-600 dark:text-gray-400 mb-4'
)

const footerClasses = computed(() => 
  'flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700'
)

// Event handlers
const close = () => {
  if (props.preventClose) return
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

const handleEscape = () => {
  close()
}

// Cleanup
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>
```

## Padrões de Composables

### 1. Composable de UI Base
```typescript
// composables/useUI.ts
export function useUI(
  key: string,
  ui?: Ref<Record<string, any>>,
  config?: Record<string, any>
) {
  const appConfig = useAppConfig()
  const nuxtUI = appConfig.ui || {}
  
  const componentConfig = computed(() => {
    return defu(
      ui?.value || {},
      nuxtUI[key] || {},
      config || {}
    )
  })
  
  return {
    ui: componentConfig,
    attrs: useAttrs()
  }
}
```

### 2. Composable de Acessibilidade
```typescript
// composables/useAccessibility.ts
export function useAccessibility(options: {
  role?: string
  ariaLabel?: Ref<string>
  ariaDescribedby?: Ref<string>
  keyboardNavigation?: boolean
}) {
  const attrs = computed(() => {
    const result: Record<string, any> = {}
    
    if (options.role) {
      result.role = options.role
    }
    
    if (options.ariaLabel?.value) {
      result['aria-label'] = options.ariaLabel.value
    }
    
    if (options.ariaDescribedby?.value) {
      result['aria-describedby'] = options.ariaDescribedby.value
    }
    
    return result
  })
  
  const keyboardHandlers = options.keyboardNavigation ? {
    onKeydown: (event: KeyboardEvent) => {
      // Implementar navegação por teclado padrão
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        ;(event.target as HTMLElement).click()
      }
    }
  } : {}
  
  return {
    attrs,
    keyboardHandlers
  }
}
```

### 3. Composable de Tema
```typescript
// composables/useTheme.ts
export function useTheme() {
  const colorMode = useColorMode()
  
  const isDark = computed(() => colorMode.value === 'dark')
  
  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
  
  const getThemeClasses = (lightClass: string, darkClass: string) => {
    return computed(() => isDark.value ? darkClass : lightClass)
  }
  
  return {
    isDark,
    toggleTheme,
    getThemeClasses,
    colorMode
  }
}
```

## Padrões de Validação

### 1. Validação de Props
```typescript
// utils/validation.ts
export const validateProps = {
  size: (value: string) => {
    const validSizes = ['xs', 'sm', 'md', 'lg', 'xl']
    return validSizes.includes(value)
  },
  
  variant: (value: string, validVariants: string[]) => {
    return validVariants.includes(value)
  },
  
  color: (value: string) => {
    const validColors = ['primary', 'secondary', 'success', 'warning', 'error', 'info']
    return validColors.includes(value)
  }
}

export const createPropValidator = (validValues: string[]) => {
  return (value: string) => validValues.includes(value)
}
```

### 2. Validação de Acessibilidade
```typescript
// utils/a11y-validation.ts
export const validateAccessibility = {
  hasLabel: (element: HTMLElement) => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.querySelector('label')
    )
  },
  
  hasValidRole: (element: HTMLElement, validRoles: string[]) => {
    const role = element.getAttribute('role')
    return !role || validRoles.includes(role)
  },
  
  hasKeyboardSupport: (element: HTMLElement) => {
    const tabIndex = element.getAttribute('tabindex')
    return element.tagName.toLowerCase() === 'button' || 
           element.tagName.toLowerCase() === 'input' ||
           (tabIndex !== null && tabIndex !== '-1')
  }
}
```

## Padrões de Testes

### 1. Testes de Componente Base
```typescript
// tests/utils/component-test-utils.ts
export const createComponentTest = (component: any, defaultProps = {}) => {
  return {
    mount: (props = {}) => mount(component, {
      props: { ...defaultProps, ...props }
    }),
    
    testAccessibility: async (wrapper: VueWrapper<any>) => {
      const results = await axe(wrapper.html())
      expect(results).toHaveNoViolations()
    },
    
    testKeyboardNavigation: async (wrapper: VueWrapper<any>) => {
      const element = wrapper.find('[tabindex], button, input, select, textarea, a')
      
      if (element.exists()) {
        await element.trigger('keydown', { key: 'Tab' })
        expect(document.activeElement).toBe(element.element)
      }
    },
    
    testProps: (wrapper: VueWrapper<any>, propTests: Record<string, any>) => {
      Object.entries(propTests).forEach(([prop, value]) => {
        wrapper.setProps({ [prop]: value })
        expect(wrapper.props(prop)).toBe(value)
      })
    }
  }
}
```

### 2. Testes de Acessibilidade Padrão
```typescript
// tests/utils/a11y-test-utils.ts
export const testAccessibilityStandards = {
  async testWCAG(wrapper: VueWrapper<any>) {
    const results = await axe(wrapper.html(), {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true }
      }
    })
    
    expect(results.violations).toHaveLength(0)
  },
  
  async testKeyboardNavigation(wrapper: VueWrapper<any>) {
    const focusableElements = wrapper.findAll(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    )
    
    for (const element of focusableElements) {
      element.element.focus()
      expect(document.activeElement).toBe(element.element)
      
      await element.trigger('keydown', { key: 'Enter' })
      // Verificar se o elemento responde adequadamente
    }
  },
  
  testAriaAttributes(wrapper: VueWrapper<any>) {
    const elementsWithAria = wrapper.findAll('[aria-label], [aria-labelledby], [aria-describedby]')
    
    elementsWithAria.forEach(element => {
      const ariaLabel = element.attributes('aria-label')
      const ariaLabelledby = element.attributes('aria-labelledby')
      const ariaDescribedby = element.attributes('aria-describedby')
      
      if (ariaLabelledby) {
        const labelElement = wrapper.find(`#${ariaLabelledby}`)
        expect(labelElement.exists()).toBe(true)
      }
      
      if (ariaDescribedby) {
        const descElement = wrapper.find(`#${ariaDescribedby}`)
        expect(descElement.exists()).toBe(true)
      }
      
      if (ariaLabel) {
        expect(ariaLabel.trim()).not.toBe('')
      }
    })
  }
}
```

## Padrões de Performance

### 1. Lazy Loading de Componentes
```typescript
// utils/lazy-loading.ts
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return defineAsyncComponent({
    loader: importFn,
    loadingComponent: () => h('div', { class: 'animate-pulse bg-gray-200 rounded' }),
    errorComponent: () => h('div', { class: 'text-red-500' }, 'Erro ao carregar componente'),
    delay: 200,
    timeout: 3000
  })
}

export const lazyComponents = {
  UModal: createLazyComponent(() => import('~/components/ui/UModal.vue')),
  UTable: createLazyComponent(() => import('~/components/ui/UTable.vue')),
  UChart: createLazyComponent(() => import('~/components/ui/UChart.vue'))
}
```

### 2. Otimização de Bundle
```typescript
// utils/bundle-optimization.ts
export const optimizeBundle = {
  // Tree-shaking friendly exports
  createSelectiveImport: (components: Record<string, any>) => {
    return new Proxy(components, {
      get(target, prop) {
        if (typeof prop === 'string' && prop in target) {
          return target[prop]
        }
        throw new Error(`Componente ${String(prop)} não encontrado`)
      }
    })
  },
  
  // Code splitting por categoria
  createCategorizedImports: () => ({
    form: () => import('~/components/ui/form/index.ts'),
    navigation: () => import('~/components/ui/navigation/index.ts'),
    feedback: () => import('~/components/ui/feedback/index.ts'),
    overlay: () => import('~/components/ui/overlay/index.ts')
  })
}
```

## Documentação de Fallback

### 1. Template de Documentação
```markdown
# Componente [Nome]

## Visão Geral
Breve descrição do componente e seu propósito.

## Uso Básico
\`\`\`vue
<template>
  <ComponentName
    variant="solid"
    size="md"
    color="primary"
  >
    Conteúdo
  </ComponentName>
</template>
\`\`\`

## Props
| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| variant | string | 'solid' | Variante visual |
| size | string | 'md' | Tamanho do componente |

## Slots
| Slot | Descrição |
|------|-----------|
| default | Conteúdo principal |
| leading | Conteúdo à esquerda |

## Eventos
| Evento | Payload | Descrição |
|--------|---------|-----------|
| click | MouseEvent | Emitido ao clicar |

## Acessibilidade
- [SUCESSO] Navegação por teclado
- [SUCESSO] Suporte a screen readers
- [SUCESSO] Contraste WCAG AA
- [SUCESSO] Foco visível

## Exemplos
### Exemplo Básico
### Exemplo Avançado
### Exemplo de Acessibilidade
```

### 2. Checklist de Implementação
```markdown
# Checklist de Implementação de Fallback

## Funcionalidade
- [ ] Props essenciais implementadas
- [ ] Eventos principais funcionando
- [ ] Slots básicos disponíveis
- [ ] Composables compatíveis

## Acessibilidade
- [ ] Navegação por teclado
- [ ] Atributos ARIA apropriados
- [ ] Contraste de cores adequado
- [ ] Foco visível e gerenciado
- [ ] Suporte a screen readers

## Performance
- [ ] Bundle size otimizado
- [ ] Tree-shaking suportado
- [ ] Lazy loading quando apropriado
- [ ] Sem vazamentos de memória

## Compatibilidade
- [ ] API consistente com Nuxt UI v4
- [ ] Temas e modo escuro
- [ ] Responsividade
- [ ] Browsers suportados

## Testes
- [ ] Testes unitários
- [ ] Testes de acessibilidade
- [ ] Testes E2E básicos
- [ ] Testes de performance

## Documentação
- [ ] README atualizado
- [ ] Exemplos funcionais
- [ ] Props documentadas
- [ ] Guia de migração (se aplicável)
```

---

*Este documento estabelece os padrões de fallback para garantir consistência e qualidade quando componentes específicos do Nuxt UI v4 não estão disponíveis, mantendo os mesmos padrões de acessibilidade, performance e experiência do usuário.*