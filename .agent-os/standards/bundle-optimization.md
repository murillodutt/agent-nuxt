# Estratégias de Otimização de Bundle Size - Nuxt 4

**Data:** 22/09/2025 00:25:00 (America/Sao_Paulo)  
**Objetivo:** Documentar estratégias abrangentes para otimização de bundle size em aplicações Nuxt 4, maximizando performance e experiência do usuário.

## Análise e Diagnóstico de Bundle

### 1. Ferramentas de Análise

```typescript
// nuxt.config.ts - Configuração para análise
export default defineNuxtConfig({
  build: {
    analyze: process.env.ANALYZE === 'true',
    
    // Configurações de otimização
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000, // 244KB - recomendação do Chrome
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          nuxtui: {
            test: /[\\/]node_modules[\\/]@nuxt[\\/]ui/,
            name: 'nuxt-ui',
            chunks: 'all',
            priority: 15
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5
          }
        }
      }
    }
  },

  // Configuração específica para análise
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            const timestamp = new Date().toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
            
            // Separar vendors por biblioteca
            if (id.includes('node_modules')) {
              if (id.includes('@nuxt/ui')) return 'nuxt-ui'
              if (id.includes('vue')) return 'vue'
              if (id.includes('lodash')) return 'lodash'
              if (id.includes('@vueuse')) return 'vueuse'
              if (id.includes('zod') || id.includes('valibot')) return 'validation'
              return 'vendor'
            }
            
            // Separar por funcionalidade
            if (id.includes('/composables/')) return 'composables'
            if (id.includes('/utils/')) return 'utils'
            if (id.includes('/components/')) return 'components'
          }
        }
      }
    }
  }
})
```

### 2. Script de Análise Automatizada

```typescript
// scripts/analyze-bundle.ts
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

interface BundleAnalysis {
  timestamp: string
  totalSize: number
  chunks: ChunkInfo[]
  recommendations: string[]
  warnings: string[]
}

interface ChunkInfo {
  name: string
  size: number
  gzipSize: number
  modules: number
  isOverSized: boolean
}

class BundleAnalyzer {
  private readonly maxChunkSize = 244000 // 244KB
  private readonly maxTotalSize = 2000000 // 2MB
  
  async analyze(): Promise<BundleAnalysis> {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.log(`[${timestamp}] [BUNDLE] ℹ Starting bundle analysis...`)
    
    // Build with analysis
    execSync('ANALYZE=true npm run build', { stdio: 'inherit' })
    
    // Read build stats
    const stats = this.readBuildStats()
    const chunks = this.analyzeChunks(stats)
    const recommendations = this.generateRecommendations(chunks)
    const warnings = this.generateWarnings(chunks)
    
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)
    
    const analysis: BundleAnalysis = {
      timestamp,
      totalSize,
      chunks,
      recommendations,
      warnings
    }
    
    // Save analysis report
    this.saveReport(analysis)
    
    console.log(`[${timestamp}] [BUNDLE] ✓ Analysis complete`)
    console.log(`  Total size: ${(totalSize / 1024).toFixed(1)}KB`)
    console.log(`  Chunks: ${chunks.length}`)
    console.log(`  Oversized chunks: ${chunks.filter(c => c.isOverSized).length}`)
    
    return analysis
  }
  
  private readBuildStats(): any {
    try {
      const statsPath = join(process.cwd(), '.nuxt/dist/client/stats.json')
      return JSON.parse(readFileSync(statsPath, 'utf8'))
    } catch (error) {
      console.warn('Could not read build stats, using fallback analysis')
      return this.fallbackAnalysis()
    }
  }
  
  private analyzeChunks(stats: any): ChunkInfo[] {
    const chunks: ChunkInfo[] = []
    
    if (stats.chunks) {
      for (const chunk of stats.chunks) {
        chunks.push({
          name: chunk.names?.[0] || chunk.id,
          size: chunk.size || 0,
          gzipSize: Math.round((chunk.size || 0) * 0.3), // Estimate
          modules: chunk.modules?.length || 0,
          isOverSized: (chunk.size || 0) > this.maxChunkSize
        })
      }
    }
    
    return chunks.sort((a, b) => b.size - a.size)
  }
  
  private generateRecommendations(chunks: ChunkInfo[]): string[] {
    const recommendations: string[] = []
    
    // Large chunks
    const oversizedChunks = chunks.filter(c => c.isOverSized)
    if (oversizedChunks.length > 0) {
      recommendations.push(
        `Split large chunks: ${oversizedChunks.map(c => c.name).join(', ')}`
      )
    }
    
    // Too many small chunks
    const smallChunks = chunks.filter(c => c.size < 10000) // < 10KB
    if (smallChunks.length > 10) {
      recommendations.push(
        `Consider combining small chunks (${smallChunks.length} chunks < 10KB)`
      )
    }
    
    // Vendor optimization
    const vendorChunk = chunks.find(c => c.name.includes('vendor'))
    if (vendorChunk && vendorChunk.size > 500000) { // > 500KB
      recommendations.push(
        'Split vendor chunk further by library'
      )
    }
    
    // Dynamic imports
    if (chunks.length < 5) {
      recommendations.push(
        'Consider using more dynamic imports for code splitting'
      )
    }
    
    return recommendations
  }
  
  private generateWarnings(chunks: ChunkInfo[]): string[] {
    const warnings: string[] = []
    
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)
    
    if (totalSize > this.maxTotalSize) {
      warnings.push(
        `Total bundle size (${(totalSize / 1024).toFixed(1)}KB) exceeds recommended limit (${(this.maxTotalSize / 1024).toFixed(1)}KB)`
      )
    }
    
    const criticalChunks = chunks.filter(c => c.size > this.maxChunkSize * 2)
    if (criticalChunks.length > 0) {
      warnings.push(
        `Critical chunk sizes detected: ${criticalChunks.map(c => `${c.name} (${(c.size / 1024).toFixed(1)}KB)`).join(', ')}`
      )
    }
    
    return warnings
  }
  
  private saveReport(analysis: BundleAnalysis): void {
    const reportPath = join(process.cwd(), 'bundle-analysis-report.json')
    writeFileSync(reportPath, JSON.stringify(analysis, null, 2))
    
    // Also create a readable report
    const readableReport = this.createReadableReport(analysis)
    const readableReportPath = join(process.cwd(), 'bundle-analysis-report.md')
    writeFileSync(readableReportPath, readableReport)
  }
  
  private createReadableReport(analysis: BundleAnalysis): string {
    return `# Bundle Analysis Report

**Generated:** ${analysis.timestamp}  
**Total Size:** ${(analysis.totalSize / 1024).toFixed(1)}KB  
**Chunks:** ${analysis.chunks.length}

## Chunk Breakdown

| Chunk | Size | Gzip | Modules | Status |
|-------|------|------|---------|---------|
${analysis.chunks.map(chunk => 
  `| ${chunk.name} | ${(chunk.size / 1024).toFixed(1)}KB | ${(chunk.gzipSize / 1024).toFixed(1)}KB | ${chunk.modules} | ${chunk.isOverSized ? '⚠️ Oversized' : '✅ OK'} |`
).join('\n')}

## Recommendations

${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

## Warnings

${analysis.warnings.length > 0 
  ? analysis.warnings.map(warn => `- ⚠️ ${warn}`).join('\n')
  : 'No warnings detected.'
}
`
  }
  
  private fallbackAnalysis(): any {
    // Fallback when stats are not available
    return {
      chunks: [
        { names: ['main'], size: 150000, modules: [] },
        { names: ['vendor'], size: 300000, modules: [] }
      ]
    }
  }
}

// Execute analysis
if (require.main === module) {
  const analyzer = new BundleAnalyzer()
  analyzer.analyze().catch(console.error)
}

export { BundleAnalyzer }
```

## Estratégias de Otimização

### 1. Tree Shaking e Dead Code Elimination

```typescript
// nuxt.config.ts - Tree shaking otimizado
export default defineNuxtConfig({
  build: {
    transpile: [
      // Transpile apenas quando necessário
      '@nuxt/ui',
      'some-es6-only-package'
    ]
  },

  vite: {
    build: {
      rollupOptions: {
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        }
      }
    },
    
    optimizeDeps: {
      include: [
        // Pré-bundle dependências pesadas
        'lodash-es',
        '@vueuse/core'
      ],
      exclude: [
        // Excluir dependências que devem ser tree-shaken
        'some-large-unused-package'
      ]
    }
  },

  // Configuração específica do Nuxt UI
  ui: {
    // Importar apenas componentes usados
    components: {
      include: ['UButton', 'UInput', 'UModal', 'UForm', 'UCard'],
      exclude: ['UTable', 'UCommandPalette'] // Componentes pesados não usados
    },
    
    // Otimizar ícones
    icons: {
      collections: ['heroicons', 'lucide'],
      // Carregar apenas ícones específicos
      include: [
        'heroicons:check',
        'heroicons:x-mark',
        'heroicons:exclamation-triangle',
        'lucide:loader-2'
      ]
    }
  }
})
```

### 2. Dynamic Imports e Code Splitting

```typescript
// composables/useLazyComponents.ts
export const useLazyComponents = () => {
  const timestamp = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  // Lazy load heavy components
  const LazyDataTable = defineAsyncComponent({
    loader: () => import('~/components/DataTable.vue'),
    loadingComponent: () => h('div', { class: 'animate-pulse h-32 bg-gray-200 rounded' }),
    errorComponent: () => h('div', { class: 'text-red-500' }, 'Failed to load table'),
    delay: 200,
    timeout: 5000
  })
  
  const LazyChart = defineAsyncComponent({
    loader: () => import('~/components/Chart.vue'),
    loadingComponent: () => h('div', { class: 'animate-pulse h-64 bg-gray-200 rounded' }),
    delay: 200
  })
  
  const LazyEditor = defineAsyncComponent({
    loader: () => import('~/components/RichTextEditor.vue'),
    loadingComponent: () => h('div', { class: 'animate-pulse h-48 bg-gray-200 rounded' }),
    delay: 500 // Delay longer for non-critical components
  })
  
  // Preload components based on user interaction
  const preloadComponent = async (componentName: string) => {
    console.log(`[${timestamp}] [LAZY] ℹ Preloading component: ${componentName}`)
    
    try {
      switch (componentName) {
        case 'DataTable':
          await import('~/components/DataTable.vue')
          break
        case 'Chart':
          await import('~/components/Chart.vue')
          break
        case 'Editor':
          await import('~/components/RichTextEditor.vue')
          break
      }
      
      console.log(`[${timestamp}] [LAZY] ✓ Component preloaded: ${componentName}`)
    } catch (error) {
      console.log(`[${timestamp}] [LAZY] ✗ Failed to preload component: ${componentName}`)
    }
  }
  
  // Smart preloading based on route
  const preloadForRoute = async (routeName: string) => {
    const preloadMap: Record<string, string[]> = {
      'dashboard': ['Chart', 'DataTable'],
      'admin': ['DataTable', 'Editor'],
      'profile': ['Editor']
    }
    
    const componentsToPreload = preloadMap[routeName] || []
    await Promise.all(componentsToPreload.map(preloadComponent))
  }
  
  return {
    LazyDataTable,
    LazyChart,
    LazyEditor,
    preloadComponent,
    preloadForRoute
  }
}
```

### 3. Otimização de Dependências

```typescript
// utils/optimized-imports.ts
// ❌ EVITAR: Importações que trazem toda a biblioteca
// import _ from 'lodash'
// import * as _ from 'lodash'

// ✅ USAR: Importações específicas
import { debounce, throttle, cloneDeep } from 'lodash-es'
import { useLocalStorage, useToggle } from '@vueuse/core'

// ❌ EVITAR: Importar todo o date-fns
// import * as dateFns from 'date-fns'

// ✅ USAR: Importações específicas do date-fns
import { format, parseISO, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Utility para importações dinâmicas otimizadas
export const createOptimizedImport = <T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: T
) => {
  let cached: T | null = null
  let loading: Promise<T> | null = null
  
  return async (): Promise<T> => {
    if (cached) return cached
    
    if (loading) return loading
    
    loading = importFn().then(module => {
      cached = module.default
      loading = null
      return cached
    }).catch(error => {
      loading = null
      console.error('Failed to load module:', error)
      if (fallback) {
        cached = fallback
        return fallback
      }
      throw error
    })
    
    return loading
  }
}

// Exemplo de uso
export const getChartLibrary = createOptimizedImport(
  () => import('chart.js'),
  null // Sem fallback, componente deve lidar com erro
)

export const getMarkdownParser = createOptimizedImport(
  () => import('marked'),
  { parse: (text: string) => text } // Fallback simples
)
```

### 4. Otimização de CSS e Assets

```typescript
// nuxt.config.ts - Otimização de CSS
export default defineNuxtConfig({
  css: [
    // Apenas CSS essencial no bundle principal
    '~/assets/css/critical.css'
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "~/assets/scss/variables.scss";
            @import "~/assets/scss/mixins.scss";
          `
        }
      }
    }
  },

  // Configuração do Tailwind para otimização
  tailwindcss: {
    config: {
      content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue'
      ],
      
      // Purge unused styles
      safelist: [
        // Manter classes usadas dinamicamente
        'bg-red-500',
        'bg-green-500',
        'bg-blue-500',
        'text-red-500',
        'text-green-500',
        'text-blue-500'
      ],
      
      theme: {
        // Reduzir paleta de cores se não usada completamente
        extend: {
          colors: {
            // Apenas cores necessárias
            primary: {
              50: '#eff6ff',
              500: '#3b82f6',
              600: '#2563eb'
            }
          }
        }
      }
    }
  },

  // Otimização de imagens
  image: {
    formats: ['webp', 'avif'],
    quality: 80,
    
    // Configurar tamanhos responsivos
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    },
    
    // Lazy loading por padrão
    loading: 'lazy',
    
    // Providers otimizados
    providers: {
      cloudinary: {
        baseURL: 'https://res.cloudinary.com/your-cloud/image/fetch/'
      }
    }
  }
})
```

### 5. Plugin de Otimização Customizado

```typescript
// plugins/bundle-optimizer.ts
export default defineNuxtPlugin(() => {
  if (process.client) {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    // Monitor bundle loading performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming
          
          // Log large JavaScript chunks
          if (resource.name.includes('.js') && resource.transferSize > 100000) {
            console.log(`[${timestamp}] [BUNDLE] ⚠ Large JS chunk loaded:`, {
              name: resource.name.split('/').pop(),
              size: `${(resource.transferSize / 1024).toFixed(1)}KB`,
              duration: `${resource.duration.toFixed(0)}ms`
            })
          }
          
          // Log CSS files
          if (resource.name.includes('.css')) {
            console.log(`[${timestamp}] [BUNDLE] ℹ CSS loaded:`, {
              name: resource.name.split('/').pop(),
              size: `${(resource.transferSize / 1024).toFixed(1)}KB`,
              duration: `${resource.duration.toFixed(0)}ms`
            })
          }
        }
      })
      
      observer.observe({ entryTypes: ['resource'] })
    }
    
    // Preload critical resources on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadCriticalResources()
      })
    } else {
      setTimeout(preloadCriticalResources, 1000)
    }
  }
})

function preloadCriticalResources() {
  const criticalResources = [
    '/api/user/profile',
    '/api/dashboard/stats'
  ]
  
  criticalResources.forEach(resource => {
    // Preload API endpoints
    $fetch(resource, { 
      method: 'GET',
      server: false,
      lazy: true
    }).catch(() => {
      // Ignore preload errors
    })
  })
  
  // Preload next likely page
  const currentPath = useRoute().path
  const likelyNextPages: Record<string, string[]> = {
    '/': ['/dashboard', '/profile'],
    '/dashboard': ['/reports', '/settings'],
    '/profile': ['/settings', '/dashboard']
  }
  
  const nextPages = likelyNextPages[currentPath] || []
  nextPages.forEach(page => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = page
    document.head.appendChild(link)
  })
}
```

### 6. Monitoramento Contínuo de Bundle

```typescript
// composables/useBundleMonitor.ts
export const useBundleMonitor = () => {
  const bundleMetrics = reactive({
    totalSize: 0,
    loadTime: 0,
    chunkCount: 0,
    largestChunk: '',
    largestChunkSize: 0
  })
  
  const analyzeBundlePerformance = () => {
    if (!process.client) return
    
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const jsResources = resources.filter(r => r.name.includes('.js'))
    const cssResources = resources.filter(r => r.name.includes('.css'))
    
    // Calculate metrics
    bundleMetrics.totalSize = [...jsResources, ...cssResources]
      .reduce((sum, r) => sum + (r.transferSize || 0), 0)
    
    bundleMetrics.loadTime = Math.max(
      ...jsResources.map(r => r.responseEnd - r.requestStart)
    )
    
    bundleMetrics.chunkCount = jsResources.length
    
    // Find largest chunk
    const largestResource = jsResources.reduce((largest, current) => 
      (current.transferSize || 0) > (largest.transferSize || 0) ? current : largest
    )
    
    if (largestResource) {
      bundleMetrics.largestChunk = largestResource.name.split('/').pop() || ''
      bundleMetrics.largestChunkSize = largestResource.transferSize || 0
    }
    
    console.log(`[${timestamp}] [BUNDLE MONITOR] Performance metrics:`, {
      totalSize: `${(bundleMetrics.totalSize / 1024).toFixed(1)}KB`,
      loadTime: `${bundleMetrics.loadTime.toFixed(0)}ms`,
      chunkCount: bundleMetrics.chunkCount,
      largestChunk: bundleMetrics.largestChunk,
      largestChunkSize: `${(bundleMetrics.largestChunkSize / 1024).toFixed(1)}KB`
    })
    
    // Alert if bundle is too large
    if (bundleMetrics.totalSize > 2000000) { // > 2MB
      console.warn(`[${timestamp}] [BUNDLE MONITOR] ⚠ Large bundle detected: ${(bundleMetrics.totalSize / 1024).toFixed(1)}KB`)
    }
    
    // Alert if load time is too long
    if (bundleMetrics.loadTime > 3000) { // > 3s
      console.warn(`[${timestamp}] [BUNDLE MONITOR] ⚠ Slow bundle loading: ${bundleMetrics.loadTime.toFixed(0)}ms`)
    }
  }
  
  const generateOptimizationReport = () => {
    const recommendations: string[] = []
    
    if (bundleMetrics.totalSize > 1500000) { // > 1.5MB
      recommendations.push('Consider implementing more aggressive code splitting')
    }
    
    if (bundleMetrics.chunkCount > 20) {
      recommendations.push('Too many chunks - consider combining smaller chunks')
    }
    
    if (bundleMetrics.largestChunkSize > 500000) { // > 500KB
      recommendations.push(`Largest chunk (${bundleMetrics.largestChunk}) should be split further`)
    }
    
    if (bundleMetrics.loadTime > 2000) { // > 2s
      recommendations.push('Bundle loading is slow - optimize critical path')
    }
    
    return {
      metrics: { ...bundleMetrics },
      recommendations,
      grade: calculateBundleGrade()
    }
  }
  
  const calculateBundleGrade = (): string => {
    let score = 100
    
    // Size penalty
    if (bundleMetrics.totalSize > 2000000) score -= 30
    else if (bundleMetrics.totalSize > 1500000) score -= 20
    else if (bundleMetrics.totalSize > 1000000) score -= 10
    
    // Load time penalty
    if (bundleMetrics.loadTime > 3000) score -= 25
    else if (bundleMetrics.loadTime > 2000) score -= 15
    else if (bundleMetrics.loadTime > 1000) score -= 5
    
    // Chunk count penalty
    if (bundleMetrics.chunkCount > 25) score -= 15
    else if (bundleMetrics.chunkCount > 20) score -= 10
    else if (bundleMetrics.chunkCount < 3) score -= 10 // Too few chunks
    
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }
  
  // Initialize monitoring on client
  if (process.client) {
    onMounted(() => {
      // Analyze after initial load
      setTimeout(analyzeBundlePerformance, 2000)
      
      // Monitor route changes
      const router = useRouter()
      router.afterEach(() => {
        setTimeout(analyzeBundlePerformance, 1000)
      })
    })
  }
  
  return {
    bundleMetrics: readonly(bundleMetrics),
    analyzeBundlePerformance,
    generateOptimizationReport
  }
}
```

### 7. Configuração de CI/CD para Monitoramento

```yaml
# .github/workflows/bundle-analysis.yml
name: Bundle Size Analysis

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  bundle-analysis:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build and analyze bundle
        run: |
          npm run build:analyze
          node scripts/analyze-bundle.js
      
      - name: Check bundle size limits
        run: |
          # Check if any chunk exceeds 244KB
          if [ -f bundle-analysis-report.json ]; then
            node -e "
              const report = require('./bundle-analysis-report.json');
              const oversized = report.chunks.filter(c => c.isOverSized);
              if (oversized.length > 0) {
                console.error('❌ Bundle size check failed');
                console.error('Oversized chunks:', oversized.map(c => c.name).join(', '));
                process.exit(1);
              } else {
                console.log('✅ Bundle size check passed');
              }
            "
          fi
      
      - name: Comment PR with bundle analysis
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const reportPath = './bundle-analysis-report.md';
            
            if (fs.existsSync(reportPath)) {
              const report = fs.readFileSync(reportPath, 'utf8');
              
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: `## Bundle Analysis Report\n\n${report}`
              });
            }
      
      - name: Upload bundle analysis artifacts
        uses: actions/upload-artifact@v3
        with:
          name: bundle-analysis
          path: |
            bundle-analysis-report.json
            bundle-analysis-report.md
```

---

**Última Atualização:** 22/09/2025 00:25:00 (America/Sao_Paulo)  
**Versão:** 1.0.0  
**Status:** Estratégias de Bundle Optimization Documentadas  
**Responsável:** Dutt eCommerce Website Design

Este guia abrangente de otimização de bundle size fornece estratégias práticas e ferramentas para manter aplicações Nuxt 4 performáticas, com monitoramento contínuo e alertas automáticos para prevenção de regressões de performance.
