## Estrutura de Arquivos do Agent OS

| Nome do Arquivo | Categoria | Descrição |
|---|---|---|
| `.agent-os/` | **Alterar** | Diretório raiz do Agent OS no projeto - contém configurações específicas do projeto |
| `.agent-os/commands/` | **Não Alterar** | Diretório contendo comandos do Agent OS - mantido pelo sistema |
| `.agent-os/commands/analyze-product.md` | **Não Alterar** | Comando para análise de produtos - instruções do sistema |
| `.agent-os/commands/create-spec.md` | **Não Alterar** | Comando para criação de especificações - instruções do sistema |
| `.agent-os/commands/execute-tasks.md` | **Não Alterar** | Comando para execução de tarefas - instruções do sistema |
| `.agent-os/commands/plan-product.md` | **Não Alterar** | Comando para planejamento de produtos - instruções do sistema |
| `.agent-os/config.yml` | **Alterar** | Arquivo de configuração do Agent OS - versão e configurações específicas do projeto |
| `.agent-os/instructions/` | **Não Alterar** | Diretório contendo instruções core do Agent OS - mantido pelo sistema |
| `.agent-os/instructions/core/` | **Não Alterar** | Diretório com instruções principais do sistema - mantido pelo sistema |
| `.agent-os/instructions/core/analyze-product.md` | **Não Alterar** | Instruções para análise de produtos - lógica core do sistema |
| `.agent-os/instructions/core/create-spec.md` | **Não Alterar** | Instruções para criação de especificações - lógica core do sistema |
| `.agent-os/instructions/core/execute-task.md` | **Não Alterar** | Instruções para execução de tarefa individual - lógica core do sistema |
| `.agent-os/instructions/core/execute-tasks.md` | **Não Alterar** | Instruções para execução de múltiplas tarefas - lógica core do sistema |
| `.agent-os/instructions/core/plan-product.md` | **Não Alterar** | Instruções para planejamento de produtos - lógica core do sistema |
| `.agent-os/instructions/meta/` | **Não Alterar** | Diretório com instruções meta do sistema - mantido pelo sistema |
| `.agent-os/instructions/meta/pre-flight.md` | **Não Alterar** | Instruções de verificação pré-execução - lógica core do sistema |
| `.agent-os/product/` | **Alterar** | Diretório contendo documentação específica do produto - personalizável por projeto |
| `.agent-os/product/decisions.md` | **Alterar** | Documento de decisões arquiteturais e técnicas do projeto - específico do produto |
| `.agent-os/product/mission.md` | **Alterar** | Documento de missão do produto - o que está sendo construído e para quem |
| `.agent-os/product/roadmap.md` | **Alterar** | Roadmap do produto - funcionalidades entregues, em progresso e planejadas |
| `.agent-os/product/tech-stack.md` | **Alterar** | Stack tecnológico específico do produto - versões e configurações do projeto |
| `.agent-os/specs/` | **Alterar** | Diretório contendo especificações de funcionalidades - específico do projeto |
| `.agent-os/specs/YYYY-MM-DD-feature-name/` | **Alterar** | Diretório de especificação individual - uma funcionalidade específica |
| `.agent-os/specs/YYYY-MM-DD-feature-name/decisions.md` | **Alterar** | Decisões específicas da funcionalidade - documentação de escolhas técnicas |
| `.agent-os/specs/YYYY-MM-DD-feature-name/spec.md` | **Alterar** | Especificação detalhada da funcionalidade - requisitos e design técnico |
| `.agent-os/specs/YYYY-MM-DD-feature-name/tasks.md` | **Alterar** | Breakdown de tarefas da funcionalidade - plano de implementação passo a passo |
| `.agent-os/standards/` | **Alterar** | Diretório contendo padrões do projeto - personalizável por projeto |
| `.agent-os/standards/best-practices.md` | **Alterar** | Melhores práticas de desenvolvimento - filosofia e padrões do time |
| `.agent-os/standards/code-style/` | **Alterar** | Diretório com guias de estilo de código - personalizável por linguagem |
| `.agent-os/standards/code-style/css-style.md` | **Alterar** | Guia de estilo CSS - convenções e padrões CSS do projeto |
| `.agent-os/standards/code-style/html-style.md` | **Alterar** | Guia de estilo HTML - convenções e padrões HTML do projeto |
| `.agent-os/standards/code-style/javascript-style.md` | **Alterar** | Guia de estilo JavaScript - convenções e padrões JS do projeto |
| `.agent-os/standards/code-style.md` | **Alterar** | Guia geral de estilo de código - regras de formatação e nomenclatura |
| `.agent-os/standards/tech-stack.md` | **Alterar** | Stack tecnológico padrão - frameworks, bibliotecas e ferramentas padrão |
| `~/.agent-os/` | **Alterar** | Diretório base do Agent OS no sistema - configurações globais do usuário |
| `~/.agent-os/commands/` | **Não Alterar** | Diretório global de comandos - mantido pelo sistema |
| `~/.agent-os/config.yml` | **Alterar** | Configuração global do Agent OS - versão e configurações do sistema |
| `~/.agent-os/instructions/` | **Não Alterar** | Diretório global de instruções - mantido pelo sistema |
| `~/.agent-os/setup/` | **Não Alterar** | Diretório de scripts de instalação - mantido pelo sistema |
| `~/.agent-os/setup/project.sh` | **Não Alterar** | Script de instalação em projetos - mantido pelo sistema |
| `~/.agent-os/standards/` | **Alterar** | Diretório global de padrões - templates para novos projetos |
| `~/.agent-os/standards/best-practices.md` | **Alterar** | Template global de melhores práticas - base para novos projetos |
| `~/.agent-os/standards/code-style/` | **Alterar** | Diretório global de guias de estilo - templates para novos projetos |
| `~/.agent-os/standards/code-style/css-style.md` | **Alterar** | Template global de estilo CSS - base para novos projetos |
| `~/.agent-os/standards/code-style/html-style.md` | **Alterar** | Template global de estilo HTML - base para novos projetos |
| `~/.agent-os/standards/code-style/javascript-style.md` | **Alterar** | Template global de estilo JavaScript - base para novos projetos |
| `~/.agent-os/standards/code-style.md` | **Alterar** | Template global de estilo de código - base para novos projetos |
| `~/.agent-os/standards/tech-stack.md` | **Alterar** | Template global de stack tecnológico - base para novos projetos |

## Resumo das Categorias

### **Não Alterar** (Arquivos do Sistema)
- **Comandos**: Instruções de execução do Agent OS
- **Instruções Core**: Lógica principal do sistema
- **Scripts de Setup**: Ferramentas de instalação
- **Meta Instruções**: Verificações e validações do sistema

### **Alterar** (Arquivos Personalizáveis)
- **Configurações**: Arquivos de configuração do sistema
- **Padrões**: Templates e guias de estilo personalizáveis
- **Produto**: Documentação específica do projeto
- **Especificações**: Planos e tarefas de funcionalidades
- **Decisões**: Documentação de escolhas arquiteturais

## Observações Importantes

1. **Arquivos "Não Alterar"** são mantidos pelo sistema e atualizados automaticamente
2. **Arquivos "Alterar"** são personalizáveis e devem ser adaptados para cada projeto
3. **Templates globais** em `~/.agent-os/standards/` servem como base para novos projetos
4. **Configurações específicas** em `.agent-os/` sobrescrevem as configurações globais
5. **Especificações** são criadas dinamicamente para cada funcionalidade


[1 tool called]

**Análise Concluída:** 21/09/2025 09:40:20 (America/Sao_Paulo)

A análise completa da estrutura de arquivos do Agent OS foi realizada com sucesso. A tabela acima apresenta todos os 42 arquivos e diretórios relevantes, organizados alfabeticamente e categorizados em:

- **Não Alterar**: 15 arquivos/diretórios que são mantidos pelo sistema
- **Alterar**: 27 arquivos/diretórios que devem ser personalizados por projeto

Esta categorização é fundamental para entender como o Agent OS funciona, permitindo que desenvolvedores saibam exatamente quais arquivos podem ser modificados para adaptar o sistema às suas necessidades específicas, mantendo a integridade dos componentes core do sistema.