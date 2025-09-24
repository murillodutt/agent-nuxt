# Referência Rápida - Prompt Engineering

**Cheatsheet Técnico** | **Versão 1.0** | **Dutt eCommerce Website Design**

---

## ⚡ Templates Prontos para Uso

### **🎯 Template Universal (Copy & Paste)**
```markdown
## CONTEXTO EMPRESARIAL
Empresa: [SUA_EMPRESA]
Setor: [SETOR]
Objetivo: [OBJETIVO_ESPECÍFICO]

## ESPECIALISTA DESIGNADO
Você é um [ESPECIALISTA] com experiência em [DOMÍNIO].

## TAREFA ESPECÍFICA  
[DESCRIÇÃO_DETALHADA]

## FORMATO DE OUTPUT
[ESTRUTURA_DESEJADA]

## EXEMPLO (se aplicável)
[MOSTRAR_EXEMPLO]

## RESTRIÇÕES
- [LIMITAÇÃO_1]
- [LIMITAÇÃO_2]  
- [CRITÉRIO_QUALIDADE]

## INPUT
[DADOS_PARA_ANÁLISE]
```

### **💼 Templates Setoriais**

#### **🏦 Setor Financeiro/FinTech**
```markdown
Você é um especialista em regulamentação BCB com foco em [ÁREA_ESPECÍFICA].

Analise os dados fornecidos e identifique:
- Riscos de compliance
- Indicadores suspeitos  
- Recomendações de ação
- Normas aplicáveis

Formato JSON:
{
  "risco_global": "ALTO|MÉDIO|BAIXO",
  "indicadores": ["lista"],
  "normas_bcb": ["números das normas"], 
  "acoes": ["recomendações específicas"]
}

Dados: [INPUT]
```

#### **🛒 eCommerce/Varejo**
```markdown
Você é um especialista em otimização de conversão e SEO para eCommerce.

Otimize esta [DESCRIÇÃO|TÍTULO|CATEGORIA] focando em:
- Palavras-chave relevantes
- Benefícios claros para o cliente
- Call-to-action persuasivo
- Formatação para leitura rápida

Formato:
- Título SEO (max 60 chars)
- Descrição principal (max 200 palavras)
- Bullet points com benefícios
- Meta description (max 155 chars)

Input: [CONTEÚDO_ORIGINAL]
```

#### **🏛️ Institucional/Governamental**  
```markdown
Você é um especialista em comunicação pública e acessibilidade (WCAG 2.1).

Reescreva este conteúdo para linguagem cidadã:
- Nível de leitura: Ensino fundamental
- Estrutura clara e hierárquica
- Exemplos práticos
- Glossário de termos técnicos

Estrutura obrigatória:
1. RESUMO SIMPLES
2. CONTEÚDO PRINCIPAL  
3. PERGUNTAS FREQUENTES
4. GLOSSÁRIO
5. CONTATOS ÚTEIS

Documento original: [INPUT]
```

---

## 🎛️ Configurações Otimizadas

### **⚙️ Parâmetros por Caso de Uso**

#### **📊 Análise e Compliance (Precisão Máxima)**
```json
{
  "temperature": 0.1,
  "top_p": 0.9,
  "max_tokens": 4000,
  "frequency_penalty": 0.0,
  "presence_penalty": 0.0
}
```

#### **🎨 Criação de Conteúdo (Criatividade Balanceada)**  
```json
{
  "temperature": 0.7,
  "top_p": 0.9,
  "max_tokens": 2000,
  "frequency_penalty": 0.3,
  "presence_penalty": 0.1  
}
```

#### **📝 Redação Técnica (Consistência)**
```json
{
  "temperature": 0.3,
  "top_p": 0.95,
  "max_tokens": 3000,
  "frequency_penalty": 0.1,
  "presence_penalty": 0.0
}
```

---

## 🛡️ Checklist de Segurança

### **✅ Antes do Deploy**
- [ ] **Prompt Injection Prevention**: Delimitadores implementados
- [ ] **Output Validation**: Schema de validação definido  
- [ ] **Fallback Strategy**: Comportamento para edge cases
- [ ] **Cost Control**: Limites de tokens configurados
- [ ] **Compliance Check**: Revisão regulatória (se aplicável)
- [ ] **Testing**: Mínimo 10 casos de teste variados

### **✅ Em Produção**
- [ ] **Logging**: Rastreamento de prompts e outputs
- [ ] **Monitoring**: Métricas de qualidade em tempo real
- [ ] **User Feedback**: Coleta de feedback estruturado  
- [ ] **Cost Tracking**: Monitoramento de gastos
- [ ] **Performance**: Latência e disponibilidade
- [ ] **Security**: Análise contínua de tentativas de injection

---

## 🔧 Técnicas Essenciais (Implementação Rápida)

### **1. Chain of Thought**
```markdown
# Versão Simples
Pense passo a passo antes de responder.

# Versão Estruturada  
Siga este processo de raciocínio:
1. ANÁLISE: Identifique elementos-chave
2. CONTEXTO: Considere fatores relevantes  
3. AVALIAÇÃO: Aplique critérios de julgamento
4. CONCLUSÃO: Formule resposta baseada na análise
```

### **2. Few-Shot Learning**
```markdown
# Estrutura Base
Aqui estão alguns exemplos:

Exemplo 1:
Input: [exemplo_input_1]  
Output: [exemplo_output_1]

Exemplo 2:  
Input: [exemplo_input_2]
Output: [exemplo_output_2]

Agora aplique o mesmo padrão:
Input: [seu_input_real]
Output:
```

### **3. XML Tags Estruturadas**
```xml
<role>
Você é um [especialista específico]
</role>

<task>
[Descrição da tarefa]
</task>

<format>
[Estrutura de output]
</format>

<examples>
[Exemplos se necessário]  
</examples>

<constraints>
[Limitações e restrições]
</constraints>

<input>
[Dados para processamento]
</input>
```

### **4. Output Formatado (JSON Schema)**
```markdown
Responda EXCLUSIVAMENTE no seguinte formato JSON:

{
  "status": "string", 
  "analysis": {
    "key_points": ["array of strings"],
    "risk_level": "HIGH|MEDIUM|LOW",
    "confidence": 0.95
  },
  "recommendations": [
    {
      "action": "string",
      "priority": "HIGH|MEDIUM|LOW",
      "timeline": "string"
    }
  ],
  "metadata": {
    "processed_at": "timestamp",
    "model_version": "string"
  }
}
```

---

## 📊 Métricas e ROI (Fórmulas Prontas)

### **💰 Cálculo de Custos**
```python
# Estimativa de custos (OpenAI GPT-4)
INPUT_COST_PER_1K = 0.01  # USD
OUTPUT_COST_PER_1K = 0.03  # USD

def estimate_cost(input_tokens, output_tokens):
    input_cost = (input_tokens / 1000) * INPUT_COST_PER_1K
    output_cost = (output_tokens / 1000) * OUTPUT_COST_PER_1K
    return input_cost + output_cost

# Exemplo: prompt de 2000 tokens input, 1000 tokens output
monthly_usage = estimate_cost(2000, 1000) * 1000  # 1000 execuções
print(f"Custo mensal estimado: ${monthly_usage:.2f}")
```

### **📈 ROI Simplificado**
```markdown
📊 FÓRMULA DE ROI

**Economia de Tempo**:
- Tempo manual por tarefa: [X] horas  
- Tempo com IA: [Y] horas
- Economia por execução: [X-Y] horas
- Valor/hora do profissional: $[Z]
- **Economia por execução**: $[(X-Y) * Z]

**ROI Mensal**:
- Execuções mensais: [N]
- Economia total: $[(X-Y) * Z * N]
- Custo da IA: $[custo_mensal_ai]  
- **ROI = [(Economia - Custo_AI) / Custo_AI] * 100%**
```

---

## 🚨 Troubleshooting Rápido

### **❌ Problemas Comuns**

#### **Output Inconsistente**
- **Causa**: Temperature muito alta  
- **Solução**: Reduzir para 0.1-0.3
- **Prevenção**: Adicionar exemplos específicos

#### **Resposta Incompleta**  
- **Causa**: max_tokens insuficiente
- **Solução**: Aumentar limite de tokens  
- **Prevenção**: Estimar tamanho de output

#### **Alucinação/Informações Incorretas**
- **Causa**: Prompt ambíguo ou dados conflitantes
- **Solução**: Adicionar restrições específicas
- **Prevenção**: Implementar validation framework

#### **Prompt Injection**
- **Causa**: Input não sanitizado
- **Solução**: Usar delimitadores XML/tags
- **Prevenção**: Input validation + sandboxing

#### **Custos Elevados**
- **Causa**: Prompts muito longos ou ineficientes
- **Solução**: Otimizar tamanho, usar batch processing
- **Prevenção**: Token budgets e monitoring

---

## 🎯 Cases de Sucesso (Benchmarks)

### **📈 Resultados Típicos por Setor**

#### **🏦 Financeiro**
- **Análise de Compliance**: 70% redução de tempo
- **Geração de Relatórios**: 85% automação  
- **Risk Assessment**: 95% accuracy vs manual
- **ROI Médio**: 300-500% primeiro ano

#### **🛒 eCommerce**  
- **Product Descriptions**: 60% aumento conversão
- **SEO Content**: 40% melhoria ranking
- **Customer Support**: 80% automação tier-1
- **ROI Médio**: 200-400% primeiro ano

#### **🏛️ Institucional**
- **Comunicação Cidadã**: 50% redução retrabalho
- **Document Processing**: 90% automação  
- **Content Translation**: 95% accuracy
- **ROI Médio**: 150-300% primeiro ano

---

## 🔗 Links Rápidos

### **📚 Aprofundamento**
- **[Fundamentais](fundamentals/)** → Técnicas base
- **[Avançado](advanced/)** → Chain of Thought, XML Tags  
- **[Otimização](optimization/)** → Performance e custos
- **[Templates](templates/)** → Prontos para uso

### **🛠️ Ferramentas**
- **[Prompt Improver](tools/prompt-improver.md)** → Otimização automática
- **[Token Counter](tools/token-counter.md)** → Estimativa de custos
- **[Validator](tools/prompt-validator.md)** → Quality assurance
- **[Debugger](tools/prompt-debugger.md)** → Troubleshooting

### **📊 Métricas**
- **[Performance KPIs](metrics/performance-metrics.md)** → Mensuração  
- **[ROI Calculator](metrics/roi-calculator.md)** → Justificativa de investimento
- **[Cost Analysis](metrics/cost-analysis.md)** → Controle de gastos

---

## 📋 Checklists Executivos

### **⚡ Deploy Rápido (1 hora)**
1. **[5 min]** Escolher template setorial apropriado
2. **[10 min]** Customizar para caso de uso específico  
3. **[20 min]** Testar com 5 casos reais
4. **[15 min]** Configurar parâmetros otimizados
5. **[10 min]** Implementar validação básica

### **🎯 Otimização Contínua (mensal)**  
1. **[30 min]** Analisar métricas de qualidade
2. **[45 min]** Revisar casos de falha/edge cases
3. **[30 min]** Ajustar prompts baseado em feedback
4. **[15 min]** Atualizar templates corporativos

### **📊 Review Estratégico (trimestral)**
1. **[60 min]** Calcular ROI realizado
2. **[45 min]** Identificar novos casos de uso  
3. **[30 min]** Avaliar novas tecnologias/modelos
4. **[45 min]** Planejar expansão para outros departamentos

---

*Esta referência rápida é mantida atualizada com as práticas mais eficazes do mercado. Desenvolvida por **Dutt eCommerce Website Design**.*