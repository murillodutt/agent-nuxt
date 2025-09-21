# Padrões de Uso MCP - Agent Nuxt

**Data:** 21/09/2025 22:22:10 (America/Sao_Paulo)  
**Sistema:** Agent Nuxt Standards  
**Integração:** MCP Nuxt UI v4  
**Propósito:** Padronização do uso do MCP para LLMs

## Diretrizes Obrigatórias para LLMs

### 1. Princípio da Fonte Única da Verdade

**SEMPRE use MCP como fonte primária para informações sobre componentes Nuxt UI v4.**

#### ❌ Não Fazer:
```typescript
// Não assumir props ou comportamentos
<UButton color="blue" size="large"> // Props podem não existir
```

#### ✅ Fazer:
```typescript
// Sempre verificar via MCP primeiro
const buttonDocs = await mcp_nuxt-ui_get_component({ componentName: "Button" })
// Usar apenas props documentadas oficialmente
<UButton color="primary" size="lg">
```

### 2. Fluxo Obrigatório de Verificação

#### Para Qualquer Implementação de Componente:
1. **Verificar existência** via `mcp_nuxt-ui_list_components()`
2. **Obter documentação** via `mcp_nuxt-ui_get_component()`
3. **Verificar metadados** via `mcp_nuxt-ui_get_component_metadata()` se necessário
4. **Implementar baseado** nas informações oficiais

#### Exemplo de Implementação Correta:
```typescript
// Passo 1: Verificar se componente existe
const allComponents = await mcp_nuxt-ui_list_components()
const hasButton = allComponents.some(c => c.name === 'Button')

if (hasButton) {
  // Passo 2: Obter documentação oficial
  const buttonInfo = await mcp_nuxt-ui_get_component({ 
    componentName: "Button" 
  })
  
  // Passo 3: Usar informações reais para implementação
  // Props válidas: color, variant, size, loading, disabled, etc.
  // (baseadas na documentação obtida)
}
```

### 3. Padrões de Busca Inteligente

#### Busca por Categoria:
```typescript
// Para formulários
const formComponents = await mcp_nuxt-ui_search_components_by_category({
  category: "form"
})

// Para dados/tabelas
const dataComponents = await mcp_nuxt-ui_search_components_by_category({
  category: "data"
})

// Para layout
const layoutComponents = await mcp_nuxt-ui_search_components_by_category({
  category: "layout"
})
```

#### Busca por Termo:
```typescript
// Busca específica
const inputComponents = await mcp_nuxt-ui_search_components_by_category({
  search: "input"
})
```

### 4. Tratamento de Informações MCP

#### Estrutura de Resposta Padrão:
```typescript
interface ComponentInfo {
  name: string
  title: string
  description: string
  category: string
  documentation: string        // Markdown completo
  documentation_url: string   // URL oficial
}
```

#### Como Processar:
```typescript
const componentInfo = await mcp_nuxt-ui_get_component({ 
  componentName: "Button" 
})

// Extrair informações essenciais:
const props = extractPropsFromDocs(componentInfo.documentation)
const examples = extractExamplesFromDocs(componentInfo.documentation)
const apiInfo = extractAPIFromDocs(componentInfo.documentation)
```

### 5. Padrões de Cache e Performance

#### Cache Inteligente:
```typescript
// Cache de informações frequentemente usadas
const componentCache = new Map()

async function getCachedComponentInfo(componentName: string) {
  if (!componentCache.has(componentName)) {
    const info = await mcp_nuxt-ui_get_component({ componentName })
    componentCache.set(componentName, info)
  }
  return componentCache.get(componentName)
}
```

#### Batch Loading:
```typescript
// Para múltiplos componentes
const componentNames = ["Button", "Input", "Form"]
const componentInfos = await Promise.all(
  componentNames.map(name => 
    mcp_nuxt-ui_get_component({ componentName: name })
  )
)
```

### 6. Validação de Implementações

#### Checklist Obrigatório:
- [ ] ✅ Componente verificado via MCP
- [ ] ✅ Props baseadas na documentação oficial
- [ ] ✅ Eventos baseados na documentação oficial
- [ ] ✅ Slots baseados na documentação oficial
- [ ] ✅ Exemplos seguem padrões oficiais

#### Validação de Props:
```typescript
// Validar se props existem na documentação
const validateProps = (componentName: string, props: object) => {
  const componentMeta = await mcp_nuxt-ui_get_component_metadata({ 
    componentName 
  })
  
  // Verificar se todas as props são válidas
  Object.keys(props).forEach(prop => {
    if (!componentMeta.props.includes(prop)) {
      throw new Error(`Prop '${prop}' não existe em ${componentName}`)
    }
  })
}
```

### 7. Padrões de Resposta para Usuários

#### Template de Resposta:
```markdown
## Implementação de [ComponentName]

**Fonte:** Documentação oficial Nuxt UI v4 (via MCP)  
**Última verificação:** [timestamp]

### Informações do Componente:
- **Categoria:** [categoria obtida do MCP]
- **Descrição:** [description obtida do MCP]
- **Documentação oficial:** [documentation_url]

### Implementação:
[código baseado na documentação MCP]

### Props Disponíveis:
[lista extraída da documentação MCP]

### Exemplos Oficiais:
[exemplos extraídos da documentação MCP]
```

### 8. Tratamento de Erros MCP

#### Erro de Componente Inexistente:
```typescript
try {
  const componentInfo = await mcp_nuxt-ui_get_component({ 
    componentName: "NonExistentComponent" 
  })
} catch (error) {
  // Sugerir componentes similares
  const allComponents = await mcp_nuxt-ui_list_components()
  const suggestions = findSimilarComponents("NonExistentComponent", allComponents)
  
  return `Componente não encontrado. Você quis dizer: ${suggestions.join(', ')}?`
}
```

#### Timeout ou Falha de Rede:
```typescript
const getComponentWithRetry = async (componentName: string, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await mcp_nuxt-ui_get_component({ componentName })
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

### 9. Integração com Agent OS

#### Comandos Agent OS para MCP:
```bash
# Buscar componente
@nuxt-ui [ComponentName]

# Listar por categoria
@nuxt-ui-category [CategoryName]

# Buscar por termo
@nuxt-ui-search [SearchTerm]

# Comparar componentes
@nuxt-ui-compare [Component1] [Component2]
```

#### Estrutura de Arquivos:
```
.agent-os/
├── standards/
│   └── mcp-usage-standards.md (este arquivo)
├── specs/examples/
│   ├── mcp-integration-guide.md
│   └── component-patterns.md
└── commands/
    └── mcp-nuxt-ui-commands.md
```

### 10. Métricas e Monitoramento

#### Métricas de Qualidade:
- **Precisão**: 100% das implementações baseadas em MCP
- **Atualização**: Informações sempre da versão atual
- **Completude**: Todos os componentes cobertos via MCP
- **Performance**: < 500ms para obter informações do componente

#### Monitoramento de Uso:
```typescript
// Log de uso para otimização
const logMCPUsage = (action: string, componentName?: string) => {
  console.log(`[MCP] ${action} ${componentName || ''} - ${new Date().toISOString()}`)
}
```

## Comandos Rápidos para LLMs

### Comandos Essenciais:
```typescript
// Lista todos os componentes
mcp_nuxt-ui_list_components()

// Informações de um componente
mcp_nuxt-ui_get_component({ componentName: "Button" })

// Metadados técnicos
mcp_nuxt-ui_get_component_metadata({ componentName: "Button" })

// Busca por categoria
mcp_nuxt-ui_search_components_by_category({ category: "form" })

// Templates disponíveis
mcp_nuxt-ui_list_templates()

// Exemplos disponíveis
mcp_nuxt-ui_list_examples()
```

### Comandos de Suporte:
```typescript
// Documentação específica
mcp_nuxt-ui_get_documentation_page({ path: "/docs/components/button" })

// Guias de migração
mcp_nuxt-ui_get_migration_guide({ version: "v4" })

// Composables
mcp_nuxt-ui_list_composables()
```

## Conclusão

Estes padrões garantem que todas as implementações sejam:
- **Precisas**: Baseadas na documentação oficial
- **Atualizadas**: Sempre sincronizadas com a versão mais recente
- **Confiáveis**: Fonte única da verdade
- **Eficientes**: Acesso otimizado às informações

**Regra de Ouro:** Nunca implemente um componente Nuxt UI sem primeiro consultar o MCP. Esta é a única fonte confiável de informações no Agent Nuxt system.

---

**Aplicação Obrigatória:** Todos os LLMs que trabalham com Agent Nuxt devem seguir estes padrões sem exceção.
