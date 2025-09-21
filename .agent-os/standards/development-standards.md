# Agent OS - Padrões de Desenvolvimento

**Data:** 21/09/2025 15:45:17 (America/Sao_Paulo)  
**Autor:** Dutt eCommerce Website Design  
**Versão:** 2.1.0  
**Camada:** Standards

---

## [OVERVIEW] Padrões Técnicos Obrigatórios

### Arquitetura de Três Camadas
- **Standards**: Padrões, convenções e diretrizes técnicas
- **Product**: Requisitos, regras de negócio e especificações funcionais
- **Specs**: Implementações técnicas detalhadas e contratos de API

### Pipeline de Cinco Fases
1. **Spec**: Criação de especificações técnicas
2. **Plan**: Planejamento e breakdown de tarefas
3. **Code**: Implementação com TypeScript strict
4. **Test**: Validação automatizada multi-camada
5. **Deploy**: Entrega com monitoramento contínuo

## [TYPESCRIPT] Padrões de Tipagem

### Configuração Obrigatória
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Convenções de Nomenclatura
```typescript
// Interfaces - PascalCase com prefixo I
interface IComponentProps {
  title: string
  isVisible: boolean
}

// Types - PascalCase
type ComponentVariant = 'primary' | 'secondary' | 'danger'

// Enums - PascalCase
enum ComponentState {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Constantes - UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3
```

## [NUXT] Padrões Específicos

### Estrutura de Componentes
```vue
<template>
  <!-- Template com acessibilidade -->
</template>

<script setup lang="ts">
// Imports organizados
import type { ComponentProps } from '~/types'

// Props com validação
interface Props {
  title: string
  variant?: ComponentVariant
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

// Composables
const { $timestamp } = useNuxtApp()
</script>

<style scoped>
/* Estilos com CSS modules ou Tailwind */
</style>
```

### Composables Pattern
```typescript
// composables/useFeature.ts
export const useFeature = () => {
  const state = ref<FeatureState>('idle')
  
  const execute = async () => {
    state.value = 'loading'
    try {
      // Implementação
      state.value = 'success'
    } catch (error) {
      state.value = 'error'
      throw error
    }
  }
  
  return {
    state: readonly(state),
    execute
  }
}
```

## [TESTING] Padrões de Teste

### Estrutura de Testes
```typescript
// tests/components/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '~/components/Button.vue'

describe('Button Component', () => {
  it('should render with correct props', () => {
    const wrapper = mount(Button, {
      props: { title: 'Test Button' }
    })
    
    expect(wrapper.text()).toBe('Test Button')
  })
  
  it('should emit click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

### Cobertura Mínima
- **Componentes**: 95% de cobertura
- **Composables**: 100% de cobertura
- **Utils**: 100% de cobertura
- **APIs**: 90% de cobertura

## [PERFORMANCE] Padrões de Otimização

### Bundle Size
- **Máximo por chunk**: 250KB
- **Lazy loading**: Obrigatório para rotas
- **Tree shaking**: Configurado automaticamente
- **Code splitting**: Por feature

### Lighthouse Scores
- **Performance**: ≥90
- **Accessibility**: ≥95
- **Best Practices**: ≥90
- **SEO**: ≥90

## [ACCESSIBILITY] Padrões WCAG

### Implementação Obrigatória
```vue
<template>
  <button
    :aria-label="ariaLabel"
    :aria-pressed="isPressed"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <span class="sr-only">{{ screenReaderText }}</span>
    {{ title }}
  </button>
</template>
```

### Checklist WCAG 2.1 AA
- [OBRIGATÓRIO] Contraste mínimo 4.5:1
- [OBRIGATÓRIO] Navegação por teclado
- [OBRIGATÓRIO] Labels em formulários
- [OBRIGATÓRIO] Alt text em imagens
- [OBRIGATÓRIO] Estrutura semântica HTML

## [SECURITY] Padrões de Segurança

### Validação de Entrada
```typescript
// utils/validation.ts
import { z } from 'zod'

export const userInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50)
})

export const validateUserInput = (data: unknown) => {
  return userInputSchema.safeParse(data)
}
```

### Headers de Segurança
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  security: {
    headers: {
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'font-src': ["'self'", 'https:', 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'upgrade-insecure-requests': true
      }
    }
  }
})
```

## [DOCUMENTATION] Padrões de Documentação

### JSDoc Obrigatório
```typescript
/**
 * Componente de botão reutilizável com suporte a variantes
 * @param title - Texto do botão
 * @param variant - Variante visual do botão
 * @param disabled - Estado desabilitado
 * @returns Componente Vue renderizado
 * @example
 * ```vue
 * <Button title="Clique aqui" variant="primary" />
 * ```
 */
export const Button = defineComponent({
  // Implementação
})
```

### README Pattern
```markdown
# Component Name

## Overview
Descrição breve do componente

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | Texto do botão |

## Events
| Event | Payload | Description |
|-------|---------|-------------|
| click | MouseEvent | Emitido ao clicar |

## Examples
```vue
<Button title="Example" @click="handleClick" />
```

## Accessibility
- Suporte completo a navegação por teclado
- ARIA labels implementados
- Contraste WCAG AA
```

## [GIT] Padrões de Versionamento

### Conventional Commits
```
feat: adiciona componente Button com variantes
fix: corrige problema de acessibilidade no Modal
docs: atualiza documentação do componente Card
style: aplica formatação ESLint
refactor: reorganiza estrutura de composables
test: adiciona testes para utils de validação
chore: atualiza dependências do projeto
```

### Branch Strategy
- **main**: Produção estável
- **develop**: Desenvolvimento ativo
- **feature/**: Novas funcionalidades
- **fix/**: Correções de bugs
- **hotfix/**: Correções urgentes

## [QUALITY] Métricas de Qualidade

### Code Quality
- **ESLint**: Zero warnings/errors
- **Prettier**: Formatação automática
- **TypeScript**: Zero any types
- **Complexity**: Máximo 10 por função

### Performance Metrics
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms

---

**Próxima Revisão:** 21/10/2025  
**Responsável:** Dutt eCommerce Website Design  
**Status:** Ativo - Versão 2.1.0