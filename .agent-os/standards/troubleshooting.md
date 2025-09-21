# Troubleshooting Guide - Nuxt 4 + UI v4 - Agent Nuxt

**Data:** 21/09/2025 23:55:00 (America/Sao_Paulo)  
**Objetivo:** Fornecer soluções abrangentes para problemas comuns em desenvolvimento Nuxt 4 + UI v4, otimizado para assistência LLM.

## Visão Geral

Este guia de troubleshooting fornece soluções estruturadas para os problemas mais comuns encontrados no desenvolvimento com Nuxt 4 e Nuxt UI v4. Cada problema inclui diagnóstico, solução e prevenção, organizados para máxima eficiência de LLMs.

## Problemas Comuns - Nuxt 4 + UI v4

### 1. Erro de Hidratação com Componentes UI

#### Problema
```bash
[Vue warn]: Hydration node mismatch:
- Client vnode: UButton
- Server vnode: button
```

#### Diagnóstico
- **Causa**: Diferença entre renderização server-side e client-side
- **Contexto**: Componentes Nuxt UI renderizados condicionalmente
- **Frequência**: Muito comum em SSR com conditional rendering

#### Solução Completa

```vue
<!-- ❌ PROBLEMA: Renderização condicional que causa mismatch -->
<template>
  <div>
    <UButton v-if="isClient" @click="handleClick">
      Click me
    </UButton>
  </div>
</template>

<script setup>
const isClient = process.client
</script>
```

```vue
<!-- ✅ SOLUÇÃO: Usar ClientOnly ou useClientOnlyValue -->
<template>
  <div>
    <ClientOnly>
      <UButton @click="handleClick">
        Click me
      </UButton>
      <template #fallback>
        <button class="btn-fallback">
          Click me
        </button>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>
const handleClick = () => {
  // Handle click logic
}
</script>
```

#### Solução Alternativa com Composable

```typescript
// composables/useClientOnlyValue.ts
export const useClientOnlyValue = <T>(clientValue: T, serverValue: T) => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  return process.client ? clientValue : serverValue
}

// Uso no componente
<template>
  <UButton :variant="buttonVariant" @click="handleClick">
    {{ buttonText }}
  </UButton>
</template>

<script setup>
const buttonVariant = useClientOnlyValue('solid', 'outline')
const buttonText = useClientOnlyValue('Client Button', 'Server Button')
</script>
```

#### Prevenção
- Sempre use `ClientOnly` para componentes com estado client-side
- Evite renderização condicional baseada em `process.client`
- Use fallbacks apropriados no `ClientOnly`
- Teste sempre em modo SSR durante desenvolvimento

---

### 2. Problemas de Auto-Import com Nuxt UI Components

#### Problema
```typescript
// Erro: Cannot resolve component: UButton
// Ou: 'UButton' is not defined
```

#### Diagnóstico
- **Causa**: Configuração incorreta de auto-imports
- **Contexto**: Componentes Nuxt UI não sendo importados automaticamente
- **Frequência**: Comum em configurações customizadas

#### Solução Completa

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],
  
  // Garantir que auto-imports estão habilitados
  components: {
    global: true,
    dirs: [
      '~/components',
      {
        path: '~/components',
        global: true
      }
    ]
  },
  
  // Configuração específica para Nuxt UI
  ui: {
    global: true,
    icons: ['heroicons', 'lucide']
  },
  
  // Resolver problemas de TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  }
})
```

#### Solução para Problemas de TypeScript

```typescript
// types/nuxt-ui.d.ts
declare module '#components' {
  export const UButton: typeof import('@nuxt/ui')['UButton']
  export const UInput: typeof import('@nuxt/ui')['UInput']
  export const UModal: typeof import('@nuxt/ui')['UModal']
  // ... outros componentes
}
```

#### Configuração Manual de Imports (se necessário)

```typescript
// plugins/nuxt-ui.client.ts
import { 
  UButton, 
  UInput, 
  UModal,
  UForm,
  UCard 
} from '@nuxt/ui'

export default defineNuxtPlugin(() => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  return {
    provide: {
      ui: {
        UButton,
        UInput,
        UModal,
        UForm,
        UCard
      }
    }
  }
})
```

#### Prevenção
- Sempre instale `@nuxt/ui` via módulos, não como dependência manual
- Verifique que `global: true` está configurado
- Use TypeScript com declarações de tipos apropriadas
- Reinicie o dev server após mudanças de configuração

---

### 3. Problemas de Estilização e Temas

#### Problema
```css
/* Estilos customizados não aplicados ou conflitando com Nuxt UI */
.my-custom-button {
  background: red; /* Não funciona */
}
```

#### Diagnóstico
- **Causa**: Conflito entre estilos customizados e sistema de design Nuxt UI
- **Contexto**: CSS customizado sendo sobrescrito pelo Tailwind/Nuxt UI
- **Frequência**: Comum ao customizar aparência

#### Solução com Sistema de Temas

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: 'emerald',
    gray: 'slate',
    
    // Customização de componentes
    button: {
      default: {
        size: 'md',
        color: 'primary',
        variant: 'solid'
      },
      variants: {
        solid: 'bg-{color}-500 hover:bg-{color}-600 text-white',
        outline: 'border border-{color}-500 text-{color}-500 hover:bg-{color}-50',
        custom: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      },
      sizes: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
      }
    },
    
    input: {
      default: {
        size: 'md',
        color: 'primary',
        variant: 'outline'
      },
      variants: {
        outline: 'border border-gray-300 focus:border-{color}-500 focus:ring-{color}-500',
        filled: 'bg-gray-100 border-transparent focus:bg-white focus:border-{color}-500'
      }
    }
  }
})
```

#### Solução com CSS Customizado

```vue
<template>
  <UButton 
    :ui="customButtonUI"
    class="custom-gradient-button"
    @click="handleClick"
  >
    Custom Button
  </UButton>
</template>

<script setup>
const customButtonUI = {
  base: 'relative inline-flex items-center justify-center',
  background: 'bg-gradient-to-r from-blue-500 to-purple-600',
  hover: 'hover:from-blue-600 hover:to-purple-700',
  focus: 'focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
}
</script>

<style scoped>
.custom-gradient-button {
  @apply transition-all duration-300 transform hover:scale-105;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.custom-gradient-button:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
</style>
```

#### Solução com Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
```

#### Prevenção
- Use o sistema de temas do Nuxt UI sempre que possível
- Configure cores customizadas via `app.config.ts`
- Use `ui` prop para customizações específicas
- Evite `!important` - use especificidade CSS correta

---

### 4. Problemas de Performance e Bundle Size

#### Problema
```bash
# Bundle muito grande
Chunk size limit exceeded: 
- vendor.js (2.5MB) exceeds recommended size (244KB)
```

#### Diagnóstico
- **Causa**: Importação desnecessária de componentes ou dependências
- **Contexto**: Bundle incluindo todos os componentes Nuxt UI
- **Frequência**: Comum em projetos grandes

#### Solução com Tree Shaking

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  
  // Otimizações de build
  build: {
    transpile: ['@nuxt/ui'],
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          nuxtui: {
            test: /[\\/]node_modules[\\/]@nuxt[\\/]ui/,
            name: 'nuxt-ui',
            chunks: 'all',
          }
        }
      }
    }
  },
  
  // Configuração específica do Nuxt UI
  ui: {
    // Importar apenas componentes necessários
    components: {
      include: ['UButton', 'UInput', 'UModal', 'UForm']
    },
    // Otimizar ícones
    icons: {
      collections: ['heroicons', 'lucide'],
      // Carregar apenas ícones usados
      autoInstall: true
    }
  },
  
  // Nitro optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true
  }
})
```

#### Análise de Bundle

```typescript
// scripts/analyze-bundle.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  build: {
    analyze: true // Gera relatório de análise
  },
  
  // Plugin para análise customizada
  plugins: ['~/plugins/bundle-analyzer.client.ts']
})

// plugins/bundle-analyzer.client.ts
export default defineNuxtPlugin(() => {
  if (process.dev) {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.log(`[${timestamp}] [BUNDLE] ℹ Bundle analysis enabled`)
    
    // Monitorar performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const loadTime = performance.now()
        console.log(`[${timestamp}] [PERFORMANCE] ✓ Page loaded in ${loadTime.toFixed(2)}ms`)
      })
    }
  }
})
```

#### Lazy Loading de Componentes

```vue
<template>
  <div>
    <!-- Componente crítico - carregado imediatamente -->
    <UButton @click="showModal = true">
      Open Modal
    </UButton>
    
    <!-- Componente não crítico - lazy loaded -->
    <LazyUModal v-model="showModal">
      <UCard>
        <template #header>
          Modal Header
        </template>
        
        <p>Modal content here...</p>
        
        <template #footer>
          <UButton @click="showModal = false">
            Close
          </UButton>
        </template>
      </UCard>
    </LazyUModal>
  </div>
</template>

<script setup>
const showModal = ref(false)

// Preload modal quando hover no botão
const preloadModal = () => {
  // Força o carregamento do componente lazy
  import('#components/UModal')
}
</script>
```

#### Prevenção
- Use `analyze: true` regularmente para monitorar bundle size
- Implemente lazy loading para componentes pesados
- Configure tree shaking adequadamente
- Monitore Core Web Vitals em produção

---

### 5. Problemas de Formulários e Validação

#### Problema
```typescript
// Validação não funcionando ou mensagens de erro não aparecendo
const form = ref()
const schema = z.object({
  email: z.string().email('Email inválido')
})
```

#### Diagnóstico
- **Causa**: Configuração incorreta de validação ou schema
- **Contexto**: Integração entre UForm e bibliotecas de validação
- **Frequência**: Comum em formulários complexos

#### Solução Completa com Zod

```vue
<template>
  <UForm
    ref="formRef"
    :schema="schema"
    :state="formState"
    class="space-y-4"
    @submit="onSubmit"
    @error="onError"
  >
    <UFormGroup 
      label="Email" 
      name="email"
      description="Digite seu email para login"
      :error="formErrors.email"
    >
      <UInput
        v-model="formState.email"
        type="email"
        placeholder="seu@email.com"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      />
    </UFormGroup>

    <UFormGroup 
      label="Senha" 
      name="password"
      :error="formErrors.password"
    >
      <UInput
        v-model="formState.password"
        type="password"
        placeholder="••••••••"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      />
    </UFormGroup>

    <UFormGroup 
      label="Confirmar Senha" 
      name="confirmPassword"
      :error="formErrors.confirmPassword"
    >
      <UInput
        v-model="formState.confirmPassword"
        type="password"
        placeholder="••••••••"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      />
    </UFormGroup>

    <div class="flex gap-3">
      <UButton
        type="submit"
        :loading="isSubmitting"
        :disabled="!isFormValid"
        class="flex-1"
      >
        {{ isSubmitting ? 'Criando conta...' : 'Criar conta' }}
      </UButton>
      
      <UButton
        type="button"
        variant="outline"
        @click="resetForm"
        :disabled="isSubmitting"
      >
        Limpar
      </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'

// Schema de validação
const schema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter ao menos: 1 minúscula, 1 maiúscula e 1 número'),
  confirmPassword: z
    .string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

type Schema = z.output<typeof schema>

// Estado do formulário
const formRef = ref()
const isSubmitting = ref(false)
const formState = reactive<Partial<Schema>>({
  email: '',
  password: '',
  confirmPassword: ''
})

const formErrors = reactive<Record<string, string>>({})

// Computed
const isFormValid = computed(() => {
  try {
    schema.parse(formState)
    return true
  } catch {
    return false
  }
})

// Métodos
const onSubmit = async (event: { data: Schema }) => {
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
  
  try {
    console.log(`[${timestamp}] [FORM] ℹ Submitting form...`)
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log(`[${timestamp}] [FORM] ✓ Form submitted successfully`)
    
    // Reset form após sucesso
    resetForm()
    
    // Mostrar toast de sucesso
    $toast.add({
      title: 'Conta criada com sucesso!',
      description: 'Você pode fazer login agora.',
      color: 'green'
    })
    
  } catch (error) {
    console.log(`[${timestamp}] [FORM] ✗ Form submission failed: ${error.message}`)
    
    $toast.add({
      title: 'Erro ao criar conta',
      description: 'Tente novamente em alguns instantes.',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}

const onError = (event: any) => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  console.log(`[${timestamp}] [FORM] ⚠ Validation errors:`, event.errors)
  
  // Mapear erros para o estado
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
  
  event.errors.forEach((error: any) => {
    if (error.path) {
      formErrors[error.path] = error.message
    }
  })
}

const resetForm = () => {
  formState.email = ''
  formState.password = ''
  formState.confirmPassword = ''
  
  Object.keys(formErrors).forEach(key => {
    formErrors[key] = ''
  })
  
  formRef.value?.clear()
}

// Toast composable
const $toast = useToast()
</script>
```

#### Solução com Valibot (Alternativa)

```typescript
// schemas/user.ts
import * as v from 'valibot'

export const CreateUserSchema = v.object({
  email: v.pipe(
    v.string(),
    v.nonEmpty('Email é obrigatório'),
    v.email('Formato de email inválido')
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, 'Senha deve ter pelo menos 8 caracteres'),
    v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter ao menos: 1 minúscula, 1 maiúscula e 1 número')
  ),
  confirmPassword: v.string()
}, [
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'Senhas não coincidem'
    ),
    ['confirmPassword']
  )
])
```

#### Prevenção
- Sempre use schemas de validação tipados (Zod/Valibot)
- Implemente tratamento de erros robusto
- Use UFormGroup para estruturação adequada
- Teste validação tanto no client quanto server

---

### 6. Problemas de Roteamento e Navegação

#### Problema
```typescript
// Navegação não funcionando ou páginas não carregando
await navigateTo('/dashboard') // Não funciona
```

#### Diagnóstico
- **Causa**: Configuração incorreta de rotas ou middleware
- **Contexto**: Problemas com Nuxt router ou middleware de autenticação
- **Frequência**: Comum em SPAs com autenticação

#### Solução Completa

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  const { $auth } = useNuxtApp()
  
  console.log(`[${timestamp}] [MIDDLEWARE] ℹ Auth check for route: ${to.path}`)
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/forgot-password', '/']
  
  if (publicRoutes.includes(to.path)) {
    return
  }
  
  // Verificar se usuário está autenticado
  if (!$auth.user.value) {
    console.log(`[${timestamp}] [MIDDLEWARE] ⚠ User not authenticated, redirecting to login`)
    
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  
  // Verificar permissões específicas
  if (to.meta.requiresAdmin && !$auth.user.value.isAdmin) {
    console.log(`[${timestamp}] [MIDDLEWARE] ✗ Admin access required`)
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado'
    })
  }
  
  console.log(`[${timestamp}] [MIDDLEWARE] ✓ Auth check passed`)
})
```

#### Navegação Programática Robusta

```vue
<template>
  <div>
    <UButton @click="handleNavigation('/dashboard')">
      Go to Dashboard
    </UButton>
    
    <UButton @click="handleNavigation('/profile', { tab: 'settings' })">
      Go to Profile Settings
    </UButton>
    
    <UButton @click="handleExternalNavigation('https://example.com')">
      External Link
    </UButton>
  </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

const handleNavigation = async (path: string, query?: Record<string, any>) => {
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
    console.log(`[${timestamp}] [NAVIGATION] ℹ Navigating to: ${path}`)
    
    // Validar se a rota existe
    const resolvedRoute = router.resolve({ path, query })
    if (!resolvedRoute.matched.length) {
      throw new Error(`Route not found: ${path}`)
    }
    
    // Executar navegação
    await navigateTo({
      path,
      query
    })
    
    console.log(`[${timestamp}] [NAVIGATION] ✓ Navigation successful`)
    
  } catch (error) {
    console.log(`[${timestamp}] [NAVIGATION] ✗ Navigation failed: ${error.message}`)
    
    // Fallback para home
    await navigateTo('/')
    
    // Mostrar erro ao usuário
    $toast.add({
      title: 'Erro de navegação',
      description: 'Não foi possível acessar a página solicitada.',
      color: 'red'
    })
  }
}

const handleExternalNavigation = (url: string) => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  console.log(`[${timestamp}] [NAVIGATION] ℹ External navigation to: ${url}`)
  
  // Abrir em nova aba com segurança
  window.open(url, '_blank', 'noopener,noreferrer')
}

const $toast = useToast()
</script>
```

#### Configuração de Rotas Dinâmicas

```typescript
// pages/blog/[...slug].vue
<template>
  <div>
    <UCard v-if="pending">
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-3/4 mt-2" />
    </UCard>
    
    <UCard v-else-if="error">
      <UAlert
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="soft"
        title="Erro ao carregar conteúdo"
        :description="error.message"
      />
    </UCard>
    
    <article v-else-if="data">
      <h1>{{ data.title }}</h1>
      <div v-html="data.content"></div>
    </article>
  </div>
</template>

<script setup>
const route = useRoute()
const slug = route.params.slug as string[]

// SEO
definePageMeta({
  title: 'Blog Post',
  description: 'Read our latest blog posts'
})

// Buscar dados
const { data, pending, error } = await useLazyFetch(`/api/blog/${slug.join('/')}`, {
  key: `blog-${slug.join('-')}`,
  transform: (data: any) => {
    // Transform data if needed
    return data
  },
  onRequest({ request, options }) {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.log(`[${timestamp}] [API] ℹ Fetching blog post: ${request}`)
  },
  onRequestError({ request, error }) {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.log(`[${timestamp}] [API] ✗ Request failed: ${error.message}`)
  }
})

// SEO dinâmico
if (data.value) {
  useSeoMeta({
    title: data.value.title,
    description: data.value.excerpt,
    ogTitle: data.value.title,
    ogDescription: data.value.excerpt,
    ogImage: data.value.image
  })
}
</script>
```

#### Prevenção
- Sempre valide rotas antes de navegar
- Use middleware para autenticação e autorização
- Implemente tratamento de erro robusto
- Configure SEO adequadamente para rotas dinâmicas

---

## Ferramentas de Debugging

### 1. Vue DevTools Integration

```typescript
// plugins/vue-devtools.client.ts
export default defineNuxtPlugin(() => {
  if (process.dev) {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.log(`[${timestamp}] [DEVTOOLS] ℹ Vue DevTools integration active`)
    
    // Custom devtools integration
    if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue
    }
  }
})
```

### 2. Error Boundary Component

```vue
<!-- components/ErrorBoundary.vue -->
<template>
  <div>
    <slot v-if="!error" />
    
    <UCard v-else class="error-boundary">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500" />
          <h3 class="text-lg font-semibold">Algo deu errado</h3>
        </div>
      </template>
      
      <div class="space-y-4">
        <p class="text-gray-600">
          Ocorreu um erro inesperado. Nosso time foi notificado.
        </p>
        
        <UAlert
          v-if="showDetails"
          icon="i-heroicons-bug-ant"
          color="red"
          variant="soft"
          :title="error.name || 'Error'"
          :description="error.message"
        />
        
        <div class="flex gap-3">
          <UButton @click="retry" color="primary">
            Tentar novamente
          </UButton>
          
          <UButton @click="showDetails = !showDetails" variant="outline">
            {{ showDetails ? 'Ocultar' : 'Ver' }} detalhes
          </UButton>
          
          <UButton @click="reportError" variant="ghost">
            Reportar problema
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
interface Props {
  fallback?: Component
  onError?: (error: Error, instance: ComponentInternalInstance | null) => void
}

const props = withDefaults(defineProps<Props>(), {
  fallback: undefined,
  onError: undefined
})

const error = ref<Error | null>(null)
const showDetails = ref(false)

const retry = () => {
  error.value = null
  showDetails.value = false
}

const reportError = () => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  console.log(`[${timestamp}] [ERROR] ℹ Reporting error to support`)
  
  // Implementar reporting de erro
  $fetch('/api/errors', {
    method: 'POST',
    body: {
      error: {
        name: error.value?.name,
        message: error.value?.message,
        stack: error.value?.stack
      },
      timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent
    }
  })
}

onErrorCaptured((err, instance, info) => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  console.log(`[${timestamp}] [ERROR] ✗ Error caught:`, err)
  console.log(`[${timestamp}] [ERROR] ℹ Component info:`, info)
  
  error.value = err
  
  if (props.onError) {
    props.onError(err, instance)
  }
  
  return false // Prevent error from propagating
})
</script>
```

---

**Última Atualização:** 21/09/2025 23:55:00 (America/Sao_Paulo)  
**Versão:** 1.0.0  
**Status:** Troubleshooting Standards Criados  
**Responsável:** Dutt eCommerce Website Design

Este guia de troubleshooting fornece soluções abrangentes e estruturadas para os problemas mais comuns em desenvolvimento Nuxt 4 + UI v4, otimizado para máxima eficiência de LLMs em assistência ao desenvolvimento.
