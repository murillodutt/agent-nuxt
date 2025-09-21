# Project Configuration - Agent Nuxt UI v4 Specialist

## Context

Configurações específicas do projeto Agent OS para desenvolvimento especializado em Nuxt UI v4, definindo parâmetros customizados e overrides das configurações globais.

## Project Identity

- **Project Name**: Agent Nuxt UI v4 Development Specialist
- **Version**: 1.0.0
- **Agent Type**: Nuxt UI v4 Specialist
- **Target Framework**: Nuxt 3.14.x → 4.x
- **UI Framework**: Nuxt UI v4.0.0-alpha.2
- **Specialization**: Component development, accessibility, performance optimization

## Framework Configuration

### Nuxt Configuration Override

```typescript
// nuxt.config.ts - Project-specific configuration
export default defineNuxtConfig({
  // Core Nuxt settings
  ssr: true,
  nitro: {
    preset: 'vercel'
  },
  
  // Nuxt UI v4 configuration
  ui: {
    primary: 'blue',
    gray: 'slate',
    notifications: {
      position: 'top-0 bottom-auto'
    }
  },
  
  // Development tools
  devtools: { enabled: true },
  typescript: { 
    strict: true,
    typeCheck: true
  },
  
  // CSS and styling
  css: ['~/assets/css/main.css'],
  
  // Modules
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/test-utils/module'
  ],
  
  // Build optimization
  build: {
    analyze: process.env.ANALYZE === 'true'
  },
  
  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.API_SECRET,
    
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.API_BASE_URL || '/api',
      appVersion: process.env.npm_package_version
    }
  }
})
```

### TailwindCSS Configuration

```javascript
// tailwind.config.js - Project-specific styling
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
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

## Development Environment

### Package.json Scripts

```json
{
  "name": "agent-nuxt-ui-v4",
  "version": "1.0.0",
  "scripts": {
    "dev": "nuxt dev --host 0.0.0.0",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "nuxt typecheck",
    "analyze": "ANALYZE=true nuxt build",
    "prepare": "nuxt prepare"
  }
}
```

### Environment Variables

```bash
# .env.example - Project environment template
# Development
NODE_ENV=development
NUXT_DEVTOOLS=true

# API Configuration
API_BASE_URL=http://localhost:3000/api
API_SECRET=your-secret-key

# Database (if needed)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Authentication (if needed)
AUTH_SECRET=your-auth-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VERCEL_ANALYTICS_ID=your-vercel-analytics-id

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

## Testing Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
})
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  }
})
```

## Code Quality Configuration

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
    'plugin:vue-a11y/recommended'
  ],
  rules: {
    // Vue specific
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    
    // Accessibility
    'vue-a11y/click-events-have-key-events': 'error',
    'vue-a11y/no-autofocus': 'error',
    
    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn'
  }
}
```

### Prettier Configuration

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "vueIndentScriptAndStyle": false
}
```

## Performance Configuration

### Bundle Analysis

```typescript
// plugins/bundle-analyzer.ts
export default defineNuxtPlugin(() => {
  if (process.dev && process.env.ANALYZE) {
    console.log('Bundle analysis enabled')
  }
})
```

### Image Optimization

```typescript
// nuxt.config.ts - Image configuration
export default defineNuxtConfig({
  image: {
    formats: ['webp', 'avif'],
    quality: 80,
    densities: [1, 2],
    sizes: '100vw sm:50vw md:400px'
  }
})
```

## Deployment Configuration

### Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "framework": "nuxtjs",
  "functions": {
    "app/server/index.mjs": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Unit tests
        run: npm run test:coverage
      
      - name: Build
        run: npm run build
      
      - name: E2E tests
        run: npm run test:e2e
```

## Monitoring Configuration

### Error Tracking

```typescript
// plugins/sentry.client.ts
import * as Sentry from '@sentry/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const { $config } = useNuxtApp()
  
  if ($config.public.sentryDsn) {
    Sentry.init({
      app: nuxtApp.vueApp,
      dsn: $config.public.sentryDsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1
    })
  }
})
```

### Analytics

```typescript
// plugins/analytics.client.ts
export default defineNuxtPlugin(() => {
  const { $config } = useNuxtApp()
  
  if ($config.public.googleAnalyticsId) {
    useHead({
      script: [
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${$config.public.googleAnalyticsId}`,
          async: true
        }
      ]
    })
  }
})
```

## Security Configuration

### Content Security Policy

```typescript
// nuxt.config.ts - Security headers
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self' https://api.example.com"
          ].join('; ')
        }
      }
    }
  }
})
```

## Project-Specific Overrides

### Custom Tech Stack Additions

- **State Management**: Pinia with TypeScript
- **Form Validation**: Zod + VeeValidate
- **Date Handling**: date-fns
- **HTTP Client**: Built-in $fetch with custom composables
- **Icons**: Heroicons via Nuxt UI
- **Animations**: CSS transitions + Vue Transition

### Performance Targets

- **Lighthouse Score**: 95+ (all categories)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 250KB initial load
- **Test Coverage**: 90%+ (unit tests)

### Accessibility Standards

- **WCAG Compliance**: 2.1 AA
- **Keyboard Navigation**: Full support
- **Screen Reader**: Optimized
- **Color Contrast**: 4.5:1 minimum
- **Focus Management**: Visible and logical

Esta configuração garante um ambiente de desenvolvimento otimizado e padronizado para projetos Agent OS especializados em Nuxt UI v4.