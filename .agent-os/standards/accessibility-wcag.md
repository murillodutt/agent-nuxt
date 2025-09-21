# Padrões de Acessibilidade WCAG 2.1 AA

## Visão Geral
Padrões obrigatórios de acessibilidade para garantir conformidade WCAG 2.1 AA em todos os componentes e páginas gerados pelo Agent OS, proporcionando experiência inclusiva e acessível.

## Implementação Obrigatória

### Estrutura HTML Semântica
```html
<!-- Estrutura de página obrigatória -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título Descritivo da Página</title>
</head>
<body>
  <!-- Skip links obrigatórios -->
  <a href="#main-content" class="skip-link">Pular para conteúdo principal</a>
  <a href="#navigation" class="skip-link">Pular para navegação</a>
  
  <!-- Header com navegação -->
  <header role="banner">
    <nav role="navigation" aria-label="Navegação principal">
      <!-- Navegação estruturada -->
    </nav>
  </header>
  
  <!-- Conteúdo principal -->
  <main id="main-content" role="main">
    <!-- Conteúdo da página -->
  </main>
  
  <!-- Rodapé -->
  <footer role="contentinfo">
    <!-- Informações de rodapé -->
  </footer>
</body>
</html>
```

### Hierarquia de Cabeçalhos
```html
<!-- Estrutura hierárquica obrigatória -->
<h1>Título Principal da Página</h1>
  <h2>Seção Principal</h2>
    <h3>Subseção</h3>
      <h4>Detalhes da Subseção</h4>
    <h3>Outra Subseção</h3>
  <h2>Segunda Seção Principal</h2>
    <h3>Subseção da Segunda Seção</h3>

<!-- NUNCA pular níveis -->
<!-- [ERRO] Incorreto -->
<h1>Título</h1>
<h3>Subseção</h3> <!-- Pulou h2 -->

<!-- [SUCESSO] Correto -->
<h1>Título</h1>
<h2>Seção</h2>
<h3>Subseção</h3>
```

## Padrões de Componentes Acessíveis

### Botões
```vue
<template>
  <!-- Botão básico -->
  <button
    :class="buttonClasses"
    :disabled="disabled"
    :aria-pressed="pressed"
    :aria-expanded="expanded"
    :aria-describedby="describedBy"
    :aria-label="ariaLabel"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <span v-if="loading" class="sr-only">Carregando...</span>
    <Icon v-if="icon && !loading" :name="icon" :aria-hidden="true" />
    <LoadingSpinner v-if="loading" aria-hidden="true" />
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
  ariaLabel?: string // Label quando texto não é suficiente
  icon?: string
}

const handleKeydown = (event: KeyboardEvent) => {
  // Ativação por Enter e Space (obrigatório)
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!props.disabled && !props.loading) {
      handleClick()
    }
  }
}

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
/* Indicador de foco visível obrigatório */
.button:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Tamanho mínimo de toque (44x44px) */
.button {
  min-height: 44px;
  min-width: 44px;
}

/* Classes para screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
```

### Formulários
```vue
<template>
  <div class="form-group">
    <!-- Label obrigatório e associado -->
    <label 
      :for="inputId"
      class="form-label"
      :class="{ 'sr-only': hideLabel }"
    >
      {{ label }}
      <span v-if="required" class="required-indicator" aria-label="obrigatório">*</span>
    </label>
    
    <!-- Descrição/instruções -->
    <div v-if="description" :id="`${inputId}-description`" class="form-description">
      {{ description }}
    </div>
    
    <!-- Campo de entrada -->
    <input
      :id="inputId"
      v-model="modelValue"
      :type="type"
      :required="required"
      :aria-invalid="hasError"
      :aria-describedby="descriptionIds"
      :aria-errormessage="hasError ? `${inputId}-error` : undefined"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="form-input"
      :class="{ 'form-input--error': hasError }"
      @blur="validateInput"
      @input="clearError"
    />
    
    <!-- Mensagem de erro -->
    <div 
      v-if="hasError" 
      :id="`${inputId}-error`" 
      class="form-error"
      role="alert"
      aria-live="polite"
    >
      <Icon name="exclamation-circle" aria-hidden="true" />
      {{ errorMessage }}
    </div>
    
    <!-- Dica de ajuda -->
    <div v-if="hint" :id="`${inputId}-hint`" class="form-hint">
      {{ hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormInputProps {
  label: string
  hideLabel?: boolean
  required?: boolean
  description?: string
  placeholder?: string
  hint?: string
  type?: string
  autocomplete?: string
  modelValue?: string
  errorMessage?: string
}

// ID único para associação label-input
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// IDs para aria-describedby
const descriptionIds = computed(() => {
  const ids = []
  if (props.description) ids.push(`${inputId.value}-description`)
  if (props.hint) ids.push(`${inputId.value}-hint`)
  if (hasError.value) ids.push(`${inputId.value}-error`)
  return ids.join(' ')
})

const hasError = computed(() => !!props.errorMessage)
</script>
```

### Navegação e Menus
```vue
<template>
  <!-- Menu dropdown -->
  <div class="dropdown" ref="dropdownRef">
    <!-- Trigger button -->
    <button
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :aria-controls="menuId"
      class="dropdown-trigger"
      @click="toggleMenu"
      @keydown="handleTriggerKeydown"
    >
      {{ triggerText }}
      <Icon name="chevron-down" :class="{ 'rotate-180': isOpen }" aria-hidden="true" />
    </button>
    
    <!-- Menu items -->
    <ul
      v-if="isOpen"
      :id="menuId"
      role="menu"
      class="dropdown-menu"
      :aria-labelledby="triggerId"
      @keydown="handleMenuKeydown"
    >
      <li
        v-for="(item, index) in items"
        :key="item.id"
        role="none"
      >
        <button
          :ref="el => menuItems[index] = el"
          role="menuitem"
          :tabindex="focusedIndex === index ? 0 : -1"
          class="dropdown-item"
          @click="selectItem(item)"
          @focus="focusedIndex = index"
        >
          {{ item.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  id: string
  label: string
  action?: () => void
}

interface DropdownProps {
  items: MenuItem[]
  triggerText: string
}

const isOpen = ref(false)
const focusedIndex = ref(0)
const menuItems = ref<HTMLElement[]>([])
const dropdownRef = ref<HTMLElement>()

const menuId = computed(() => `menu-${Math.random().toString(36).substr(2, 9)}`)
const triggerId = computed(() => `trigger-${Math.random().toString(36).substr(2, 9)}`)

// Navegação por teclado obrigatória
const handleTriggerKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
    case 'ArrowDown':
      event.preventDefault()
      openMenu()
      break
    case 'ArrowUp':
      event.preventDefault()
      openMenu()
      focusedIndex.value = props.items.length - 1
      break
  }
}

const handleMenuKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      closeMenu()
      break
    case 'ArrowDown':
      event.preventDefault()
      focusedIndex.value = (focusedIndex.value + 1) % props.items.length
      focusCurrentItem()
      break
    case 'ArrowUp':
      event.preventDefault()
      focusedIndex.value = focusedIndex.value === 0 
        ? props.items.length - 1 
        : focusedIndex.value - 1
      focusCurrentItem()
      break
    case 'Home':
      event.preventDefault()
      focusedIndex.value = 0
      focusCurrentItem()
      break
    case 'End':
      event.preventDefault()
      focusedIndex.value = props.items.length - 1
      focusCurrentItem()
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      selectItem(props.items[focusedIndex.value])
      break
  }
}

const focusCurrentItem = () => {
  nextTick(() => {
    menuItems.value[focusedIndex.value]?.focus()
  })
}

// Gerenciamento de foco
const openMenu = () => {
  isOpen.value = true
  focusedIndex.value = 0
  nextTick(() => {
    focusCurrentItem()
  })
}

const closeMenu = () => {
  isOpen.value = false
  // Retornar foco para o trigger
  dropdownRef.value?.querySelector('.dropdown-trigger')?.focus()
}

// Click fora para fechar
onClickOutside(dropdownRef, closeMenu)
</script>
```

### Modais e Overlays
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
        <!-- Header -->
        <div class="modal-header">
          <h2 :id="titleId" class="modal-title">
            {{ title }}
          </h2>
          <button
            class="modal-close"
            @click="closeModal"
            :aria-label="`Fechar ${title}`"
          >
            <Icon name="x" aria-hidden="true" />
          </button>
        </div>
        
        <!-- Body -->
        <div :id="descriptionId" class="modal-body">
          <slot />
        </div>
        
        <!-- Footer -->
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
  closeOnOverlay?: boolean
}

const modalRef = ref<HTMLElement>()
const previousFocus = ref<HTMLElement>()

const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)
const descriptionId = computed(() => `modal-desc-${Math.random().toString(36).substr(2, 9)}`)

// Trap de foco obrigatório
const trapFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return
  
  const focusableElements = modalRef.value?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>
  
  if (!focusableElements?.length) return
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

// Gerenciamento de foco
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    // Salvar foco anterior
    previousFocus.value = document.activeElement as HTMLElement
    
    // Focar no modal
    nextTick(() => {
      modalRef.value?.focus()
      document.addEventListener('keydown', trapFocus)
      
      // Prevenir scroll do body
      document.body.style.overflow = 'hidden'
    })
  } else {
    // Restaurar foco
    document.removeEventListener('keydown', trapFocus)
    document.body.style.overflow = ''
    
    nextTick(() => {
      previousFocus.value?.focus()
    })
  }
})

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnOverlay && event.target === event.currentTarget) {
    closeModal()
  }
}
</script>
```

## Padrões de Conteúdo

### Imagens e Mídia
```vue
<template>
  <!-- Imagem com alt text obrigatório -->
  <img
    :src="src"
    :alt="alt"
    :class="imageClasses"
    :loading="lazy ? 'lazy' : 'eager'"
    @error="handleImageError"
  />
  
  <!-- Imagem decorativa -->
  <img
    :src="decorativeImage"
    alt=""
    role="presentation"
    aria-hidden="true"
  />
  
  <!-- Figura com legenda -->
  <figure>
    <img :src="chartImage" :alt="chartAlt" />
    <figcaption>
      {{ caption }}
      <span v-if="longDescription" class="sr-only">
        {{ longDescription }}
      </span>
    </figcaption>
  </figure>
  
  <!-- Vídeo acessível -->
  <video
    :src="videoSrc"
    controls
    :aria-label="videoLabel"
    :aria-describedby="videoDescriptionId"
  >
    <track
      kind="captions"
      :src="captionsFile"
      srclang="pt-BR"
      label="Português (Brasil)"
      default
    />
    <track
      kind="descriptions"
      :src="descriptionsFile"
      srclang="pt-BR"
      label="Descrições em Português"
    />
    <!-- Fallback para navegadores sem suporte -->
    <p>
      Seu navegador não suporta vídeo HTML5.
      <a :href="videoSrc">Baixar vídeo</a>
    </p>
  </video>
</template>
```

### Tabelas Acessíveis
```vue
<template>
  <div class="table-container">
    <!-- Caption obrigatório -->
    <table class="accessible-table">
      <caption>
        {{ tableCaption }}
        <span v-if="tableSummary" class="table-summary">
          {{ tableSummary }}
        </span>
      </caption>
      
      <!-- Cabeçalho com scope -->
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            :scope="header.scope || 'col'"
            :aria-sort="getSortDirection(header.key)"
            :class="header.class"
          >
            <button
              v-if="header.sortable"
              @click="sort(header.key)"
              class="sort-button"
              :aria-label="`Ordenar por ${header.label}`"
            >
              {{ header.label }}
              <Icon :name="getSortIcon(header.key)" aria-hidden="true" />
            </button>
            <span v-else>{{ header.label }}</span>
          </th>
        </tr>
      </thead>
      
      <!-- Corpo da tabela -->
      <tbody>
        <tr
          v-for="(row, rowIndex) in sortedData"
          :key="row.id"
          :class="{ 'table-row--selected': selectedRows.includes(row.id) }"
        >
          <td
            v-for="(header, colIndex) in headers"
            :key="header.key"
            :headers="getHeaderIds(header, rowIndex)"
            :class="header.cellClass"
          >
            <!-- Checkbox para seleção -->
            <input
              v-if="header.key === 'select'"
              type="checkbox"
              :checked="selectedRows.includes(row.id)"
              :aria-label="`Selecionar linha ${rowIndex + 1}`"
              @change="toggleRowSelection(row.id)"
            />
            
            <!-- Conteúdo da célula -->
            <span v-else>
              {{ getCellValue(row, header.key) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface TableHeader {
  key: string
  label: string
  sortable?: boolean
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup'
  class?: string
  cellClass?: string
}

interface TableProps {
  headers: TableHeader[]
  data: any[]
  tableCaption: string
  tableSummary?: string
  selectable?: boolean
}

// Para tabelas complexas, usar headers attribute
const getHeaderIds = (header: TableHeader, rowIndex: number) => {
  if (header.scope === 'row') {
    return `header-${header.key}-${rowIndex}`
  }
  return undefined
}
</script>
```

## Padrões de Navegação

### Breadcrumbs
```vue
<template>
  <nav aria-label="Navegação estrutural" class="breadcrumb">
    <ol class="breadcrumb-list">
      <li
        v-for="(item, index) in items"
        :key="item.href || item.label"
        class="breadcrumb-item"
      >
        <!-- Link para páginas anteriores -->
        <NuxtLink
          v-if="item.href && index < items.length - 1"
          :to="item.href"
          class="breadcrumb-link"
        >
          {{ item.label }}
        </NuxtLink>
        
        <!-- Página atual (sem link) -->
        <span
          v-else
          class="breadcrumb-current"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          {{ item.label }}
        </span>
        
        <!-- Separador -->
        <Icon
          v-if="index < items.length - 1"
          name="chevron-right"
          class="breadcrumb-separator"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>
```

### Paginação
```vue
<template>
  <nav aria-label="Navegação de páginas" class="pagination">
    <!-- Informação sobre resultados -->
    <div class="pagination-info" aria-live="polite">
      Mostrando {{ startItem }} a {{ endItem }} de {{ totalItems }} resultados
    </div>
    
    <ul class="pagination-list">
      <!-- Primeira página -->
      <li>
        <button
          :disabled="currentPage === 1"
          @click="goToPage(1)"
          class="pagination-button"
          :aria-label="currentPage === 1 ? 'Primeira página (atual)' : 'Ir para primeira página'"
        >
          <Icon name="chevron-double-left" aria-hidden="true" />
          Primeira
        </button>
      </li>
      
      <!-- Página anterior -->
      <li>
        <button
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          class="pagination-button"
          aria-label="Página anterior"
        >
          <Icon name="chevron-left" aria-hidden="true" />
          Anterior
        </button>
      </li>
      
      <!-- Páginas numeradas -->
      <li v-for="page in visiblePages" :key="page">
        <button
          :class="[
            'pagination-button',
            { 'pagination-button--current': page === currentPage }
          ]"
          :aria-current="page === currentPage ? 'page' : undefined"
          :aria-label="page === currentPage ? `Página ${page} (atual)` : `Ir para página ${page}`"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>
      
      <!-- Próxima página -->
      <li>
        <button
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          class="pagination-button"
          aria-label="Próxima página"
        >
          Próxima
          <Icon name="chevron-right" aria-hidden="true" />
        </button>
      </li>
      
      <!-- Última página -->
      <li>
        <button
          :disabled="currentPage === totalPages"
          @click="goToPage(totalPages)"
          class="pagination-button"
          :aria-label="currentPage === totalPages ? 'Última página (atual)' : 'Ir para última página'"
        >
          Última
          <Icon name="chevron-double-right" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </nav>
</template>
```

## Padrões de Estados e Feedback

### Loading States
```vue
<template>
  <div class="loading-container">
    <!-- Loading com texto para screen readers -->
    <div
      v-if="loading"
      class="loading-spinner"
      role="status"
      aria-live="polite"
      :aria-label="loadingText"
    >
      <Icon name="spinner" class="animate-spin" aria-hidden="true" />
      <span class="sr-only">{{ loadingText }}</span>
    </div>
    
    <!-- Skeleton loading -->
    <div v-if="showSkeleton" class="skeleton-container" aria-hidden="true">
      <div class="skeleton-line skeleton-line--title"></div>
      <div class="skeleton-line skeleton-line--text"></div>
      <div class="skeleton-line skeleton-line--text"></div>
    </div>
    
    <!-- Progress bar -->
    <div
      v-if="showProgress"
      role="progressbar"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="progressLabel"
      class="progress-bar"
    >
      <div
        class="progress-fill"
        :style="{ width: `${progress}%` }"
      ></div>
      <span class="sr-only">{{ progress }}% completo</span>
    </div>
  </div>
</template>
```

### Mensagens de Status
```vue
<template>
  <!-- Região live para anúncios -->
  <div
    :aria-live="priority"
    :aria-atomic="atomic"
    class="sr-only"
    ref="announcer"
  ></div>
  
  <!-- Alertas visuais -->
  <div
    v-if="visible"
    :class="alertClasses"
    role="alert"
    :aria-labelledby="titleId"
    :aria-describedby="descriptionId"
  >
    <Icon :name="alertIcon" aria-hidden="true" />
    
    <div class="alert-content">
      <h3 :id="titleId" class="alert-title">
        {{ title }}
      </h3>
      <p :id="descriptionId" class="alert-description">
        {{ description }}
      </p>
    </div>
    
    <button
      v-if="dismissible"
      @click="dismiss"
      class="alert-dismiss"
      :aria-label="`Fechar alerta: ${title}`"
    >
      <Icon name="x" aria-hidden="true" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  description: string
  dismissible?: boolean
  priority?: 'polite' | 'assertive'
  atomic?: boolean
}

// Anunciar para screen readers
const announceMessage = (message: string) => {
  if (announcer.value) {
    announcer.value.textContent = message
    
    // Limpar após anúncio
    setTimeout(() => {
      if (announcer.value) {
        announcer.value.textContent = ''
      }
    }, 1000)
  }
}

watch(() => props.visible, (newValue) => {
  if (newValue) {
    announceMessage(`${props.title}: ${props.description}`)
  }
})
</script>
```

## Validação e Testes

### Checklist de Validação
```typescript
// Checklist automático de acessibilidade
export const accessibilityChecklist = {
  // Estrutura HTML
  semanticHTML: {
    hasDoctype: () => document.doctype !== null,
    hasLangAttribute: () => document.documentElement.hasAttribute('lang'),
    hasMainLandmark: () => document.querySelector('main[role="main"], main') !== null,
    hasSkipLinks: () => document.querySelector('a[href^="#"]') !== null
  },
  
  // Cabeçalhos
  headings: {
    hasH1: () => document.querySelector('h1') !== null,
    hierarchyCorrect: () => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      let previousLevel = 0
      
      return headings.every(heading => {
        const currentLevel = parseInt(heading.tagName.charAt(1))
        const isValid = currentLevel <= previousLevel + 1
        previousLevel = currentLevel
        return isValid
      })
    }
  },
  
  // Formulários
  forms: {
    allInputsHaveLabels: () => {
      const inputs = document.querySelectorAll('input, select, textarea')
      return Array.from(inputs).every(input => {
        const id = input.getAttribute('id')
        return id && document.querySelector(`label[for="${id}"]`)
      })
    },
    
    errorsHaveAriaInvalid: () => {
      const invalidInputs = document.querySelectorAll('[aria-invalid="true"]')
      return Array.from(invalidInputs).every(input => {
        const errorId = input.getAttribute('aria-errormessage')
        return errorId && document.getElementById(errorId)
      })
    }
  },
  
  // Imagens
  images: {
    allImagesHaveAlt: () => {
      const images = document.querySelectorAll('img')
      return Array.from(images).every(img => img.hasAttribute('alt'))
    }
  },
  
  // Contraste
  contrast: {
    checkMinimumContrast: async () => {
      // Implementar verificação de contraste
      // Usar biblioteca como color-contrast-checker
      return true // Placeholder
    }
  }
}

// Executar checklist
export const runAccessibilityCheck = async () => {
  const results = {}
  
  for (const [category, checks] of Object.entries(accessibilityChecklist)) {
    results[category] = {}
    
    for (const [checkName, checkFn] of Object.entries(checks)) {
      try {
        results[category][checkName] = await checkFn()
      } catch (error) {
        results[category][checkName] = false
        console.error(`Erro na verificação ${category}.${checkName}:`, error)
      }
    }
  }
  
  return results
}
```

### Testes Automatizados
```typescript
// playwright-a11y.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Testes de Acessibilidade', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar axe-core
    await page.addInitScript(() => {
      window.axe = require('axe-core')
    })
  })
  
  test('deve passar em todos os critérios WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#third-party-widget') // Excluir widgets de terceiros
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })
  
  test('navegação por teclado completa', async ({ page }) => {
    await page.goto('/')
    
    // Testar ordem de tabulação
    const focusableElements = await page.locator('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').all()
    
    for (let i = 0; i < focusableElements.length; i++) {
      await page.keyboard.press('Tab')
      const focused = await page.evaluate(() => document.activeElement?.tagName)
      expect(focused).toBeTruthy()
    }
  })
  
  test('anúncios para screen reader', async ({ page }) => {
    await page.goto('/')
    
    // Testar regiões live
    const liveRegions = await page.locator('[aria-live]').all()
    expect(liveRegions.length).toBeGreaterThan(0)
    
    // Testar anúncios de status
    await page.click('button[type="submit"]')
    const statusMessage = await page.locator('[role="status"]').textContent()
    expect(statusMessage).toBeTruthy()
  })
  
  test('contraste de cores adequado', async ({ page }) => {
    await page.goto('/')
    
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze()
    
    expect(contrastResults.violations).toEqual([])
  })
})
```

## Ferramentas de Desenvolvimento

### ESLint Rules
```javascript
// .eslintrc.js - Regras de acessibilidade obrigatórias
module.exports = {
  extends: [
    'plugin:vue-a11y/recommended'
  ],
  
  rules: {
    // Obrigatórias (error)
    'vue-a11y/alt-text': 'error',
    'vue-a11y/anchor-has-content': 'error',
    'vue-a11y/click-events-have-key-events': 'error',
    'vue-a11y/form-control-has-label': 'error',
    'vue-a11y/heading-has-content': 'error',
    'vue-a11y/label-has-for': 'error',
    'vue-a11y/no-autofocus': 'error',
    'vue-a11y/no-onchange': 'error',
    'vue-a11y/tabindex-no-positive': 'error',
    'vue-a11y/aria-props': 'error',
    'vue-a11y/aria-role': 'error',
    'vue-a11y/aria-unsupported-elements': 'error',
    'vue-a11y/role-has-required-aria-props': 'error',
    
    // Recomendadas (warn)
    'vue-a11y/accessible-emoji': 'warn',
    'vue-a11y/iframe-has-title': 'warn',
    'vue-a11y/interactive-supports-focus': 'warn',
    'vue-a11y/media-has-caption': 'warn',
    'vue-a11y/mouse-events-have-key-events': 'warn'
  }
}
```

### Composable de Acessibilidade
```typescript
// composables/useA11y.ts
export const useA11y = () => {
  // Anunciar mensagens para screen readers
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
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
  
  // Gerenciar foco
  const manageFocus = {
    trap: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>
      
      if (!focusableElements.length) return () => {}
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
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
      firstElement.focus()
      
      return () => {
        container.removeEventListener('keydown', handleTabKey)
      }
    },
    
    restore: (element: HTMLElement) => {
      element.focus()
    },
    
    save: () => {
      return document.activeElement as HTMLElement
    }
  }
  
  // Verificar se usuário prefere movimento reduzido
  const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  
  // Verificar se usuário prefere alto contraste
  const prefersHighContrast = () => {
    return window.matchMedia('(prefers-contrast: high)').matches
  }
  
  return {
    announce,
    manageFocus,
    prefersReducedMotion,
    prefersHighContrast
  }
}
```

## Documentação Obrigatória

### README de Acessibilidade
Cada componente deve incluir:

1. **Conformidade WCAG**: Critérios atendidos
2. **Navegação por Teclado**: Teclas suportadas
3. **Screen Reader**: Como o componente é anunciado
4. **Estados ARIA**: Atributos utilizados
5. **Exemplos de Uso**: Implementação correta
6. **Testes**: Como validar acessibilidade

### Checklist de Entrega
- [ ] Estrutura HTML semântica
- [ ] Navegação por teclado completa
- [ ] Contraste WCAG 2.1 AA (4.5:1)
- [ ] Labels e descrições adequadas
- [ ] Estados ARIA corretos
- [ ] Testes automatizados passando
- [ ] Validação manual com screen reader
- [ ] Documentação atualizada
- [ ] Exemplos de uso fornecidos
- [ ] Performance não comprometida