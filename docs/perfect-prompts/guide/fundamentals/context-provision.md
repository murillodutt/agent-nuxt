# Provisão e Gestão de Contexto

**Otimização da Janela de Contexto** | **Versão 1.0** | **Dutt eCommerce Website Design**

---

## 🎯 Importância da Context Provision

**Context Provision** é a arte e ciência de fornecer informações relevantes, organizadas e otimizadas dentro da janela de contexto limitada dos LLMs. É crucial para análises precisas, decisões bem fundamentadas e outputs de alta qualidade em aplicações corporativas.

### **Por que Context Management Importa**
- **Precisão**: Informações relevantes produzem análises mais acuradas
- **Eficiência**: Contexto otimizado reduz custo computacional
- **Relevância**: Foco em dados pertinentes ao problema específico
- **Confiabilidade**: Base sólida de informações reduz alucinações  
- **Rastreabilidade**: Contexto documentado facilita auditoria
- **Escalabilidade**: Gestão eficiente permite processar volumes maiores

---

## 📐 Limitações de Contexto por Modelo

### **Context Windows Atuais (2025)**

| Modelo | Context Window | Uso Recomendado | Custo Relativo |
|---------|---------------|-----------------|----------------|
| **Claude 3.5 Sonnet** | 200K tokens | Análise de documentos longos | Alto |
| **GPT-4 Turbo** | 128K tokens | Aplicações gerais balanceadas | Médio-Alto |
| **GPT-4** | 8K tokens | Tarefas específicas e rápidas | Médio |
| **Gemini Pro** | 2M tokens | Processing massivo de dados | Variável |
| **Llama 2** | 4K tokens | Deploy local, casos específicos | Baixo |

### **Estimativa de Tokens (Português Brasileiro)**

```python
def estimate_tokens(text):
    """Estimativa aproximada para português brasileiro"""
    # Regra prática: ~4 caracteres = 1 token em português
    char_count = len(text)
    estimated_tokens = char_count / 4
    
    # Ajuste para complexidade do texto
    if any(char in text for char in ['#', '{', '}', '<', '>']):
        estimated_tokens *= 1.1  # Estruturas aumentam token count
    
    if text.count('\n') / len(text) > 0.05:
        estimated_tokens *= 1.05  # Muitas quebras de linha
    
    return int(estimated_tokens)

# Benchmarks práticos
examples = {
    "Email corporativo": "150-300 tokens",
    "Relatório executivo (2 páginas)": "800-1200 tokens", 
    "Contrato padrão": "2000-4000 tokens",
    "Balanço patrimonial completo": "1500-2500 tokens",
    "Manual de procedimentos": "5000-15000 tokens"
}
```

---

## 🏗️ Estratégias de Context Provision

### **1. Hierarchical Context (Contexto Hierárquico)**

#### **Pirâmide de Relevância**
```
🔺 CONTEXTO CRÍTICO (Top 20%)
├── Informação essencial para decisão
├── Dados que impactam diretamente o resultado  
└── Restrições e limitações obrigatórias

🔸 CONTEXTO IMPORTANTE (Middle 60%)
├── Background necessário para compreensão
├── Dados históricos relevantes
└── Especificações técnicas detalhadas

🔹 CONTEXTO COMPLEMENTAR (Bottom 20%)
├── Informações "nice to have"
├── Detalhes adicionais
└── Referencias e fontes
```

#### **Implementação Prática - Análise Financeira**
```markdown
## CONTEXTO CRÍTICO - OBRIGATÓRIO (500 tokens)
### Operação Analisada
- Valor: R$ 2.5M  
- Origem: Conta PJ (CNPJ: 12.345.678/0001-90)
- Destino: Banco Internacional (SWIFT: CAYBKY22)
- Data: 2024-09-24
- Justificativa: "Pagamento de fornecedor internacional"

### Normas BCB Aplicáveis - CRÍTICAS
- Circular 3.542/2014: Prevenção lavagem de dinheiro
- Lei 9.613/1998: Tipificação de crimes financeiros
- Resolução 4.595/2017: Operações com exterior

## CONTEXTO IMPORTANTE - RELEVANTE (1000 tokens)  
### Histórico do Cliente
- Empresa: Importadora de eletrônicos (desde 2018)
- Faturamento anual: R$ 15M-25M
- Perfil operacional: 8-12 operações/mês, tíquete médio R$ 400K
- Relacionamento bancário: 6 anos, sem ocorrências

### Análise de Risco Prévia
- Score interno: 6.5/10 (médio-alto)
- Última operação similar: R$ 1.8M (3 meses atrás)
- Setor econômico: Médio risco conforme CNAE
- Região: São Paulo (baixo risco geográfico)

### Contexto Regulatório  
- Banco Central alertas recentes: Paraísos fiscais
- COAF warnings: Operações >R$ 2M requerem atenção especial
- Tendências de mercado: Aumento 15% em operações suspeitas Q3/2024

## CONTEXTO COMPLEMENTAR - OPCIONAL (500 tokens)
### Documentação Disponível
- Contrato de importação (verificado)
- Invoice do fornecedor (validada)
- Licença de importação (conforme)
- Documentação KYC atualizada

### Referências Setoriais
- Benchmark setor eletrônicos: 2-3% operações requerem análise adicional
- Padrão similar instituições: Bloqueio preventivo comum para >R$ 2M
- Guidelines internacionais: FATF recommendations aplicáveis
```

### **2. Contextual Chunking (Fragmentação Contextual)**

#### **Técnica: Progressive Context Loading**
```python
class ContextualChunker:
    def __init__(self, max_tokens=8000):
        self.max_tokens = max_tokens
        self.context_priority = {
            "critical": 1,
            "important": 2, 
            "supplementary": 3
        }
    
    def chunk_by_priority(self, context_dict):
        """Fragmenta contexto por prioridade respeitando token limits"""
        chunks = []
        current_chunk = {"tokens": 0, "content": []}
        
        # Ordenar por prioridade
        sorted_context = sorted(
            context_dict.items(),
            key=lambda x: self.context_priority.get(x[0], 99)
        )
        
        for context_type, content in sorted_context:
            content_tokens = estimate_tokens(content)
            
            if current_chunk["tokens"] + content_tokens > self.max_tokens:
                # Finalizar chunk atual  
                if current_chunk["content"]:
                    chunks.append(current_chunk)
                
                # Iniciar novo chunk
                current_chunk = {
                    "tokens": content_tokens,
                    "content": [(context_type, content)]
                }
            else:
                current_chunk["tokens"] += content_tokens
                current_chunk["content"].append((context_type, content))
        
        # Adicionar último chunk
        if current_chunk["content"]:
            chunks.append(current_chunk)
        
        return chunks

# Uso prático
context_data = {
    "critical": "Operação R$ 2.5M para paraíso fiscal...",
    "important": "Histórico do cliente nos últimos 2 anos...",
    "supplementary": "Documentação adicional e referencias..."
}

chunker = ContextualChunker(max_tokens=6000)
chunks = chunker.chunk_by_priority(context_data)

for i, chunk in enumerate(chunks):
    print(f"Chunk {i+1}: {chunk['tokens']} tokens")
```

### **3. Dynamic Context Selection (Seleção Dinâmica)**

#### **Context Relevance Scoring**
```python
def score_context_relevance(query, context_pieces):
    """Score relevância de cada peça de contexto para query específica"""
    scores = {}
    
    # Keywords extraction from query
    query_keywords = extract_keywords(query.lower())
    
    for context_id, context_text in context_pieces.items():
        score = 0
        context_lower = context_text.lower()
        
        # Keyword matching (weighted)
        for keyword in query_keywords:
            if keyword in context_lower:
                # Pontuação por frequência e posição
                frequency = context_lower.count(keyword)
                position_bonus = 2 if context_lower.find(keyword) < 200 else 1
                score += frequency * position_bonus
        
        # Domain-specific scoring
        if "financeiro" in query.lower():
            financial_terms = ["bcb", "risco", "compliance", "operação", "norma"]
            for term in financial_terms:
                if term in context_lower:
                    score += 3
        
        # Recency bonus (if applicable)  
        if has_recent_date(context_text):
            score += 2
            
        scores[context_id] = score
    
    # Return top-scoring contexts within token budget
    return select_top_contexts(scores, token_budget=6000)

# Implementação para compliance bancário
query = "Analise risco desta operação internacional de R$ 2.5M"
available_contexts = {
    "operacao_details": "Detalhes da operação...",
    "cliente_history": "Histórico dos últimos 5 anos...", 
    "normas_bcb": "Regulamentações aplicáveis...",
    "market_trends": "Tendências de mercado...",
    "documentation": "Documentos suportivos..."
}

relevant_contexts = score_context_relevance(query, available_contexts)
```

---

## 📋 Context Templates por Setor

### **🏦 Setor Financeiro - Template de Contexto**

```markdown
# CONTEXT TEMPLATE: Análise de Compliance Bancário

## SEÇÃO 1: CONTEXTO OPERACIONAL CRÍTICO [300-500 tokens]
### Operação em Análise  
- **ID**: {{OPERATION_ID}}
- **Valor**: R$ {{AMOUNT:,.2f}}  
- **Data**: {{OPERATION_DATE}}
- **Origem**: {{ORIGIN_ACCOUNT}} ({{ORIGIN_ENTITY}})
- **Destino**: {{DESTINATION_BANK}} ({{DESTINATION_COUNTRY}})
- **Tipo**: {{OPERATION_TYPE}}
- **Justificativa**: "{{STATED_PURPOSE}}"

### Classificação Imediata
- **Valor vs Perfil**: {{AMOUNT_VS_PROFILE}} (Normal/Elevado/Crítico)
- **Destino**: {{DESTINATION_RISK}} (Baixo/Médio/Alto/Paraíso Fiscal)
- **Urgência**: {{URGENCY_LEVEL}} (Normal/Alta/Crítica)

## SEÇÃO 2: CONTEXTO REGULATÓRIO [400-600 tokens]
### Normas BCB Diretamente Aplicáveis
```yaml
primary_regulations:
  - norm: "{{PRIMARY_BCB_NORM}}"
    article: "{{SPECIFIC_ARTICLE}}"
    summary: "{{NORM_SUMMARY}}"
    threshold: "{{APPLICABLE_THRESHOLD}}"
  
secondary_regulations:
  - norm: "{{SECONDARY_BCB_NORM}}"
    relevance: "{{WHY_RELEVANT}}"
```

### Contexto de Enforcement
- **Alertas BCB Recentes**: {{RECENT_BCB_ALERTS}}
- **Tendências Regulatórias**: {{REGULATORY_TRENDS}}
- **Precedentes Similares**: {{SIMILAR_CASES_OUTCOME}}

## SEÇÃO 3: CONTEXTO DO CLIENTE [500-800 tokens]
### Perfil Corporativo
```json
{
  "razao_social": "{{COMPANY_NAME}}",
  "cnpj": "{{CNPJ}}",  
  "cnae": "{{CNAE_CODE}} - {{BUSINESS_DESCRIPTION}}",
  "porte": "{{COMPANY_SIZE}}",
  "faturamento_anual": "{{ANNUAL_REVENUE}}",
  "tempo_relacionamento": "{{RELATIONSHIP_YEARS}} anos"
}
```

### Histórico Operacional (12 meses)
- **Total Operações**: {{TOTAL_OPERATIONS_12M}}
- **Valor Médio**: R$ {{AVERAGE_AMOUNT:,.2f}}  
- **Frequência**: {{FREQUENCY_PATTERN}}
- **Sazonalidade**: {{SEASONAL_PATTERNS}}
- **Ocorrências**: {{PAST_INCIDENTS}} (Nenhuma/Leves/Graves)

### Score de Risco Interno
- **Score Atual**: {{INTERNAL_RISK_SCORE}}/10
- **Última Atualização**: {{SCORE_LAST_UPDATE}}
- **Fatores de Risco**: {{RISK_FACTORS_LIST}}
- **Fatores Mitigantes**: {{MITIGATING_FACTORS}}

## SEÇÃO 4: CONTEXTO DE MERCADO [200-400 tokens]
### Intelligence Recente
- **Alertas COAF**: {{COAF_RECENT_ALERTS}}
- **Padrões Setoriais**: {{INDUSTRY_RISK_PATTERNS}}  
- **Geopolítica**: {{RELEVANT_GEOPOLITICAL_CONTEXT}}
- **Benchmarks**: {{PEER_COMPARISON_DATA}}

## SEÇÃO 5: DOCUMENTAÇÃO SUPORTIVA [100-300 tokens]
### Evidências Disponíveis
- ✅ Contrato comercial: {{CONTRACT_STATUS}}
- ✅ Invoice/Fatura: {{INVOICE_STATUS}} 
- ✅ KYC atualizado: {{KYC_STATUS}}
- ✅ Licenças: {{LICENSES_STATUS}}
- ❓ Documentos pendentes: {{PENDING_DOCS}}

---
**Total Estimated Tokens**: {{TOTAL_CONTEXT_TOKENS}}
**Priority Level**: {{CONTEXT_PRIORITY}}  
**Last Updated**: {{CONTEXT_TIMESTAMP}}
```

### **🛒 eCommerce - Template de Contexto**

```markdown
# CONTEXT TEMPLATE: Otimização de Produto eCommerce

## SEÇÃO 1: CONTEXTO DO PRODUTO [400-600 tokens]
### Produto em Análise
```yaml
produto:
  nome_atual: "{{CURRENT_PRODUCT_NAME}}"
  categoria: "{{PRODUCT_CATEGORY}}"
  subcategoria: "{{SUBCATEGORY}}" 
  marca: "{{BRAND_NAME}}"
  preco_atual: "R$ {{CURRENT_PRICE:,.2f}}"
  margem: "{{PROFIT_MARGIN}}%"
  estoque: "{{STOCK_LEVEL}}"
  
performance_atual:
  visualizacoes_mes: {{MONTHLY_VIEWS}}
  conversao_atual: "{{CURRENT_CONVERSION}}%"
  bounce_rate: "{{BOUNCE_RATE}}%"
  tempo_pagina: "{{AVG_TIME_ON_PAGE}}s"
  reviews_count: {{REVIEWS_COUNT}}
  rating_medio: {{AVERAGE_RATING}}/5
```

### Conteúdo Atual (para otimização)
- **Título**: "{{CURRENT_TITLE}}"
- **Descrição**: "{{CURRENT_DESCRIPTION}}"
- **Bullet Points**: {{CURRENT_BULLETS}}
- **Imagens**: {{IMAGE_COUNT}} ({{IMAGE_QUALITY_SCORE}}/10)

## SEÇÃO 2: CONTEXTO COMPETITIVO [500-700 tokens]
### Análise da Concorrência
```json
{
  "concorrentes_diretos": [
    {
      "nome": "{{COMPETITOR_1_NAME}}",
      "preco": "R$ {{COMPETITOR_1_PRICE}}",
      "posicao_organica": {{ORGANIC_POSITION}},
      "diferenciais": ["{{DIFF_1}}", "{{DIFF_2}}"],
      "pontos_fracos": ["{{WEAK_1}}", "{{WEAK_2}}"]
    },
    {
      "nome": "{{COMPETITOR_2_NAME}}",  
      "preco": "R$ {{COMPETITOR_2_PRICE}}",
      "market_share": "{{MARKET_SHARE}}%",
      "estrategia_pricing": "{{PRICING_STRATEGY}}"
    }
  ],
  "gap_analysis": {
    "opportunities": ["{{OPPORTUNITY_1}}", "{{OPPORTUNITY_2}}"],
    "threats": ["{{THREAT_1}}", "{{THREAT_2}}"]
  }
}
```

### Posicionamento SEO
- **Palavra-chave Principal**: "{{PRIMARY_KEYWORD}}" ({{SEARCH_VOLUME}}/mês)
- **Posição Atual**: {{CURRENT_RANKING}}º
- **Keywords Secundárias**: {{SECONDARY_KEYWORDS}}
- **Featured Snippets**: {{SNIPPET_OPPORTUNITIES}}

## SEÇÃO 3: CONTEXTO DO PÚBLICO [300-500 tokens]  
### Target Audience
```yaml
publico_primario:
  idade: "{{TARGET_AGE_RANGE}}"
  genero: "{{GENDER_DISTRIBUTION}}"
  renda_familiar: "R$ {{INCOME_RANGE}}"
  escolaridade: "{{EDUCATION_LEVEL}}"
  comportamento_compra: "{{BUYING_BEHAVIOR}}"
  
pain_points:
  - "{{PAIN_POINT_1}}"
  - "{{PAIN_POINT_2}}"  
  - "{{PAIN_POINT_3}}"
  
motivacoes_compra:
  - "{{MOTIVATION_1}}"
  - "{{MOTIVATION_2}}"
  
canais_preferidos:
  - "{{PREFERRED_CHANNEL_1}}"
  - "{{PREFERRED_CHANNEL_2}}"
```

### Comportamento no Site
- **Device**: {{MOBILE_TRAFFIC}}% mobile, {{DESKTOP_TRAFFIC}}% desktop
- **Geografia**: {{TOP_CITIES}} (principais cidades)  
- **Horários**: {{PEAK_HOURS}} (picos de tráfego)
- **Jornada Típica**: {{TYPICAL_USER_JOURNEY}}

## SEÇÃO 4: CONTEXTO DE NEGÓCIO [200-400 tokens]
### Objetivos da Otimização
- **Meta Conversão**: {{TARGET_CONVERSION}}% (atual: {{CURRENT_CONVERSION}}%)
- **Meta Revenue**: R$ {{REVENUE_TARGET:,.2f}}/mês
- **ROI Esperado**: {{EXPECTED_ROI}}% em {{TIMEFRAME}}
- **KPIs Secundários**: {{SECONDARY_KPIS}}

### Restrições e Limitações
- **Budget**: R$ {{OPTIMIZATION_BUDGET:,.2f}}
- **Timeline**: {{PROJECT_TIMELINE}}  
- **Recursos**: {{AVAILABLE_RESOURCES}}
- **Guidelines de Marca**: {{BRAND_RESTRICTIONS}}
- **Conformidade**: {{COMPLIANCE_REQUIREMENTS}}

---
**Context Quality Score**: {{CONTEXT_COMPLETENESS}}/10
**Optimization Readiness**: {{READINESS_LEVEL}}
**Estimated Token Usage**: {{CONTEXT_TOKENS}}
```

---

## 🔧 Context Optimization Techniques

### **1. Context Compression**

```python
def compress_context(full_context, target_tokens, priority_weights=None):
    """Comprime contexto mantendo informações mais importantes"""
    
    if priority_weights is None:
        priority_weights = {
            "critical": 1.0,
            "important": 0.7,
            "supplementary": 0.4
        }
    
    compressed_sections = {}
    token_budget = target_tokens
    
    # Primeiro passo: garantir seções críticas
    for section, content in full_context.items():
        if section in priority_weights:
            weight = priority_weights[section]
            section_tokens = estimate_tokens(content)
            
            if weight >= 0.8:  # Crítico - incluir sempre
                compressed_sections[section] = content
                token_budget -= section_tokens
            elif weight >= 0.5:  # Importante - comprimir se necessário
                if section_tokens <= token_budget * 0.3:
                    compressed_sections[section] = content
                    token_budget -= section_tokens
                else:
                    # Comprimir mantendo pontos-chave
                    compressed = extract_key_points(content, int(section_tokens * 0.6))
                    compressed_sections[f"{section}_compressed"] = compressed
                    token_budget -= estimate_tokens(compressed)
    
    return compressed_sections

def extract_key_points(text, target_tokens):
    """Extrai pontos-chave de um texto longo"""
    sentences = text.split('.')
    
    # Score sentences por relevância (simplified)
    scored_sentences = []
    for sentence in sentences:
        score = 0
        # Bonus para sentenças com números/dados
        if any(char.isdigit() for char in sentence):
            score += 2
        # Bonus para palavras-chave importantes
        important_words = ['risco', 'bcb', 'norma', 'operação', 'valor', 'cliente']
        for word in important_words:
            if word.lower() in sentence.lower():
                score += 1
        
        scored_sentences.append((score, sentence.strip()))
    
    # Selecionar top sentences que cabem no orçamento
    sorted_sentences = sorted(scored_sentences, key=lambda x: x[0], reverse=True)
    selected = []
    current_tokens = 0
    
    for score, sentence in sorted_sentences:
        sentence_tokens = estimate_tokens(sentence)
        if current_tokens + sentence_tokens <= target_tokens:
            selected.append(sentence)
            current_tokens += sentence_tokens
        else:
            break
    
    return '. '.join(selected)
```

### **2. Context Retrieval (RAG Integration)**

```python
class ContextRetriever:
    def __init__(self, knowledge_base_path, embedding_model="text-embedding-ada-002"):
        self.knowledge_base = self.load_knowledge_base(knowledge_base_path)
        self.embedding_model = embedding_model
        self.vector_index = self.build_vector_index()
    
    def retrieve_relevant_context(self, query, max_contexts=5, max_tokens=2000):
        """Recupera contexto mais relevante para a query"""
        
        # Generate query embedding
        query_embedding = self.get_embedding(query)
        
        # Find most similar contexts
        similarities = self.calculate_similarities(query_embedding)
        
        # Select top contexts within token budget
        selected_contexts = []
        token_count = 0
        
        for similarity, context_id in similarities[:max_contexts]:
            context = self.knowledge_base[context_id]
            context_tokens = estimate_tokens(context["content"])
            
            if token_count + context_tokens <= max_tokens:
                selected_contexts.append({
                    "id": context_id,
                    "content": context["content"],
                    "relevance_score": similarity,
                    "source": context["source"],
                    "last_updated": context["timestamp"]
                })
                token_count += context_tokens
            else:
                break
        
        return {
            "contexts": selected_contexts,
            "total_tokens": token_count,
            "coverage_score": self.calculate_coverage_score(query, selected_contexts)
        }
    
    def adaptive_context_selection(self, query, context_complexity):
        """Seleciona contexto adaptado à complexidade da query"""
        
        if context_complexity == "simple":
            # Para queries simples, contexto mínimo
            return self.retrieve_relevant_context(query, max_contexts=2, max_tokens=800)
        elif context_complexity == "complex":
            # Para análises complexas, contexto extenso
            return self.retrieve_relevant_context(query, max_contexts=8, max_tokens=4000)
        else:
            # Contexto balanceado
            return self.retrieve_relevant_context(query, max_contexts=5, max_tokens=2000)
```

### **3. Context Validation**

```python
def validate_context_quality(context_dict, query):
    """Valida qualidade e relevância do contexto fornecido"""
    
    validation_results = {
        "completeness_score": 0,
        "relevance_score": 0,
        "currency_score": 0,
        "consistency_score": 0,
        "issues": [],
        "recommendations": []
    }
    
    # 1. Completeness Check
    required_sections = identify_required_sections(query)
    provided_sections = set(context_dict.keys())
    missing_sections = required_sections - provided_sections
    
    validation_results["completeness_score"] = 1 - (len(missing_sections) / len(required_sections))
    
    if missing_sections:
        validation_results["issues"].append(f"Missing sections: {missing_sections}")
        validation_results["recommendations"].append("Add missing critical context sections")
    
    # 2. Relevance Check  
    query_keywords = extract_keywords(query)
    total_relevance = 0
    
    for section, content in context_dict.items():
        section_relevance = calculate_keyword_overlap(query_keywords, content)
        total_relevance += section_relevance
    
    validation_results["relevance_score"] = min(total_relevance / len(context_dict), 1.0)
    
    # 3. Currency Check
    dates_found = extract_dates_from_context(context_dict)
    if dates_found:
        most_recent = max(dates_found)
        days_old = (datetime.now() - most_recent).days
        validation_results["currency_score"] = max(0, 1 - (days_old / 365))  # Decay over 1 year
    else:
        validation_results["issues"].append("No timestamp information found")
        validation_results["currency_score"] = 0.5  # Default if no dates
    
    # 4. Consistency Check
    consistency_issues = detect_consistency_issues(context_dict)
    validation_results["consistency_score"] = 1 - (len(consistency_issues) / 10)  # Normalize
    validation_results["issues"].extend(consistency_issues)
    
    # Overall Quality Score
    validation_results["overall_quality"] = (
        validation_results["completeness_score"] * 0.3 +
        validation_results["relevance_score"] * 0.4 +
        validation_results["currency_score"] * 0.2 +
        validation_results["consistency_score"] * 0.1
    )
    
    return validation_results
```

---

## 📊 Context ROI e Performance

### **Context Efficiency Metrics**

```python
def measure_context_efficiency(baseline_performance, optimized_performance):
    """Mede impacto da otimização de contexto"""
    
    metrics = {}
    
    # Accuracy improvement
    accuracy_gain = (optimized_performance["accuracy"] - baseline_performance["accuracy"]) / baseline_performance["accuracy"]
    metrics["accuracy_improvement"] = f"{accuracy_gain:.1%}"
    
    # Token efficiency (better results with same/fewer tokens)
    token_efficiency = optimized_performance["quality_score"] / optimized_performance["tokens_used"]
    baseline_efficiency = baseline_performance["quality_score"] / baseline_performance["tokens_used"]
    efficiency_gain = (token_efficiency - baseline_efficiency) / baseline_efficiency
    metrics["token_efficiency_gain"] = f"{efficiency_gain:.1%}"
    
    # Cost optimization
    cost_per_quality_point = calculate_cost_per_quality(optimized_performance)
    baseline_cost_per_quality = calculate_cost_per_quality(baseline_performance)
    cost_improvement = (baseline_cost_per_quality - cost_per_quality_point) / baseline_cost_per_quality
    metrics["cost_efficiency_improvement"] = f"{cost_improvement:.1%}"
    
    # Response time impact
    if "response_time" in optimized_performance:
        time_change = (optimized_performance["response_time"] - baseline_performance["response_time"]) / baseline_performance["response_time"]
        metrics["response_time_change"] = f"{time_change:.1%}"
    
    return metrics

# Example calculation
baseline = {
    "accuracy": 0.78,
    "quality_score": 7.2,
    "tokens_used": 8500,
    "response_time": 12.3
}

optimized = {
    "accuracy": 0.89,
    "quality_score": 8.7,
    "tokens_used": 6200,
    "response_time": 9.1
}

efficiency_gains = measure_context_efficiency(baseline, optimized)
```

### **Context Strategy ROI Calculator**

```python
def calculate_context_strategy_roi():
    """ROI de implementar estratégias de context optimization"""
    
    # Baseline: Context management ad-hoc
    baseline_metrics = {
        "avg_tokens_per_query": 9500,
        "success_rate": 0.73,
        "revision_cycles": 2.4,
        "analyst_time_hours": 0.75,
        "context_prep_time": 0.45
    }
    
    # With optimized context strategies
    optimized_metrics = {
        "avg_tokens_per_query": 6800,
        "success_rate": 0.91,
        "revision_cycles": 1.1,
        "analyst_time_hours": 0.35,
        "context_prep_time": 0.15
    }
    
    # Calculate monthly savings
    monthly_queries = 1500
    hourly_rate = 75  # USD
    token_cost_per_1k = 0.002  # USD
    
    # Token cost savings
    token_savings = (baseline_metrics["avg_tokens_per_query"] - optimized_metrics["avg_tokens_per_query"]) * monthly_queries
    monthly_token_savings = (token_savings / 1000) * token_cost_per_1k
    
    # Time savings
    time_savings_per_query = (baseline_metrics["analyst_time_hours"] + baseline_metrics["context_prep_time"]) - (optimized_metrics["analyst_time_hours"] + optimized_metrics["context_prep_time"])
    monthly_time_savings = time_savings_per_query * monthly_queries * hourly_rate
    
    # Quality improvement value (less rework)  
    rework_reduction = (baseline_metrics["revision_cycles"] - optimized_metrics["revision_cycles"]) * 0.25  # 15min per cycle
    monthly_rework_savings = rework_reduction * monthly_queries * hourly_rate
    
    total_monthly_savings = monthly_token_savings + monthly_time_savings + monthly_rework_savings
    
    return {
        "monthly_savings": {
            "token_costs": f"${monthly_token_savings:.0f}",
            "time_savings": f"${monthly_time_savings:.0f}", 
            "rework_reduction": f"${monthly_rework_savings:.0f}",
            "total": f"${total_monthly_savings:.0f}"
        },
        "annual_roi": f"${total_monthly_savings * 12:.0f}",
        "payback_period": "1-2 months (setup and training time)",
        "efficiency_gains": {
            "token_reduction": f"{((baseline_metrics['avg_tokens_per_query'] - optimized_metrics['avg_tokens_per_query']) / baseline_metrics['avg_tokens_per_query']) * 100:.1f}%",
            "success_rate_improvement": f"{((optimized_metrics['success_rate'] - baseline_metrics['success_rate']) / baseline_metrics['success_rate']) * 100:.1f}%",
            "time_reduction": f"{(time_savings_per_query / (baseline_metrics['analyst_time_hours'] + baseline_metrics['context_prep_time'])) * 100:.1f}%"
        }
    }
```

---

## 🚀 Próximos Passos

### **Para Implementação Imediata**  
1. **[Advanced XML Tags](../advanced/xml-tags-complete-guide.md)** - Estruturação avançada de contexto
2. **[Long Context Management](../optimization/long-context-tips.md)** - Gestão de contextos extensos
3. **[Template Integration](prompt-templates-and-variables.md)** - Templates com context slots

### **Para Otimização Avançada**
1. **[Context Window Management](../optimization/context-window-management.md)** - Estratégias de janela
2. **[Prompt Caching](../optimization/prompt-caching.md)** - Cache de contextos frequentes  
3. **[Batch Processing](../optimization/batch-processing.md)** - Processamento contextual em lote

### **Para Integração Corporativa**
1. **[RAG Integration](../tools/rag-integration.md)** - Recuperação automática de contexto
2. **[Knowledge Management](../tools/knowledge-base.md)** - Base de conhecimento estruturada
3. **[API Context Management](../optimization/api-integration.md)** - Contexto programático

---

*Context provision eficaz é a ponte entre dados corporativos e insights acionáveis, maximizando valor dentro das limitações técnicas dos LLMs.*

---

**Desenvolvido por Dutt eCommerce Website Design - Otimização de IA para análises corporativas baseadas em dados.**