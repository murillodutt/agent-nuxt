# Framework de Validação de Prompt Engineering

**Sistema de Testes e Quality Assurance** | **Versão 1.0** | **Dutt eCommerce Website Design**

---

## 🎯 Objetivo

Este framework estabelece padrões rigorosos de validação para garantir que todos os exemplos e técnicas documentados neste guia atendam aos critérios de qualidade corporativa e conformidade regulatória.

---

## 🧪 Categorias de Teste

### **1. Testes de Consistência**

#### **Test Case 1.1: Determinismo**
```python
def test_consistency():
    """Verifica se prompts com temperature baixa geram outputs consistentes"""
    prompt = "Analise este documento financeiro: [dados_padrao]"
    config = {"temperature": 0.1, "max_tokens": 1000}
    
    results = []
    for i in range(5):
        response = llm_call(prompt, config)
        results.append(response)
    
    # Verificar similaridade >= 90% entre execuções
    assert similarity_score(results) >= 0.90
    assert all(is_valid_json(r) for r in results if "json" in prompt.lower())
```

#### **Test Case 1.2: Formato de Output**  
```python
def test_output_format():
    """Valida aderência ao formato especificado"""
    prompt = """Responda em formato JSON:
    {"analise": "string", "risco": "ALTO|MÉDIO|BAIXO", "confianca": float}
    
    Documento: [input_test]"""
    
    response = llm_call(prompt, {"temperature": 0.2})
    
    # Validações obrigatórias
    assert is_valid_json(response)
    data = json.loads(response)
    assert "analise" in data
    assert data["risco"] in ["ALTO", "MÉDIO", "BAIXO"]  
    assert isinstance(data["confianca"], (int, float))
    assert 0.0 <= data["confianca"] <= 1.0
```

### **2. Testes de Qualidade**

#### **Test Case 2.1: Prevenção de Alucinação**
```python
def test_hallucination_prevention():
    """Verifica se o modelo inventa informações não fornecidas"""
    prompt = """Analise APENAS as informações fornecidas no documento.
    Se informações não estiverem disponíveis, responda "INFORMAÇÃO NÃO DISPONÍVEL".
    
    Documento: "Empresa XYZ teve receita de R$ 1M em 2024."
    
    Pergunta: Qual foi o lucro líquido da empresa XYZ?"""
    
    response = llm_call(prompt, {"temperature": 0.1})
    
    # Deve indicar que a informação não está disponível
    assert any(phrase in response.upper() for phrase in [
        "INFORMAÇÃO NÃO DISPONÍVEL", 
        "NÃO MENCIONADO",
        "NÃO FORNECIDO",
        "DADOS INSUFICIENTES"
    ])
```

#### **Test Case 2.2: Compliance Regulatory**
```python
def test_regulatory_compliance():
    """Valida aderência a padrões regulatórios específicos"""
    prompt = """Você é um analista BCB especializado em compliance.
    Analise esta operação identificando APENAS riscos baseados em normas BCB vigentes.
    Cite o número específico da norma para cada risco identificado.
    
    Operação: [dados_operacao_teste]"""
    
    response = llm_call(prompt, {"temperature": 0.1})
    
    # Verificar se cita normas BCB válidas
    import re
    bcb_citations = re.findall(r'(?:BCB|Circular|Resolução)\s*\d+', response)
    assert len(bcb_citations) > 0, "Deve citar normas BCB específicas"
    
    # Verificar se não especula
    forbidden_words = ["possivelmente", "provavelmente", "acredito", "imagino"]
    assert not any(word in response.lower() for word in forbidden_words)
```

### **3. Testes de Performance**

#### **Test Case 3.1: Eficiência de Tokens**
```python
def test_token_efficiency():
    """Verifica otimização de uso de tokens"""
    test_cases = [
        ("prompt_basico", "Analise este documento: [doc]"),
        ("prompt_otimizado", "Analise documento identificando: riscos, oportunidades, recomendações.\nDoc: [doc]")
    ]
    
    for name, prompt in test_cases:
        token_count = count_tokens(prompt)
        response = llm_call(prompt, {"max_tokens": 500})
        response_tokens = count_tokens(response)
        
        # Razão output/input deve ser > 1.5 para eficiência
        efficiency_ratio = response_tokens / token_count
        assert efficiency_ratio > 1.5, f"{name}: baixa eficiência {efficiency_ratio:.2f}"
```

#### **Test Case 3.2: Latência Aceitável**  
```python
def test_response_latency():
    """Verifica se tempo de resposta está dentro do aceitável"""
    import time
    
    prompt = "Analise este relatório financeiro e identifique 3 pontos principais: [dados]"
    
    start_time = time.time()
    response = llm_call(prompt, {"max_tokens": 1000})
    latency = time.time() - start_time
    
    # Para uso corporativo, < 30 segundos é aceitável
    assert latency < 30.0, f"Latência muito alta: {latency:.2f}s"
    assert len(response) > 100, "Resposta muito curta para o tempo gasto"
```

---

## 🏢 Testes Setoriais Específicos

### **Setor Financeiro**

#### **Test Case: Análise de Risco BCB**
```python
def test_bcb_risk_analysis():
    """Testa análise de risco conforme padrões BCB"""
    prompt = """Você é um analista sênior de risco bancário.
    Classifique esta operação conforme critérios BCB:
    
    Operação: Transferência internacional de R$ 500.000 
    Origem: Conta PF sem histórico de grandes movimentações
    Destino: Conta em paraíso fiscal  
    Justificativa: "Investimento pessoal"
    
    Formato JSON obrigatório:
    {
      "classificacao_risco": "BAIXO|MÉDIO|ALTO|CRÍTICO",
      "indicadores_bcb": ["lista de red flags"],  
      "normas_aplicaveis": ["números das normas"],
      "acao_recomendada": "string"
    }"""
    
    response = llm_call(prompt, {"temperature": 0.1})
    data = json.loads(response)
    
    # Validações específicas BCB
    assert data["classificacao_risco"] in ["ALTO", "CRÍTICO"], "Deve identificar alto risco"
    assert any("paraíso fiscal" in indicador.lower() for indicador in data["indicadores_bcb"])
    assert len(data["normas_aplicaveis"]) > 0, "Deve citar normas aplicáveis"
```

### **eCommerce**

#### **Test Case: Otimização SEO**
```python
def test_seo_optimization():
    """Testa otimização de conteúdo para SEO"""
    prompt = """Você é um especialista em SEO para eCommerce.
    Otimize esta descrição de produto:
    
    Original: "Smartphone bom e barato"
    
    Requisitos:
    - Título SEO (max 60 chars)
    - 3-5 palavras-chave relevantes
    - Descrição persuasiva (max 200 palavras) 
    - Meta description (max 155 chars)"""
    
    response = llm_call(prompt, {"temperature": 0.3})
    
    # Validações SEO
    lines = response.split('\n')
    title_line = [l for l in lines if 'título' in l.lower() or 'title' in l.lower()][0]
    assert len(title_line.split(':')[-1].strip()) <= 60, "Título SEO muito longo"
    
    assert 'smartphone' in response.lower(), "Deve manter palavra-chave principal"
    assert any(word in response.lower() for word in ['promoção', 'oferta', 'preço'])
```

---

## 📊 Métricas de Qualidade

### **Scorecard Automático**
```python
class QualityScorecard:
    def __init__(self):
        self.tests = []
        
    def run_all_tests(self, prompt, expected_behavior):
        results = {
            "consistency": self.test_consistency(prompt),
            "format_compliance": self.test_format_compliance(prompt),  
            "no_hallucination": self.test_hallucination_prevention(prompt),
            "regulatory_compliance": self.test_regulatory_compliance(prompt),
            "token_efficiency": self.test_token_efficiency(prompt),
            "response_quality": self.test_response_quality(prompt)
        }
        
        # Score geral (0-10)
        total_score = sum(results.values()) / len(results)
        return {
            "score": round(total_score, 2),
            "details": results,
            "status": "PASS" if total_score >= 8.0 else "FAIL"
        }

# Uso
scorecard = QualityScorecard()
result = scorecard.run_all_tests(prompt_to_test, expected_behavior)
print(f"Quality Score: {result['score']}/10 - {result['status']}")
```

### **Benchmarks por Setor**

#### **Financeiro (Compliance)**
- **Accuracy**: ≥ 95% na identificação de riscos
- **Precision**: ≥ 90% (baixos falsos positivos)  
- **Recall**: ≥ 95% (detectar todos os riscos reais)
- **Regulatory Citation**: 100% das análises devem citar normas

#### **eCommerce (Conversão)**
- **CTR Improvement**: ≥ 15% vs. descrições originais
- **SEO Score**: ≥ 85/100 em ferramentas padrão
- **Readability**: Nível fundamental/médio
- **Keyword Density**: 2-3% para termo principal

#### **Institucional (Acessibilidade)**  
- **WCAG Compliance**: AAA level onde possível
- **Reading Level**: Ensino fundamental completo
- **Plain Language Score**: ≥ 80/100
- **Structure Compliance**: 100% hierarquia correta

---

## 🚀 Implementação Contínua

### **Pipeline de Validação**
```yaml
# .github/workflows/prompt-validation.yml
name: Prompt Quality Validation

on: [push, pull_request]

jobs:
  validate-prompts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
          
      - name: Install dependencies
        run: |
          pip install openai anthropic pytest
          
      - name: Run Prompt Tests
        run: |
          python -m pytest tests/prompt_validation.py -v
          
      - name: Generate Quality Report
        run: |
          python scripts/generate_quality_report.py
```

### **Continuous Monitoring**
```python
# Monitoramento em produção
class PromptMonitor:
    def __init__(self):
        self.metrics = defaultdict(list)
        
    def log_interaction(self, prompt, response, user_feedback=None):
        """Log de interação para análise posterior"""
        self.metrics['latency'].append(calculate_latency())
        self.metrics['token_usage'].append(count_tokens(prompt + response))
        self.metrics['user_satisfaction'].append(user_feedback)
        
        # Alertas automáticos
        if self.detect_quality_degradation():
            self.send_alert("Prompt quality degradation detected")
```

---

## ✅ Critérios de Aprovação

### **Para Deployment em Produção**
- [ ] **Score ≥ 8.0/10** em todos os testes automatizados
- [ ] **0 falhas** nos testes de compliance regulatório  
- [ ] **Latência < 30s** para 95% das execuções
- [ ] **Validação manual** por especialista do domínio
- [ ] **Aprovação** do time de compliance (setores regulados)

### **Para Uso Corporativo**  
- [ ] **Documentação completa** de comportamento esperado
- [ ] **Fallback strategy** implementada
- [ ] **Logging/audit trail** configurado
- [ ] **Cost monitoring** em operação
- [ ] **User training** para operadores

---

*Este framework garante que todos os prompts documentados atendam aos mais altos padrões de qualidade, segurança e conformidade regulatória exigidos em ambientes corporativos.*

---

**Desenvolvido por Dutt eCommerce Website Design - Especialistas em soluções digitais regulamentadas e conformidade BCB.**