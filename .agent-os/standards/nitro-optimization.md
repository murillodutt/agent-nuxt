# Padrões de Otimização Nitro Engine - Agent OS

**Data:** 21/09/2025 22:35:00 (America/Sao_Paulo)  
**Objetivo:** Fornecer padrões específicos de otimização do Nitro Engine para maximizar performance em projetos Nuxt.js desenvolvidos com auxílio de LLMs via Agent OS.

## 1. Configurações Base de Performance

### 1.1. Nitro Configuration (`nitro.config.ts`)

```typescript
import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  // Otimizações de Build
  experimental: {
    wasm: true,
    asyncContext: true
  },
  
  // Compressão
  compressPublicAssets: {
    gzip: true,
    brotli: true
  },
  
  // Prerendering otimizado
  prerender: {
    crawlLinks: false, // Evita crawl desnecessário
    routes: ['/sitemap.xml', '/robots.txt']
  },
  
  // Bundle optimization
  rollupConfig: {
    output: {
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          if (id.includes('vue')) return 'vue'
          if (id.includes('@nuxt/ui')) return 'nuxt-ui'
          return 'vendor'
        }
      }
    }
  }
})
```

### 1.2. Nuxt Configuration (`nuxt.config.ts`)

```typescript
export default defineNuxtConfig({
  nitro: {
    // Preset otimizado por ambiente
    preset: process.env.NODE_ENV === 'production' ? 'cloudflare-pages' : 'node-server',
    
    // Compactação de assets
    compressPublicAssets: true,
    
    // Minificação
    minify: true,
    
    // Tree-shaking agressivo
    experimental: {
      payloadExtraction: false, // Reduz payload inicial
      inlineSSRStyles: false    // Evita CSS inline desnecessário
    },
    
    // Storage otimizado
    storage: {
      cache: {
        driver: 'redis', // ou 'memory' para desenvolvimento
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      }
    }
  }
})
```

## 2. Presets por Tipo de Deployment

### 2.1. Edge Runtime (Cloudflare, Vercel Edge)

```typescript
// nitro.config.ts para Edge
export default defineNitroConfig({
  preset: 'cloudflare-pages',
  
  // Otimizações específicas para Edge
  experimental: {
    wasm: true
  },
  
  // Limite de memória Edge
  rollupConfig: {
    output: {
      manualChunks: undefined // Evita chunks múltiplos no Edge
    }
  },
  
  // Compatibilidade Edge Runtime
  compatibilityDate: '2024-01-01',
  
  // Variáveis de ambiente otimizadas
  runtimeConfig: {
    // Apenas variáveis essenciais no Edge
    apiKey: process.env.API_KEY
  }
})
```

### 2.2. Serverless (AWS Lambda, Vercel Functions)

```typescript
// nitro.config.ts para Serverless
export default defineNitroConfig({
  preset: 'aws-lambda',
  
  // Cold start optimization
  experimental: {
    asyncContext: true
  },
  
  // Bundle size optimization para Lambda
  rollupConfig: {
    external: ['aws-sdk'], // Externalizar SDKs disponíveis no runtime
    output: {
      format: 'cjs' // CommonJS para compatibilidade Lambda
    }
  },
  
  // Timeout otimizado
  aws: {
    timeout: 30,
    memory: 512
  }
})
```

### 2.3. Node.js Server (Traditional Hosting)

```typescript
// nitro.config.ts para Node.js
export default defineNitroConfig({
  preset: 'node-server',
  
  // Otimizações Node.js
  node: {
    cluster: true, // Cluster mode para múltiplos cores
    workers: process.env.WORKERS || 'auto'
  },
  
  // Compressão HTTP
  compression: {
    gzip: true,
    brotli: true,
    threshold: 1024 // Comprimir arquivos > 1KB
  },
  
  // Keep-alive connections
  http: {
    keepAlive: true,
    keepAliveTimeout: 5000
  }
})
```

## 3. Configurações de Cache Avançadas

### 3.1. Cache de API Routes

```typescript
// server/api/data.get.ts
export default defineCachedEventHandler(async (event) => {
  // Lógica da API
  return await fetchData()
}, {
  maxAge: 1000 * 60 * 10, // 10 minutos
  staleMaxAge: 1000 * 60 * 60, // 1 hora stale
  varies: ['Accept-Encoding'],
  
  // Cache condicional
  shouldBypassCache: (event) => {
    return getHeader(event, 'cache-control') === 'no-cache'
  }
})
```

### 3.2. Cache de Storage

```typescript
// nitro.config.ts
export default defineNitroConfig({
  storage: {
    // Cache em memória para desenvolvimento
    memory: { driver: 'memory' },
    
    // Cache Redis para produção
    redis: {
      driver: 'redis',
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      db: 0
    },
    
    // Cache de arquivos para assets estáticos
    assets: {
      driver: 'fs',
      base: './cache/assets'
    }
  }
})
```

### 3.3. Cache Headers Otimizados

```typescript
// server/middleware/cache-headers.ts
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // Cache agressivo para assets estáticos
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff2?|ttf)$/)) {
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
    return
  }
  
  // Cache moderado para páginas
  if (url.pathname.startsWith('/blog/')) {
    setHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=86400')
    return
  }
  
  // Sem cache para APIs dinâmicas
  if (url.pathname.startsWith('/api/')) {
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
    return
  }
})
```

## 4. Bundle Splitting e Lazy Loading

### 4.1. Configuração de Chunks

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    }
  },
  
  // Lazy loading de componentes
  components: {
    dirs: [
      '~/components',
      { path: '~/components/lazy', lazy: true }
    ]
  }
})
```

### 4.2. Dynamic Imports Otimizados

```typescript
// Componente com lazy loading
<script setup>
// Lazy loading condicional
const LazyModal = defineAsyncComponent(() => 
  import('~/components/Modal.vue')
)

// Preload crítico
const CriticalComponent = defineAsyncComponent({
  loader: () => import('~/components/Critical.vue'),
  loadingComponent: LoadingSpinner,
  delay: 0
})
</script>
```

## 5. API Routes Otimizadas

### 5.1. Estrutura de Performance

```typescript
// server/api/optimized.get.ts
export default defineEventHandler(async (event) => {
  // Validação rápida de parâmetros
  const query = getQuery(event)
  const validation = await validateQuery(query)
  if (!validation.valid) {
    throw createError({
      statusCode: 400,
      statusMessage: validation.error
    })
  }
  
  // Cache check primeiro
  const cacheKey = `api:${event.node.req.url}`
  const cached = await storage.getItem(cacheKey)
  if (cached) return cached
  
  // Processamento otimizado
  const result = await processRequest(query)
  
  // Cache set com TTL
  await storage.setItem(cacheKey, result, { ttl: 300 })
  
  return result
})
```

### 5.2. Middleware de Performance

```typescript
// server/middleware/performance.ts
export default defineEventHandler(async (event) => {
  const start = Date.now()
  
  // Request ID para tracking
  const requestId = generateId()
  setHeader(event, 'X-Request-ID', requestId)
  
  // Response time header
  event.node.res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${requestId}] ${event.node.req.method} ${event.node.req.url} - ${duration}ms`)
    
    // Alertas para requests lentos
    if (duration > 1000) {
      console.warn(`[SLOW REQUEST] ${requestId} took ${duration}ms`)
    }
  })
})
```

## 6. Middleware Server-Side Otimizado

### 6.1. Rate Limiting

```typescript
// server/middleware/rate-limit.ts
const rateLimiter = new Map()

export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.startsWith('/api/')) return
  
  const ip = getClientIP(event)
  const key = `rate_limit:${ip}`
  
  const current = rateLimiter.get(key) || { count: 0, resetTime: Date.now() + 60000 }
  
  if (Date.now() > current.resetTime) {
    current.count = 0
    current.resetTime = Date.now() + 60000
  }
  
  if (current.count >= 100) { // 100 requests por minuto
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests'
    })
  }
  
  current.count++
  rateLimiter.set(key, current)
})
```

### 6.2. Security Headers

```typescript
// server/middleware/security.ts
export default defineEventHandler(async (event) => {
  // Security headers básicos
  setHeaders(event, {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  })
  
  // CSP para produção
  if (process.env.NODE_ENV === 'production') {
    setHeader(event, 'Content-Security-Policy', 
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    )
  }
})
```

## 7. Core Web Vitals Optimization

### 7.1. Métricas de Performance

```typescript
// plugins/performance.client.ts
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Observar Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
    
    // Performance Observer
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            console.log('Navigation timing:', entry.toJSON())
          }
        }
      })
      observer.observe({ entryTypes: ['navigation', 'resource'] })
    }
  }
})
```

### 7.2. Image Optimization

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  image: {
    // Provider otimizado
    provider: 'cloudinary', // ou 'vercel', 'cloudflare'
    
    // Formatos modernos
    formats: ['webp', 'avif'],
    
    // Responsive images
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    
    // Lazy loading por padrão
    loading: 'lazy',
    
    // Placeholder blur
    placeholder: 'blur'
  }
})
```

## 8. Validação e Monitoramento

### 8.1. Health Check Endpoint

```typescript
// server/api/health.get.ts
export default defineEventHandler(async (event) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  }
  
  // Verificações de dependências
  try {
    // Teste de database/redis se aplicável
    await testConnections()
    health.dependencies = 'healthy'
  } catch (error) {
    health.status = 'unhealthy'
    health.dependencies = error.message
  }
  
  setHeader(event, 'Cache-Control', 'no-cache')
  return health
})
```

### 8.2. Performance Monitoring

```typescript
// server/middleware/monitoring.ts
export default defineEventHandler(async (event) => {
  // Apenas em produção
  if (process.env.NODE_ENV !== 'production') return
  
  const start = process.hrtime.bigint()
  
  event.node.res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1000000 // ms
    
    // Log estruturado
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method: event.node.req.method,
      url: event.node.req.url,
      statusCode: event.node.res.statusCode,
      duration,
      userAgent: getHeader(event, 'user-agent'),
      ip: getClientIP(event)
    }))
    
    // Alertas para performance
    if (duration > 2000) {
      console.error(`[PERFORMANCE ALERT] Slow request: ${duration}ms`)
    }
  })
})
```

## 9. Padrões para LLMs

### 9.1. Template de Configuração Base

Quando uma LLM precisar otimizar um projeto Nuxt:

1. **Avaliar o ambiente de deployment** (Edge/Serverless/Node)
2. **Escolher o preset adequado** conforme seção 2
3. **Implementar cache estratégico** conforme seção 3
4. **Configurar bundle splitting** conforme seção 4
5. **Adicionar middleware de performance** conforme seções 5-6
6. **Validar Core Web Vitals** conforme seção 7

### 9.2. Checklist de Otimização

- [ ] Preset Nitro adequado ao ambiente
- [ ] Compressão gzip/brotli ativada
- [ ] Cache headers configurados
- [ ] Bundle splitting implementado
- [ ] Lazy loading de componentes
- [ ] API routes com cache
- [ ] Middleware de segurança
- [ ] Monitoramento de performance
- [ ] Health checks implementados
- [ ] Core Web Vitals < 2.5s LCP, < 100ms FID, < 0.1 CLS

## 10. Troubleshooting Comum

### 10.1. Bundle Size Excessivo
- Verificar `rollupConfig.output.manualChunks`
- Implementar dynamic imports
- Usar `analyze: true` no build para visualizar

### 10.2. Cold Start Lento (Serverless)
- Reduzir dependências no bundle
- Usar `experimental.asyncContext: true`
- Implementar warm-up functions

### 10.3. Cache Miss Alto
- Revisar cache keys e TTL
- Implementar cache warming
- Verificar variação de headers

---

**Última Atualização:** 21/09/2025 22:35:00 (America/Sao_Paulo)  
**Versão:** 1.0.0  
**Compatibilidade:** Nuxt 4.x, Nitro 2.x+  
**Responsável:** Dutt eCommerce Website Design

Este documento fornece padrões abrangentes de otimização do Nitro Engine para garantir máxima performance em projetos Nuxt.js desenvolvidos com auxílio de LLMs via Agent OS.
