# Templates e Variáveis de Prompt

**Sistema de Reutilização e Padronização** | **Versão 1.0** | **Dutt eCommerce Website Design**

---

## 🎯 O que são Prompt Templates

**Prompt Templates** são estruturas reutilizáveis com placeholders (variáveis) que permitem padronizar, escalar e manter consistência em operações de prompt engineering. Funcionam como "moldes" que podem ser customizados para diferentes contextos mantendo a estrutura e qualidade base.

### **Benefícios Estratégicos**
- **Escalabilidade**: Um template serve múltiplos casos de uso
- **Consistência**: Padronização de formato e qualidade
- **Manutenibilidade**: Atualizações centralizadas  
- **Eficiência**: Redução drástica de tempo de desenvolvimento
- **Auditabilidade**: Versionamento e controle de mudanças
- **Especialização**: Templates otimizados por setor/função

---

## 🏗️ Arquitetura de Template System

### **Hierarquia de Templates**

```
📁 Template Library
├── 🌐 Universal Templates (cross-sector)
│   ├── analysis-template.md
│   ├── content-creation-template.md  
│   └── qa-template.md
├── 🏢 Sector Templates (industry-specific)
│   ├── 🏦 financial/
│   │   ├── compliance-analysis.md
│   │   ├── risk-assessment.md
│   │   └── regulatory-report.md
│   ├── 🛒 ecommerce/
│   │   ├── product-optimization.md
│   │   ├── seo-content.md
│   │   └── customer-support.md
│   └── 🏛️ institutional/
│       ├── citizen-communication.md
│       ├── policy-analysis.md
│       └── accessibility-adaptation.md
└── 🔧 Function Templates (role-specific)
    ├── data-analyst.md
    ├── content-strategist.md
    └── project-manager.md
```

---

## 🎨 Sistema de Variáveis

### **Tipos de Variáveis**

#### **1. Variáveis de Contexto**
```markdown
{{COMPANY_NAME}}          # Nome da empresa
{{INDUSTRY_SECTOR}}       # Setor de atuação  
{{TARGET_AUDIENCE}}       # Público-alvo
{{BUSINESS_OBJECTIVE}}    # Objetivo de negócio
{{COMPLIANCE_STANDARDS}}  # Padrões regulatórios aplicáveis
```

#### **2. Variáveis de Especialização**
```markdown
{{EXPERT_ROLE}}           # Papel do especialista (ex: "Analista BCB Sênior")
{{DOMAIN_EXPERTISE}}      # Área de expertise (ex: "compliance bancário")
{{YEARS_EXPERIENCE}}      # Anos de experiência
{{CERTIFICATIONS}}       # Certificações relevantes
{{SPECIALIZED_KNOWLEDGE}} # Conhecimentos específicos
```

#### **3. Variáveis de Processo**
```markdown
{{TASK_DESCRIPTION}}      # Descrição específica da tarefa
{{INPUT_DATA}}           # Dados de entrada
{{OUTPUT_FORMAT}}        # Formato de saída desejado
{{QUALITY_CRITERIA}}     # Critérios de qualidade
{{VALIDATION_RULES}}     # Regras de validação
```

#### **4. Variáveis de Configuração**
```markdown
{{RESPONSE_LENGTH}}       # Tamanho esperado da resposta
{{TONE_OF_VOICE}}        # Tom de voz (formal/técnico/acessível)
{{LANGUAGE_LEVEL}}       # Nível de linguagem (técnico/cidadão)
{{URGENCY_LEVEL}}        # Nível de urgência
{{CONFIDENCE_THRESHOLD}} # Limite de confiança para respostas
```

### **Sintaxe de Variáveis**

```python
# Implementação Python para template engine
class PromptTemplate:
    def __init__(self, template_string):
        self.template = template_string
        self.required_vars = self._extract_variables()
    
    def _extract_variables(self):
        """Extrai variáveis do formato {{VARIABLE_NAME}}"""
        import re
        return re.findall(r'\{\{([A-Z_]+)\}\}', self.template)
    
    def render(self, **kwargs):
        """Renderiza template com variáveis fornecidas"""
        missing_vars = set(self.required_vars) - set(kwargs.keys())
        if missing_vars:
            raise ValueError(f"Missing required variables: {missing_vars}")
        
        rendered = self.template
        for var, value in kwargs.items():
            rendered = rendered.replace(f"{{{{{var}}}}}", str(value))
        
        return rendered
    
    def get_required_variables(self):
        """Retorna lista de variáveis obrigatórias"""
        return self.required_vars
```

---

## 📋 Templates Universais

### **Template de Análise Geral**

```markdown
# Template: Universal Analysis
# Version: 2.1
# Use Cases: Análise de documentos, dados, processos

## CONTEXTO EMPRESARIAL
Empresa: {{COMPANY_NAME}}
Setor: {{INDUSTRY_SECTOR}}
Objetivo: {{BUSINESS_OBJECTIVE}}

## ESPECIALISTA DESIGNADO
Você é um {{EXPERT_ROLE}} com {{YEARS_EXPERIENCE}} anos de experiência em {{DOMAIN_EXPERTISE}}.

Sua expertise específica inclui:
{{SPECIALIZED_KNOWLEDGE}}

## TAREFA ESPECÍFICA
{{TASK_DESCRIPTION}}

## DADOS PARA ANÁLISE
{{INPUT_DATA}}

## CRITÉRIOS DE ANÁLISE
{{QUALITY_CRITERIA}}

## FORMATO DE OUTPUT OBRIGATÓRIO
{{OUTPUT_FORMAT}}

## VALIDAÇÕES NECESSÁRIAS
{{VALIDATION_RULES}}

## RESTRIÇÕES
- Base sua análise EXCLUSIVAMENTE nos dados fornecidos
- Se informações são insuficientes, indique claramente "DADOS INSUFICIENTES"
- Mantenha {{TONE_OF_VOICE}} apropriado para {{TARGET_AUDIENCE}}
- Respeite padrões {{COMPLIANCE_STANDARDS}} aplicáveis
```

**Exemplo de Uso:**
```python
analysis_template = PromptTemplate(universal_analysis_template)

rendered_prompt = analysis_template.render(
    COMPANY_NAME="Banco XYZ",
    INDUSTRY_SECTOR="Financeiro",
    BUSINESS_OBJECTIVE="Compliance com regulamentações BCB",
    EXPERT_ROLE="Analista de Compliance Sênior",
    YEARS_EXPERIENCE="12",
    DOMAIN_EXPERTISE="regulamentações bancárias brasileiras",
    SPECIALIZED_KNOWLEDGE="BCB, AML, Open Banking, PIX",
    TASK_DESCRIPTION="Analise esta operação bancária para riscos de compliance",
    INPUT_DATA="[dados da operação]",
    QUALITY_CRITERIA="Precisão 95%+, citação de normas específicas",
    OUTPUT_FORMAT="JSON estruturado com classificação de risco",
    VALIDATION_RULES="Todas as normas citadas devem estar vigentes",
    TONE_OF_VOICE="técnico profissional",
    TARGET_AUDIENCE="equipe de compliance",
    COMPLIANCE_STANDARDS="BCB"
)
```

### **Template de Criação de Conteúdo**

```markdown
# Template: Content Creation  
# Version: 1.8
# Use Cases: Copywriting, SEO, comunicação

## CONTEXTO DE CRIAÇÃO
Cliente: {{COMPANY_NAME}}
Setor: {{INDUSTRY_SECTOR}}
Produto/Serviço: {{PRODUCT_SERVICE}}
Público-alvo: {{TARGET_AUDIENCE}}

## CRIADOR ESPECIALIZADO
Você é um {{EXPERT_ROLE}} especializado em {{DOMAIN_EXPERTISE}} para o mercado {{MARKET_REGION}}.

Sua experiência inclui:
- {{SPECIALIZED_SKILL_1}}
- {{SPECIALIZED_SKILL_2}}  
- {{SPECIALIZED_SKILL_3}}

## BRIEF DE CRIAÇÃO
Objetivo: {{CONTENT_OBJECTIVE}}
Mensagem principal: {{KEY_MESSAGE}}
Tom de voz: {{TONE_OF_VOICE}}
Estilo: {{CONTENT_STYLE}}

## ESPECIFICAÇÕES TÉCNICAS
Formato: {{CONTENT_FORMAT}}
Tamanho: {{CONTENT_LENGTH}}
Palavras-chave: {{SEO_KEYWORDS}}
CTA desejado: {{CALL_TO_ACTION}}

## DIRETRIZES DE MARCA
{{BRAND_GUIDELINES}}

## RESTRIÇÕES
- Mantenha autenticidade da marca
- Otimize para {{PRIMARY_CHANNEL}}
- Considere jornada do cliente: {{CUSTOMER_JOURNEY_STAGE}}
- Respeite regulamentações {{REGULATORY_REQUIREMENTS}}
```

---

## 🏢 Templates Setoriais

### **🏦 Setor Financeiro - Análise de Compliance**

```markdown
# Template: Banking Compliance Analysis
# Version: 3.2  
# Specific Use: BCB regulatory compliance analysis

## CONTEXTO REGULATÓRIO BRASILEIRO
Instituição: {{FINANCIAL_INSTITUTION}}
Tipo: {{INSTITUTION_TYPE}} (Banco/Fintech/Cooperativa/etc)
Regulador: Banco Central do Brasil (BCB)

## ANALISTA ESPECIALIZADO BCB
Você é um {{EXPERT_ROLE}} certificado pela FEBRABAN, com {{YEARS_EXPERIENCE}} anos de experiência específica em:
- {{BCB_SPECIALIZATION_1}} (ex: "Circular 3.542 - AML")
- {{BCB_SPECIALIZATION_2}} (ex: "Resolução 4.658 - Open Banking")  
- {{BCB_SPECIALIZATION_3}} (ex: "Regulamentação PIX")

## OPERAÇÃO PARA ANÁLISE
{{OPERATION_DETAILS}}

## NORMAS BCB APLICÁVEIS (verificar conformidade)
{{APPLICABLE_BCB_NORMS}}

## ANÁLISE REQUERIDA
Classifique esta operação quanto a:
1. **Risco de Lavagem de Dinheiro**: BAIXO/MÉDIO/ALTO/CRÍTICO
2. **Aderência Normativa**: CONFORME/NÃO_CONFORME/PENDÊNCIAS
3. **Indicadores Suspeitos**: Listar se identificados
4. **Ações Recomendadas**: Específicas e com prazo

## FORMATO JSON OBRIGATÓRIO
{
  "instituicao": "{{FINANCIAL_INSTITUTION}}",
  "data_analise": "{{CURRENT_DATE}}",
  "analista": "{{ANALYST_ID}}",
  "operacao": {
    "id": "{{OPERATION_ID}}",
    "valor": {{OPERATION_AMOUNT}},
    "tipo": "{{OPERATION_TYPE}}"
  },
  "compliance_analysis": {
    "risco_global": "BAIXO|MÉDIO|ALTO|CRÍTICO",
    "status_conformidade": "CONFORME|NÃO_CONFORME|PENDÊNCIAS",
    "normas_verificadas": [
      {
        "norma": "{{BCB_NORM_NUMBER}}",
        "status": "CONFORME|NÃO_CONFORME",
        "observacao": "detalhes da verificação"
      }
    ],
    "indicadores_suspeitos": ["array de red flags identificados"],
    "score_risco": {{RISK_SCORE_0_100}},
    "acoes_recomendadas": [
      {
        "acao": "descrição da ação",
        "prazo": "prazo em dias úteis",
        "criticidade": "ALTA|MÉDIA|BAIXA"
      }
    ]
  },
  "validacao": {
    "analise_completa": true|false,
    "dados_suficientes": true|false,
    "confianca_analise": {{CONFIDENCE_0_1}}
  }
}

## RESTRIÇÕES CRÍTICAS
- NUNCA invente números de normas BCB
- SEMPRE cite norma específica para cada não-conformidade
- SE dados insuficientes: {"erro": "DADOS_INSUFICIENTES", "campos_necessarios": ["lista"]}
- Mantenha linguagem técnica precisa
```

### **🛒 eCommerce - Otimização de Produto**

```markdown
# Template: eCommerce Product Optimization
# Version: 2.5
# Specific Use: Brazilian eCommerce product listing optimization

## CONTEXTO ECOMMERCE BRASILEIRO
Loja: {{STORE_NAME}}
Plataforma: {{ECOMMERCE_PLATFORM}} (VTEX/Shopify/Magento/etc)
Categoria: {{PRODUCT_CATEGORY}}
Público: {{TARGET_DEMOGRAPHIC}}
Ticket médio: {{AVERAGE_TICKET}}

## ESPECIALISTA EM CONVERSÃO
Você é um {{EXPERT_ROLE}} especializado no mercado brasileiro, com expertise em:
- CRO para {{PRODUCT_CATEGORY}}
- SEO para marketplace {{PRIMARY_MARKETPLACE}}
- Comportamento do consumidor {{REGION}} (Sul/Sudeste/Nordeste/etc)
- Otimização mobile-first ({{MOBILE_TRAFFIC_PERCENTAGE}}% do tráfego)

## PRODUTO PARA OTIMIZAÇÃO
Nome atual: {{CURRENT_PRODUCT_NAME}}
Preço: {{PRODUCT_PRICE}}
Principais concorrentes: {{COMPETITOR_LIST}}
USP atual: {{CURRENT_USP}}

## DESCRIÇÃO ATUAL (para otimizar)
{{CURRENT_DESCRIPTION}}

## OBJETIVOS DE CONVERSÃO
- Aumentar conversão de {{CURRENT_CONVERSION_RATE}}% para {{TARGET_CONVERSION_RATE}}%+
- Melhorar posição SEO para: {{PRIMARY_KEYWORDS}}
- Reduzir bounce rate de {{CURRENT_BOUNCE_RATE}}%
- Aumentar tempo na página

## ENTREGÁVEIS OBRIGATÓRIOS
1. **Título otimizado** (max {{TITLE_MAX_CHARS}} chars)
2. **Descrição principal** ({{DESCRIPTION_MIN_WORDS}}-{{DESCRIPTION_MAX_WORDS}} palavras)
3. **Bullet points** ({{BULLET_POINTS_COUNT}} itens: features + benefícios)
4. **Meta description** (max 155 chars)
5. **Tags/palavras-chave** ({{SUGGESTED_TAGS_COUNT}} sugestões)

## DIRETRIZES BRASILEIRAS
- Destaque formas de pagamento (PIX/boleto/cartão)
- Mencione frete grátis se {{FREE_SHIPPING_THRESHOLD}}
- Use linguagem {{TONE_PREFERENCE}} apropriada para {{TARGET_AGE_RANGE}}
- Otimize para Black Friday/Dia das Mães se {{SEASONAL_RELEVANCE}}
- Considere mobile-first ({{MOBILE_USAGE_STATS}})

## FORMATO ESTRUTURADO
{
  "otimizacao_produto": {
    "titulo_seo": "título otimizado aqui",
    "descricao_principal": "descrição completa e persuasiva",
    "bullet_points": [
      "Benefício 1 + feature",
      "Benefício 2 + feature", 
      "etc"
    ],
    "meta_description": "descrição para SERP",
    "palavras_chave": {
      "primaria": "{{PRIMARY_KEYWORD}}",
      "secundarias": ["lista de keywords relacionadas"],
      "long_tail": ["frases de cauda longa específicas"]
    },
    "melhorias_identificadas": [
      "lista das principais mudanças feitas"
    ],
    "cta_sugeridos": ["calls-to-action específicos"],
    "projec
oes": {
      "conversao_estimada": "percentual esperado",
      "impacto_seo": "melhoria esperada no ranking"
    }
  }
}

## VALIDAÇÕES
- Palavra-chave primária densidade 2-3%
- Readability score ≥ {{MIN_READABILITY_SCORE}}
- Menção aos principais diferenciais vs concorrentes
- CTA claro e persuasivo presente
```

### **🏛️ Institucional - Comunicação Cidadã**

```markdown
# Template: Citizen Communication  
# Version: 2.0
# Specific Use: Government/institutional accessible communication

## CONTEXTO INSTITUCIONAL
Órgão: {{INSTITUTION_NAME}}
Nível: {{GOVERNMENT_LEVEL}} (Federal/Estadual/Municipal)
Público: Cidadãos brasileiros (escolaridade média: {{EDUCATION_LEVEL}})
Canal: {{COMMUNICATION_CHANNEL}} (site/impressos/redes sociais)

## ESPECIALISTA EM COMUNICAÇÃO PÚBLICA
Você é um {{EXPERT_ROLE}} com experiência em:
- Linguagem Cidadã conforme Manual da Presidência da República
- Acessibilidade WCAG {{WCAG_LEVEL}}
- Lei de Acesso à Informação (LAI)
- Comunicação governamental para diversos níveis de letramento

## DOCUMENTO PARA ADAPTAÇÃO
Título original: {{ORIGINAL_TITLE}}
Tipo: {{DOCUMENT_TYPE}} (Lei/Decreto/Portaria/Instrução/etc)
Resumo técnico: {{TECHNICAL_SUMMARY}}

## DOCUMENTO ORIGINAL (para simplificar)
{{ORIGINAL_DOCUMENT}}

## PÚBLICO-ALVO ESPECÍFICO
- Escolaridade: {{TARGET_EDUCATION_LEVEL}}
- Idade predominante: {{TARGET_AGE_RANGE}}
- Renda familiar: {{TARGET_INCOME_RANGE}}
- Acesso digital: {{DIGITAL_ACCESS_LEVEL}}%
- Canal preferencial: {{PREFERRED_CHANNEL}}

## ESTRUTURA OBRIGATÓRIA PARA ADAPTAÇÃO

### 1. RESUMO CIDADÃO (max {{CITIZEN_SUMMARY_MAX_WORDS}} palavras)
- O que é e para que serve
- Quem é afetado
- Quando entra em vigor  
- Como o cidadão é impactado

### 2. CONTEÚDO PRINCIPAL
- Seções com títulos descritivos
- Parágrafos curtos (max {{MAX_PARAGRAPH_SENTENCES}} frases)
- Exemplos práticos para situações comuns
- Linguagem nível {{LANGUAGE_LEVEL}}

### 3. PERGUNTAS FREQUENTES (min {{MIN_FAQ_ITEMS}} itens)
- Dúvidas operacionais mais comuns
- Prazos explicados em linguagem simples
- Custos (se aplicável) detalhados
- Documentos necessários listados

### 4. GLOSSÁRIO
- Todos os termos técnicos utilizados
- Definições em linguagem acessível
- Exemplos quando apropriado

### 5. INFORMAÇÕES PRÁTICAS  
- Onde fazer/solicitar
- Horários de atendimento
- Documentos necessários
- Custos envolvidos
- Prazos de processamento
- Canais de contato e suporte

## DIRETRIZES DE ACESSIBILIDADE
- Flesch Reading Ease ≥ {{MIN_FLESCH_SCORE}}
- Sentenças ≤ {{MAX_SENTENCE_LENGTH}} palavras
- Voz ativa sempre que possível
- Evitar jargões jurídicos sem explicação
- Hierarquia clara (H1, H2, H3)
- Listas numeradas para processos

## VALIDAÇÕES OBRIGATÓRIAS
- ✅ Precisão jurídica 100% mantida
- ✅ Zero termos técnicos sem definição
- ✅ Exemplos práticos para conceitos abstratos  
- ✅ Múltiplos canais de atendimento oferecidos
- ✅ Conformidade com LAI
- ✅ Linguagem inclusiva e respeitosa
```

---

## 🔧 Implementação Técnica

### **Sistema de Template Management**

```python
class PromptTemplateManager:
    def __init__(self, template_directory="./templates/"):
        self.template_dir = template_directory
        self.cache = {}
        self.version_control = {}
    
    def load_template(self, template_name, version="latest"):
        """Carrega template com versionamento"""
        if version == "latest":
            version = self.get_latest_version(template_name)
        
        cache_key = f"{template_name}:{version}"
        if cache_key not in self.cache:
            template_path = f"{self.template_dir}/{template_name}/v{version}.md"
            with open(template_path, 'r', encoding='utf-8') as f:
                self.cache[cache_key] = PromptTemplate(f.read())
        
        return self.cache[cache_key]
    
    def create_template_instance(self, template_name, variables):
        """Cria instância de template com validação"""
        template = self.load_template(template_name)
        
        # Validação de variáveis obrigatórias
        missing_vars = set(template.get_required_variables()) - set(variables.keys())
        if missing_vars:
            raise ValueError(f"Missing required variables for {template_name}: {missing_vars}")
        
        # Validação de tipos de dados
        validated_vars = self.validate_variable_types(template_name, variables)
        
        return template.render(**validated_vars)
    
    def validate_variable_types(self, template_name, variables):
        """Valida tipos de dados das variáveis"""
        validation_rules = self.load_validation_rules(template_name)
        
        validated = {}
        for var_name, var_value in variables.items():
            if var_name in validation_rules:
                rule = validation_rules[var_name]
                if not self.validate_type(var_value, rule):
                    raise TypeError(f"Variable {var_name} must be {rule['type']}")
                
                validated[var_name] = self.format_variable(var_value, rule)
            else:
                validated[var_name] = var_value
        
        return validated
    
    def get_template_catalog(self):
        """Retorna catálogo de templates disponíveis"""
        return {
            "universal": [
                {"name": "analysis", "version": "2.1", "use_cases": ["data analysis", "document review"]},
                {"name": "content-creation", "version": "1.8", "use_cases": ["copywriting", "SEO"]}
            ],
            "financial": [
                {"name": "compliance-analysis", "version": "3.2", "use_cases": ["BCB compliance", "risk assessment"]},
                {"name": "regulatory-report", "version": "2.0", "use_cases": ["BCB reporting", "audit preparation"]}
            ],
            "ecommerce": [
                {"name": "product-optimization", "version": "2.5", "use_cases": ["listing optimization", "conversion improvement"]},
                {"name": "seo-content", "version": "1.9", "use_cases": ["blog posts", "category descriptions"]}
            ]
        }
```

### **Template Validation System**

```python
class TemplateValidator:
    def __init__(self):
        self.validation_rules = {
            "COMPANY_NAME": {"type": str, "max_length": 100, "required": True},
            "YEARS_EXPERIENCE": {"type": int, "min": 1, "max": 50, "required": True},
            "CONFIDENCE_0_1": {"type": float, "min": 0.0, "max": 1.0, "required": True},
            "BCB_NORM_NUMBER": {"type": str, "pattern": r"^\d{1,4}(\.\d{3})?(/\d{4})?$", "required": True}
        }
    
    def validate_template_output(self, template_name, rendered_prompt, expected_variables):
        """Valida se template foi renderizado corretamente"""
        issues = []
        
        # Verifica se ainda há variáveis não substituídas
        unrendered_vars = re.findall(r'\{\{([A-Z_]+)\}\}', rendered_prompt)
        if unrendered_vars:
            issues.append(f"Unrendered variables found: {unrendered_vars}")
        
        # Verifica estrutura específica por tipo de template
        if template_name.startswith("financial"):
            issues.extend(self.validate_financial_template(rendered_prompt))
        elif template_name.startswith("ecommerce"):
            issues.extend(self.validate_ecommerce_template(rendered_prompt))
        
        return {
            "is_valid": len(issues) == 0,
            "issues": issues,
            "template_name": template_name,
            "validation_timestamp": datetime.now().isoformat()
        }
    
    def validate_financial_template(self, prompt):
        """Validação específica para templates financeiros"""
        issues = []
        
        # Deve mencionar BCB ou normas regulatórias
        if not re.search(r'BCB|Banco Central|Circular|Resolução', prompt):
            issues.append("Financial template must reference BCB or regulatory norms")
        
        # Deve ter estrutura de análise de risco
        required_sections = ["risco", "conformidade", "normas", "recomendações"]
        for section in required_sections:
            if section.lower() not in prompt.lower():
                issues.append(f"Missing required section: {section}")
        
        return issues
```

### **Template Performance Monitoring**

```python
class TemplateAnalytics:
    def __init__(self):
        self.usage_stats = defaultdict(int)
        self.performance_metrics = defaultdict(list)
    
    def track_template_usage(self, template_name, version, user_id, execution_time, success=True):
        """Rastreia uso de templates para analytics"""
        self.usage_stats[f"{template_name}:v{version}"] += 1
        
        self.performance_metrics[template_name].append({
            "version": version,
            "user_id": user_id,
            "execution_time": execution_time,
            "success": success,
            "timestamp": datetime.now()
        })
    
    def get_template_insights(self, template_name, days=30):
        """Gera insights sobre performance de template específico"""
        recent_data = [
            m for m in self.performance_metrics[template_name]
            if (datetime.now() - m["timestamp"]).days <= days
        ]
        
        if not recent_data:
            return {"error": "No recent data available"}
        
        return {
            "total_uses": len(recent_data),
            "success_rate": sum(m["success"] for m in recent_data) / len(recent_data),
            "avg_execution_time": sum(m["execution_time"] for m in recent_data) / len(recent_data),
            "most_used_version": max(set(m["version"] for m in recent_data), 
                                   key=lambda v: sum(1 for m in recent_data if m["version"] == v)),
            "user_adoption": len(set(m["user_id"] for m in recent_data)),
            "trend": self.calculate_usage_trend(recent_data)
        }
    
    def generate_optimization_suggestions(self, template_name):
        """IA-powered sugestões de otimização baseadas em analytics"""
        insights = self.get_template_insights(template_name)
        suggestions = []
        
        if insights["success_rate"] < 0.85:
            suggestions.append("Consider simplifying variable requirements or improving validation")
        
        if insights["avg_execution_time"] > 15:
            suggestions.append("Template may be too complex, consider breaking into smaller components")
        
        if insights["user_adoption"] < 5:
            suggestions.append("Low adoption - consider improving documentation or training")
        
        return suggestions
```

---

## 📊 ROI de Template System

### **Métricas de Eficiência**

```python
def calculate_template_roi():
    """Calcula ROI do sistema de templates"""
    
    # Métricas Before (prompts manuais)
    before = {
        "avg_prompt_creation_time": 25,  # minutos por prompt
        "consistency_score": 0.65,       # 65% de consistência entre prompts
        "reuse_rate": 0.10,             # 10% de reaproveitamento
        "quality_score": 0.70,          # 70% de qualidade média
        "maintenance_hours_month": 40    # horas mensais de manutenção
    }
    
    # Métricas After (sistema de templates)
    after = {
        "avg_prompt_creation_time": 8,   # minutos por prompt
        "consistency_score": 0.92,      # 92% de consistência
        "reuse_rate": 0.85,            # 85% de reaproveitamento
        "quality_score": 0.89,         # 89% de qualidade média
        "maintenance_hours_month": 12   # horas mensais de manutenção
    }
    
    # Cálculos de economia
    monthly_prompts = 500
    hourly_rate = 75  # USD
    
    time_savings_per_prompt = (before["avg_prompt_creation_time"] - after["avg_prompt_creation_time"]) / 60
    monthly_time_savings = time_savings_per_prompt * monthly_prompts
    maintenance_savings = (before["maintenance_hours_month"] - after["maintenance_hours_month"])
    
    total_monthly_savings = (monthly_time_savings + maintenance_savings) * hourly_rate
    
    # Quality improvement value (reduced rework, better outcomes)
    quality_improvement_value = monthly_prompts * 0.3 * hourly_rate  # 30min saved per prompt due to quality
    
    return {
        "monthly_savings": total_monthly_savings,
        "quality_value": quality_improvement_value,
        "total_monthly_value": total_monthly_savings + quality_improvement_value,
        "annual_roi": (total_monthly_savings + quality_improvement_value) * 12,
        "efficiency_improvement": {
            "speed": f"{((before['avg_prompt_creation_time'] - after['avg_prompt_creation_time']) / before['avg_prompt_creation_time'] * 100):.1f}%",
            "consistency": f"{((after['consistency_score'] - before['consistency_score']) / before['consistency_score'] * 100):.1f}%",
            "reuse": f"{((after['reuse_rate'] - before['reuse_rate']) / before['reuse_rate'] * 100):.1f}%"
        }
    }
```

---

## 🚀 Próximos Passos

### **Para Implementação Imediata**
1. **[Role Definition](role-definition.md)** - Especialização de papéis para templates
2. **[Output Formatting](output-formatting.md)** - Estruturas de resposta padronizadas
3. **[Context Provision](context-provision.md)** - Gestão de contexto em templates

### **Para Automação Avançada**
1. **[Tools - Template Builder](../tools/template-builder.md)** - Ferramenta de construção visual
2. **[Testing Framework](../tests/validation-framework.md)** - Validação automatizada
3. **[Advanced XML Tags](../advanced/xml-tags-complete-guide.md)** - Estruturação complexa

### **Para Gestão Corporativa**
1. **[Performance Metrics](../metrics/performance-metrics.md)** - KPIs de template performance
2. **[Version Control](../optimization/template-versioning.md)** - Controle de versão enterprise
3. **[Team Collaboration](../tools/team-templates.md)** - Colaboração em templates

---

*Templates bem estruturados transformam prompt engineering de arte em ciência, garantindo qualidade, consistência e escalabilidade para operações críticas de negócio.*

---

**Desenvolvido por Dutt eCommerce Website Design - Sistemas de automação escaláveis para soluções corporativas regulamentadas.**