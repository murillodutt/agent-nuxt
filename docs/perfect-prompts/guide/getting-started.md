# Primeiros Passos em Prompt Engineering

**Guia Prático de Implementação** | **Versão 1.0** | **Dutt eCommerce Website Design**

---

## 🎯 Objetivos de Aprendizagem

Ao final deste guia, você será capaz de:
- Criar prompts estruturados e eficazes
- Entender os princípios fundamentais de design de instrução
- Implementar técnicas básicas de otimização
- Mensurar e melhorar a qualidade dos outputs
- Aplicar padrões de segurança e compliance

---

## 🧠 Conceitos Fundamentais

### **1. Anatomia de um Prompt Eficaz**

```
[PAPEL/CONTEXTO] + [TAREFA] + [FORMATO] + [EXEMPLOS] + [RESTRIÇÕES] = PROMPT COMPLETO
```

#### **Exemplo Prático (Setor Financeiro):**
```
Você é um analista sênior de compliance bancário especializado em BCB.

TAREFA: Analise este documento de operação financeira e identifique potenciais não-conformidades com regulamentações BCB.

FORMATO: 
- Lista os riscos encontrados por categoria
- Classifique cada risco (ALTO/MÉDIO/BAIXO)  
- Sugira ações corretivas específicas
- Use formato JSON estruturado

EXEMPLO:
{
  "riscos": [
    {
      "categoria": "Lavagem de Dinheiro",
      "nivel": "ALTO", 
      "descricao": "Transação sem justificativa econômica adequada",
      "acao_corretiva": "Solicitar documentação adicional da origem dos recursos"
    }
  ]
}

RESTRIÇÕES:
- Baseie-se APENAS em regulamentações BCB vigentes
- Não faça especulações sobre intenções
- Cite o número específico das normas aplicáveis

DOCUMENTO: [inserir documento aqui]
```

### **2. Os 5 Pilares da Eficácia**

#### **🎯 CLAREZA**
- Use linguagem precisa e não ambígua
- Evite jargões desnecessários
- Estruture instruções em etapas claras

**❌ Ruim:** "Analise isso"  
**✅ Bom:** "Analise este relatório financeiro e identifique 3 indicadores de performance mais críticos"

#### **🎭 PAPEL (Role Definition)**
- Defina expertise específica necessária
- Estabeleça perspectiva e autoridade  
- Alinhe com o domínio da tarefa

**Exemplos por Setor:**
- **FinTech**: "Você é um especialista em Open Banking e APIs PIX"
- **eCommerce**: "Você é um consultor de otimização de conversão com 10 anos de experiência"  
- **Institucional**: "Você é um redator técnico especializado em comunicação governamental acessível"

#### **📋 ESTRUTURA**
- Organize informações hierarquicamente
- Use marcadores e seções claras
- Implemente templates reutilizáveis

#### **🎯 ESPECIFICIDADE**  
- Defina outputs desejados com precisão
- Estabeleça critérios de qualidade mensuráveis
- Inclua exemplos concretos quando apropriado

#### **🛡️ SEGURANÇA**
- Implemente validações contra alucinações
- Estabeleça limites de responsabilidade
- Documente fontes de informação

---

## 🚀 Implementação Passo a Passo

### **Passo 1: Setup Técnico**

#### **Escolha do Modelo**
```markdown
**Claude 4.0 (Anthropic)**
- ✅ Melhor para: Análises longas, documentos extensos, compliance
- ✅ Context window: 200K tokens
- ✅ Forte em: Reasoning, análise de documentos

**GPT-4/4o (OpenAI)**  
- ✅ Melhor para: Function calling, integrações, criatividade
- ✅ Context window: 128K tokens
- ✅ Forte em: Code generation, APIs, multimodalidade

**Critérios de Seleção:**
- Volume de contexto necessário
- Necessidade de function calling
- Budget e pricing model
- Latência aceitável
```

#### **Configuração Inicial**
```python
# Exemplo de configuração Python (OpenAI)
import openai

client = openai.OpenAI(api_key="sua-chave-api")

# Configurações recomendadas para uso corporativo
CONFIGURACAO_PADRAO = {
    "model": "gpt-4-turbo-preview",
    "temperature": 0.1,  # Baixa para consistência
    "max_tokens": 4000,
    "top_p": 0.9,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
}
```

### **Passo 2: Primeiro Prompt Estruturado**

#### **Template Base (Use como starting point)**
```markdown
## CONTEXTO EMPRESARIAL
Empresa: [Nome da empresa]
Setor: [Financeiro/eCommerce/Institucional/etc]
Objetivo: [Objetivo específico desta tarefa]

## PAPEL ESPECIALIZADO  
Você é um [especialista em área específica] com experiência em [domínio relevante]. 
Sua expertise inclui [conhecimentos específicos necessários].

## TAREFA ESPECÍFICA
[Descrição clara e detalhada do que deve ser feito]

## FORMATO DE OUTPUT
[Especificar estrutura exata desejada]
- Se JSON: incluir schema
- Se texto: definir seções e hierarquia  
- Se lista: especificar formato de itens

## EXEMPLOS (se aplicável)
[Mostrar 1-2 exemplos do output desejado]

## RESTRIÇÕES E VALIDAÇÕES
- [Limitações importantes]
- [Critérios de qualidade]  
- [Fontes de verdade para validação]

## INPUT  
[Dados/documento/contexto específico para análise]
```

### **Passo 3: Teste e Iteração**

#### **Processo de Refinamento**
1. **Teste Inicial**: Execute o prompt com dados de teste
2. **Análise Qualitativa**: Avalie se o output atende aos critérios  
3. **Identificação de Gaps**: Note inconsistências ou omissões
4. **Refinamento**: Ajuste instruções específicas
5. **Teste de Regressão**: Confirme que melhorias não quebraram funcionalidades anteriores

#### **Métricas de Qualidade**
```markdown
📊 SCORECARD DE AVALIAÇÃO

**Precisão**: Output atende às especificações? (0-10)
**Completude**: Todas as informações solicitadas foram fornecidas? (0-10)  
**Consistência**: Resultados similares em inputs similares? (0-10)
**Usabilidade**: Output é diretamente utilizável sem edição? (0-10)
**Conformidade**: Atende a padrões regulatórios aplicáveis? (0-10)

**Score Mínimo Aceitável**: 8.0/10 em todas as dimensões
```

---

## 🎯 Casos de Uso por Setor

### **Setor Financeiro**

#### **Análise de Compliance**
```markdown
Você é um especialista em regulamentação BCB com foco em prevenção à lavagem de dinheiro.

Analise esta transação e classifique o nível de risco:
[dados da transação]

Formato JSON:
{
  "risco_global": "ALTO|MÉDIO|BAIXO",
  "indicadores_suspeitos": ["lista de red flags identificados"],
  "normas_aplicáveis": ["BCB 3.542", "Lei 9.613/98"],
  "recomendacoes": ["ações específicas a tomar"]
}
```

#### **Geração de Relatórios Regulatórios**
```markdown
Você é um analista de risco especializado em elaboração de relatórios BCB.

Gere um resumo executivo baseado nos dados de risco apresentados:
[dados de entrada]

Estrutura obrigatória:
1. SUMÁRIO EXECUTIVO (máx 300 palavras)
2. INDICADORES PRINCIPAIS (tabela formatada)  
3. ANÁLISE DE TENDÊNCIAS (comparação períodos anteriores)
4. RECOMENDAÇÕES ESTRATÉGICAS (3-5 itens priorizados)
5. COMPLIANCE STATUS (aderência às normas)
```

### **eCommerce**

#### **Otimização de Descrições de Produto**
```markdown
Você é um copywriter especializado em eCommerce com expertise em SEO e conversão.

Reescreva esta descrição de produto para maximizar conversões:
[descrição atual]

Critérios obrigatórios:
- Foco em benefícios (não apenas features)
- Incluir 3-5 palavras-chave relevantes naturalmente
- Call-to-action persuasivo
- Máximo 200 palavras
- Tom: [profissional/casual/técnico] conforme público-alvo

Formato de output:
- Título otimizado (max 60 caracteres)
- Descrição principal
- Bullet points com benefícios-chave
- Meta description (max 155 caracteres)
```

### **Institucional/Governamental**

#### **Comunicação Acessível**  
```markdown
Você é um especialista em comunicação pública e acessibilidade digital (WCAG 2.1).

Reescreva este documento técnico para linguagem cidadã:
[documento original]

Padrões obrigatórios:
- Linguagem clara (nível fundamental/médio)
- Estrutura hierárquica clara (H1, H2, H3)
- Exemplos práticos quando aplicável  
- Glossário para termos técnicos essenciais
- Conformidade WCAG 2.1 AA

Estrutura:
1. RESUMO EM LINGUAGEM SIMPLES
2. CONTEÚDO PRINCIPAL (seções claras)
3. PERGUNTAS FREQUENTES
4. GLOSSÁRIO
5. ONDE BUSCAR MAIS INFORMAÇÕES
```

---

## 🔧 Ferramentas Essenciais

### **Validação e Qualidade**
```bash
# Token Counter (script Python simples)
def count_tokens(text, model="gpt-4"):
    """Estima uso de tokens para planejamento de custos"""
    # Implementação básica: ~4 caracteres = 1 token
    return len(text) / 4

# Validator de JSON
import json
def validate_json_output(output):
    try:
        json.loads(output)
        return True
    except:
        return False
```

### **Templates de Desenvolvimento**
```python
class PromptTemplate:
    def __init__(self, template_string):
        self.template = template_string
    
    def render(self, **kwargs):
        return self.template.format(**kwargs)

# Exemplo de uso
compliance_template = PromptTemplate("""
Você é um {expert_role} especializado em {domain}.

Analise o seguinte {input_type} e identifique {analysis_focus}:

{input_data}

Formato de resposta:
{output_format}
""")

prompt = compliance_template.render(
    expert_role="analista de compliance BCB",
    domain="regulamentação bancária",  
    analysis_focus="potenciais não-conformidades",
    input_type="relatório de transações",
    input_data="[dados aqui]",
    output_format="JSON estruturado com riscos e recomendações"
)
```

---

## ✅ Checklist de Implementação

### **Antes do Deploy**
- [ ] Prompt testado com mínimo 10 casos variados
- [ ] Métricas de qualidade definidas e medidas
- [ ] Fallbacks implementados para edge cases
- [ ] Validações de output automatizadas
- [ ] Custo estimado e budget aprovado
- [ ] Compliance review realizado (se aplicável)

### **Durante Operação**
- [ ] Logs de prompts e outputs para auditoria
- [ ] Monitoramento de qualidade contínuo  
- [ ] Feedback loop para melhorias
- [ ] Controle de custos e usage tracking
- [ ] Updates de template quando necessário

---

## 🚀 Próximos Passos

### **Aprofundamento Técnico**
1. **[Técnicas Fundamentais](fundamentals/)** - Padrões essenciais
2. **[System Prompts Avançados](fundamentals/system-prompts.md)** - Estruturas complexas  
3. **[Templates Reutilizáveis](fundamentals/prompt-templates-and-variables.md)** - Automação

### **Casos Avançados**  
1. **[Chain of Thought](advanced/chain-of-thought.md)** - Raciocínio estruturado
2. **[XML Tags Framework](advanced/xml-tags-complete-guide.md)** - Estruturação avançada
3. **[Anti-Alucinação](anti-hallucination/)** - Qualidade e confiabilidade

### **Operacionalização**
1. **[Ferramentas](tools/)** - Debugging e desenvolvimento
2. **[Métricas](metrics/)** - Mensuração de ROI  
3. **[Otimização](optimization/)** - Performance e custos

---

*Este guia foi desenvolvido por **Dutt eCommerce Website Design** com base em implementações reais em projetos corporativos e regulamentados.*