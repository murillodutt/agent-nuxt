# Development Guidelines - Agent OS Nuxt Development Agent

## Context

Diretrizes de desenvolvimento padronizadas para projetos Agent OS especializados em Nuxt UI v4, garantindo consistência, qualidade e eficiência operacional.

## Princípios Fundamentais

### 1. Desenvolvimento Orientado por Componentes
- **Atomic Design**: Implementar hierarquia atoms → molecules → organisms → templates → pages
- **Composição sobre Herança**: Preferir composables e composition API
- **Single Responsibility**: Cada componente deve ter uma única responsabilidade
- **Props Interface**: Definir interfaces TypeScript claras para todas as props

### 2. Padrões de Código TypeScript

```typescript
// [SUCESSO] Bom: Interface clara e tipagem forte
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

// [SUCESSO] Bom: Composable com tipagem
export const useTheme = () => {
  const colorMode = useColorMode()
  
  const isDark = computed(() => colorMode.value === 'dark')
  
  return {
    isDark,
    toggleTheme: () => colorMode.preference = isDark.value ? 'light' : 'dark'
  }
}
```

### 3. Estrutura de Arquivos

```
components/
├── ui/           # Componentes base do Nuxt UI
├── forms/        # Componentes de formulário
├── layout/       # Componentes de layout
└── feature/      # Componentes específicos de funcionalidade

composables/
├── core/         # Composables fundamentais
├── ui/           # Composables de interface
└── business/     # Lógica de negócio

utils/
├── validation/   # Funções de validação
├── formatting/   # Formatação de dados
└── helpers/      # Utilitários gerais
```

## Padrões de Qualidade

### 1. Acessibilidade (WCAG 2.1 AA)

```vue
<!-- [SUCESSO] Bom: Acessibilidade completa -->
<template>
  <button
    :aria-label="ariaLabel"
    :aria-pressed="pressed"
    :disabled="disabled"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <Icon v-if="icon" :name="icon" aria-hidden="true" />
    <span>{{ label }}</span>
  </button>
</template>
```

### 2. Performance

- **Lazy Loading**: Usar `defineAsyncComponent` para componentes pesados
- **Tree Shaking**: Importar apenas o necessário
- **Bundle Splitting**: Separar código por rotas
- **Image Optimization**: Usar `<NuxtImg>` com lazy loading

```typescript
// [SUCESSO] Bom: Lazy loading de componente
const HeavyChart = defineAsyncComponent(() => import('~/components/HeavyChart.vue'))

// [SUCESSO] Bom: Import específico
import { debounce } from 'lodash-es'
```

### 3. Testes

```typescript
// [SUCESSO] Bom: Teste de componente
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '~/components/ui/Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    })
    
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.attributes('type')).toBe('button')
  })
  
  it('handles click events', async () => {
    const wrapper = mount(Button, {
      props: { label: 'Click me' }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

## Padrões de Nuxt UI v4

### 1. Uso de Componentes

```vue
<template>
  <!-- [SUCESSO] Bom: Uso correto do Nuxt UI v4 -->
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold">Card Title</h2>
    </template>
    
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" type="email" />
      </UFormGroup>
      
      <UButton type="submit" :loading="pending">
        Submit
      </UButton>
    </UForm>
  </UCard>
</template>
```

### 2. Customização de Tema

```typescript
// [SUCESSO] Bom: Configuração de tema
export default defineNuxtConfig({
  ui: {
    primary: 'blue',
    gray: 'slate',
    notifications: {
      position: 'top-0 bottom-auto'
    }
  }
})
```

## Padrões de Estado e Dados

### 1. Pinia Store

```typescript
// [SUCESSO] Bom: Store bem estruturada
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  
  const isAuthenticated = computed(() => !!user.value)
  
  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      user.value = response.user
    } finally {
      loading.value = false
    }
  }
  
  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    login
  }
})
```

### 2. Composables de Dados

```typescript
// [SUCESSO] Bom: Composable para dados
export const useUsers = () => {
  const { data: users, pending, error, refresh } = useFetch('/api/users', {
    key: 'users',
    transform: (data: any[]) => data.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`
    }))
  })
  
  return {
    users,
    pending,
    error,
    refresh
  }
}
```

## Padrões de Segurança

### 1. Validação de Entrada

```typescript
// [SUCESSO] Bom: Validação com Zod
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres')
})

export type User = z.infer<typeof userSchema>
```

### 2. Sanitização

```typescript
// [SUCESSO] Bom: Sanitização de dados
import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}
```

## Padrões de Documentação

### 1. Comentários de Código

```typescript
/**
 * Composable para gerenciar autenticação de usuários
 * 
 * @example
 * ```typescript
 * const { login, logout, user } = useAuth()
 * await login({ email, password })
 * ```
 */
export const useAuth = () => {
  // Implementação...
}
```

### 2. Props Documentation

```vue
<script setup lang="ts">
interface Props {
  /** Variante visual do botão */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg'
  /** Se o botão está desabilitado */
  disabled?: boolean
  /** Se o botão está em estado de carregamento */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})
</script>
```

## Checklist de Qualidade

### Antes do Commit
- [ ] TypeScript compila sem erros
- [ ] ESLint passa sem warnings
- [ ] Testes unitários passam (90%+ cobertura)
- [ ] Testes de acessibilidade passam
- [ ] Performance não regrediu (Lighthouse)
- [ ] Documentação atualizada

### Antes do Deploy
- [ ] Testes E2E passam
- [ ] Build de produção funciona
- [ ] Bundle size dentro do limite
- [ ] Core Web Vitals verdes
- [ ] Segurança validada (OWASP)

## Ferramentas de Desenvolvimento

### 1. VS Code Extensions
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag

### 2. Scripts Úteis

```json
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "nuxt typecheck"
  }
}
```

## Padrões de Git

### 1. Conventional Commits

```
feat: add user authentication system
fix: resolve button accessibility issue
docs: update component documentation
style: format code with prettier
refactor: extract user logic to composable
test: add unit tests for auth composable
chore: update dependencies
```

### 2. Branch Strategy

- `main`: Produção estável
- `develop`: Desenvolvimento ativo
- `feature/nome-da-feature`: Novas funcionalidades
- `fix/nome-do-bug`: Correções de bugs
- `hotfix/nome-do-hotfix`: Correções urgentes

## Monitoramento e Observabilidade

### 1. Performance Monitoring

```typescript
// [SUCESSO] Bom: Monitoramento de performance
export const trackPageView = (page: string) => {
  if (process.client) {
    // Google Analytics, Vercel Analytics, etc.
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: page,
      page_location: window.location.href
    })
  }
}
```

### 2. Error Tracking

```typescript
// [SUCESSO] Bom: Tratamento de erros
export const handleError = (error: Error, context?: string) => {
  console.error(`Error in ${context}:`, error)
  
  if (process.client) {
    // Sentry, LogRocket, etc.
    Sentry.captureException(error, {
      tags: { context }
    })
  }
}
```

Estas diretrizes garantem desenvolvimento consistente, seguro e de alta qualidade para projetos Agent OS especializados em Nuxt UI v4.