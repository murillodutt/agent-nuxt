# Tech Stack - Agent OS Nuxt Development Agent

## Context

Global tech stack defaults for Agent OS Nuxt projects, specialized for Nuxt 4.x and UI v4 development. Overridable in project-specific `.agent-os/product/tech-stack.md`.

## Core Framework Stack

- **App Framework**: Nuxt 3.14.x (preparing for 4.x)
- **UI Framework**: Nuxt UI v4.0.0-alpha.2
- **Language**: TypeScript 5.3.x
- **Runtime**: Node.js 22 LTS
- **Package Manager**: npm (with workspaces support)
- **Vue Version**: Vue 3.4.x (Composition API)

## Nuxt Ecosystem

### Core Modules
- `@nuxt/ui`: ^4.0.0-alpha.2 (Primary UI framework)
- `@nuxt/content`: ^2.13.0 (Content management)
- `@nuxt/image`: ^1.8.0 (Image optimization)
- `@pinia/nuxt`: ^0.5.0 (State management)
- `@nuxtjs/tailwindcss`: latest (Styling framework)
- `@vueuse/nuxt`: latest (Composition utilities)

### Development Tools
- `@nuxt/devtools`: ^1.5.0 (Development experience)
- `@nuxt/eslint`: ^0.5.0 (Code quality)
- `vitest`: ^2.0.0 (Unit testing)
- `playwright`: ^1.47.0 (E2E testing)
- `@nuxt/test-utils`: latest (Testing utilities)

### Performance & Security
- `nuxt-security`: latest (Security headers)
- `@nuxtjs/color-mode`: latest (Theme switching)
- Bundle analyzer: Integrated
- Tree shaking: Aggressive
- Lazy loading: Enabled by default

## Styling & Design System

- **CSS Framework**: TailwindCSS 4.0+
- **UI Components**: Nuxt UI v4 (Headless UI + Tailwind)
- **Icons**: Heroicons (via Nuxt UI)
- **Fonts**: Inter (self-hosted via Nuxt Fonts)
- **Theme System**: CSS variables + Tailwind config
- **Color Modes**: Light/Dark with system preference

## Development Environment

- **TypeScript**: Strict mode enabled
- **ESLint**: Nuxt ESLint config + accessibility rules
- **Prettier**: Integrated with ESLint
- **Husky**: Git hooks for quality gates
- **Commitizen**: Conventional commits

## Testing Strategy

- **Unit Tests**: Vitest + Vue Test Utils
- **Component Tests**: @nuxt/test-utils
- **E2E Tests**: Playwright
- **Accessibility Tests**: jest-axe + @axe-core/playwright
- **Performance Tests**: Lighthouse CI

## Deployment & Hosting

- **Primary Hosting**: Vercel (optimized for Nuxt)
- **Alternative**: Netlify, Cloudflare Pages
- **Database**: Supabase PostgreSQL (for full-stack apps)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Analytics**: Vercel Analytics
- **Monitoring**: Sentry (error tracking)

## CI/CD Pipeline

- **Platform**: GitHub Actions
- **Triggers**: Push to main/develop branches
- **Quality Gates**: 
  - TypeScript compilation
  - ESLint + Prettier
  - Unit tests (90%+ coverage)
  - E2E tests (critical paths)
  - Accessibility tests (WCAG 2.1 AA)
  - Performance tests (Lighthouse scores)
- **Deployment**: Automatic to staging, manual to production

## Agent OS Specific

- **MCP Servers**: Nuxt UI v4, Nuxt Core, Accessibility
- **Context Management**: Intelligent loading with 60% token reduction
- **Fallback System**: Local docs + community resources
- **Validation**: Real-time TypeScript + accessibility checks
- **Performance Monitoring**: Core Web Vitals tracking

## Environment Configuration

```yaml
# Development
NODE_ENV: development
NUXT_DEVTOOLS: true
NUXT_UI_VERSION: 4.0.0-alpha.2

# Production
NODE_ENV: production
NITRO_PRESET: vercel
BUILD_PRESET: static # or server for SSR
```

## Quality Standards

- **Performance**: Lighthouse score 95+
- **Accessibility**: WCAG 2.1 AA compliance
- **SEO**: Core Web Vitals green
- **Security**: OWASP compliance
- **Code Quality**: 90%+ test coverage
- **Bundle Size**: <250KB initial load
