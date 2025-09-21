# Referência Global Agent OS - Nuxt Patterns

**Data:** 21/09/2025 21:10:32 (America/Sao_Paulo)  
**Estrutura:** Hybrid Local + Global Agent OS  
**Compatibilidade:** 100% mantida com projeto existente

## Estrutura de Referência

### Padrões Globais (Reutilizáveis)
- **Localização**: `~/.agent-os/standards/`
- **Escopo**: Padrões aplicáveis a todos os projetos Nuxt
- **Conteúdo**: 
  - `best-practices.md` - Melhores práticas gerais
  - `code-style.md` - Estilo de código padrão
  - `tech-stack.md` - Stack tecnológico base

### Padrões Específicos do Projeto (Locais)
- **Localização**: `.agent-os/standards/`
- **Escopo**: Específico para Agent Nuxt
- **Conteúdo**:
  - `nuxt-ui-v4-patterns.md` - Padrões específicos Nuxt UI v4
  - `accessibility-wcag.md` - Padrões de acessibilidade
  - `development-guidelines.md` - Diretrizes específicas

## Estratégia Híbrida

Esta implementação mantém uma **estratégia híbrida** que:

1. **Aproveita estrutura global** para padrões reutilizáveis
2. **Mantém arquivos locais** para especializações Nuxt
3. **Preserva compatibilidade** com implementação atual
4. **Permite expansão futura** para outros projetos Nuxt

## Benefícios

- ✅ **100% Compatível** com Agent OS oficial
- ✅ **Zero Breaking Changes** no projeto atual
- ✅ **Reutilização** de padrões entre projetos
- ✅ **Especialização** mantida para Nuxt UI v4

---

**Nota:** Esta abordagem híbrida é recomendada para projetos que já possuem especializações significativas, permitindo migração gradual para estrutura totalmente global conforme necessário.
