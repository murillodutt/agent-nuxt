# Requisitos de Acessibilidade - WCAG 2.1 AA

## Visão Geral
Especificação completa de requisitos de acessibilidade para garantir conformidade WCAG 2.1 AA em todos os componentes Nuxt UI v4, proporcionando experiência inclusiva para todos os usuários.

## Princípios WCAG 2.1

### 1. Perceptível
Informações e componentes da interface devem ser apresentados de forma que os usuários possam percebê-los.

### 2. Operável  
Componentes da interface e navegação devem ser operáveis por todos os usuários.

### 3. Compreensível
Informações e operação da interface devem ser compreensíveis.

### 4. Robusto
Conteúdo deve ser robusto o suficiente para ser interpretado por diversos agentes de usuário, incluindo tecnologias assistivas.

## Critérios de Conformidade AA

### 1.1 Alternativas em Texto (A)
```typescript
// Implementação obrigatória
interface ImageAccessibility {
  alt: string // Texto alternativo descritivo
  role?: 'img' | 'presentation'
  'aria-describedby'?: string
}

// Exemplo de uso
const accessibleImage = {
  alt: "Gráfico mostrando crescimento de vendas de 25% no último trimestre",
  role: "img",
  "aria-describedby": "chart-description"
}
```

### 1.2 Mídia Baseada em Tempo (A/AA)
```typescript
interface MediaAccessibility {
  captions: boolean // Legendas para vídeos (AA)
  audioDescription?: boolean // Descrição de áudio (AA)
  transcript?: string // Transcrição completa
  controls: boolean // Controles acessíveis
}
```

### 1.3 Adaptável (A/AA)
```typescript
// Estrutura semântica obrigatória
const semanticStructure = {
  headings: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], // Hierarquia lógica
  landmarks: ['main', 'nav', 'aside', 'footer', 'header'],
  lists: ['ul', 'ol', 'dl'], // Listas estruturadas
  tables: {
    headers: true, // th elements
    scope: 'col | row', // Escopo definido
    caption: string // Descrição da tabela
  }
}
```

### 1.4 Distinguível (A/AA)
```typescript
// Contraste de cores (AA)
const contrastRequirements = {
  normalText: 4.5, // Razão mínima 4.5:1
  largeText: 3.0,  // Razão mínima 3:1 (18pt+ ou 14pt+ bold)
  nonTextElements: 3.0, // Elementos gráficos e controles
  
  // Validação automática
  validateContrast: (foreground: string, background: string) => {
    const ratio = calculateContrastRatio(foreground, background)
    return {
      passes: ratio >= 4.5,
      ratio,
      level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail'
    }
  }
}

// Redimensionamento de texto (AA)
const textScaling = {
  maxZoom: '200%', // Até 200% sem perda de funcionalidade
  responsive: true,
  noHorizontalScroll: true
}
```

### 2.1 Acessível por Teclado (A)
```typescript
// Navegação por teclado obrigatória
interface KeyboardAccessibility {
  focusable: boolean // Todos os elementos interativos
  tabIndex: number | 'auto' // Ordem lógica de tabulação
  keyboardShortcuts: KeyboardShortcut[]
  trapFocus?: boolean // Para modais e overlays
}

interface KeyboardShortcut {
  key: string
  modifiers?: ('ctrl' | 'alt' | 'shift' | 'meta')[]
  action: string
  description: string
}

// Implementação padrão
const keyboardPatterns = {
  button: {
    activate: ['Enter', 'Space'],
    description: 'Ativar botão'
  },
  
  menu: {
    open: ['Enter', 'Space', 'ArrowDown'],
    navigate: ['ArrowUp', 'ArrowDown'],
    close: ['Escape'],
    select: ['Enter', 'Space']
  },
  
  modal: {
    close: ['Escape'],
    trapFocus: true,
    returnFocus: true
  },
  
  tabs: {
    navigate: ['ArrowLeft', 'ArrowRight'],
    activate: ['Enter', 'Space'],
    home: ['Home'],
    end: ['End']
  }
}
```

### 2.2 Tempo Suficiente (A/AA)
```typescript
interface TimingAccessibility {
  noTimeLimit?: boolean // Sem limite de tempo (preferível)
  adjustableTimeout?: {
    minimum: number // Mínimo 20 segundos
    extendable: boolean // Usuário pode estender
    warning: number // Aviso antes do timeout
  }
  pauseContent?: boolean // Para conteúdo em movimento
}
```

### 2.3 Convulsões e Reações Físicas (A/AA)
```typescript
const seizurePreventions = {
  flashLimit: 3, // Máximo 3 flashes por segundo
  redFlashLimit: 0.006, // Limite para flashes vermelhos
  reducedMotion: {
    respectPreference: true, // Respeitar prefers-reduced-motion
    alternativeAnimations: true // Animações alternativas
  }
}
```

### 2.4 Navegável (A/AA)
```typescript
// Estrutura de navegação
interface NavigationAccessibility {
  skipLinks: SkipLink[] // Links para pular conteúdo
  pageTitle: string // Título descritivo único
  focusOrder: 'logical' // Ordem lógica de foco
  linkPurpose: 'clear' // Propósito claro dos links
  headingStructure: 'hierarchical' // Estrutura hierárquica
  breadcrumbs?: Breadcrumb[] // Navegação estrutural
}

interface SkipLink {
  href: string
  text: string
  position: 'first' // Primeiro elemento focável
}

// Implementação obrigatória
const skipLinks = [
  { href: '#main-content', text: 'Pular para conteúdo principal' },
  { href: '#navigation', text: 'Pular para navegação' },
  { href: '#search', text: 'Pular para busca' }
]
```

### 2.5 Modalidades de Entrada (AA)
```typescript
interface InputModalityAccessibility {
  pointerGestures: {
    alternatives: boolean // Alternativas para gestos complexos
    singlePointer: boolean // Operação com ponteiro único
  }
  
  pointerCancellation: {
    upEvent: boolean // Execução no evento up
    abort: boolean // Possibilidade de abortar
    undo: boolean // Possibilidade de desfazer
  }
  
  labelInName: {
    accessibleName: string // Nome acessível inclui texto visível
    consistent: boolean // Consistência entre visual e programático
  }
  
  motionActuation: {
    alternatives: boolean // Alternativas para ativação por movimento
    disable: boolean // Possibilidade de desabilitar
  }
}
```

### 3.1 Legível (A)
```typescript
interface ReadabilityAccessibility {
  language: {
    page: string // Idioma da página (lang attribute)
    parts?: LanguagePart[] // Partes em idiomas diferentes
  }
  
  unusualWords: {
    definitions: boolean // Definições disponíveis
    glossary?: string // Link para glossário
  }
  
  abbreviations: {
    expandedForm: boolean // Forma expandida na primeira ocorrência
    title?: string // Atributo title com expansão
  }
}

interface LanguagePart {
  element: HTMLElement
  language: string
}
```

### 3.2 Previsível (A/AA)
```typescript
interface PredictabilityAccessibility {
  onFocus: {
    noContextChange: boolean // Sem mudança de contexto no foco
  }
  
  onInput: {
    noContextChange: boolean // Sem mudança de contexto na entrada
  }
  
  consistentNavigation: {
    sameOrder: boolean // Mesma ordem em páginas relacionadas
    sameLabels: boolean // Mesmos rótulos para mesma funcionalidade
  }
  
  consistentIdentification: {
    sameFunctionality: boolean // Mesma identificação para mesma função
    sameIcons: boolean // Mesmos ícones para mesma função
  }
}
```

### 3.3 Assistência de Entrada (A/AA)
```typescript
interface InputAssistanceAccessibility {
  errorIdentification: {
    automatic: boolean // Identificação automática de erros
    textDescription: boolean // Descrição textual do erro
    location: 'inline' | 'summary' // Localização da mensagem
  }
  
  labelsInstructions: {
    required: boolean // Rótulos para campos obrigatórios
    format: boolean // Formato esperado
    example?: string // Exemplo de entrada válida
  }
  
  errorSuggestion: {
    provided: boolean // Sugestões de correção
    secure: boolean // Não comprometer segurança
  }
  
  errorPrevention: {
    reversible: boolean // Ações reversíveis
    checked: boolean // Dados verificados
    confirmed: boolean // Confirmação para ações importantes
  }
}
```

### 4.1 Compatível (A/AA)
```typescript
interface CompatibilityAccessibility {
  parsing: {
    validHTML: boolean // HTML válido
    uniqueIds: boolean // IDs únicos
    properNesting: boolean // Aninhamento correto
  }
  
  nameRoleValue: {
    programmaticName: boolean // Nome programático
    programmaticRole: boolean // Papel programático  
    programmaticValue: boolean // Valor programático
    userAgentControl: boolean // Controle por agente de usuário
  }
  
  statusMessages: {
    programmatic: boolean // Mensagens programáticas
    ariaLive: 'polite' | 'assertive' // Regiões live apropriadas
    roleStatus: boolean // Role status quando apropriado
  }
}
```

## Implementação em Componentes Nuxt UI v4

### Button Component
```vue
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :aria-pressed="pressed"
    :aria-expanded="expanded"
    :aria-describedby="describedBy"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span v-if="loading" class="sr-only">Carregando...</span>
    <Icon v-if="icon && !loading" :name="icon" />
    <LoadingSpinner v-if="loading" />
    <slot />
  </button>
</template>

<script setup lang="ts">
interface ButtonProps {
  disabled?: boolean
  loading?: boolean
  pressed?: boolean // Para toggle buttons
  expanded?: boolean // Para buttons que controlam outros elementos
  describedBy?: string // ID do elemento que descreve o botão
  icon?: string
}

const handleKeydown = (event: KeyboardEvent) => {
  // Ativação por Enter e Space
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  }
}
</script>
```

### Input Component
```vue
<template>
  <div class="input-group">
    <label 
      :for="inputId"
      class="input-label"
      :class="{ 'sr-only': hideLabel }"
    >
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    
    <input
      :id="inputId"
      v-model="modelValue"
      :type="type"
      :required="required"
      :aria-invalid="hasError"
      :aria-describedby="descriptionIds"
      :placeholder="placeholder"
      class="input-field"
      @blur="validateInput"
    />
    
    <div v-if="description" :id="`${inputId}-description`" class="input-description">
      {{ description }}
    </div>
    
    <div 
      v-if="hasError" 
      :id="`${inputId}-error`" 
      class="input-error"
      role="alert"
      aria-live="polite"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface InputProps {
  label: string
  hideLabel?: boolean
  required?: boolean
  description?: string
  placeholder?: string
  type?: string
  modelValue?: string
}

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
const descriptionIds = computed(() => {
  const ids = []
  if (description) ids.push(`${inputId.value}-description`)
  if (hasError.value) ids.push(`${inputId.value}-error`)
  return ids.join(' ')
})
</script>
```

### Modal Component
```vue
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click="handleOverlayClick"
      @keydown.esc="closeModal"
    >
      <div
        ref="modalRef"
        class="modal-content"
        role="dialog"
        :aria-labelledby="titleId"
        :aria-describedby="descriptionId"
        aria-modal="true"
        tabindex="-1"
      >
        <div class="modal-header">
          <h2 :id="titleId" class="modal-title">
            {{ title }}
          </h2>
          <button
            class="modal-close"
            @click="closeModal"
            aria-label="Fechar modal"
          >
            <Icon name="x" />
          </button>
        </div>
        
        <div :id="descriptionId" class="modal-body">
          <slot />
        </div>
        
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface ModalProps {
  isOpen: boolean
  title: string
}

const modalRef = ref<HTMLElement>()
const previousFocus = ref<HTMLElement>()

// Gerenciamento de foco
const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return
  
  const focusableElements = modalRef.value?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  if (!focusableElements?.length) return
  
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
  
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

watch(isOpen, (newValue) => {
  if (newValue) {
    previousFocus.value = document.activeElement as HTMLElement
    nextTick(() => {
      modalRef.value?.focus()
      document.addEventListener('keydown', trapFocus)
    })
  } else {
    document.removeEventListener('keydown', trapFocus)
    previousFocus.value?.focus()
  }
})
</script>
```

## Testes de Acessibilidade

### Testes Automatizados
```typescript
// playwright-accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Acessibilidade', () => {
  test('deve passar em todos os testes axe-core', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })
  
  test('navegação por teclado', async ({ page }) => {
    await page.goto('/')
    
    // Testar ordem de tabulação
    await page.keyboard.press('Tab')
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName)
    expect(firstFocused).toBe('BUTTON') // Skip link
    
    // Testar ativação por Enter/Space
    await page.keyboard.press('Enter')
    // Verificar se a ação foi executada
  })
  
  test('contraste de cores', async ({ page }) => {
    await page.goto('/')
    
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze()
    
    expect(contrastResults.violations).toEqual([])
  })
})
```

### Checklist de Validação Manual
```markdown
## Checklist de Acessibilidade

### Teclado
- [ ] Todos os elementos interativos são acessíveis por teclado
- [ ] Ordem de tabulação é lógica
- [ ] Indicadores de foco são visíveis
- [ ] Não há armadilhas de teclado
- [ ] Atalhos de teclado funcionam corretamente

### Screen Reader
- [ ] Conteúdo é lido em ordem lógica
- [ ] Elementos têm nomes acessíveis apropriados
- [ ] Estados e propriedades são anunciados
- [ ] Landmarks e headings estruturam o conteúdo
- [ ] Mensagens de erro são anunciadas

### Visual
- [ ] Contraste atende WCAG 2.1 AA (4.5:1)
- [ ] Texto é legível em 200% de zoom
- [ ] Informação não depende apenas de cor
- [ ] Elementos têm tamanho mínimo de 44x44px
- [ ] Animações respeitam prefers-reduced-motion

### Formulários
- [ ] Todos os campos têm labels associados
- [ ] Campos obrigatórios são identificados
- [ ] Erros são identificados e explicados
- [ ] Instruções são fornecidas quando necessário
- [ ] Validação não remove contexto
```

## Ferramentas de Desenvolvimento

### ESLint Plugin A11y
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue-a11y/recommended'
  ],
  
  rules: {
    // Regras específicas de acessibilidade
    'vue-a11y/alt-text': 'error',
    'vue-a11y/anchor-has-content': 'error',
    'vue-a11y/click-events-have-key-events': 'error',
    'vue-a11y/form-control-has-label': 'error',
    'vue-a11y/heading-has-content': 'error',
    'vue-a11y/label-has-for': 'error',
    'vue-a11y/no-autofocus': 'error',
    'vue-a11y/no-onchange': 'error',
    'vue-a11y/tabindex-no-positive': 'error'
  }
}
```

### Composable de Acessibilidade
```typescript
// composables/useAccessibility.ts
export const useAccessibility = () => {
  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
  
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
    
    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()
    
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }
  
  return {
    announceToScreenReader,
    trapFocus
  }
}
```