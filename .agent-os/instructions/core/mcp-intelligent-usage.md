---
description: Intelligent MCP Nuxt UI Usage for Enhanced Create-Spec
globs:
alwaysApply: false
version: 2.0
encoding: UTF-8
---

# MCP Intelligent Usage - Enhanced Create-Spec

**Data:** 21/09/2025 20:15:30 (America/Sao_Paulo)  
**Propósito:** Ensinar LLMs a usar MCP Nuxt UI com 95%+ precisão  
**Estratégia:** Uso inteligente vs duplicação de dados

## 🎯 FILOSOFIA PRINCIPAL

### Princípio Fundamental
**O MCP Nuxt UI é a FONTE ÚNICA DA VERDADE**. Em vez de duplicar informações, ensinamos a LLM a **consultar inteligentemente** o MCP para obter informações 100% precisas e atualizadas.

### Abordagem Inteligente
```typescript
// ❌ ERRADO: Assumir ou duplicar informações
<UButton color="blue" size="large"> // Props podem não existir

// ✅ CORRETO: Consultar MCP primeiro, depois implementar
const buttonInfo = await mcp_nuxt_ui_get_component({ componentName: "Button" })
// Usar apenas props reais documentadas
<UButton color="primary" size="lg">
```

## 🧠 ESTRATÉGIAS DE CONSULTA MCP

### 1. Descoberta Inteligente de Componentes

#### **Fluxo de Descoberta**
```typescript
// Passo 1: Analisar requisitos da spec
const specRequirements = analyzeSpecDescription(userDescription)

// Passo 2: Descobrir componentes por categoria
const formComponents = await mcp_nuxt_ui_search_components_by_category({
  category: "form"
})

const dataComponents = await mcp_nuxt_ui_search_components_by_category({
  category: "data"
})

const layoutComponents = await mcp_nuxt_ui_search_components_by_category({
  category: "layout"
})

// Passo 3: Filtrar por relevância
const relevantComponents = filterByRelevance(
  [...formComponents, ...dataComponents, ...layoutComponents],
  specRequirements
)
```

#### **Padrões de Busca Inteligente**
```typescript
// Para funcionalidades específicas
const searchPatterns = {
  // Formulários
  "formulário|form|input|campo": async () => {
    return await mcp_nuxt_ui_search_components_by_category({
      category: "form"
    })
  },
  
  // Tabelas e dados
  "tabela|lista|dados|table": async () => {
    return await mcp_nuxt_ui_search_components_by_category({
      category: "data"
    })
  },
  
  // Navegação
  "menu|navegação|botão|button": async () => {
    return await mcp_nuxt_ui_search_components_by_category({
      category: "navigation"
    })
  },
  
  // Feedback
  "alerta|notificação|toast|modal": async () => {
    return await mcp_nuxt_ui_search_components_by_category({
      category: "feedback"
    })
  }
}
```

### 2. Obtenção de Metadados Completos

#### **Workflow de Informações Detalhadas**
```typescript
async function getCompleteComponentInfo(componentName: string) {
  // 1. Informações básicas do componente
  const basicInfo = await mcp_nuxt_ui_get_component({
    componentName: componentName
  })
  
  // 2. Metadados técnicos (props, events, slots)
  const metadata = await mcp_nuxt_ui_get_component_metadata({
    componentName: componentName
  })
  
  // 3. Combinar informações para spec completa
  return {
    name: basicInfo.name,
    description: basicInfo.description,
    category: basicInfo.category,
    props: metadata.props,
    events: metadata.emits,
    slots: metadata.slots,
    examples: basicInfo.examples || [],
    accessibility: extractAccessibilityInfo(basicInfo, metadata),
    performance: extractPerformanceInfo(basicInfo, metadata)
  }
}
```

#### **Validação de Props e Events**
```typescript
async function validateComponentUsage(componentName: string, proposedProps: any) {
  const metadata = await mcp_nuxt_ui_get_component_metadata({
    componentName: componentName
  })
  
  // Validar se props existem
  const validProps = Object.keys(proposedProps).filter(prop => 
    metadata.props.some(p => p.name === prop)
  )
  
  // Alertar sobre props inválidas
  const invalidProps = Object.keys(proposedProps).filter(prop => 
    !metadata.props.some(p => p.name === prop)
  )
  
  if (invalidProps.length > 0) {
    console.warn(`Props inválidas para ${componentName}:`, invalidProps)
    console.log(`Props válidas:`, metadata.props.map(p => p.name))
  }
  
  return {
    validProps: validProps,
    invalidProps: invalidProps,
    availableProps: metadata.props,
    availableEvents: metadata.emits,
    availableSlots: metadata.slots
  }
}
```

### 3. Geração de Código Baseada em MCP

#### **Template Generator Inteligente**
```typescript
async function generateComponentTemplate(componentName: string, context: any) {
  // Obter informações reais do MCP
  const componentInfo = await getCompleteComponentInfo(componentName)
  
  // Gerar template baseado em informações reais
  const template = `
<template>
  <${componentInfo.name}
    ${generatePropsFromMetadata(componentInfo.props, context)}
    ${generateEventsFromMetadata(componentInfo.events, context)}
    ${generateAccessibilityAttributes(componentInfo.accessibility)}
  >
    ${generateSlotsFromMetadata(componentInfo.slots, context)}
  </${componentInfo.name}>
</template>

<script setup lang="ts">
${generateScriptFromMetadata(componentInfo, context)}
</script>
  `.trim()
  
  return template
}

function generatePropsFromMetadata(props: any[], context: any) {
  return props
    .filter(prop => isRelevantForContext(prop, context))
    .map(prop => {
      const value = inferValueFromContext(prop, context)
      return `${prop.name}="${value}"`
    })
    .join('\n    ')
}
```

## 📚 PADRÕES DE ENSINO PARA LLMs

### 1. Workflow Obrigatório

#### **Antes de Qualquer Implementação**
```markdown
SEMPRE seguir este fluxo:

1. **DESCOBRIR** componentes relevantes
   ```typescript
   const components = await mcp_nuxt_ui_search_components_by_category({
     category: "form" // ou categoria relevante
   })
   ```

2. **OBTER** informações detalhadas
   ```typescript
   const info = await mcp_nuxt_ui_get_component({
     componentName: "Button" // componente específico
   })
   ```

3. **VALIDAR** props e events
   ```typescript
   const metadata = await mcp_nuxt_ui_get_component_metadata({
     componentName: "Button"
   })
   ```

4. **IMPLEMENTAR** baseado em dados reais
   ```vue
   <!-- Usar apenas props/events validados -->
   <UButton :color="validatedColor" @click="validatedEvent">
   ```
```

### 2. Padrões de Consulta por Contexto

#### **Para Formulários**
```typescript
// Template de descoberta para formulários
async function discoverFormComponents(formRequirements: string[]) {
  // 1. Listar todos os componentes de form
  const formComponents = await mcp_nuxt_ui_search_components_by_category({
    category: "form"
  })
  
  // 2. Para cada componente, obter detalhes
  const detailedComponents = await Promise.all(
    formComponents.map(async (comp) => {
      const details = await mcp_nuxt_ui_get_component({
        componentName: comp.name
      })
      const metadata = await mcp_nuxt_ui_get_component_metadata({
        componentName: comp.name
      })
      return { ...details, ...metadata }
    })
  )
  
  // 3. Filtrar por requisitos específicos
  return detailedComponents.filter(comp => 
    matchesFormRequirements(comp, formRequirements)
  )
}
```

#### **Para Tabelas e Dados**
```typescript
// Template de descoberta para dados
async function discoverDataComponents(dataRequirements: string[]) {
  const dataComponents = await mcp_nuxt_ui_search_components_by_category({
    category: "data"
  })
  
  // Foco especial em UTable
  const tableInfo = await mcp_nuxt_ui_get_component({
    componentName: "Table"
  })
  
  const tableMetadata = await mcp_nuxt_ui_get_component_metadata({
    componentName: "Table"
  })
  
  return {
    availableComponents: dataComponents,
    recommendedComponent: {
      name: "UTable",
      info: tableInfo,
      metadata: tableMetadata,
      usage: generateTableUsageExample(tableMetadata)
    }
  }
}
```

### 3. Geração de Acessibilidade Automática

#### **Extração de Informações A11y do MCP**
```typescript
function extractAccessibilityInfo(componentInfo: any, metadata: any) {
  return {
    // Extrair informações de ARIA dos metadados
    ariaSupport: metadata.props.filter(prop => 
      prop.name.startsWith('aria') || prop.name.includes('aria')
    ),
    
    // Identificar suporte a teclado
    keyboardSupport: componentInfo.description?.includes('keyboard') ||
                    metadata.emits.some(event => 
                      ['keydown', 'keyup', 'keypress'].includes(event.name)
                    ),
    
    // Verificar roles semânticos
    semanticRoles: extractSemanticRoles(componentInfo.description),
    
    // Gerar implementação WCAG
    wcagImplementation: generateWCAGImplementation(componentInfo, metadata)
  }
}

function generateWCAGImplementation(componentInfo: any, metadata: any) {
  const wcagAttributes = []
  
  // Adicionar aria-label se necessário
  if (isInteractiveComponent(componentInfo)) {
    wcagAttributes.push('aria-label="Descrição acessível"')
  }
  
  // Adicionar role se necessário
  if (needsExplicitRole(componentInfo)) {
    wcagAttributes.push(`role="${inferRole(componentInfo)}"`)
  }
  
  // Adicionar suporte a teclado
  if (needsKeyboardSupport(componentInfo)) {
    wcagAttributes.push('tabindex="0"')
  }
  
  return wcagAttributes
}
```

## 🎯 IMPLEMENTAÇÃO NO ENHANCED CREATE-SPEC

### Integração no Workflow

#### **Step 3 Modificado: Intelligent Component Discovery via MCP**
```markdown
<step number="3" name="mcp_intelligent_discovery">

### Step 3: MCP Intelligent Component Discovery

Use MCP Nuxt UI integration to discover optimal components with 100% accuracy.

<mcp_discovery_workflow>
  # 1. Análise semântica da spec
  spec_keywords = extract_keywords(spec_description)
  spec_intent = analyze_intent(spec_description)
  
  # 2. Descoberta inteligente por categoria
  FOR EACH category IN ["form", "data", "navigation", "feedback", "layout"]:
    IF category_relevant_to_spec(category, spec_keywords):
      components = await mcp_nuxt_ui_search_components_by_category({
        category: category
      })
      
      # 3. Obter detalhes completos
      FOR EACH component IN components:
        IF component_matches_intent(component, spec_intent):
          details = await mcp_nuxt_ui_get_component({
            componentName: component.name
          })
          
          metadata = await mcp_nuxt_ui_get_component_metadata({
            componentName: component.name
          })
          
          # 4. Armazenar informações completas e REAIS
          store_validated_component(details, metadata)
</mcp_discovery_workflow>
```

#### **Geração de Specs com Precisão 100%**
```typescript
// Função para gerar specs baseadas em MCP
async function generatePreciseSpecs(discoveredComponents: any[]) {
  const specs = []
  
  for (const component of discoveredComponents) {
    // Obter informações REAIS do MCP
    const realInfo = await mcp_nuxt_ui_get_component({
      componentName: component.name
    })
    
    const realMetadata = await mcp_nuxt_ui_get_component_metadata({
      componentName: component.name
    })
    
    // Gerar spec baseada em dados REAIS
    const spec = {
      name: realInfo.name,
      description: realInfo.description,
      
      // Props REAIS (não assumidas)
      props: realMetadata.props.map(prop => ({
        name: prop.name,
        type: prop.type,
        required: prop.required,
        default: prop.default,
        description: prop.description
      })),
      
      // Events REAIS (não assumidos)
      events: realMetadata.emits.map(event => ({
        name: event.name,
        payload: event.payload,
        description: event.description
      })),
      
      // Slots REAIS (não assumidos)
      slots: realMetadata.slots.map(slot => ({
        name: slot.name,
        props: slot.props,
        description: slot.description
      })),
      
      // Exemplos de uso REAIS
      examples: realInfo.examples || generateExamplesFromMetadata(realMetadata),
      
      // Acessibilidade baseada em informações REAIS
      accessibility: extractRealAccessibilityInfo(realInfo, realMetadata)
    }
    
    specs.push(spec)
  }
  
  return specs
}
```

## 📈 RESULTADOS ESPERADOS

### Precisão Garantida
- **Props**: 100% corretas (vindas do MCP)
- **Events**: 100% corretos (vindos do MCP)
- **Slots**: 100% corretos (vindos do MCP)
- **Exemplos**: Baseados em documentação real
- **Acessibilidade**: Extraída de informações oficiais

### Benefícios da Abordagem
1. **Sempre Atualizado**: MCP reflete versão atual do Nuxt UI
2. **Zero Alucinação**: Informações vêm da fonte oficial
3. **Manutenção Zero**: Não precisamos atualizar dados duplicados
4. **Escalabilidade**: Funciona com qualquer componente atual/futuro
5. **Precisão 100%**: Props e events sempre corretos

---

**Estratégia MCP Inteligente** - Ensinando LLMs a pescar em vez de dar peixes duplicados! 🎣
