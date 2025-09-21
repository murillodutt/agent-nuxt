# Development Best Practices - Agent OS Enhanced

**Data:** 21/09/2025 22:45:00 (America/Sao_Paulo)  
**Objetivo:** Diretrizes de desenvolvimento otimizadas para auxiliar LLMs na geração de código Nuxt.js de alta qualidade.

## Context

Global development guidelines for Agent OS projects, enhanced with cognitive patterns to improve LLM reasoning and code generation.

<conditional-block context-check="core-principles">
IF this Core Principles section already read in current context:
  SKIP: Re-reading this section
  NOTE: "Using Core Principles already in context"
ELSE:
  READ: The following principles

## Core Principles

### Keep It Simple
- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones
- **LLM Guidance**: When generating code, prioritize clarity over cleverness

### Optimize for Readability
- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- Add comments for "why" not "what"
- **LLM Guidance**: Generate descriptive variable names that explain intent

### DRY (Don't Repeat Yourself)
- Extract repeated business logic to private methods
- Extract repeated UI markup to reusable components
- Create utility functions for common operations
- **LLM Guidance**: Identify patterns and suggest abstractions

### File Structure
- Keep files focused on a single responsibility
- Group related functionality together
- Use consistent naming conventions
- **LLM Guidance**: Follow Nuxt.js conventions for automatic imports
</conditional-block>

## LLM-Specific Reasoning Patterns

### Problem-Solving Framework
1. **Understand the Context**: Always analyze the full requirement before coding
2. **Identify Dependencies**: List all imports and dependencies needed
3. **Plan the Structure**: Outline the component/function structure
4. **Implement Incrementally**: Build in small, testable pieces
5. **Validate and Optimize**: Check for performance and best practices

### Code Generation Strategy
- **Start with TypeScript**: Always use TypeScript for better type safety
- **Composition API First**: Prefer Composition API over Options API
- **Reactive Patterns**: Use `ref`, `reactive`, and `computed` appropriately
- **Error Handling**: Always include proper error handling and loading states
- **Accessibility**: Include ARIA attributes and semantic HTML

### Nuxt.js Specific Patterns
- **Auto-imports**: Leverage Nuxt's auto-import system
- **Server-side**: Distinguish between server and client-side code
- **SEO Optimization**: Include meta tags and structured data
- **Performance**: Implement lazy loading and code splitting

## Cognitive Enhancement for LLMs

### Decision-Making Framework
- **Evaluate Options**: Always consider multiple approaches before choosing
- **Justify Choices**: Provide reasoning for architectural decisions
- **Consider Trade-offs**: Acknowledge performance vs. maintainability balance
- **Think Incrementally**: Break complex problems into smaller components

### Context Awareness Patterns
- **Environment Detection**: Check for SSR vs. client-side rendering context
- **Device Considerations**: Consider mobile-first responsive design
- **Performance Budget**: Keep bundle size and loading times in mind
- **Accessibility First**: Design for all users from the start

### Error Prevention Strategies
- **Defensive Programming**: Validate inputs and handle edge cases
- **Type Safety**: Leverage TypeScript for compile-time error detection
- **Testing Mindset**: Write code that is easy to test
- **Documentation**: Include inline documentation for complex logic

<conditional-block context-check="dependencies" task-condition="choosing-external-library">
IF current task involves choosing an external library:
  IF Dependencies section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Dependencies guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Dependencies section not relevant to current task

## Dependencies

### Choose Libraries Wisely
When adding third-party dependencies:
- Select the most popular and actively maintained option
- Check the library's GitHub repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Number of stars/downloads
  - Clear documentation
- **LLM Guidance**: Prefer libraries with TypeScript support and good documentation
- **Nuxt Ecosystem**: Prioritize Nuxt modules and Vue 3 compatible libraries
</conditional-block>

## Advanced Patterns for Nuxt.js

### Component Architecture
- **Single File Components**: Use `.vue` files with proper separation of concerns
- **Composition Functions**: Extract reusable logic into composables
- **Props Validation**: Always define prop types and defaults
- **Emit Events**: Use proper event handling with TypeScript interfaces

### State Management
- **Pinia Integration**: Use Pinia for complex state management
- **Local State First**: Prefer local component state when possible
- **Server State**: Use `$fetch` and `useLazyFetch` for server data
- **Reactive Patterns**: Leverage Vue's reactivity system effectively

### Performance Optimization
- **Lazy Loading**: Implement lazy loading for heavy components
- **Code Splitting**: Use dynamic imports for route-level splitting
- **Image Optimization**: Use `<NuxtImg>` for optimized image delivery
- **Bundle Analysis**: Regular bundle size monitoring and optimization

### SEO and Meta Management
- **Dynamic Meta**: Use `useSeoMeta` for dynamic meta tags
- **Structured Data**: Implement JSON-LD for rich snippets
- **Open Graph**: Include proper OG tags for social sharing
- **Sitemap**: Generate dynamic sitemaps for better indexing

## Quality Assurance Patterns

### Code Review Checklist
- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Loading states included
- [ ] Accessibility attributes present
- [ ] Performance considerations addressed
- [ ] Tests written for complex logic
- [ ] Documentation updated

### Performance Benchmarks
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: Monitor and optimize regularly

### Security Considerations
- **Input Validation**: Sanitize all user inputs
- **XSS Prevention**: Use proper escaping and CSP headers
- **CSRF Protection**: Implement CSRF tokens for forms
- **Authentication**: Use secure authentication patterns
- **Environment Variables**: Never expose secrets in client code

---

**Última Atualização:** 21/09/2025 22:45:00 (America/Sao_Paulo)  
**Versão:** 2.0.0 - Enhanced for LLM Cognitive Patterns  
**Compatibilidade:** Nuxt 4.x, Vue 3.x, TypeScript 5.x  
**Responsável:** Dutt eCommerce Website Design
