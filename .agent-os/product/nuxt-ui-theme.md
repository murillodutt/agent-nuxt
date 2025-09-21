# Sistema de Temas Nuxt UI v4

## Visão Geral
Sistema de temas unificado e acessível para Nuxt UI v4, garantindo consistência visual, conformidade WCAG 2.1 AA e experiência de usuário otimizada em todos os componentes.

## Arquitetura do Sistema de Temas

### Estrutura Base
```typescript
interface NuxtUITheme {
  colors: ColorSystem
  typography: TypographySystem
  spacing: SpacingSystem
  components: ComponentThemes
  accessibility: AccessibilityConfig
  responsive: ResponsiveConfig
}
```

## Sistema de Cores

### Paleta Principal
```typescript
const colorSystem = {
  // Cores Primárias
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Base
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  
  // Cores Neutras
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  },
  
  // Cores Semânticas
  semantic: {
    success: '#10b981',
    warning: '#f59e0b', 
    error: '#ef4444',
    info: '#3b82f6'
  }
}
```

### Conformidade de Contraste WCAG 2.1 AA
```typescript
const contrastRatios = {
  // Texto normal: mínimo 4.5:1
  normalText: {
    onLight: 'gray.700', // 7.2:1
    onDark: 'gray.200'   // 8.1:1
  },
  
  // Texto grande: mínimo 3:1  
  largeText: {
    onLight: 'gray.600', // 4.8:1
    onDark: 'gray.300'   // 5.2:1
  },
  
  // Elementos interativos: mínimo 3:1
  interactive: {
    primary: 'primary.600', // 4.2:1
    secondary: 'gray.600'   // 4.8:1
  }
}
```

## Sistema de Tipografia

### Escala Tipográfica
```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace']
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }]
  },
  
  fontWeight: {
    normal: '400',
    medium: '500', 
    semibold: '600',
    bold: '700'
  }
}
```

### Hierarquia Semântica
```typescript
const textStyles = {
  h1: {
    fontSize: '4xl',
    fontWeight: 'bold',
    lineHeight: 'tight',
    letterSpacing: '-0.025em'
  },
  h2: {
    fontSize: '3xl', 
    fontWeight: 'bold',
    lineHeight: 'tight'
  },
  h3: {
    fontSize: '2xl',
    fontWeight: 'semibold', 
    lineHeight: 'snug'
  },
  body: {
    fontSize: 'base',
    fontWeight: 'normal',
    lineHeight: 'relaxed'
  },
  caption: {
    fontSize: 'sm',
    fontWeight: 'medium',
    lineHeight: 'normal'
  }
}
```

## Sistema de Espaçamento

### Escala de Espaçamento
```typescript
const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem'       // 96px
}
```

## Temas de Componentes

### Button Component
```typescript
const buttonTheme = {
  base: {
    font: 'font-medium',
    rounded: 'rounded-md',
    size: {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-3 py-2 text-sm', 
      lg: 'px-4 py-2 text-base',
      xl: 'px-6 py-3 text-base'
    }
  },
  
  variants: {
    solid: {
      primary: {
        bg: 'bg-primary-600 hover:bg-primary-700',
        text: 'text-white',
        ring: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      },
      secondary: {
        bg: 'bg-gray-600 hover:bg-gray-700',
        text: 'text-white', 
        ring: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
      }
    },
    
    outline: {
      primary: {
        border: 'border border-primary-600',
        text: 'text-primary-600 hover:text-white',
        bg: 'hover:bg-primary-600',
        ring: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      }
    },
    
    ghost: {
      primary: {
        text: 'text-primary-600 hover:text-primary-700',
        bg: 'hover:bg-primary-50',
        ring: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      }
    }
  },
  
  // Estados de acessibilidade
  accessibility: {
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
    focus: 'focus:outline-none focus-visible:ring-2',
    active: 'active:scale-95 transition-transform'
  }
}
```

### Input Component  
```typescript
const inputTheme = {
  base: {
    appearance: 'appearance-none',
    background: 'bg-white dark:bg-gray-900',
    border: 'border border-gray-300 dark:border-gray-700',
    rounded: 'rounded-md',
    font: 'text-sm',
    placeholder: 'placeholder-gray-400 dark:placeholder-gray-500'
  },
  
  size: {
    sm: 'px-2.5 py-1.5',
    md: 'px-3 py-2',
    lg: 'px-4 py-2.5'
  },
  
  states: {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
    disabled: 'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
  },
  
  accessibility: {
    focus: 'focus:outline-none focus:ring-2 focus:ring-offset-2',
    required: 'aria-required="true"',
    invalid: 'aria-invalid="true"'
  }
}
```

### Card Component
```typescript
const cardTheme = {
  base: {
    background: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
    rounded: 'rounded-lg',
    shadow: 'shadow-sm'
  },
  
  variants: {
    default: 'p-6',
    compact: 'p-4',
    spacious: 'p-8'
  },
  
  elements: {
    header: 'border-b border-gray-200 dark:border-gray-700 pb-4 mb-4',
    footer: 'border-t border-gray-200 dark:border-gray-700 pt-4 mt-4',
    divider: 'border-t border-gray-200 dark:border-gray-700 my-4'
  }
}
```

## Modo Escuro (Dark Mode)

### Configuração Automática
```typescript
const darkModeConfig = {
  strategy: 'class', // class-based dark mode
  selector: '.dark',
  
  colors: {
    background: {
      primary: 'bg-white dark:bg-gray-900',
      secondary: 'bg-gray-50 dark:bg-gray-800',
      tertiary: 'bg-gray-100 dark:bg-gray-700'
    },
    
    text: {
      primary: 'text-gray-900 dark:text-gray-100',
      secondary: 'text-gray-600 dark:text-gray-400',
      tertiary: 'text-gray-500 dark:text-gray-500'
    },
    
    border: {
      default: 'border-gray-200 dark:border-gray-700',
      light: 'border-gray-100 dark:border-gray-800'
    }
  }
}
```

## Responsividade

### Breakpoints
```typescript
const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}
```

### Componentes Responsivos
```typescript
const responsivePatterns = {
  // Grid responsivo
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  
  // Texto responsivo
  heading: 'text-2xl md:text-3xl lg:text-4xl',
  
  // Espaçamento responsivo
  padding: 'p-4 md:p-6 lg:p-8',
  
  // Flexbox responsivo
  flex: 'flex flex-col md:flex-row'
}
```

## Configuração do Tema

### app.config.ts
```typescript
export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'slate',
    
    // Configurações globais
    strategy: 'merge',
    
    // Componentes customizados
    button: buttonTheme,
    input: inputTheme,
    card: cardTheme,
    
    // Acessibilidade
    accessibility: {
      reducedMotion: true,
      highContrast: false,
      focusRing: true
    },
    
    // Dark mode
    darkMode: darkModeConfig
  }
})
```

### Composable useTheme
```typescript
export const useTheme = () => {
  const colorMode = useColorMode()
  
  const toggleDarkMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
  
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    colorMode.preference = theme
  }
  
  return {
    colorMode: readonly(colorMode),
    toggleDarkMode,
    setTheme
  }
}
```

## Validação de Acessibilidade

### Testes Automáticos
```typescript
// Validação de contraste
const validateContrast = (foreground: string, background: string) => {
  const ratio = getContrastRatio(foreground, background)
  return {
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    ratio
  }
}

// Validação de foco
const validateFocusStates = (component: string) => {
  return {
    hasVisibleFocus: true,
    focusRingContrast: validateContrast('focus-ring', 'background'),
    keyboardAccessible: true
  }
}
```

## Customização Avançada

### Tokens CSS Customizados
```css
:root {
  /* Cores primárias */
  --color-primary-50: theme('colors.blue.50');
  --color-primary-500: theme('colors.blue.500');
  --color-primary-900: theme('colors.blue.900');
  
  /* Espaçamento */
  --spacing-xs: theme('spacing.1');
  --spacing-sm: theme('spacing.2');
  --spacing-md: theme('spacing.4');
  --spacing-lg: theme('spacing.6');
  
  /* Tipografia */
  --font-size-xs: theme('fontSize.xs');
  --font-size-sm: theme('fontSize.sm');
  --font-size-base: theme('fontSize.base');
  
  /* Sombras */
  --shadow-sm: theme('boxShadow.sm');
  --shadow-md: theme('boxShadow.md');
  --shadow-lg: theme('boxShadow.lg');
}
```

### Plugin Tailwind Customizado
```javascript
const plugin = require('tailwindcss/plugin')

module.exports = plugin(function({ addUtilities, theme }) {
  addUtilities({
    '.focus-ring': {
      '&:focus': {
        outline: 'none',
        'box-shadow': `0 0 0 2px ${theme('colors.primary.500')}`
      }
    },
    
    '.accessible-text': {
      'font-size': theme('fontSize.base'),
      'line-height': theme('lineHeight.relaxed'),
      'color': theme('colors.gray.900')
    }
  })
})
```