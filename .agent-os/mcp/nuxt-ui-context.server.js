/**
 * Nuxt UI v4 Context MCP Server - Agent OS
 * 
 * Servidor MCP (Model Context Protocol) especializado em fornecer contexto
 * otimizado para desenvolvimento com Nuxt UI v4, implementando estratégias
 * avançadas de context management e Multi-Chain Prompts.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js'

class NuxtUIContextServer {
  constructor() {
    this.server = new Server(
      {
        name: 'nuxt-ui-context-server',
        version: '1.0.0',
        description: 'MCP Server for Nuxt UI v4 development context and optimization'
      },
      {
        capabilities: {
          tools: {},
          resources: {}
        }
      }
    )

    this.knowledgeBase = this.initializeKnowledgeBase()
    this.contextCache = new Map()
    this.setupHandlers()
  }

  initializeKnowledgeBase() {
    return {
      components: {
        'UButton': {
          category: 'atoms',
          props: ['variant', 'size', 'disabled', 'loading', 'icon', 'label'],
          slots: ['default', 'leading', 'trailing'],
          emits: ['click'],
          accessibility: ['keyboard-navigation', 'screen-reader', 'focus-management'],
          examples: [
            {
              title: 'Basic Button',
              code: '<UButton>Click me</UButton>'
            },
            {
              title: 'Primary Button with Icon',
              code: '<UButton variant="primary" icon="i-heroicons-plus">Add Item</UButton>'
            }
          ]
        },
        'UInput': {
          category: 'atoms',
          props: ['modelValue', 'type', 'placeholder', 'disabled', 'required', 'error'],
          slots: ['leading', 'trailing'],
          emits: ['update:modelValue', 'blur', 'focus'],
          accessibility: ['form-validation', 'error-announcement', 'label-association'],
          examples: [
            {
              title: 'Basic Input',
              code: '<UInput v-model="value" placeholder="Enter text" />'
            },
            {
              title: 'Input with Validation',
              code: '<UInput v-model="email" type="email" :error="emailError" />'
            }
          ]
        },
        'UModal': {
          category: 'molecules',
          props: ['modelValue', 'title', 'size', 'closable', 'preventClose'],
          slots: ['default', 'header', 'footer'],
          emits: ['update:modelValue', 'close', 'open'],
          accessibility: ['focus-trap', 'escape-key', 'aria-modal'],
          examples: [
            {
              title: 'Basic Modal',
              code: `<UModal v-model="isOpen" title="Confirm Action">
  <p>Are you sure you want to continue?</p>
  <template #footer>
    <UButton @click="isOpen = false">Cancel</UButton>
    <UButton variant="primary" @click="confirm">Confirm</UButton>
  </template>
</UModal>`
            }
          ]
        },
        'UCard': {
          category: 'molecules',
          props: ['title', 'description', 'image', 'padding'],
          slots: ['default', 'header', 'footer'],
          emits: [],
          accessibility: ['semantic-structure', 'heading-hierarchy'],
          examples: [
            {
              title: 'Basic Card',
              code: `<UCard title="Card Title" description="Card description">
  <p>Card content goes here</p>
</UCard>`
            }
          ]
        }
      },
      
      composables: {
        'useFormData': {
          description: 'Reactive form data management with validation',
          parameters: ['initialValues', 'validationRules'],
          returns: ['values', 'errors', 'validate', 'reset'],
          example: `const { values, errors, validate } = useFormData({
  name: '',
  email: ''
}, {
  name: (value) => value ? null : 'Name is required',
  email: (value) => /\\S+@\\S+\\.\\S+/.test(value) ? null : 'Invalid email'
})`
        },
        'useAsyncData': {
          description: 'Async data fetching with loading states',
          parameters: ['key', 'handler', 'options'],
          returns: ['data', 'pending', 'error', 'refresh'],
          example: `const { data, pending, error } = await useAsyncData('users', () => $fetch('/api/users'))`
        },
        'useColorMode': {
          description: 'Color mode (light/dark) management',
          parameters: [],
          returns: ['colorMode', 'preference', 'setColorMode'],
          example: `const { colorMode, setColorMode } = useColorMode()
setColorMode('dark')`
        }
      },

      patterns: {
        'form-validation': {
          description: 'Comprehensive form validation pattern',
          implementation: `// Form validation with Nuxt UI v4
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'Must be 18 or older')
})

const { values, errors, validate } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    email: '',
    age: null
  }
})`,
          components: ['UForm', 'UInput', 'UButton'],
          accessibility: ['error-announcement', 'field-validation', 'submit-prevention']
        },
        
        'data-table': {
          description: 'Accessible and performant data table pattern',
          implementation: `// Data table with sorting and pagination
const { data, pending } = await useFetch('/api/users', {
  query: {
    page: currentPage,
    limit: pageSize,
    sort: sortBy,
    order: sortOrder
  }
})

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'actions', label: 'Actions' }
]`,
          components: ['UTable', 'UPagination', 'UButton'],
          accessibility: ['sortable-headers', 'keyboard-navigation', 'screen-reader-support']
        },

        'modal-management': {
          description: 'Modal state management and accessibility',
          implementation: `// Modal with proper focus management
const isOpen = ref(false)
const modalRef = ref()

const openModal = () => {
  isOpen.value = true
  nextTick(() => {
    modalRef.value?.focus()
  })
}

const closeModal = () => {
  isOpen.value = false
  // Return focus to trigger element
}`,
          components: ['UModal', 'UButton'],
          accessibility: ['focus-trap', 'escape-key', 'return-focus']
        }
      },

      optimizations: {
        'bundle-splitting': {
          description: 'Code splitting strategies for Nuxt UI components',
          technique: 'Dynamic imports and lazy loading',
          implementation: `// Lazy load heavy components
const UDataTable = defineAsyncComponent(() => import('~/components/UDataTable.vue'))
const UChart = defineAsyncComponent(() => import('~/components/UChart.vue'))

// Route-based splitting
export default defineNuxtConfig({
  experimental: {
    payloadExtraction: false
  },
  nitro: {
    experimental: {
      wasm: true
    }
  }
})`
        },
        
        'performance-monitoring': {
          description: 'Performance monitoring for Nuxt UI applications',
          technique: 'Core Web Vitals tracking',
          implementation: `// Performance monitoring
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Monitor Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getFCP(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  }
})`
        }
      }
    }
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get-component-info',
            description: 'Get detailed information about a Nuxt UI v4 component',
            inputSchema: {
              type: 'object',
              properties: {
                componentName: {
                  type: 'string',
                  description: 'Name of the Nuxt UI component (e.g., UButton, UInput)'
                }
              },
              required: ['componentName']
            }
          },
          {
            name: 'generate-component-example',
            description: 'Generate code examples for Nuxt UI v4 components',
            inputSchema: {
              type: 'object',
              properties: {
                componentName: {
                  type: 'string',
                  description: 'Name of the component'
                },
                useCase: {
                  type: 'string',
                  description: 'Specific use case or scenario'
                },
                accessibility: {
                  type: 'boolean',
                  description: 'Include accessibility features',
                  default: true
                }
              },
              required: ['componentName', 'useCase']
            }
          },
          {
            name: 'analyze-accessibility',
            description: 'Analyze accessibility compliance for component code',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Vue component code to analyze'
                },
                standard: {
                  type: 'string',
                  enum: ['WCAG-A', 'WCAG-AA', 'WCAG-AAA'],
                  default: 'WCAG-AA'
                }
              },
              required: ['code']
            }
          },
          {
            name: 'optimize-performance',
            description: 'Suggest performance optimizations for Nuxt UI components',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Component code to optimize'
                },
                target: {
                  type: 'string',
                  enum: ['bundle-size', 'render-time', 'memory-usage'],
                  description: 'Optimization target'
                }
              },
              required: ['code']
            }
          },
          {
            name: 'get-pattern-implementation',
            description: 'Get implementation details for common Nuxt UI patterns',
            inputSchema: {
              type: 'object',
              properties: {
                pattern: {
                  type: 'string',
                  description: 'Pattern name (e.g., form-validation, data-table)'
                },
                complexity: {
                  type: 'string',
                  enum: ['basic', 'intermediate', 'advanced'],
                  default: 'intermediate'
                }
              },
              required: ['pattern']
            }
          },
          {
            name: 'validate-nuxt-ui-usage',
            description: 'Validate proper usage of Nuxt UI v4 components and patterns',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Code to validate'
                },
                strict: {
                  type: 'boolean',
                  description: 'Enable strict validation mode',
                  default: false
                }
              },
              required: ['code']
            }
          }
        ]
      }
    })

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      switch (name) {
        case 'get-component-info':
          return this.getComponentInfo(args.componentName)
        
        case 'generate-component-example':
          return this.generateComponentExample(args.componentName, args.useCase, args.accessibility)
        
        case 'analyze-accessibility':
          return this.analyzeAccessibility(args.code, args.standard)
        
        case 'optimize-performance':
          return this.optimizePerformance(args.code, args.target)
        
        case 'get-pattern-implementation':
          return this.getPatternImplementation(args.pattern, args.complexity)
        
        case 'validate-nuxt-ui-usage':
          return this.validateNuxtUIUsage(args.code, args.strict)
        
        default:
          throw new Error(`Unknown tool: ${name}`)
      }
    })

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'nuxt-ui://components',
            name: 'Nuxt UI v4 Components',
            description: 'Complete component library reference',
            mimeType: 'application/json'
          },
          {
            uri: 'nuxt-ui://patterns',
            name: 'Design Patterns',
            description: 'Common implementation patterns',
            mimeType: 'application/json'
          },
          {
            uri: 'nuxt-ui://accessibility',
            name: 'Accessibility Guidelines',
            description: 'WCAG compliance guidelines for Nuxt UI',
            mimeType: 'text/markdown'
          },
          {
            uri: 'nuxt-ui://performance',
            name: 'Performance Best Practices',
            description: 'Optimization strategies and techniques',
            mimeType: 'text/markdown'
          }
        ]
      }
    })

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params

      switch (uri) {
        case 'nuxt-ui://components':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.knowledgeBase.components, null, 2)
            }]
          }
        
        case 'nuxt-ui://patterns':
          return {
            contents: [{
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.knowledgeBase.patterns, null, 2)
            }]
          }
        
        case 'nuxt-ui://accessibility':
          return {
            contents: [{
              uri,
              mimeType: 'text/markdown',
              text: this.generateAccessibilityGuide()
            }]
          }
        
        case 'nuxt-ui://performance':
          return {
            contents: [{
              uri,
              mimeType: 'text/markdown',
              text: this.generatePerformanceGuide()
            }]
          }
        
        default:
          throw new Error(`Unknown resource: ${uri}`)
      }
    })
  }

  async getComponentInfo(componentName) {
    const component = this.knowledgeBase.components[componentName]
    
    if (!component) {
      return {
        content: [{
          type: 'text',
          text: `Component "${componentName}" not found in Nuxt UI v4 library.`
        }]
      }
    }

    return {
      content: [{
        type: 'text',
        text: `# ${componentName}

**Category:** ${component.category}

## Props
${component.props.map(prop => `- \`${prop}\``).join('\n')}

## Slots
${component.slots.map(slot => `- \`${slot}\``).join('\n')}

## Events
${component.emits.map(emit => `- \`${emit}\``).join('\n')}

## Accessibility Features
${component.accessibility.map(feature => `- ${feature}`).join('\n')}

## Examples
${component.examples.map((example, index) => `
### ${example.title}
\`\`\`vue
${example.code}
\`\`\`
`).join('\n')}
`
      }]
    }
  }

  async generateComponentExample(componentName, useCase, includeAccessibility = true) {
    const component = this.knowledgeBase.components[componentName]
    
    if (!component) {
      return {
        content: [{
          type: 'text',
          text: `Component "${componentName}" not found.`
        }]
      }
    }

    // Generate contextual example based on use case
    let example = this.generateContextualExample(componentName, useCase, component)
    
    if (includeAccessibility) {
      example = this.enhanceWithAccessibility(example, component.accessibility)
    }

    return {
      content: [{
        type: 'text',
        text: `# ${componentName} Example - ${useCase}

\`\`\`vue
${example}
\`\`\`

## Accessibility Notes
${includeAccessibility ? this.generateAccessibilityNotes(component.accessibility) : 'Accessibility features not included in this example.'}
`
      }]
    }
  }

  async analyzeAccessibility(code, standard = 'WCAG-AA') {
    const issues = []
    const recommendations = []
    
    // Analyze semantic HTML
    if (!code.includes('<button') && code.includes('click')) {
      issues.push('Interactive elements should use semantic HTML (button, a, etc.)')
    }
    
    // Check for ARIA attributes
    if (code.includes('role=') && !code.includes('aria-')) {
      recommendations.push('Consider adding ARIA attributes for better screen reader support')
    }
    
    // Check for keyboard navigation
    if (!code.includes('keydown') && !code.includes('keyup') && code.includes('click')) {
      issues.push('Interactive elements should support keyboard navigation')
    }
    
    // Check for focus management
    if (code.includes('modal') && !code.includes('focus')) {
      issues.push('Modals should implement proper focus management')
    }

    const score = Math.max(0, 100 - (issues.length * 20) - (recommendations.length * 5))
    
    return {
      content: [{
        type: 'text',
        text: `# Accessibility Analysis (${standard})

**Score:** ${score}/100

## Issues Found
${issues.length > 0 ? issues.map(issue => `- ❌ ${issue}`).join('\n') : '✅ No critical issues found'}

## Recommendations
${recommendations.length > 0 ? recommendations.map(rec => `- 💡 ${rec}`).join('\n') : '✅ No additional recommendations'}

## Compliance Level
${score >= 90 ? '✅ Excellent' : score >= 70 ? '⚠️ Good' : '❌ Needs Improvement'}
`
      }]
    }
  }

  async optimizePerformance(code, target) {
    const optimizations = []
    const metrics = this.analyzePerformanceMetrics(code)
    
    switch (target) {
      case 'bundle-size':
        if (code.includes('import')) {
          optimizations.push('Use dynamic imports for heavy components')
        }
        if (code.includes('lodash')) {
          optimizations.push('Import specific lodash functions instead of the entire library')
        }
        break
        
      case 'render-time':
        if (code.includes('v-for') && !code.includes(':key')) {
          optimizations.push('Add :key to v-for loops for better rendering performance')
        }
        if (code.includes('computed') && code.includes('filter')) {
          optimizations.push('Consider memoizing expensive computations')
        }
        break
        
      case 'memory-usage':
        if (code.includes('ref(') && code.includes('[]')) {
          optimizations.push('Use shallowRef for large arrays to reduce reactivity overhead')
        }
        break
    }

    return {
      content: [{
        type: 'text',
        text: `# Performance Optimization - ${target}

## Current Metrics
- Estimated bundle impact: ${metrics.bundleImpact}KB
- Render complexity: ${metrics.renderComplexity}
- Memory usage: ${metrics.memoryUsage}

## Optimizations
${optimizations.map(opt => `- 🚀 ${opt}`).join('\n')}

## Optimized Code
\`\`\`vue
${this.applyOptimizations(code, optimizations)}
\`\`\`
`
      }]
    }
  }

  async getPatternImplementation(pattern, complexity = 'intermediate') {
    const patternInfo = this.knowledgeBase.patterns[pattern]
    
    if (!patternInfo) {
      return {
        content: [{
          type: 'text',
          text: `Pattern "${pattern}" not found.`
        }]
      }
    }

    return {
      content: [{
        type: 'text',
        text: `# ${pattern} Pattern (${complexity})

${patternInfo.description}

## Implementation
\`\`\`vue
${patternInfo.implementation}
\`\`\`

## Required Components
${patternInfo.components.map(comp => `- ${comp}`).join('\n')}

## Accessibility Considerations
${patternInfo.accessibility.map(acc => `- ${acc}`).join('\n')}
`
      }]
    }
  }

  async validateNuxtUIUsage(code, strict = false) {
    const violations = []
    const warnings = []
    
    // Check for proper component usage
    const componentMatches = code.match(/<U[A-Z][a-zA-Z]*/g) || []
    componentMatches.forEach(match => {
      const componentName = match.slice(1) // Remove <
      if (!this.knowledgeBase.components[componentName]) {
        violations.push(`Unknown Nuxt UI component: ${componentName}`)
      }
    })
    
    // Check for deprecated patterns
    if (code.includes('$nuxt') && strict) {
      warnings.push('$nuxt is deprecated, use useNuxtApp() instead')
    }
    
    // Check for proper prop usage
    if (code.includes('v-model') && !code.includes('modelValue')) {
      warnings.push('Consider using explicit modelValue prop for better TypeScript support')
    }

    return {
      content: [{
        type: 'text',
        text: `# Nuxt UI Usage Validation

## Violations
${violations.length > 0 ? violations.map(v => `- ❌ ${v}`).join('\n') : '✅ No violations found'}

## Warnings
${warnings.length > 0 ? warnings.map(w => `- ⚠️ ${w}`).join('\n') : '✅ No warnings'}

## Overall Status
${violations.length === 0 ? '✅ Valid Nuxt UI usage' : '❌ Issues found that need attention'}
`
      }]
    }
  }

  // Helper methods
  generateContextualExample(componentName, useCase, component) {
    // This would generate contextual examples based on the use case
    // For now, return a basic example
    return component.examples[0]?.code || `<${componentName} />`
  }

  enhanceWithAccessibility(example, accessibilityFeatures) {
    // Add accessibility enhancements to the example
    let enhanced = example
    
    if (accessibilityFeatures.includes('keyboard-navigation')) {
      enhanced = enhanced.replace('>', ' @keydown="handleKeydown">')
    }
    
    if (accessibilityFeatures.includes('screen-reader')) {
      enhanced = enhanced.replace('>', ' :aria-label="ariaLabel">')
    }
    
    return enhanced
  }

  generateAccessibilityNotes(features) {
    return features.map(feature => `- ${feature.replace('-', ' ')}`).join('\n')
  }

  analyzePerformanceMetrics(code) {
    return {
      bundleImpact: Math.floor(code.length / 100), // Rough estimate
      renderComplexity: (code.match(/v-/g) || []).length,
      memoryUsage: code.includes('ref(') ? 'Medium' : 'Low'
    }
  }

  applyOptimizations(code, optimizations) {
    // Apply basic optimizations to the code
    let optimized = code
    
    optimizations.forEach(opt => {
      if (opt.includes('dynamic imports')) {
        optimized = optimized.replace(/import (.+) from/, 'const $1 = defineAsyncComponent(() => import')
      }
      
      if (opt.includes(':key')) {
        optimized = optimized.replace(/v-for="([^"]+)"/, 'v-for="$1" :key="item.id"')
      }
    })
    
    return optimized
  }

  generateAccessibilityGuide() {
    return `# Nuxt UI v4 Accessibility Guidelines

## WCAG 2.1 AA Compliance

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Implement proper focus management
- Support standard keyboard shortcuts

### Screen Reader Support
- Use semantic HTML elements
- Provide appropriate ARIA labels
- Announce dynamic content changes

### Color and Contrast
- Maintain 4.5:1 contrast ratio for normal text
- Maintain 3:1 contrast ratio for large text
- Don't rely solely on color to convey information

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trapping in modals

## Implementation Checklist
- [ ] Semantic HTML structure
- [ ] ARIA attributes where needed
- [ ] Keyboard event handlers
- [ ] Focus management
- [ ] Color contrast validation
- [ ] Screen reader testing
`
  }

  generatePerformanceGuide() {
    return `# Nuxt UI v4 Performance Best Practices

## Bundle Optimization
- Use dynamic imports for heavy components
- Implement proper tree shaking
- Optimize dependencies

## Rendering Performance
- Use v-show vs v-if appropriately
- Implement virtual scrolling for large lists
- Optimize computed properties

## Memory Management
- Use shallowRef for large objects
- Implement proper cleanup in onUnmounted
- Avoid memory leaks in event listeners

## Core Web Vitals
- Optimize Largest Contentful Paint (LCP)
- Minimize Cumulative Layout Shift (CLS)
- Reduce First Input Delay (FID)

## Monitoring
- Implement performance monitoring
- Track Core Web Vitals
- Monitor bundle size changes
`
  }

  async start() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('Nuxt UI Context MCP Server running on stdio')
  }
}

// Start the server
const server = new NuxtUIContextServer()
server.start().catch(console.error)

export default NuxtUIContextServer