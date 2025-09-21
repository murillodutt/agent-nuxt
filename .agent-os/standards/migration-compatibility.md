# Guias de Migração e Compatibility - Nuxt 4 + UI v4

**Data:** 22/09/2025 00:35:00 (America/Sao_Paulo)  
**Objetivo:** Fornecer guias abrangentes de migração e compatibilidade para atualizações Nuxt 3→4 e Nuxt UI v3→v4, com foco em desenvolvimento assistido por LLM.

## Migração Nuxt 3 → Nuxt 4

### 1. Preparação e Análise Pré-Migração

```typescript
// scripts/pre-migration-analysis.ts
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

interface MigrationAnalysis {
  timestamp: string
  currentVersion: string
  targetVersion: string
  issues: MigrationIssue[]
  recommendations: string[]
  estimatedEffort: string
}

interface MigrationIssue {
  file: string
  line: number
  type: 'breaking-change' | 'deprecation' | 'warning'
  description: string
  solution: string
}

class MigrationAnalyzer {
  private issues: MigrationIssue[] = []
  
  async analyze(): Promise<MigrationAnalysis> {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.log(`[${timestamp}] [MIGRATION] ℹ Starting pre-migration analysis...`)
    
    const currentVersion = this.getCurrentNuxtVersion()
    const targetVersion = '4.0.0'
    
    // Analyze different aspects
    await this.analyzePackageJson()
    await this.analyzeNuxtConfig()
    await this.analyzeComponents()
    await this.analyzeComposables()
    await this.analyzePlugins()
    await this.analyzeMiddleware()
    await this.analyzeServerRoutes()
    
    const recommendations = this.generateRecommendations()
    const estimatedEffort = this.estimateEffort()
    
    const analysis: MigrationAnalysis = {
      timestamp,
      currentVersion,
      targetVersion,
      issues: this.issues,
      recommendations,
      estimatedEffort
    }
    
    this.saveAnalysisReport(analysis)
    
    console.log(`[${timestamp}] [MIGRATION] ✓ Analysis complete`)
    console.log(`  Issues found: ${this.issues.length}`)
    console.log(`  Breaking changes: ${this.issues.filter(i => i.type === 'breaking-change').length}`)
    console.log(`  Estimated effort: ${estimatedEffort}`)
    
    return analysis
  }
  
  private getCurrentNuxtVersion(): string {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
      return packageJson.dependencies?.nuxt || packageJson.devDependencies?.nuxt || 'unknown'
    } catch {
      return 'unknown'
    }
  }
  
  private async analyzePackageJson(): Promise<void> {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
      
      // Check for deprecated packages
      const deprecatedPackages = [
        '@nuxt/content', // Changed to @nuxt/content in v4
        '@nuxtjs/composition-api', // No longer needed
        '@nuxtjs/axios' // Use $fetch instead
      ]
      
      deprecatedPackages.forEach(pkg => {
        if (packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg]) {
          this.issues.push({
            file: 'package.json',
            line: 0,
            type: 'breaking-change',
            description: `Package ${pkg} is deprecated in Nuxt 4`,
            solution: this.getPackageMigrationSolution(pkg)
          })
        }
      })
      
      // Check Node.js version requirement
      const nodeVersion = process.version
      if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
        this.issues.push({
          file: 'package.json',
          line: 0,
          type: 'breaking-change',
          description: 'Nuxt 4 requires Node.js 18+',
          solution: 'Update Node.js to version 18 or higher'
        })
      }
      
    } catch (error) {
      console.warn('Could not analyze package.json:', error)
    }
  }
  
  private async analyzeNuxtConfig(): Promise<void> {
    const configFiles = await glob('nuxt.config.{ts,js}')
    
    for (const file of configFiles) {
      try {
        const content = readFileSync(file, 'utf8')
        
        // Check for deprecated config options
        const deprecatedConfigs = [
          { old: 'buildModules', new: 'modules', breaking: true },
          { old: 'build.babel', new: 'vite config', breaking: true },
          { old: 'build.postcss', new: 'css.postcss', breaking: false },
          { old: 'loading', new: 'app.pageTransition', breaking: true }
        ]
        
        deprecatedConfigs.forEach(config => {
          if (content.includes(config.old)) {
            this.issues.push({
              file,
              line: this.findLineNumber(content, config.old),
              type: config.breaking ? 'breaking-change' : 'deprecation',
              description: `Config option '${config.old}' is deprecated`,
              solution: `Replace with '${config.new}'`
            })
          }
        })
        
        // Check for auto-import changes
        if (content.includes('components: false') || content.includes('autoImport: false')) {
          this.issues.push({
            file,
            line: this.findLineNumber(content, 'components: false'),
            type: 'warning',
            description: 'Auto-import behavior changed in Nuxt 4',
            solution: 'Review auto-import configuration and update accordingly'
          })
        }
        
      } catch (error) {
        console.warn(`Could not analyze ${file}:`, error)
      }
    }
  }
  
  private async analyzeComponents(): Promise<void> {
    const componentFiles = await glob('components/**/*.vue')
    
    for (const file of componentFiles) {
      try {
        const content = readFileSync(file, 'utf8')
        
        // Check for deprecated Vue features
        if (content.includes('$nuxt.')) {
          this.issues.push({
            file,
            line: this.findLineNumber(content, '$nuxt.'),
            type: 'breaking-change',
            description: '$nuxt instance is deprecated',
            solution: 'Use useNuxtApp() composable instead'
          })
        }
        
        // Check for deprecated lifecycle hooks
        if (content.includes('asyncData') || content.includes('fetch(')) {
          this.issues.push({
            file,
            line: this.findLineNumber(content, 'asyncData'),
            type: 'breaking-change',
            description: 'asyncData and fetch are deprecated',
            solution: 'Use useFetch() or useLazyFetch() composables'
          })
        }
        
        // Check for deprecated $axios usage
        if (content.includes('$axios')) {
          this.issues.push({
            file,
            line: this.findLineNumber(content, '$axios'),
            type: 'breaking-change',
            description: '$axios is no longer available',
            solution: 'Use $fetch() or useFetch() instead'
          })
        }
        
      } catch (error) {
        console.warn(`Could not analyze ${file}:`, error)
      }
    }
  }
  
  private async analyzeComposables(): Promise<void> {
    const composableFiles = await glob('composables/**/*.{ts,js}')
    
    for (const file of composableFiles) {
      try {
        const content = readFileSync(file, 'utf8')
        
        // Check for deprecated composables
        const deprecatedComposables = [
          { old: 'useContext', new: 'useNuxtApp', breaking: true },
          { old: 'useStatic', new: 'useLazyFetch with server: false', breaking: true },
          { old: 'ssrRef', new: 'ref', breaking: true }
        ]
        
        deprecatedComposables.forEach(comp => {
          if (content.includes(comp.old)) {
            this.issues.push({
              file,
              line: this.findLineNumber(content, comp.old),
              type: comp.breaking ? 'breaking-change' : 'deprecation',
              description: `Composable '${comp.old}' is deprecated`,
              solution: `Replace with '${comp.new}'`
            })
          }
        })
        
      } catch (error) {
        console.warn(`Could not analyze ${file}:`, error)
      }
    }
  }
  
  private async analyzePlugins(): Promise<void> {
    const pluginFiles = await glob('plugins/**/*.{ts,js}')
    
    for (const file of pluginFiles) {
      try {
        const content = readFileSync(file, 'utf8')
        
        // Check for deprecated plugin patterns
        if (content.includes('export default function') && !content.includes('defineNuxtPlugin')) {
          this.issues.push({
            file,
            line: 1,
            type: 'breaking-change',
            description: 'Plugin must use defineNuxtPlugin wrapper',
            solution: 'Wrap plugin function with defineNuxtPlugin()'
          })
        }
        
        // Check for deprecated inject usage
        if (content.includes('inject(')) {
          this.issues.push({
            file,
            line: this.findLineNumber(content, 'inject('),
            type: 'breaking-change',
            description: 'inject() is deprecated in plugins',
            solution: 'Use return { provide: { ... } } pattern'
          })
        }
        
      } catch (error) {
        console.warn(`Could not analyze ${file}:`, error)
      }
    }
  }
  
  private async analyzeMiddleware(): Promise<void> {
    const middlewareFiles = await glob('middleware/**/*.{ts,js}')
    
    for (const file of middlewareFiles) {
      try {
        const content = readFileSync(file, 'utf8')
        
        // Check for deprecated middleware patterns
        if (!content.includes('defineNuxtRouteMiddleware') && !content.includes('export default')) {
          this.issues.push({
            file,
            line: 1,
            type: 'warning',
            description: 'Middleware should use defineNuxtRouteMiddleware',
            solution: 'Wrap middleware with defineNuxtRouteMiddleware()'
          })
        }
        
      } catch (error) {
        console.warn(`Could not analyze ${file}:`, error)
      }
    }
  }
  
  private async analyzeServerRoutes(): Promise<void> {
    const serverFiles = await glob('server/**/*.{ts,js}')
    
    for (const file of serverFiles) {
      try {
        const content = readFileSync(file, 'utf8')
        
        // Check for deprecated server patterns
        if (content.includes('serverMiddleware')) {
          this.issues.push({
            file,
            line: this.findLineNumber(content, 'serverMiddleware'),
            type: 'breaking-change',
            description: 'serverMiddleware is deprecated',
            solution: 'Move to server/ directory and use defineEventHandler'
          })
        }
        
        // Check for proper event handler usage
        if (file.includes('server/api/') && !content.includes('defineEventHandler')) {
          this.issues.push({
            file,
            line: 1,
            type: 'warning',
            description: 'API routes should use defineEventHandler',
            solution: 'Wrap handler with defineEventHandler()'
          })
        }
        
      } catch (error) {
        console.warn(`Could not analyze ${file}:`, error)
      }
    }
  }
  
  private findLineNumber(content: string, search: string): number {
    const lines = content.split('\n')
    const lineIndex = lines.findIndex(line => line.includes(search))
    return lineIndex + 1
  }
  
  private getPackageMigrationSolution(pkg: string): string {
    const solutions: Record<string, string> = {
      '@nuxt/content': 'Update to @nuxt/content v2 for Nuxt 4 compatibility',
      '@nuxtjs/composition-api': 'Remove package - Composition API is built into Vue 3',
      '@nuxtjs/axios': 'Replace with built-in $fetch or useFetch composable'
    }
    
    return solutions[pkg] || 'Check package documentation for Nuxt 4 compatibility'
  }
  
  private generateRecommendations(): string[] {
    const recommendations: string[] = []
    
    const breakingChanges = this.issues.filter(i => i.type === 'breaking-change').length
    const deprecations = this.issues.filter(i => i.type === 'deprecation').length
    
    if (breakingChanges > 0) {
      recommendations.push(`Address ${breakingChanges} breaking changes before migration`)
    }
    
    if (deprecations > 0) {
      recommendations.push(`Update ${deprecations} deprecated features for future compatibility`)
    }
    
    recommendations.push('Create a backup branch before starting migration')
    recommendations.push('Update dependencies incrementally, testing after each change')
    recommendations.push('Run comprehensive tests after migration')
    
    if (this.issues.some(i => i.file.includes('plugin'))) {
      recommendations.push('Review and test all plugins thoroughly')
    }
    
    if (this.issues.some(i => i.description.includes('composable'))) {
      recommendations.push('Update composables to use new Nuxt 4 patterns')
    }
    
    return recommendations
  }
  
  private estimateEffort(): string {
    const totalIssues = this.issues.length
    const breakingChanges = this.issues.filter(i => i.type === 'breaking-change').length
    
    if (breakingChanges > 20 || totalIssues > 50) {
      return 'High (2-3 weeks)'
    } else if (breakingChanges > 10 || totalIssues > 25) {
      return 'Medium (1-2 weeks)'
    } else if (breakingChanges > 5 || totalIssues > 10) {
      return 'Low-Medium (3-5 days)'
    } else {
      return 'Low (1-2 days)'
    }
  }
  
  private saveAnalysisReport(analysis: MigrationAnalysis): void {
    // Save JSON report
    writeFileSync('migration-analysis.json', JSON.stringify(analysis, null, 2))
    
    // Save readable report
    const readableReport = this.createReadableReport(analysis)
    writeFileSync('migration-analysis.md', readableReport)
  }
  
  private createReadableReport(analysis: MigrationAnalysis): string {
    return `# Migration Analysis Report

**Generated:** ${analysis.timestamp}  
**Current Version:** ${analysis.currentVersion}  
**Target Version:** ${analysis.targetVersion}  
**Estimated Effort:** ${analysis.estimatedEffort}

## Issues Found (${analysis.issues.length})

### Breaking Changes (${analysis.issues.filter(i => i.type === 'breaking-change').length})

${analysis.issues
  .filter(i => i.type === 'breaking-change')
  .map(issue => `- **${issue.file}:${issue.line}** - ${issue.description}\n  *Solution:* ${issue.solution}`)
  .join('\n\n')}

### Deprecations (${analysis.issues.filter(i => i.type === 'deprecation').length})

${analysis.issues
  .filter(i => i.type === 'deprecation')
  .map(issue => `- **${issue.file}:${issue.line}** - ${issue.description}\n  *Solution:* ${issue.solution}`)
  .join('\n\n')}

### Warnings (${analysis.issues.filter(i => i.type === 'warning').length})

${analysis.issues
  .filter(i => i.type === 'warning')
  .map(issue => `- **${issue.file}:${issue.line}** - ${issue.description}\n  *Solution:* ${issue.solution}`)
  .join('\n\n')}

## Recommendations

${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

## Next Steps

1. Review all breaking changes and plan fixes
2. Update dependencies to Nuxt 4 compatible versions
3. Test thoroughly in development environment
4. Migrate in stages, testing after each change
5. Update documentation and team knowledge
`
  }
}

// Execute analysis
if (require.main === module) {
  const analyzer = new MigrationAnalyzer()
  analyzer.analyze().catch(console.error)
}

export { MigrationAnalyzer }
```

### 2. Guia Passo a Passo de Migração

```markdown
# Guia de Migração Nuxt 3 → 4: Passo a Passo

## Fase 1: Preparação (1-2 dias)

### 1.1. Backup e Versionamento
```bash
# Criar branch de backup
git checkout -b backup/pre-nuxt4-migration
git push origin backup/pre-nuxt4-migration

# Criar branch de migração
git checkout -b feature/migrate-to-nuxt4
```

### 1.2. Análise Pré-Migração
```bash
# Executar análise automática
npm run analyze:migration

# Revisar relatório
cat migration-analysis.md
```

### 1.3. Atualização de Dependências Base
```bash
# Atualizar Node.js para versão 18+
nvm install 18
nvm use 18

# Limpar cache
rm -rf node_modules package-lock.json
npm cache clean --force
```

## Fase 2: Atualização de Dependências (2-3 dias)

### 2.1. Atualizar Nuxt
```bash
# Atualizar para Nuxt 4
npm install nuxt@^4.0.0

# Verificar compatibilidade de módulos
npm outdated
```

### 2.2. Atualizar Módulos Essenciais
```json
{
  "dependencies": {
    "nuxt": "^4.0.0",
    "@nuxt/ui": "^4.0.0",
    "@nuxt/image": "^1.0.0",
    "@pinia/nuxt": "^0.5.0"
  },
  "devDependencies": {
    "@nuxt/devtools": "^1.0.0"
  }
}
```

### 2.3. Remover Dependências Obsoletas
```bash
# Remover pacotes não necessários
npm uninstall @nuxtjs/composition-api
npm uninstall @nuxtjs/axios
```

## Fase 3: Migração de Código (3-5 dias)

### 3.1. Atualizar nuxt.config.ts
```typescript
// Antes (Nuxt 3)
export default defineNuxtConfig({
  buildModules: ['@nuxt/ui'],
  loading: { color: 'blue' }
})

// Depois (Nuxt 4)
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
```

### 3.2. Migrar Composables
```typescript
// Antes (Nuxt 3)
import { useContext } from '@nuxtjs/composition-api'

export default function useAuth() {
  const { $axios } = useContext()
  
  return {
    login: (credentials) => $axios.post('/auth/login', credentials)
  }
}

// Depois (Nuxt 4)
export default function useAuth() {
  const { $fetch } = useNuxtApp()
  
  return {
    login: (credentials) => $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
  }
}
```

### 3.3. Migrar Plugins
```typescript
// Antes (Nuxt 3)
export default function ({ $axios }, inject) {
  inject('api', $axios)
}

// Depois (Nuxt 4)
export default defineNuxtPlugin(() => {
  return {
    provide: {
      api: $fetch
    }
  }
})
```

### 3.4. Migrar Middleware
```typescript
// Antes (Nuxt 3)
export default function ({ redirect, store }) {
  if (!store.state.auth.user) {
    return redirect('/login')
  }
}

// Depois (Nuxt 4)
export default defineNuxtRouteMiddleware((to, from) => {
  const { $auth } = useNuxtApp()
  
  if (!$auth.user.value) {
    return navigateTo('/login')
  }
})
```

## Fase 4: Migração Nuxt UI v3 → v4

### 4.1. Componentes com Breaking Changes
```vue
<!-- Antes (UI v3) -->
<template>
  <UButton
    :loading="isLoading"
    :disabled="isDisabled"
    color="primary"
    variant="solid"
  >
    Click me
  </UButton>
</template>

<!-- Depois (UI v4) -->
<template>
  <UButton
    :loading="isLoading"
    :disabled="isDisabled"
    color="primary"
    variant="solid"
  >
    Click me
  </UButton>
</template>
```

### 4.2. Novos Padrões de Tema
```typescript
// app.config.ts (UI v4)
export default defineAppConfig({
  ui: {
    primary: 'emerald',
    gray: 'slate',
    
    // Novos padrões de customização
    button: {
      default: {
        loadingIcon: 'i-heroicons-arrow-path-20-solid'
      }
    }
  }
})
```

## Fase 5: Testes e Validação (2-3 dias)

### 5.1. Testes Automatizados
```bash
# Executar suite de testes
npm run test

# Testes de integração
npm run test:e2e

# Verificar build de produção
npm run build
npm run preview
```

### 5.2. Validação Manual
- [ ] Todas as páginas carregam corretamente
- [ ] Formulários funcionam adequadamente  
- [ ] Navegação está operacional
- [ ] APIs respondem corretamente
- [ ] Estilos estão aplicados
- [ ] Performance mantida ou melhorada

### 5.3. Checklist de Compatibilidade
- [ ] Node.js 18+ configurado
- [ ] Todas as dependências atualizadas
- [ ] Código migrado para novos padrões
- [ ] Testes passando
- [ ] Build de produção funcional
- [ ] Performance validada
```

### 3. Utilitários de Migração Automática

```typescript
// utils/migration-helpers.ts
export class MigrationHelper {
  private readonly timestamp: string
  
  constructor() {
    this.timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }
  
  /**
   * Migra automaticamente composables deprecated
   */
  async migrateComposables(filePath: string): Promise<void> {
    console.log(`[${this.timestamp}] [MIGRATION] ℹ Migrating composables in: ${filePath}`)
    
    const fs = await import('fs/promises')
    let content = await fs.readFile(filePath, 'utf8')
    
    // Substituições automáticas
    const migrations = [
      { from: /useContext\(\)/g, to: 'useNuxtApp()' },
      { from: /ssrRef\(/g, to: 'ref(' },
      { from: /\$axios\./g, to: '$fetch(' },
      { from: /useStatic\(/g, to: 'useLazyFetch(' }
    ]
    
    let changed = false
    migrations.forEach(migration => {
      if (migration.from.test(content)) {
        content = content.replace(migration.from, migration.to)
        changed = true
      }
    })
    
    if (changed) {
      await fs.writeFile(filePath, content)
      console.log(`[${this.timestamp}] [MIGRATION] ✓ Updated: ${filePath}`)
    }
  }
  
  /**
   * Migra plugins para novo formato
   */
  async migratePlugin(filePath: string): Promise<void> {
    console.log(`[${this.timestamp}] [MIGRATION] ℹ Migrating plugin: ${filePath}`)
    
    const fs = await import('fs/promises')
    let content = await fs.readFile(filePath, 'utf8')
    
    // Detectar padrão antigo
    if (content.includes('export default function') && !content.includes('defineNuxtPlugin')) {
      // Envolver com defineNuxtPlugin
      content = content.replace(
        /export default function[^{]*{/,
        'export default defineNuxtPlugin(() => {'
      )
      
      // Substituir inject por provide
      content = content.replace(
        /inject\('([^']+)', ([^)]+)\)/g,
        'return { provide: { $1: $2 } }'
      )
      
      await fs.writeFile(filePath, content)
      console.log(`[${this.timestamp}] [MIGRATION] ✓ Updated plugin: ${filePath}`)
    }
  }
  
  /**
   * Atualiza nuxt.config.ts
   */
  async migrateNuxtConfig(configPath: string): Promise<void> {
    console.log(`[${this.timestamp}] [MIGRATION] ℹ Migrating config: ${configPath}`)
    
    const fs = await import('fs/promises')
    let content = await fs.readFile(configPath, 'utf8')
    
    const configMigrations = [
      { from: /buildModules:/g, to: 'modules:' },
      { from: /loading:\s*{[^}]+}/g, to: 'app: { pageTransition: { name: "page", mode: "out-in" } }' },
      { from: /build:\s*{\s*babel:/g, to: '// build.babel migrated to vite config\n  vite: { build:' }
    ]
    
    let changed = false
    configMigrations.forEach(migration => {
      if (migration.from.test(content)) {
        content = content.replace(migration.from, migration.to)
        changed = true
      }
    })
    
    if (changed) {
      await fs.writeFile(configPath, content)
      console.log(`[${this.timestamp}] [MIGRATION] ✓ Updated config: ${configPath}`)
    }
  }
  
  /**
   * Valida migração de um arquivo
   */
  async validateMigration(filePath: string): Promise<ValidationResult> {
    const fs = await import('fs/promises')
    const content = await fs.readFile(filePath, 'utf8')
    
    const issues: string[] = []
    const warnings: string[] = []
    
    // Verificar padrões deprecated
    const deprecatedPatterns = [
      { pattern: /useContext\(\)/, message: 'useContext is deprecated, use useNuxtApp()' },
      { pattern: /\$axios/, message: '$axios is deprecated, use $fetch' },
      { pattern: /asyncData/, message: 'asyncData is deprecated, use useFetch' },
      { pattern: /fetch\(/, message: 'fetch hook is deprecated, use useFetch' }
    ]
    
    deprecatedPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(content)) {
        issues.push(message)
      }
    })
    
    // Verificar warnings
    const warningPatterns = [
      { pattern: /console\.log/, message: 'Consider removing console.log statements' },
      { pattern: /any/, message: 'Consider using specific types instead of any' }
    ]
    
    warningPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(content)) {
        warnings.push(message)
      }
    })
    
    return {
      filePath,
      isValid: issues.length === 0,
      issues,
      warnings
    }
  }
}

interface ValidationResult {
  filePath: string
  isValid: boolean
  issues: string[]
  warnings: string[]
}
```

### 4. Compatibility Checker

```typescript
// utils/compatibility-checker.ts
export class CompatibilityChecker {
  private readonly supportMatrix = {
    'nuxt': {
      '4.0.0': {
        node: '>=18.0.0',
        vue: '>=3.3.0',
        '@nuxt/ui': '>=4.0.0'
      }
    },
    '@nuxt/ui': {
      '4.0.0': {
        nuxt: '>=4.0.0',
        vue: '>=3.3.0',
        tailwindcss: '>=3.3.0'
      }
    }
  }
  
  async checkCompatibility(): Promise<CompatibilityReport> {
    const timestamp = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    console.log(`[${timestamp}] [COMPATIBILITY] ℹ Checking compatibility...`)
    
    const packageJson = await this.readPackageJson()
    const nodeVersion = process.version
    
    const issues: CompatibilityIssue[] = []
    
    // Check Node.js version
    if (!this.satisfiesVersion(nodeVersion, '>=18.0.0')) {
      issues.push({
        type: 'version-mismatch',
        package: 'node',
        current: nodeVersion,
        required: '>=18.0.0',
        severity: 'error'
      })
    }
    
    // Check package compatibility
    for (const [pkg, version] of Object.entries(packageJson.dependencies || {})) {
      const compatibility = this.checkPackageCompatibility(pkg, version)
      if (compatibility) {
        issues.push(compatibility)
      }
    }
    
    const report: CompatibilityReport = {
      timestamp,
      nodeVersion,
      packages: packageJson.dependencies || {},
      issues,
      isCompatible: issues.filter(i => i.severity === 'error').length === 0
    }
    
    console.log(`[${timestamp}] [COMPATIBILITY] ${report.isCompatible ? '✓' : '✗'} Compatibility check complete`)
    console.log(`  Issues found: ${issues.length}`)
    console.log(`  Errors: ${issues.filter(i => i.severity === 'error').length}`)
    console.log(`  Warnings: ${issues.filter(i => i.severity === 'warning').length}`)
    
    return report
  }
  
  private async readPackageJson(): Promise<any> {
    const fs = await import('fs/promises')
    try {
      const content = await fs.readFile('package.json', 'utf8')
      return JSON.parse(content)
    } catch (error) {
      throw new Error('Could not read package.json')
    }
  }
  
  private checkPackageCompatibility(pkg: string, version: string): CompatibilityIssue | null {
    // Check if package has known compatibility matrix
    if (!this.supportMatrix[pkg as keyof typeof this.supportMatrix]) {
      return null
    }
    
    const matrix = this.supportMatrix[pkg as keyof typeof this.supportMatrix]
    
    // Find the version requirements
    for (const [matrixVersion, requirements] of Object.entries(matrix)) {
      if (this.satisfiesVersion(version, `>=${matrixVersion}`)) {
        // Check each requirement
        for (const [depPkg, depVersion] of Object.entries(requirements)) {
          if (depPkg === 'node') {
            if (!this.satisfiesVersion(process.version, depVersion)) {
              return {
                type: 'dependency-mismatch',
                package: pkg,
                current: version,
                required: `${depPkg} ${depVersion}`,
                severity: 'error'
              }
            }
          }
          // Additional dependency checks would go here
        }
      }
    }
    
    return null
  }
  
  private satisfiesVersion(current: string, required: string): boolean {
    // Simplified version checking - in production, use semver library
    const currentNum = parseInt(current.replace(/[^\d]/g, ''))
    const requiredNum = parseInt(required.replace(/[^\d]/g, ''))
    
    if (required.includes('>=')) {
      return currentNum >= requiredNum
    }
    
    return currentNum === requiredNum
  }
}

interface CompatibilityReport {
  timestamp: string
  nodeVersion: string
  packages: Record<string, string>
  issues: CompatibilityIssue[]
  isCompatible: boolean
}

interface CompatibilityIssue {
  type: 'version-mismatch' | 'dependency-mismatch' | 'deprecated-package'
  package: string
  current: string
  required: string
  severity: 'error' | 'warning'
}
```

### 5. Script de Migração Completa

```bash
#!/bin/bash
# scripts/migrate-to-nuxt4.sh

set -e

TIMESTAMP=$(date '+%d/%m/%Y %H:%M:%S')
echo "[$TIMESTAMP] [MIGRATION] ℹ Starting Nuxt 4 migration process..."

# Fase 1: Backup
echo "[$TIMESTAMP] [MIGRATION] ℹ Creating backup..."
git checkout -b "backup/pre-nuxt4-$(date +%Y%m%d)"
git push origin "backup/pre-nuxt4-$(date +%Y%m%d)"

# Criar branch de migração
git checkout -b "feature/migrate-to-nuxt4"

# Fase 2: Análise pré-migração
echo "[$TIMESTAMP] [MIGRATION] ℹ Running pre-migration analysis..."
npm run analyze:migration

# Fase 3: Atualizar dependências
echo "[$TIMESTAMP] [MIGRATION] ℹ Updating dependencies..."
npm install nuxt@^4.0.0
npm install @nuxt/ui@^4.0.0

# Remover dependências obsoletas
npm uninstall @nuxtjs/composition-api @nuxtjs/axios

# Fase 4: Migração automática de código
echo "[$TIMESTAMP] [MIGRATION] ℹ Running automatic code migration..."
npm run migrate:composables
npm run migrate:plugins
npm run migrate:config

# Fase 5: Verificação
echo "[$TIMESTAMP] [MIGRATION] ℹ Running compatibility check..."
npm run check:compatibility

# Fase 6: Build test
echo "[$TIMESTAMP] [MIGRATION] ℹ Testing build..."
npm run build

# Fase 7: Testes
echo "[$TIMESTAMP] [MIGRATION] ℹ Running tests..."
npm run test

echo "[$TIMESTAMP] [MIGRATION] ✓ Migration completed successfully!"
echo "[$TIMESTAMP] [MIGRATION] ℹ Please review the migration report and test thoroughly before merging."
```

---

**Última Atualização:** 22/09/2025 00:35:00 (America/Sao_Paulo)  
**Versão:** 1.0.0  
**Status:** Guias de Migração e Compatibility Implementados  
**Responsável:** Dutt eCommerce Website Design

Este guia abrangente de migração e compatibility fornece ferramentas e processos estruturados para migração segura e eficiente de projetos Nuxt 3→4 e UI v3→v4, com automação máxima e validação rigorosa.
