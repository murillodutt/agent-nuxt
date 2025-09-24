# Framework de Validação - Técnicas Avançadas

**Testes Especializados para Prompt Engineering Avançado** | **Versão 1.0** | **Dutt eCommerce Website Design**

---

## 🎯 Objetivo

Este framework especializado valida técnicas avançadas de prompt engineering, garantindo que implementações sofisticadas mantenham qualidade, consistência e performance adequadas para uso corporativo crítico.

---

## 🧪 Categorias de Teste Avançado

### **1. Testes de Raciocínio Estruturado**

#### **Test Suite: Chain of Thought Validation**
```python
import pytest
from advanced_prompt_tester import ChainOfThoughtTester

class TestChainOfThoughtReasoning:
    def setup_method(self):
        self.cot_tester = ChainOfThoughtTester()
        self.financial_scenario = {
            "operation": "International transfer R$ 5M to Panama",
            "client_profile": "Small import company, R$ 2M annual revenue",
            "expected_reasoning_steps": [
                "analyze_operation_context",
                "assess_client_profile_compatibility", 
                "evaluate_destination_risk",
                "apply_bcb_regulations",
                "calculate_risk_score",
                "formulate_recommendation"
            ]
        }
    
    def test_reasoning_completeness(self):
        """Valida se todas as etapas de raciocínio são seguidas"""
        cot_prompt = """
        Você é um analista BCB. Use raciocínio passo-a-passo:
        
        1. ANÁLISE DO CONTEXTO: Examine a operação
        2. PERFIL DO CLIENTE: Avalie compatibilidade  
        3. RISCO DE DESTINO: Classifique jurisdição
        4. APLICAÇÃO NORMATIVA: Cite regulamentações BCB
        5. SCORE DE RISCO: Calcule numericamente
        6. RECOMENDAÇÃO: Formule ação específica
        
        OPERAÇÃO: {operation}
        CLIENTE: {client_profile}
        """.format(**self.financial_scenario)
        
        response = self.cot_tester.query(cot_prompt)
        
        # Verificar presença de todas as etapas  
        for step in self.financial_scenario["expected_reasoning_steps"]:
            step_indicators = self.get_step_indicators(step)
            assert any(indicator in response.lower() for indicator in step_indicators), \
                f"Missing reasoning step: {step}"
    
    def test_logical_flow_consistency(self):
        """Testa consistência lógica entre etapas de raciocínio"""
        responses = []
        for i in range(5):
            response = self.cot_tester.query(self.get_standard_cot_prompt())
            responses.append(self.extract_reasoning_chain(response))
        
        # Verificar consistência de ordem lógica
        for i in range(1, len(responses)):
            consistency_score = self.calculate_logical_consistency(responses[0], responses[i])
            assert consistency_score > 0.85, f"Logical inconsistency detected: {consistency_score}"
    
    def test_reasoning_depth_quality(self):
        """Avalia profundidade e qualidade do raciocínio"""
        shallow_prompt = "Analise esta operação de R$ 5M para Panama"
        deep_cot_prompt = """
        Como especialista BCB, aplique metodologia de análise estruturada:
        
        PASSO 1 - CONTEXTUALIZAÇÃO:
        - Valor vs perfil histórico do cliente
        - Compatibilidade com atividade econômica
        - Frequência vs padrão operacional
        
        PASSO 2 - AVALIAÇÃO JURISDICIONAL:
        - Status do país de destino (FATF, paraísos fiscais)
        - Acordos internacionais Brasil-destino  
        - Precedentes regulatórios
        
        PASSO 3 - CONFORMIDADE NORMATIVA:
        - Circular 3.542/2014 aplicabilidade
        - Thresholds regulamentários
        - Requisitos documentais
        
        OPERAÇÃO: R$ 5M para Panama, empresa importação R$ 2M/ano
        """
        
        shallow_response = self.cot_tester.query(shallow_prompt)
        deep_response = self.cot_tester.query(deep_cot_prompt)
        
        shallow_depth = self.measure_reasoning_depth(shallow_response)
        deep_depth = self.measure_reasoning_depth(deep_response)
        
        improvement_ratio = deep_depth / shallow_depth
        assert improvement_ratio > 2.0, f"CoT não melhorou profundidade suficientemente: {improvement_ratio}"
```

#### **Test Suite: XML Tags Structure Validation**
```python
class TestXMLTagsFramework:
    def setup_method(self):
        self.xml_tester = XMLPromptTester()
        self.structured_prompt = """
        <context>
        Você é analista de compliance com expertise BCB
        </context>
        
        <task>
        Analise operação financeira identificando riscos
        </task>
        
        <methodology>
        1. Avaliar valor vs perfil cliente
        2. Classificar risco jurisdicional
        3. Aplicar normas BCB pertinentes
        4. Calcular score risco (0-10)
        5. Recomendar ação específica
        </methodology>
        
        <output_format>
        {
          "risk_analysis": {
            "score": number,
            "classification": "LOW|MEDIUM|HIGH|CRITICAL",
            "reasoning": "step-by-step analysis"
          },
          "compliance_check": {
            "applicable_norms": ["BCB norm numbers"],
            "status": "COMPLIANT|NON_COMPLIANT"
          },
          "recommendation": {
            "action": "APPROVE|INVESTIGATE|BLOCK",
            "justification": "detailed reasoning"
          }
        }
        </output_format>
        
        <input>
        Operação: R$ 3M para Ilhas Cayman
        Cliente: Consultoria jurídica, 5 funcionários
        Justificativa: "Pagamento serviços advocatícios"
        </input>
        """
    
    def test_xml_structure_parsing(self):
        """Valida se estrutura XML é corretamente interpretada"""
        response = self.xml_tester.query(self.structured_prompt)
        
        # Verificar se resposta segue formato especificado
        assert self.is_valid_json(response), "Output deve ser JSON válido"
        
        data = json.loads(response)
        required_sections = ["risk_analysis", "compliance_check", "recommendation"]
        
        for section in required_sections:
            assert section in data, f"Missing required section: {section}"
    
    def test_section_isolation(self):
        """Testa se seções XML mantêm independência conceitual"""
        modified_prompts = [
            self.modify_xml_section("context", "Você é auditor interno"),
            self.modify_xml_section("task", "Realizar due diligence completa"),
            self.modify_xml_section("output_format", "Relatório em português")
        ]
        
        responses = [self.xml_tester.query(prompt) for prompt in modified_prompts]
        
        # Verificar que mudanças em seções específicas afetam apenas comportamentos esperados
        for i, response in enumerate(responses):
            if i == 0:  # Context change
                assert "auditor" in response.lower()
            elif i == 1:  # Task change  
                assert "due diligence" in response.lower()
            elif i == 2:  # Format change
                assert self.is_portuguese_formatted(response)
```

### **2. Testes de Técnicas Multi-Shot**

#### **Test Suite: Few-Shot Learning Validation**
```python
class TestMultiShotPrompting:
    def setup_method(self):
        self.multishot_tester = MultiShotTester()
        
        # Examples for few-shot learning
        self.few_shot_examples = [
            {
                "input": "Cliente PJ, R$ 800K para Uruguai, importação soja",
                "output": {
                    "risk_score": 4,
                    "classification": "MEDIUM",
                    "reasoning": "Valor compatível, destino baixo risco, atividade econômica justificável"
                }
            },
            {
                "input": "Cliente PF, R$ 2M para Suíça, 'investimento pessoal'",
                "output": {
                    "risk_score": 8,
                    "classification": "HIGH", 
                    "reasoning": "Valor elevado para PF, justificativa vaga, requer documentação adicional"
                }
            },
            {
                "input": "Cliente PJ, R$ 50K para EUA, pagamento fornecedor",
                "output": {
                    "risk_score": 2,
                    "classification": "LOW",
                    "reasoning": "Valor baixo, destino seguro, justificativa comercial clara"
                }
            }
        ]
    
    def test_pattern_learning_effectiveness(self):
        """Testa se modelo aprende padrões dos exemplos"""
        few_shot_prompt = self.build_few_shot_prompt(self.few_shot_examples)
        
        test_case = "Cliente PJ, R$ 1.5M para Panama, 'consultoria internacional'"
        
        response = self.multishot_tester.query(few_shot_prompt + f"\nInput: {test_case}\nOutput:")
        
        # Verificar se seguiu padrão dos exemplos
        parsed_response = json.loads(response)
        
        # Deve classificar como HIGH risk (similar ao exemplo 2)
        assert parsed_response["classification"] in ["HIGH", "CRITICAL"], \
            f"Failed to learn risk pattern: {parsed_response['classification']}"
        
        # Deve ter reasoning estruturado similar aos exemplos
        reasoning = parsed_response["reasoning"].lower()
        risk_indicators = ["panama", "consultoria", "vaga", "alto risco"]
        matched_indicators = sum(1 for indicator in risk_indicators if indicator in reasoning)
        assert matched_indicators >= 2, "Reasoning não identificou suficientes indicadores de risco"
    
    def test_few_shot_vs_zero_shot_performance(self):
        """Compara performance few-shot vs zero-shot"""
        test_cases = [
            "Cliente PF, R$ 5M para Ilhas Virgens, sem justificativa",
            "Cliente PJ, R$ 300K para Alemanha, importação equipamentos",
            "Cliente PJ, R$ 10M para Cayman, 'reestruturação societária'"
        ]
        
        zero_shot_results = []
        few_shot_results = []
        
        for case in test_cases:
            # Zero-shot
            zero_prompt = f"Classifique o risco desta operação: {case}"
            zero_response = self.multishot_tester.query(zero_prompt)
            zero_shot_results.append(self.extract_risk_classification(zero_response))
            
            # Few-shot  
            few_prompt = self.build_few_shot_prompt(self.few_shot_examples) + f"\nInput: {case}\nOutput:"
            few_response = self.multishot_tester.query(few_prompt)
            few_shot_results.append(self.extract_risk_classification(few_response))
        
        # Calcular accuracy vs ground truth
        ground_truth = ["CRITICAL", "LOW", "CRITICAL"]
        
        zero_accuracy = sum(1 for i, result in enumerate(zero_shot_results) 
                           if result == ground_truth[i]) / len(ground_truth)
        few_accuracy = sum(1 for i, result in enumerate(few_shot_results)
                          if result == ground_truth[i]) / len(ground_truth)
        
        improvement = few_accuracy - zero_accuracy
        assert improvement > 0.2, f"Few-shot deve melhorar accuracy em >20%: {improvement}"
```

### **3. Testes de Prompt Chaining**

#### **Test Suite: Prompt Chain Validation**
```python
class TestPromptChaining:
    def setup_method(self):
        self.chaining_tester = PromptChainTester()
        
        # Define chain steps for complex compliance analysis
        self.compliance_chain = [
            {
                "step": "data_extraction",
                "prompt": """
                Extraia dados estruturados desta operação:
                {operation_description}
                
                Retorne JSON:
                {
                  "amount": number,
                  "currency": "string",
                  "origin": "string", 
                  "destination": "string",
                  "client_type": "PF|PJ",
                  "stated_purpose": "string"
                }
                """,
                "output_key": "extracted_data"
            },
            {
                "step": "risk_assessment",
                "prompt": """
                Com base nestes dados: {extracted_data}
                
                Avalie risco usando metodologia BCB:
                1. Score valor vs perfil (0-10)
                2. Score destino (0-10)  
                3. Score justificativa (0-10)
                4. Score geral ponderado
                
                JSON:
                {
                  "value_risk": number,
                  "destination_risk": number,
                  "purpose_risk": number,
                  "overall_risk": number,
                  "classification": "LOW|MEDIUM|HIGH|CRITICAL"
                }
                """,
                "output_key": "risk_assessment"
            },
            {
                "step": "regulatory_check",
                "prompt": """
                Dados: {extracted_data}
                Risco: {risk_assessment}
                
                Identifique normas BCB aplicáveis:
                - Circular 3.542/2014 (AML)
                - Lei 9.613/1998 (crimes financeiros)
                - Outras normas pertinentes
                
                Para cada norma, indique:
                - Aplicabilidade (SIM/NÃO)
                - Artigo específico
                - Status conformidade
                
                JSON: {
                  "applicable_norms": [
                    {
                      "norm": "string",
                      "article": "string", 
                      "applies": boolean,
                      "compliance_status": "COMPLIANT|NON_COMPLIANT|REQUIRES_REVIEW"
                    }
                  ]
                }
                """,
                "output_key": "regulatory_check"
            },
            {
                "step": "final_recommendation",
                "prompt": """
                Síntese da análise:
                Dados: {extracted_data}
                Risco: {risk_assessment} 
                Regulatório: {regulatory_check}
                
                Forneça recomendação final:
                
                JSON: {
                  "recommendation": "APPROVE|INVESTIGATE|BLOCK",
                  "confidence": 0.95,
                  "justification": "reasoning completo",
                  "required_actions": ["lista de ações"],
                  "timeline": "prazo em horas"
                }
                """,
                "output_key": "final_recommendation"
            }
        ]
    
    def test_chain_execution_integrity(self):
        """Valida integridade de execução da cadeia completa"""
        test_operation = """
        Operação: Transferência de R$ 8.5 milhões da Mineradora ABC Ltda 
        (CNPJ 12.345.678/0001-90) para conta no Banco Safra Cayman Ltd, 
        Ilhas Cayman, com justificativa de 'reestruturação de investimentos 
        no exterior para otimização fiscal'.
        """
        
        chain_results = self.chaining_tester.execute_chain(
            self.compliance_chain, 
            {"operation_description": test_operation}
        )
        
        # Verificar que todos os steps foram executados
        expected_keys = ["extracted_data", "risk_assessment", "regulatory_check", "final_recommendation"]
        for key in expected_keys:
            assert key in chain_results, f"Chain missing output: {key}"
        
        # Verificar consistência entre steps
        extracted_amount = chain_results["extracted_data"]["amount"]
        assert extracted_amount == 8500000, "Data extraction falhou"
        
        risk_class = chain_results["risk_assessment"]["classification"]
        final_rec = chain_results["final_recommendation"]["recommendation"]
        
        # High-value + Cayman deve resultar em HIGH/CRITICAL risk
        assert risk_class in ["HIGH", "CRITICAL"], f"Risk classification inadequada: {risk_class}"
        
        # HIGH/CRITICAL risk deve resultar em INVESTIGATE ou BLOCK
        assert final_rec in ["INVESTIGATE", "BLOCK"], f"Recomendação inconsistente com risco: {final_rec}"
    
    def test_chain_error_handling(self):
        """Testa robustez da cadeia com dados incompletos/incorretos"""
        incomplete_operation = "Transferência de valor não especificado para destino não informado"
        
        try:
            chain_results = self.chaining_tester.execute_chain(
                self.compliance_chain,
                {"operation_description": incomplete_operation}
            )
            
            # Deve identificar dados insuficientes
            if "extracted_data" in chain_results:
                extracted = chain_results["extracted_data"]
                # Campos críticos devem estar null ou conter indicators de dados insuficientes
                assert extracted.get("amount") is None or extracted.get("amount") == 0
                
            if "final_recommendation" in chain_results:
                final_rec = chain_results["final_recommendation"]
                assert "dados insuficientes" in final_rec.get("justification", "").lower()
                
        except Exception as e:
            # Exception handling é aceitável para dados extremamente incompletos
            assert "insufficient data" in str(e).lower() or "dados insuficientes" in str(e).lower()
```

---

## 🎯 Métricas de Performance Avançada

### **Complexity Scoring**
```python
def calculate_technique_complexity_score(response, technique_type):
    """Calcula score de complexidade técnica implementada"""
    
    complexity_indicators = {
        "chain_of_thought": [
            "passo", "etapa", "primeiro", "segundo", "portanto", "consequentemente",
            "dado que", "considerando", "baseado em", "analisando"
        ],
        "xml_tags": [
            "<", ">", "context", "task", "methodology", "output", "input",
            "structured", "format", "section"
        ],
        "few_shot": [
            "exemplo", "similar", "padrão", "baseado nos casos", "seguindo o formato",
            "como mostrado", "conforme demonstrado"
        ],
        "prompt_chaining": [
            "baseado na análise anterior", "considerando o resultado", "integrando",
            "síntese", "compilando", "resultado anterior"
        ]
    }
    
    if technique_type not in complexity_indicators:
        return 0
    
    indicators = complexity_indicators[technique_type]
    response_lower = response.lower()
    
    matched_indicators = sum(1 for indicator in indicators if indicator in response_lower)
    complexity_score = min(matched_indicators / len(indicators), 1.0)
    
    return complexity_score

def measure_reasoning_depth(response):
    """Mede profundidade de raciocínio na resposta"""
    depth_indicators = {
        "causal_reasoning": ["porque", "devido a", "resulta em", "causa", "efeito"],
        "comparative_analysis": ["comparado", "versus", "diferente de", "similar", "maior que"],
        "conditional_logic": ["se", "então", "caso", "quando", "conforme"],
        "quantitative_analysis": ["score", "percentual", "probabilidade", "métrica", "KPI"],
        "regulatory_citation": ["circular", "resolução", "lei", "norma", "artigo"]
    }
    
    total_depth = 0
    response_lower = response.lower()
    
    for category, indicators in depth_indicators.items():
        category_matches = sum(1 for indicator in indicators if indicator in response_lower)
        category_score = min(category_matches / len(indicators), 1.0)
        total_depth += category_score
    
    return total_depth / len(depth_indicators)  # Normalize 0-1
```

### **Advanced Quality Metrics**
```python
class AdvancedQualityMetrics:
    def __init__(self):
        self.quality_dimensions = {
            "reasoning_coherence": self.measure_reasoning_coherence,
            "technical_accuracy": self.measure_technical_accuracy,
            "contextual_awareness": self.measure_contextual_awareness,
            "structured_thinking": self.measure_structured_thinking,
            "domain_expertise": self.measure_domain_expertise
        }
    
    def comprehensive_quality_assessment(self, prompt, response, expected_behavior):
        """Avaliação abrangente de qualidade para técnicas avançadas"""
        results = {}
        
        for dimension, measure_func in self.quality_dimensions.items():
            score = measure_func(prompt, response, expected_behavior)
            results[dimension] = {
                "score": score,
                "interpretation": self.interpret_score(dimension, score),
                "improvement_suggestions": self.suggest_improvements(dimension, score)
            }
        
        overall_score = sum(result["score"] for result in results.values()) / len(results)
        
        return {
            "overall_quality_score": overall_score,
            "dimension_scores": results,
            "readiness_level": self.determine_readiness_level(overall_score),
            "certification_status": "APPROVED" if overall_score >= 0.85 else "NEEDS_IMPROVEMENT"
        }
    
    def measure_reasoning_coherence(self, prompt, response, expected_behavior):
        """Mede coerência lógica do raciocínio"""
        # Implementar análise de flow lógico
        logical_connectors = ["portanto", "assim", "consequentemente", "dado que"]
        connector_usage = sum(1 for conn in logical_connectors if conn in response.lower())
        
        # Verificar sequência lógica de argumentos
        logical_sequence_score = self.analyze_logical_sequence(response)
        
        # Verificar consistência interna
        consistency_score = self.check_internal_consistency(response)
        
        return (connector_usage / 10 + logical_sequence_score + consistency_score) / 3
    
    def measure_domain_expertise(self, prompt, response, expected_behavior):
        """Avalia demonstração de expertise específica do domínio"""
        domain_indicators = {
            "financial_compliance": ["bcb", "circular", "coaf", "rif", "aml", "pld"],
            "ecommerce": ["conversão", "seo", "ctr", "roas", "ltv", "cac"],
            "institutional": ["wcag", "lai", "acessibilidade", "linguagem cidadã"]
        }
        
        # Detectar domínio
        domain = self.detect_domain(prompt.lower())
        if not domain:
            return 0.5  # Neutral score for general prompts
        
        relevant_indicators = domain_indicators.get(domain, [])
        response_lower = response.lower()
        
        expertise_mentions = sum(1 for indicator in relevant_indicators 
                               if indicator in response_lower)
        
        expertise_score = min(expertise_mentions / len(relevant_indicators), 1.0)
        
        # Bonus for specific citations (normas, studies, etc.)
        citation_bonus = 0.2 if self.has_specific_citations(response) else 0
        
        return min(expertise_score + citation_bonus, 1.0)
```

---

## 🚀 Benchmarking Suite

### **Performance Benchmarks**
```python
class AdvancedTechniqueBenchmark:
    def __init__(self):
        self.benchmark_suite = {
            "chain_of_thought": {
                "simple_analysis": {"target_reasoning_steps": 4, "max_time_seconds": 15},
                "complex_analysis": {"target_reasoning_steps": 8, "max_time_seconds": 45},
                "multi_domain": {"target_reasoning_steps": 12, "max_time_seconds": 90}
            },
            "xml_structured": {
                "basic_structure": {"required_sections": 4, "max_parsing_errors": 0},
                "complex_nested": {"required_sections": 8, "max_parsing_errors": 1}, 
                "dynamic_adaptation": {"section_flexibility": 0.8, "format_compliance": 0.95}
            },
            "multishot_learning": {
                "few_shot_3_examples": {"min_accuracy_improvement": 0.25, "consistency_score": 0.85},
                "many_shot_10_examples": {"min_accuracy_improvement": 0.45, "pattern_recognition": 0.90},
                "domain_transfer": {"cross_domain_accuracy": 0.70, "adaptation_speed": 0.80}
            }
        }
    
    def run_comprehensive_benchmark(self, test_scenarios):
        """Executa benchmark completo de todas as técnicas avançadas"""
        results = {}
        
        for technique, benchmarks in self.benchmark_suite.items():
            technique_results = {}
            
            for benchmark_name, targets in benchmarks.items():
                scenarios = test_scenarios.get(technique, {}).get(benchmark_name, [])
                if not scenarios:
                    continue
                
                benchmark_scores = []
                for scenario in scenarios:
                    score = self.execute_benchmark_scenario(technique, scenario, targets)
                    benchmark_scores.append(score)
                
                technique_results[benchmark_name] = {
                    "average_score": sum(benchmark_scores) / len(benchmark_scores),
                    "individual_scores": benchmark_scores,
                    "pass_rate": sum(1 for s in benchmark_scores if s >= 0.8) / len(benchmark_scores),
                    "targets_met": self.check_targets_met(benchmark_scores, targets)
                }
            
            results[technique] = technique_results
        
        return self.generate_benchmark_report(results)
```

---

## ✅ Critérios de Aprovação

### **Para Técnicas Avançadas**
- [ ] **Complexity Score ≥ 0.80** - Implementação sofisticada demonstrada
- [ ] **Reasoning Depth ≥ 0.85** - Análise multi-layered consistente
- [ ] **Chain Integrity = 100%** - Prompt chains executam sem falhas
- [ ] **XML Structure Compliance ≥ 95%** - Parsing e interpretação corretos
- [ ] **Multi-shot Learning Improvement ≥ 30%** - Melhoria significativa vs baseline

### **Para Uso Corporativo Crítico**
- [ ] **Domain Expertise Score ≥ 0.90** - Conhecimento especializado demonstrado
- [ ] **Regulatory Accuracy = 100%** - Zero erros em citações normativas
- [ ] **Performance Consistency ≥ 85%** - Resultados estáveis entre execuções
- [ ] **Integration Compatibility = 100%** - Funciona com sistemas existentes

---

**Este framework garante que técnicas avançadas mantenham o mesmo rigor e confiabilidade das técnicas fundamentais, permitindo implementação segura em ambientes corporativos críticos.**

---

**Desenvolvido por Dutt eCommerce Website Design - Validação de IA avançada para aplicações corporativas mission-critical.**