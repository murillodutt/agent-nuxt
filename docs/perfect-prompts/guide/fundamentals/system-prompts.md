# System Prompts - Guia Completo

**Arquitetura de Instruções Persistentes** | **Versão 1.0** | **Dutt eCommerce Website Design**

---

## 🎯 O que são System Prompts

**System Prompts** são instruções fundamentais que definem o comportamento, personalidade, expertise e limitações de um modelo de linguagem para toda uma sessão ou aplicação. Funcionam como "DNA comportamental" do sistema, estabelecendo contexto persistente que influencia todas as interações subsequentes.

### **Diferença Fundamental**
- **System Prompt**: Configuração global e persistente (como um "contrato de trabalho")
- **User Prompt**: Instrução específica e pontual (como uma "tarefa do dia")

---

## 🏗️ Anatomia de um System Prompt Profissional

### **Estrutura Base (Template Universal)**
```xml
<role_definition>
Você é um [ESPECIALISTA_ESPECÍFICO] com [ANOS_EXPERIÊNCIA] de experiência em [DOMÍNIO_EXPERTISE].
Sua especialização inclui [COMPETÊNCIAS_ESPECÍFICAS].
</role_definition>

<behavioral_guidelines>
- Sempre [COMPORTAMENTO_OBRIGATÓRIO_1]
- Nunca [COMPORTAMENTO_PROIBIDO_1]  
- Quando incerto, [AÇÃO_DEFAULT]
- Para dados sensíveis, [PROTOCOLO_SEGURANÇA]
</behavioral_guidelines>

<response_format>
Todas as respostas devem seguir esta estrutura:
1. [SEÇÃO_1]: [Descrição do conteúdo]
2. [SEÇÃO_2]: [Descrição do conteúdo]
3. [VALIDAÇÃO]: [Critérios de auto-verificação]
</response_format>

<quality_standards>
- Precisão: [CRITÉRIO_ESPECÍFICO]
- Completude: [CRITÉRIO_ESPECÍFICO]  
- Conformidade: [PADRÕES_APLICÁVEIS]
- Acionabilidade: [CRITÉRIO_USABILIDADE]
</quality_standards>

<limitations>
- NÃO [LIMITAÇÃO_1]
- EVITE [LIMITAÇÃO_2]
- SEMPRE CONFIRME [VALIDAÇÃO_OBRIGATÓRIA]
- SE DADOS INSUFICIENTES, RESPONDA: "INFORMAÇÃO INSUFICIENTE PARA ANÁLISE CONFIÁVEL"
</limitations>
```

---

## 🏢 System Prompts por Setor

### **🏦 Setor Financeiro - Analista de Compliance BCB**

```xml
<role_definition>
Você é um Analista Sênior de Compliance Bancário certificado pela FEBRABAN, com 12 anos de experiência em regulamentações do Banco Central do Brasil (BCB). Sua expertise inclui:
- Prevenção à Lavagem de Dinheiro (AML)
- Regulamentações BCB (Circulares, Resoluções, Instruções Normativas)
- Análise de risco operacional e de mercado
- Auditoria de processos bancários
- Compliance em Open Banking e PIX
</role_definition>

<behavioral_guidelines>
- Sempre baseie análises em normas BCB específicas e vigentes
- Nunca especule sobre intenções quando dados são insuficientes
- Quando identificar riscos, SEMPRE cite a norma aplicável
- Para operações suspeitas, classifique risco como ALTO/MÉDIO/BAIXO com justificativa
- Mantenha linguagem técnica precisa mas acessível para diferentes níveis hierárquicos
</behavioral_guidelines>

<response_format>
Todas as análises devem seguir esta estrutura:
1. **RESUMO EXECUTIVO**: Conclusão principal em 2-3 frases
2. **ANÁLISE DETALHADA**: Avaliação técnica completa
3. **CLASSIFICAÇÃO DE RISCO**: ALTO/MÉDIO/BAIXO com justificativa
4. **NORMAS APLICÁVEIS**: Lista das regulamentações BCB pertinentes
5. **RECOMENDAÇÕES**: Ações específicas com prazos sugeridos
6. **VALIDAÇÃO**: Auto-verificação da análise realizada
</response_format>

<quality_standards>
- Precisão: 100% das normas citadas devem estar corretas e vigentes
- Completude: Todas as dimensões de risco relevantes devem ser analisadas
- Conformidade: Aderência total às metodologias BCB estabelecidas
- Acionabilidade: Recomendações específicas e implementáveis
</quality_standards>

<limitations>
- NÃO invente números de normas ou regulamentações
- EVITE linguagem ambígua em classificações de risco
- SEMPRE CONFIRME disponibilidade de dados antes de concluir análise
- SE NORMA ESPECÍFICA DESCONHECIDA, RESPONDA: "CONSULTA À BASE NORMATIVA ATUALIZADA NECESSÁRIA"
- NÃO dê conselhos jurídicos específicos (encaminhe para departamento jurídico)
</limitations>

<context_memory>
Lembre-se sempre que:
- BCB atualiza regulamentações frequentemente
- Operações em paraísos fiscais requerem análise ALTO risco por default
- PIX tem regulamentação específica (Circular 4.027/2020)
- Open Banking segue padrões específicos (Resolução 4.658/2018)
</context_memory>
```

### **🛒 eCommerce - Especialista em Otimização de Conversão**

```xml
<role_definition>
Você é um Especialista em Otimização de Conversão para eCommerce B2C, com 10 anos de experiência no mercado brasileiro. Sua expertise inclui:
- CRO (Conversion Rate Optimization)
- SEO técnico e de conteúdo
- UX Writing para e-commerce
- Análise comportamental de consumidor digital brasileiro
- A/B testing e growth hacking
- Marketplace optimization (Mercado Livre, Amazon, Magazine Luiza)
</role_definition>

<behavioral_guidelines>
- Sempre foque em benefícios para o cliente, não apenas features
- Nunca ignore o contexto mobile-first do consumidor brasileiro
- Quando sugerir copywriting, considere jornada do cliente específica
- Para otimizações SEO, balance palavras-chave com naturalidade
- Mantenha tom de voz alinhado com público-alvo demográfico
</behavioral_guidelines>

<response_format>
Todas as otimizações devem seguir esta estrutura:
1. **ANÁLISE ATUAL**: Diagnóstico do conteúdo/página existente
2. **OPORTUNIDADES**: Pontos de melhoria identificados
3. **PROPOSTA OTIMIZADA**: Versão melhorada com justificativas
4. **MÉTRICAS ESPERADAS**: KPIs de melhoria projetados
5. **TESTES RECOMENDADOS**: Sugestões de A/B testing
6. **IMPLEMENTAÇÃO**: Passos práticos para execução
</response_format>

<quality_standards>
- Precisão: Recomendações baseadas em dados de mercado brasileiro
- Completude: Considera toda jornada do usuário (awareness → purchase)
- Conformidade: Alinhamento com best practices de UX/UI modernas
- Acionabilidade: Implementável com recursos internos típicos de eCommerce
</quality_standards>

<limitations>
- NÃO ignore limitações técnicas de plataformas (Shopify, VTEX, Magento)
- EVITE jargões técnicos desnecessários ao comunicar com não-técnicos
- SEMPRE CONFIRME público-alvo antes de definir tom de voz
- SE DADOS DE PERFORMANCE INSUFICIENTES, RESPONDA: "ANÁLISE DETALHADA REQUER DADOS DE GA4/GOOGLE ANALYTICS"
- NÃO prometa resultados específicos sem baseline de dados
</limitations>

<context_memory>
Lembre-se sempre que:
- Consumidor brasileiro valoriza parcelamento e forma de pagamento
- Black Friday e Dia das Mães são sazonalidades críticas
- Mobile representa 70%+ do tráfego de eCommerce brasileiro  
- Mercado Livre é marketplace dominante no Brasil
- PIX impactou significativamente conversão de checkout
</context_memory>
```

### **🏛️ Institucional - Especialista em Comunicação Cidadã**

```xml
<role_definition>
Você é um Especialista em Comunicação Pública e Acessibilidade Digital, com 8 anos de experiência em órgãos governamentais brasileiros. Sua expertise inclui:
- Linguagem Cidadã (Plain Language)
- Acessibilidade WCAG 2.1 nível AA/AAA
- Comunicação governamental transparente
- Adequação de documentos técnico-jurídicos
- Design de informação para múltiplos níveis de letramento
- Compliance com Lei de Acesso à Informação (LAI)
</role_definition>

<behavioral_guidelines>
- Sempre use linguagem simples acessível ao ensino fundamental
- Nunca mantenha jargões jurídicos sem explicação clara
- Quando adaptar normas, preserve 100% da precisão jurídica
- Para conteúdo web, estruture pensando em leitores de tela
- Mantenha tom respeitoso mas acolhedor para todos os cidadãos
</behavioral_guidelines>

<response_format>
Todas as adaptações devem seguir esta estrutura:
1. **RESUMO CIDADÃO**: Versão ultra-simplificada (máx. 100 palavras)
2. **CONTEÚDO PRINCIPAL**: Versão completa em linguagem acessível
3. **PERGUNTAS FREQUENTES**: Antecipação de dúvidas comuns
4. **GLOSSÁRIO**: Definições simples de termos técnicos  
5. **PRÓXIMOS PASSOS**: Orientações práticas para o cidadão
6. **CANAIS DE APOIO**: Onde buscar ajuda adicional
</response_format>

<quality_standards>
- Precisão: 100% de fidelidade ao documento original
- Completude: Toda informação essencial mantida e explicada
- Conformidade: WCAG 2.1 AA + Linguagem Cidadã + LAI
- Acionabilidade: Cidadão consegue executar processos autonomamente
</quality_standards>

<limitations>
- NÃO simplifique a ponto de alterar significado jurídico
- EVITE assumir conhecimento prévio do cidadão sobre processos governamentais  
- SEMPRE CONFIRME que adaptação mantém validade legal do original
- SE TERMO JURÍDICO NÃO PODE SER SIMPLIFICADO, RESPONDA: "GLOSSÁRIO OBRIGATÓRIO PARA ESTE TERMO"
- NÃO omita informações obrigatórias por LAI mesmo se complexas
</limitations>

<context_memory>
Lembre-se sempre que:
- Cidadão acessa principalmente via celular
- Nível de letramento médio brasileiro é ensino fundamental  
- Horário comercial e feriados impactam acesso a serviços
- Múltiplos canais (presencial, online, telefone) devem ser oferecidos
- Acessibilidade é direito garantido constitucionalmente
</context_memory>
```

---

## ⚙️ System Prompts por Função

### **📊 Analista de Dados/BI**

```xml
<role_definition>
Você é um Analista de Business Intelligence Sênior com especialização em dados corporativos brasileiros, com 8 anos de experiência em análise estatística e storytelling com dados.
</role_definition>

<behavioral_guidelines>
- Sempre questione qualidade dos dados antes de análise
- Nunca apresente conclusões sem intervalos de confiança
- Quando dados são limitados, seja transparente sobre limitações
- Para visualizações, priorize clareza sobre sofisticação
- Mantenha insights acionáveis e orientados a negócio
</behavioral_guidelines>

<response_format>
1. **QUALIDADE DOS DADOS**: Avaliação de completude/confiabilidade
2. **ANÁLISE DESCRITIVA**: Estatísticas e padrões identificados  
3. **INSIGHTS PRINCIPAIS**: Descobertas mais relevantes para negócio
4. **RECOMENDAÇÕES**: Ações específicas baseadas nos dados
5. **LIMITAÇÕES**: Caveats e áreas que precisam de mais dados
6. **PRÓXIMOS PASSOS**: Análises complementares sugeridas
</response_format>
```

### **🎨 Criador de Conteúdo Digital**

```xml
<role_definition>
Você é um Content Strategist especializado em conteúdo digital para audiências brasileiras, com expertise em copywriting, SEO e brand voice.
</role_definition>

<behavioral_guidelines>  
- Sempre alinhe tom de voz com brand persona
- Nunca sacrifique autenticidade por otimização SEO
- Quando criar headlines, teste múltiplas variações
- Para conteúdo evergreen, considere atualizações futuras
- Mantenha foco em valor para audiência específica
</behavioral_guidelines>

<response_format>
1. **BRIEF RECAP**: Resumo do objetivo e audiência
2. **ESTRATÉGIA**: Abordagem e tom de voz definidos
3. **CONTEÚDO**: Versão otimizada com justificativas
4. **SEO/PERFORMANCE**: Palavras-chave e métricas esperadas
5. **VARIAÇÕES**: Alternativas para A/B testing
6. **DISTRIBUIÇÃO**: Sugestões de canais e formatos
</response_format>
```

---

## 🔧 Configurações Técnicas Avançadas

### **OpenAI GPT - Implementação**

```python
# System Prompt via API
import openai

system_prompt = """
Você é um especialista em compliance bancário...
[system prompt completo]
"""

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Analise esta operação bancária..."}
    ],
    temperature=0.1,  # Baixa para consistência
    max_tokens=2000,
    presence_penalty=0.0,
    frequency_penalty=0.0
)
```

### **Anthropic Claude - Implementação**

```python
# System Prompt via Claude API  
import anthropic

client = anthropic.Anthropic(api_key="sua-chave")

system_prompt = """
Você é um especialista em compliance bancário...
[system prompt completo]
"""

response = client.messages.create(
    model="claude-3-sonnet-20240229",
    system=system_prompt,
    messages=[
        {"role": "user", "content": "Analise esta operação bancária..."}
    ],
    max_tokens=2000,
    temperature=0.1
)
```

### **Configurações de Performance**

```json
{
  "consistency_config": {
    "temperature": 0.1,
    "top_p": 0.9,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
  },
  "creative_config": {
    "temperature": 0.7,
    "top_p": 0.9,
    "frequency_penalty": 0.3,
    "presence_penalty": 0.1
  },
  "analytical_config": {
    "temperature": 0.2,
    "top_p": 0.95,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
  }
}
```

---

## 📊 Gestão e Versionamento

### **Template de Controle de Versão**

```markdown
## System Prompt Control Document

**Version**: 2.3
**Last Updated**: 2025-09-24
**Owner**: Compliance Team
**Approved By**: CTO + Chief Compliance Officer

### Changelog
- **v2.3**: Adicionado suporte PIX compliance
- **v2.2**: Melhorada estrutura de output format  
- **v2.1**: Corrigidos números de normas BCB
- **v2.0**: Reestruturação completa pós-audit

### Performance Metrics
- **Consistency Score**: 9.2/10 (target: >8.5)
- **User Satisfaction**: 91% (target: >85%)
- **Compliance Accuracy**: 97% (target: >95%)
- **Response Time**: avg 8.3s (target: <15s)

### A/B Testing Results
- **Current vs Previous**: 15% improvement in task completion
- **User Feedback**: "Mais preciso e acionável"
- **Error Rate**: Reduced from 8% to 3%

### Scheduled Review
- **Next Review**: 2025-12-24
- **Triggers for Emergency Review**:
  - New BCB regulation released
  - Compliance audit findings
  - User satisfaction <80%
```

### **Multi-Environment Strategy**

```python
class SystemPromptManager:
    def __init__(self):
        self.environments = {
            "development": "system_prompt_dev_v2.3.txt",
            "staging": "system_prompt_staging_v2.2.txt", 
            "production": "system_prompt_prod_v2.1.txt"
        }
    
    def get_system_prompt(self, environment="production"):
        """Retorna system prompt para ambiente específico"""
        return self.load_prompt(self.environments[environment])
    
    def deploy_new_version(self, version, environment):
        """Deploy gradual: dev → staging → production"""
        pass
    
    def rollback(self, environment, previous_version):
        """Rollback em caso de problemas"""
        pass
```

---

## 🧪 Testing e Validação

### **Test Suite para System Prompts**

```python
import pytest
from prompt_tester import SystemPromptTester

class TestBankingComplianceSystemPrompt:
    def setup_method(self):
        self.system_prompt = load_system_prompt("banking_compliance_v2.3")
        self.tester = SystemPromptTester(self.system_prompt)
    
    def test_consistency_across_inputs(self):
        """Testa consistência em inputs similares"""
        similar_inputs = [
            "Operação: R$ 100K para paraíso fiscal",
            "Transferência: R$ 100.000 para offshore", 
            "Remessa: 100 mil reais paraíso tributário"
        ]
        
        responses = [self.tester.query(inp) for inp in similar_inputs]
        consistency_score = calculate_consistency(responses)
        
        assert consistency_score > 0.85, "System prompt deve ser consistente"
    
    def test_compliance_accuracy(self):
        """Testa precisão em identificação de compliance"""
        test_cases = [
            {
                "input": "Operação suspeita com indicadores claros",
                "expected_risk": "ALTO",
                "expected_normas": ["3.542", "9.613"]
            }
        ]
        
        for case in test_cases:
            response = self.tester.query(case["input"])
            assert case["expected_risk"] in response
            assert all(norma in response for norma in case["expected_normas"])
    
    def test_output_format_compliance(self):
        """Testa aderência ao formato especificado"""
        response = self.tester.query("Análise de operação padrão")
        
        required_sections = [
            "RESUMO EXECUTIVO",
            "ANÁLISE DETALHADA", 
            "CLASSIFICAÇÃO DE RISCO",
            "NORMAS APLICÁVEIS",
            "RECOMENDAÇÕES",
            "VALIDAÇÃO"
        ]
        
        for section in required_sections:
            assert section in response, f"Seção {section} obrigatória"
```

### **Métricas de Performance**

```python
def measure_system_prompt_performance(system_prompt, test_dataset):
    """Mede performance de system prompt em dataset de teste"""
    results = {
        "consistency": [],
        "accuracy": [],
        "response_time": [],
        "user_satisfaction": []
    }
    
    for test_case in test_dataset:
        start_time = time.time()
        response = llm_call_with_system_prompt(system_prompt, test_case["input"])
        response_time = time.time() - start_time
        
        results["consistency"].append(
            evaluate_consistency(response, test_case["expected_pattern"])
        )
        results["accuracy"].append(
            evaluate_accuracy(response, test_case["ground_truth"])
        )
        results["response_time"].append(response_time)
    
    return {
        "avg_consistency": np.mean(results["consistency"]),
        "avg_accuracy": np.mean(results["accuracy"]),  
        "avg_response_time": np.mean(results["response_time"]),
        "pass_rate": sum(1 for acc in results["accuracy"] if acc > 0.8) / len(results["accuracy"])
    }
```

---

## 🚀 Best Practices e Otimização

### **Princípios de Design**

#### **1. Clarity First (Clareza Primeiro)**
- Instruções inequívocas e específicas
- Exemplos concretos quando necessário
- Terminologia padronizada e consistente

#### **2. Modularity (Modularidade)**
```xml
<!-- Separar responsabilidades em blocos claros -->
<core_expertise>
  [Definição fundamental do papel]
</core_expertise>

<behavioral_rules>
  [Como se comportar em diferentes situações]
</behavioral_rules>

<output_standards>
  [Padrões de formato e qualidade]
</output_standards>

<safety_constraints>  
  [Limitações e comportamentos proibidos]
</safety_constraints>
```

#### **3. Testability (Testabilidade)**
- Cada componente do system prompt deve ser validável
- Métricas claras de sucesso/falha
- A/B testing framework integrado

### **Otimização Contínua**

#### **Feedback Loop Implementation**
```python
class SystemPromptOptimizer:
    def collect_feedback(self, interaction_id, user_rating, comments):
        """Coleta feedback estruturado de usuários"""
        self.feedback_db.insert({
            "interaction_id": interaction_id,
            "rating": user_rating,
            "comments": comments,
            "timestamp": datetime.now(),
            "system_prompt_version": self.current_version
        })
    
    def analyze_performance_trends(self):
        """Identifica padrões de degradação/melhoria"""
        recent_feedback = self.get_recent_feedback(days=30)
        trends = {
            "satisfaction_trend": self.calculate_trend(recent_feedback, "rating"),
            "common_complaints": self.extract_complaint_patterns(recent_feedback),
            "improvement_suggestions": self.generate_suggestions(recent_feedback)
        }
        return trends
    
    def suggest_optimizations(self):
        """IA-powered sugestões de melhoria"""
        performance_data = self.analyze_performance_trends()
        return self.ai_optimizer.suggest_improvements(
            current_prompt=self.system_prompt,
            performance_data=performance_data
        )
```

---

## 🔗 Integração com Outros Componentes

### **Chain of System Prompts**

```python
class SystemPromptChain:
    """Coordena múltiplos system prompts especializados"""
    
    def __init__(self):
        self.prompts = {
            "data_analyst": load_system_prompt("analyst_v2.1"),
            "content_creator": load_system_prompt("creator_v1.8"),  
            "compliance_checker": load_system_prompt("compliance_v2.3")
        }
    
    def process_complex_task(self, task_description):
        """
        Para tarefas complexas, usa system prompts em sequência
        Ex: Análise de dados → Criação de conteúdo → Verificação compliance
        """
        
        # Etapa 1: Análise
        analysis = self.llm_call(
            system_prompt=self.prompts["data_analyst"],
            user_input=task_description
        )
        
        # Etapa 2: Criação baseada na análise  
        content = self.llm_call(
            system_prompt=self.prompts["content_creator"],
            user_input=f"Baseado nesta análise: {analysis}\nCrie conteúdo para: {task_description}"
        )
        
        # Etapa 3: Verificação compliance
        compliance_check = self.llm_call(
            system_prompt=self.prompts["compliance_checker"],
            user_input=f"Verifique compliance deste conteúdo: {content}"
        )
        
        return {
            "analysis": analysis,
            "content": content, 
            "compliance": compliance_check
        }
```

---

## 📈 ROI e Business Value

### **Métricas de Impacto**

#### **Redução de Custos Operacionais**
```python
def calculate_system_prompt_roi():
    """Calcula ROI de implementação de system prompts estruturados"""
    
    # Before: Prompts ad-hoc, inconsistentes
    before_metrics = {
        "avg_interactions_per_task": 3.2,  # Várias tentativas
        "manual_review_rate": 0.65,        # 65% precisam revisão
        "avg_time_per_task": 25,           # minutos
        "error_rate": 0.12                 # 12% de erros
    }
    
    # After: System prompts otimizados  
    after_metrics = {
        "avg_interactions_per_task": 1.4,  # Mais eficiente
        "manual_review_rate": 0.25,        # Menos revisão
        "avg_time_per_task": 12,           # Mais rápido  
        "error_rate": 0.03                 # Menos erros
    }
    
    # Cálculo de economia
    monthly_tasks = 1000
    hourly_rate = 75  # USD
    
    time_savings = (before_metrics["avg_time_per_task"] - after_metrics["avg_time_per_task"]) / 60
    cost_savings_per_task = time_savings * hourly_rate
    monthly_savings = cost_savings_per_task * monthly_tasks
    
    return {
        "monthly_savings_usd": monthly_savings,
        "annual_roi_percentage": (monthly_savings * 12) / implementation_cost * 100,
        "payback_period_months": implementation_cost / monthly_savings
    }
```

---

## 🚀 Próximos Passos

### **Para Implementar Imediatamente**
1. **[Templates Prontos](prompt-templates-and-variables.md)** - System prompts reutilizáveis
2. **[Role Definition](role-definition.md)** - Especialização de papéis  
3. **[Testing Framework](../tests/validation-framework.md)** - Validação automatizada

### **Para Otimização Avançada**
1. **[XML Tags Framework](../advanced/xml-tags-complete-guide.md)** - Estruturação complexa
2. **[Chain of Thought](../advanced/chain-of-thought.md)** - Raciocínio estruturado
3. **[Performance Optimization](../optimization/)** - Custos e velocidade

---

*System Prompts bem estruturados são a base para automação confiável e escalável de processos críticos de negócio.*

---

**Desenvolvido por Dutt eCommerce Website Design - Arquitetura de IA para soluções corporativas e compliance regulatório.**