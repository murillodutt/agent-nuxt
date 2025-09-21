# AGENT OS - NUXT 4.x DEVELOPMENT RULES

**Versão:** 2.1.0  
**Atualizado:** 21/09/2025  
**Especialização:** Agent OS + Nuxt 4.x + Nuxt UI v4

---

## 1. VISÃO GERAL
O Agent Nuxt é um sistema de conhecimento e contextos estruturados baseado na arquitetura Agent OS, projetado para auxiliar LLMs no desenvolvimento de qualquer tipo de projeto utilizando o framework Nuxt.js. Não é uma implementação Nuxt, mas sim uma base de conhecimento especializada.

### 1.1 Propósito
Plataforma Agent OS especializada em dev Nuxt 4.x com arquitetura de três camadas, pipeline de cinco fases e workflows spec-driven baseados em contexto.

### 1.2 Arquitetura Core
**Três Camadas de Contexto:**
- **Standards**: Padrões, convenções e diretrizes técnicas
- **Product**: Requisitos, regras de negócio e especificações funcionais  
- **Specs**: Implementações técnicas detalhadas e contratos de API

**Pipeline de Cinco Fases:**
1. **Spec**: Criação de especificações técnicas
2. **Plan**: Planejamento e breakdown de tarefas
3. **Code**: Implementação com TypeScript strict
4. **Test**: Validação automatizada multi-camada
5. **Deploy**: Entrega com monitoramento contínuo

---

## 2. POLÍTICAS OBRIGATÓRIAS

### 2.1 Estrutura de Arquivos
```
project/
├── .agent-os/
│   ├── standards/     # Padrões e convenções
│   ├── product/       # Requisitos e regras
│   └── specs/         # Implementações técnicas
├── .trae/rules/       # Regras específicas do projeto
├── components/        # Componentes Vue/Nuxt
├── pages/            # Páginas da aplicação
├── composables/      # Composables reutilizáveis
├── utils/            # Utilitários
├── types/            # Definições TypeScript
└── tests/            # Testes automatizados
```

### 2.2 Processo de Instalação
**Agent OS v1.4.0** - Duas modalidades:

**Base (Estrutura):**
```bash
# Claude Code
@agent-os base

# Cursor
@agent-os/base
```

**Projeto (Completo):**
```bash  
# Claude Code
@agent-os project

# Cursor  
@agent-os/project
```

**Config via `config.yml`:**
```yaml
agent_os:
  version: "1.4.2"
  project_type: "nuxt"
  ui_framework: "nuxt-ui-v4"
  typescript: true
  testing: "vitest"
```

### 2.3 Política de Comunicação Profissional
**EMOJIS SÃO PROIBIDOS** em todo código, documentação, scripts e outputs do Agent OS.

**Caracteres Unicode Aprovados:**
```
[SUCCESS] ✓ (U+2713 CHECK MARK)
[ERROR]   ✗ (U+2717 BALLOT X)  
[WARNING] ⚠ (U+26A0 WARNING SIGN)
[INFO]    ℹ (U+2139 INFORMATION SOURCE)
[PENDING] ○ (U+25CB WHITE CIRCLE)
[DONE]    ● (U+25CF BLACK CIRCLE)
[LOADING] ⋯ (U+22EF MIDLINE HORIZONTAL ELLIPSIS)
[ARROW]   → (U+2192 RIGHTWARDS ARROW)
```

**Razões da Política:**
- Compatibilidade cross-platform
- Padrões profissionais enterprise
- Prevenção de problemas técnicos
- Acessibilidade para leitores de tela

### 2.4 Sistema de Timestamp Obrigatório
**TIMESTAMP AUTOMÁTICO** deve ser carregado ANTES de qualquer execução de contexto, log, commit ou registro.

**Formato Padrão Obrigatório:**
```typescript
const timestamp = new Date().toLocaleString('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
})
// Resultado: "21/09/2025 14:30:45"
```

**Aplicação Obrigatória:**
- **Logs de Sistema**: `[${timestamp}] [LEVEL] [CONTEXT] message`
- **Commits Git**: Incluir timestamp em mensagens de commit
- **Documentação**: Timestamp em atualizações e criações
- **APIs**: Timestamp em responses e logs de requisição
- **Testes**: Logs de execução com timestamp
- **Scripts**: Outputs de build/deploy com timestamp

**Função Utilitária Padrão:**
```typescript
// utils/timestamp.ts
export const getTimestamp = (): string => {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
```

**Integração com Agent OS:**
- Carregamento automático em todos os workflows
- Timestamp em logs de subagentes
- Rastreabilidade completa de operações
- Auditoria temporal de contextos

### 2.5 Workflows Spec-Driven
Sistema baseado em contexto inteligente com carregamento condicional e otimização de performance.

**Estrutura de Workflow:**
```yaml
workflow:
  trigger: "context_change"
  phases:
    - spec_creation
    - task_planning  
    - implementation
    - validation
    - deployment
```

---

## 3. ESPECIALIZAÇÃO NUXT 4.x

### 3.1 Integração Ecossistema
- **Nuxt 4.x**: Framework base com SSR/SSG
- **Nuxt UI v4**: Sistema de componentes
- **TypeScript**: Tipagem strict obrigatória
- **Vitest**: Framework de testes
- **Playwright**: Testes E2E

### 3.2 Arquitetura Subagentes
Sistema de subagentes especializados para diferentes aspectos do dev:

```typescript
interface SubAgentSystem {
  component: 'Criação e manutenção de componentes'
  page: 'Desenvolvimento de páginas'
  api: 'Endpoints e integrações'
  test: 'Testes automatizados'
  deploy: 'Deploy e monitoramento'
}
```

### 3.3 Sistema de Contexto Inteligente
Carregamento condicional baseado na tarefa atual com otimização de performance.

**Estratégias de Otimização:**
- Compressão semântica de contexto
- Remoção de duplicatas
- Priorização por relevância
- Cache inteligente de contexto

---

## 4. SISTEMA DE QUALIDADE

### 4.1 Validação Multi-Camada
**Métricas Core:**
- Cobertura testes > 90%
- Complexidade < 10
- Bundle size < 250KB
- Lighthouse > 90
- WCAG 2.1 AA compliance

### 4.2 Checklist Desenvolvimento
```markdown
## Pré-Dev
- [ ] Spec completa e validada
- [ ] Contexto LLM otimizado
- [ ] Templates selecionados

## Durante Dev  
- [ ] TypeScript strict ativo
- [ ] Testes implementados
- [ ] Performance monitorada

## Pós-Dev
- [ ] Todos testes passando
- [ ] Build sem erros
- [ ] Docs atualizadas
```

### 4.3 Sistema de Logs com Timestamp
**Formato Obrigatório:**
```typescript
const logEntry = `[${timestamp}] [AGENT-OS] [${level}] [${context}] ${message}`

// Contextos: WORKFLOW, SPEC, CONTEXT, TEMPLATE, VALIDATION
// Levels: INFO, SUCCESS, ERROR, WARNING, PENDING
// Timestamp: Formato pt-BR (America/Sao_Paulo)
```

**Implementação em Workflows:**
```typescript
// Exemplo de log em workflow
const timestamp = getTimestamp()
console.log(`[${timestamp}] [AGENT-OS] [INFO] [WORKFLOW] Iniciando spec_creation`)
console.log(`[${timestamp}] [AGENT-OS] [SUCCESS] [SPEC] Especificação criada com sucesso`)
```

**Rastreabilidade Temporal:**
- Todos os logs devem incluir timestamp
- Sequência temporal de operações
- Auditoria completa de workflows
- Debugging facilitado por timeline

---

## 5. TEMPLATES E AUTOMAÇÃO

### 5.1 Templates Adaptativos
Sistema inteligente que adapta templates baseado no contexto da tarefa.

**Templates Core:**
```yaml
nuxt_component:
  basic: ["component.vue", "test.ts", "stories.ts"]
  advanced: ["component.vue", "composable.ts", "types.ts", "test.ts"]

nuxt_page:
  static: ["page.vue", "test.ts"] 
  dynamic: ["[slug].vue", "middleware.ts", "api.ts", "test.ts"]
```

### 5.2 Workflows Inteligentes
```yaml
intelligent_workflows:
  development:
    trigger: "code_change"
    steps: ["context_analysis", "dependency_check", "test_selection", "quality_validation"]
  
  deployment:
    trigger: "merge_to_main"  
    steps: ["security_scan", "performance_audit", "accessibility_check", "bundle_analysis"]
```

### 5.3 Scaffolding Baseado em Contexto
**Operação via Arquivos de Contexto** - Não há comandos CLI diretos.

**Plataformas Suportadas:**
- Cursor AI (integração nativa)
- Claude Code (execução na IDE)
- VS Code (com extensões)

**Método de Operação:**
```typescript
interface ContextDrivenScaffolding {
  operationMode: 'context-files-only'
  scaffoldingMethod: {
    contextLoading: 'Carregamento automático .agent-os/'
    templateGeneration: 'Geração baseada em templates'
    workflowExecution: 'Workflows spec-driven'
    agentCoordination: 'Subagentes especializados'
  }
}
```

---

## 6. INTEGRAÇÃO COM IDES

### 6.1 Estruturas Específicas
```typescript
interface IDEIntegration {
  cursor: {
    configPath: '.cursor/rules/'
    agentPath: '.cursor/agents/'
    contextFiles: ['.cursor/context.md', '.cursor/instructions.md']
  }
  
  claude: {
    configPath: '.claude/config/'
    contextPath: '.claude/context/'
    rulesFile: '.claude/rules.md'
  }
  
  vscode: {
    configPath: '.vscode/settings.json'
    extensionsPath: '.vscode/extensions.json'
    tasksPath: '.vscode/tasks.json'
  }
}
```

### 6.2 Configuração Multi-IDE
Sistema que suporta múltiplas IDEs simultaneamente com configurações sincronizadas.

---

## 7. CONCLUSÃO

Esta plataforma Agent OS representa uma solução especializada para desenvolvimento Nuxt 4.x, integrando:

**Recursos Core:**
- Arquitetura de três camadas (Standards, Product, Specs)
- Pipeline de desenvolvimento de cinco fases
- Workflows spec-driven baseados em contexto
- Ecossistema de subagentes especializados
- Sistema de contexto inteligente otimizado para IDEs

**Otimização Específica:**
- Ecossistema Nuxt 4.x completo
- Integração nativa Nuxt UI v4
- TypeScript strict por padrão
- Testes automatizados multi-camada
- Deploy com monitoramento contínuo

**Referências:**
- [Agent OS Official](https://buildermethods.com/agent-os)
- [GitHub Repository](https://github.com/buildermethods/agent-os)
- [Nuxt 4.x Documentation](https://nuxt.com)
- [Nuxt UI v4 Guide](https://ui.nuxt.com)

---
**Última atualização:** 21/09/2025