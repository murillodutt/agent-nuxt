# Formatação e Controle de Output

**Estruturação Precisa de Respostas** | **Versão 1.0** | **Dutt eCommerce Website Design**

---

## 🎯 Importância do Output Formatting

**Output Formatting** é a especificação precisa da estrutura, formato e organização das respostas geradas por LLMs. É essencial para integração programática, processamento automatizado e garantia de consistência em aplicações corporativas.

### **Por que Format Control Importa**
- **Automação**: Responses estruturadas podem ser processadas por código
- **Consistência**: Padronização independente de variações do modelo
- **Parsing**: Extração automática de dados específicos
- **Integração**: Compatibilidade com APIs e sistemas corporativos
- **Auditoria**: Estrutura facilita tracking e compliance
- **UX**: Apresentação organizada e profissional

---

## 🏗️ Tipos de Formatação

### **1. JSON Estruturado**

#### **Caso de Uso: Análise Financeira BCB**
```json
{
  "metadata": {
    "instituicao": "Banco XYZ",
    "analista_id": "A001",
    "data_analise": "2025-09-24T10:30:00Z",
    "versao_sistema": "v2.3"
  },
  "operacao": {
    "id": "OP-2024-001234",
    "valor_brl": 250000.00,
    "tipo": "transferencia_internacional",
    "origem": {
      "conta": "12345-6",
      "titular": "EMPRESA ABC LTDA",
      "cpf_cnpj": "12.345.678/0001-90"
    },
    "destino": {
      "pais": "Ilhas Cayman",
      "banco": "Cayman International Bank",
      "codigo_swift": "CAYBKY22"
    }
  },
  "analise_compliance": {
    "classificacao_risco": "ALTO",
    "score_risco": 8.7,
    "confianca_analise": 0.94,
    "indicadores_suspeitos": [
      {
        "tipo": "destino_paraiso_fiscal",
        "descricao": "Transferência para jurisdição de alto risco",
        "severidade": "ALTA",
        "norma_aplicavel": "Circular BCB 3.542/2014"
      },
      {
        "tipo": "incompatibilidade_perfil",
        "descricao": "Valor incompatível com histórico do cliente",
        "severidade": "MEDIA", 
        "norma_aplicavel": "Resolução BCB 2.025/1993"
      }
    ],
    "verificacoes_normativas": [
      {
        "norma": "Circular 3.542/2014",
        "item": "Art. 2º - Identificação de operações suspeitas",
        "status": "NAO_CONFORME",
        "detalhes": "Operação apresenta múltiplos indicadores de risco"
      },
      {
        "norma": "Lei 9.613/1998",  
        "item": "Art. 9º - Comunicação ao COAF",
        "status": "ACAO_REQUERIDA",
        "detalhes": "RIF deve ser enviado em 24h úteis"
      }
    ]
  },
  "recomendacoes": [
    {
      "prioridade": "URGENTE",
      "acao": "Bloquear operação imediatamente",
      "responsavel": "Compliance Officer",
      "prazo_horas": 2,
      "justificativa": "Alto risco + destino paraíso fiscal"
    },
    {
      "prioridade": "ALTA",
      "acao": "Enviar RIF ao COAF",
      "responsavel": "Analista AML",
      "prazo_horas": 24,
      "justificativa": "Obrigatório por Lei 9.613/1998"
    }
  ],
  "validacao": {
    "analise_completa": true,
    "dados_suficientes": true,
    "normas_atualizadas": true,
    "revisao_requerida": false
  }
}
```

#### **Schema de Validação**
```python
# JSON Schema para validação automática
compliance_analysis_schema = {
    "type": "object",
    "required": ["metadata", "operacao", "analise_compliance", "recomendacoes"],
    "properties": {
        "metadata": {
            "type": "object",
            "required": ["instituicao", "data_analise"],
            "properties": {
                "instituicao": {"type": "string"},
                "analista_id": {"type": "string"},
                "data_analise": {"type": "string", "format": "date-time"}
            }
        },
        "analise_compliance": {
            "type": "object",
            "required": ["classificacao_risco", "score_risco"],
            "properties": {
                "classificacao_risco": {
                    "type": "string", 
                    "enum": ["BAIXO", "MEDIO", "ALTO", "CRITICO"]
                },
                "score_risco": {"type": "number", "minimum": 0, "maximum": 10},
                "confianca_analise": {"type": "number", "minimum": 0, "maximum": 1}
            }
        }
    }
}
```

### **2. XML Estruturado**

#### **Caso de Uso: Relatório Regulatório**
```xml
<relatorio_bcb>
    <cabecalho>
        <instituicao codigo="12345">Banco XYZ S.A.</instituicao>
        <periodo_referencia inicio="2024-07-01" fim="2024-09-30"/>
        <data_geracao>2024-10-15T09:00:00-03:00</data_geracao>
        <responsavel_tecnico cpf="123.456.789-00">João Silva</responsavel_tecnico>
    </cabecalho>
    
    <indicadores_risco>
        <categoria nome="lavagem_dinheiro">
            <total_operacoes_analisadas>1247</total_operacoes_analisadas>
            <operacoes_suspeitas>23</operacoes_suspeitas>
            <percentual_suspeitas>1.84</percentual_suspeitas>
            <rifs_enviados>23</rifs_enviados>
            <status_coaf>TODOS_ENVIADOS</status_coaf>
        </categoria>
        
        <categoria nome="financiamento_terrorismo">
            <total_operacoes_analisadas>1247</total_operacoes_analisadas>
            <operacoes_suspeitas>0</operacoes_suspeitas>
            <percentual_suspeitas>0.00</percentual_suspeitas>
            <rifs_enviados>0</rifs_enviados>
        </categoria>
    </indicadores_risco>
    
    <detalhamento_operacoes>
        <operacao_suspeita id="OS-2024-001">
            <data>2024-08-15</data>
            <valor moeda="BRL">500000.00</valor>
            <tipo>TRANSFERENCIA_INTERNACIONAL</tipo>
            <origem_recursos>PESSOA_JURIDICA</origem_recursos>
            <destino pais="Panama" codigo_pais="PA"/>
            <indicadores>
                <indicador codigo="IND001">Valor incompatível com perfil</indicador>
                <indicador codigo="IND007">Destino paraíso fiscal</indicador>
            </indicadores>
            <status_rif>ENVIADO</status_rif>
            <data_envio_coaf>2024-08-16</data_envio_coaf>
        </operacao_suspeita>
    </detalhamento_operacoes>
    
    <assinatura_digital>
        <hash_documento>a1b2c3d4e5f6...</hash_documento>
        <certificado_digital>X.509 Certificate Data</certificado_digital>
        <timestamp>2024-10-15T09:15:30-03:00</timestamp>
    </assinatura_digital>
</relatorio_bcb>
```

### **3. Markdown Estruturado**

#### **Caso de Uso: Relatório Executivo**
```markdown
# Relatório de Análise de Compliance Q3 2024

**Instituição**: Banco XYZ S.A.  
**Período**: Julho - Setembro 2024  
**Responsável**: João Silva (Compliance Officer)  
**Data**: 15/10/2024  

---

## 📊 Resumo Executivo

### KPIs Principais
- **Total de Operações**: 1.247 analisadas
- **Taxa de Suspeição**: 1,84% (23 operações)
- **Compliance Score**: 94,2/100
- **RIFs Enviados**: 23/23 (100% dentro do prazo)

### Status Geral: 🟢 **CONFORME**

---

## 🎯 Indicadores por Categoria

### Lavagem de Dinheiro
| Métrica | Valor | Status |
|---------|-------|--------|
| Operações Analisadas | 1.247 | ✅ |
| Operações Suspeitas | 23 (1,84%) | ⚠️ |
| RIFs Enviados | 23/23 | ✅ |
| Prazo Médio Envio | 18h | ✅ |

### Financiamento ao Terrorismo  
| Métrica | Valor | Status |
|---------|-------|--------|
| Operações Analisadas | 1.247 | ✅ |
| Operações Suspeitas | 0 (0%) | ✅ |
| RIFs Enviados | 0/0 | ✅ |

---

## 🚨 Principais Riscos Identificados

### 1. Transferências Internacionais (Alto Risco)
- **Quantidade**: 23 operações  
- **Valor Médio**: R$ 485.000
- **Principal Destino**: Panamá (15), Ilhas Cayman (5), Uruguai (3)
- **Ação**: Todas bloqueadas preventivamente

### 2. Operações em Espécie (Médio Risco)  
- **Quantidade**: 156 operações
- **Valor Médio**: R$ 45.000
- **Padrão**: Depósitos fracionados abaixo de R$ 50k
- **Ação**: Monitoramento intensificado

---

## 📈 Tendências e Insights

### Evolução Trimestral
```
Q1 2024: 1,2% taxa suspeição
Q2 2024: 1,6% taxa suspeição  
Q3 2024: 1,8% taxa suspeição ⬆️ (+0,2pp)
```

### Principais Mudanças
- **↗️ Aumento** em transferências para paraísos fiscais
- **↘️ Redução** em operações com criptomoedas
- **→ Estável** operações em espécie

---

## 🎯 Recomendações Estratégicas

### Curto Prazo (30 dias)
1. **Intensificar monitoramento** de transferências >R$ 200k
2. **Treinar equipe** em novos indicadores de risco
3. **Implementar** alertas automáticos para paraísos fiscais

### Médio Prazo (90 dias)
1. **Desenvolver** modelo preditivo de risco
2. **Integrar** APIs de listas restritivas internacionais  
3. **Auditar** processos de análise manual

### Longo Prazo (12 meses)
1. **Automizar** 70% das análises de baixo risco
2. **Implementar** IA para detecção de padrões
3. **Obter** certificação ISO 31000

---

## 📋 Anexos

- **Anexo I**: Lista detalhada de RIFs enviados
- **Anexo II**: Relatório técnico de sistemas  
- **Anexo III**: Atas de reuniões do Comitê de Compliance

---

**Documento Assinado Digitalmente**  
João Silva - Compliance Officer  
Certificado ICP-Brasil A3  
Hash: a1b2c3d4e5f6...
```

### **4. Tabelas Estruturadas**

#### **Caso de Uso: Dashboard de KPIs**
```markdown
## KPIs de Performance - eCommerce Q3 2024

### Métricas de Conversão por Categoria

| Categoria | Tráfego | Conversão | Revenue | AOV | Status |
|-----------|---------|-----------|---------|-----|--------|
| Smartphones | 45.2K | 3.2% | R$ 1.8M | R$ 1.249 | 🟢 |
| Notebooks | 23.1K | 2.1% | R$ 980K | R$ 2.015 | 🟡 |
| Acessórios | 67.8K | 5.8% | R$ 445K | R$ 113 | 🟢 |
| TVs | 12.4K | 1.8% | R$ 670K | R$ 2.987 | 🔴 |

### Performance por Canal

| Canal | CAC | LTV | ROI | Payback | Trend |
|-------|-----|-----|-----|---------|-------|
| Google Ads | R$ 67 | R$ 234 | 3.49x | 3.2 meses | ↗️ |
| Facebook | R$ 45 | R$ 189 | 4.20x | 2.8 meses | ↗️ |
| Organic | R$ 12 | R$ 298 | 24.8x | 0.4 meses | → |
| Email | R$ 8 | R$ 167 | 20.9x | 0.3 meses | ↘️ |

### Alertas e Ações

| Métrica | Atual | Meta | Gap | Ação Requerida | Responsável |
|---------|-------|------|-----|----------------|-------------|
| Conversão TVs | 1.8% | 2.5% | -0.7pp | Otimizar landing pages | UX Team |
| ROI Facebook | 4.20x | 5.0x | -0.8x | Revisar criativos | Marketing |
| Email Open Rate | 18% | 25% | -7pp | A/B test subject lines | CRM Team |
```

---

## 🔧 Implementação Técnica

### **Prompt para JSON Output**

```markdown
Você é um analista de compliance BCB especializado.

Analise esta operação bancária e responda EXCLUSIVAMENTE no formato JSON especificado:

OPERAÇÃO:
- Valor: R$ 300.000
- Origem: Conta PJ (Comércio de eletrônicos)  
- Destino: Banco no Uruguai
- Justificativa: "Importação de produtos"

FORMATO JSON OBRIGATÓRIO:
{
  "analise_id": "string (gerado automaticamente)",
  "timestamp": "ISO 8601 datetime",
  "operacao": {
    "valor_brl": number,
    "tipo": "string",
    "origem": "string",
    "destino": "string"  
  },
  "classificacao_risco": "BAIXO|MEDIO|ALTO|CRITICO",
  "score_risco": number (0-10),
  "indicadores_suspeitos": [
    {
      "tipo": "string",
      "descricao": "string",
      "norma_bcb": "string"
    }
  ],
  "recomendacao": {
    "acao": "APROVAR|BLOQUEAR|INVESTIGAR",
    "prazo_horas": number,
    "justificativa": "string"
  },
  "confianca": number (0.0-1.0)
}

INSTRUÇÕES CRÍTICAS:
- Responda APENAS com JSON válido
- Todos os campos são obrigatórios
- Use apenas os valores enum especificados
- Baseie-se em normas BCB reais
- Se dados insuficientes: "confianca": 0.0
```

### **Validação Automática de Output**

```python
import json
import jsonschema
from datetime import datetime

def validate_compliance_output(response_text, schema):
    """Valida se output atende ao schema especificado"""
    try:
        # Parse JSON
        data = json.loads(response_text)
        
        # Validação de schema
        jsonschema.validate(data, schema)
        
        # Validações específicas de negócio
        business_validation = validate_business_rules(data)
        
        return {
            "is_valid": business_validation["is_valid"],
            "parsed_data": data,
            "validation_errors": business_validation["errors"],
            "timestamp": datetime.now().isoformat()
        }
        
    except json.JSONDecodeError as e:
        return {
            "is_valid": False,
            "error": f"Invalid JSON: {str(e)}",
            "raw_response": response_text
        }
    except jsonschema.ValidationError as e:
        return {
            "is_valid": False,
            "error": f"Schema validation failed: {str(e)}",
            "raw_response": response_text
        }

def validate_business_rules(data):
    """Validações específicas de regras de negócio"""
    errors = []
    
    # Validar classificação de risco vs score
    risk_classification = data.get("classificacao_risco")
    risk_score = data.get("score_risco", 0)
    
    risk_score_ranges = {
        "BAIXO": (0, 3),
        "MEDIO": (3, 6),  
        "ALTO": (6, 8),
        "CRITICO": (8, 10)
    }
    
    if risk_classification in risk_score_ranges:
        min_score, max_score = risk_score_ranges[risk_classification]
        if not (min_score <= risk_score <= max_score):
            errors.append(f"Risk score {risk_score} incompatible with classification {risk_classification}")
    
    # Validar se há indicadores suspeitos para risco ALTO/CRÍTICO
    if risk_classification in ["ALTO", "CRITICO"]:
        indicadores = data.get("indicadores_suspeitos", [])
        if len(indicadores) == 0:
            errors.append("High/Critical risk must have suspicious indicators")
    
    # Validar recomendação vs risco
    recomendacao = data.get("recomendacao", {}).get("acao")
    if risk_classification in ["ALTO", "CRITICO"] and recomendacao == "APROVAR":
        errors.append("High/Critical risk should not recommend APROVAR")
    
    return {
        "is_valid": len(errors) == 0,
        "errors": errors
    }
```

### **Template Engine para Formatação**

```python
class OutputFormatter:
    def __init__(self):
        self.format_templates = {
            "json": self.format_json,
            "xml": self.format_xml,
            "markdown": self.format_markdown,
            "table": self.format_table,
            "csv": self.format_csv
        }
    
    def format_output(self, data, format_type, template_config=None):
        """Formata dados conforme tipo especificado"""
        if format_type not in self.format_templates:
            raise ValueError(f"Unsupported format: {format_type}")
        
        formatter = self.format_templates[format_type]
        return formatter(data, template_config or {})
    
    def format_json(self, data, config):
        """Formatação JSON com validação de schema"""
        formatted = json.dumps(data, ensure_ascii=False, indent=config.get("indent", 2))
        
        if "schema" in config:
            validation = validate_compliance_output(formatted, config["schema"])
            if not validation["is_valid"]:
                raise ValueError(f"JSON validation failed: {validation['validation_errors']}")
        
        return formatted
    
    def format_markdown(self, data, config):
        """Formatação Markdown estruturada"""
        if "template" in config:
            return self.render_markdown_template(data, config["template"])
        
        # Formatação automática baseada no tipo de dados
        if isinstance(data, dict) and "analise_compliance" in data:
            return self.format_compliance_markdown(data)
        elif isinstance(data, list) and all("kpi" in item for item in data):
            return self.format_kpi_table_markdown(data)
        else:
            return self.auto_format_markdown(data)
    
    def format_compliance_markdown(self, data):
        """Template específico para análise de compliance"""
        template = """
# Análise de Compliance - {analise_id}

**Data**: {timestamp}  
**Analista**: Sistema Automatizado  
**Confiança**: {confianca:.1%}

## 📊 Resumo da Operação

- **Valor**: R$ {operacao[valor_brl]:,.2f}
- **Tipo**: {operacao[tipo]}
- **Origem**: {operacao[origem]}  
- **Destino**: {operacao[destino]}

## 🚨 Avaliação de Risco

**Classificação**: {classificacao_risco}  
**Score**: {score_risco}/10

### Indicadores Suspeitos
{indicadores_list}

## 🎯 Recomendação

**Ação**: {recomendacao[acao]}  
**Prazo**: {recomendacao[prazo_horas]}h  
**Justificativa**: {recomendacao[justificativa]}
        """.strip()
        
        # Processar indicadores
        indicadores_list = ""
        for ind in data.get("indicadores_suspeitos", []):
            indicadores_list += f"- **{ind['tipo']}**: {ind['descricao']} (Norma: {ind['norma_bcb']})\n"
        
        data["indicadores_list"] = indicadores_list or "Nenhum indicador identificado"
        
        return template.format(**data)
```

---

## 📊 Casos de Uso Avançados

### **Multi-Format Output**

```markdown
Você é um analista de performance de eCommerce.

Analise os dados de Q3 2024 e gere 3 formatos diferentes:

DADOS: [dados de performance]

FORMATO 1 - JSON (para API):
{
  "period": "Q3 2024",
  "metrics": {
    "total_revenue": number,
    "conversion_rate": number,
    "avg_order_value": number
  },
  "channels": [
    {
      "name": "string",
      "performance": {
        "revenue": number,
        "roi": number,
        "trend": "UP|DOWN|STABLE"
      }
    }
  ],
  "recommendations": ["array of strings"]
}

FORMATO 2 - MARKDOWN (para relatório):
# Performance Report Q3 2024
## Key Metrics
[tabela organizada]
## Channel Analysis  
[análise detalhada]
## Recommendations
[lista priorizada]

FORMATO 3 - CSV (para planilha):
Channel,Revenue,Conversion,ROI,Status
[dados tabulares]
```

### **Conditional Formatting**

```markdown
Analise esta operação financeira.

Se RISCO = BAIXO, responda em formato RESUMIDO:
{
  "status": "APROVADO",
  "risco": "BAIXO", 
  "observacoes": "string breve"
}

Se RISCO = MÉDIO/ALTO/CRÍTICO, responda em formato DETALHADO:
{
  "metadata": {...},
  "analise_completa": {...},
  "indicadores_detalhados": [...],
  "plano_acao": {...}
}

OPERAÇÃO: [dados]
```

### **Progressive Disclosure**

```markdown
Gere relatório com 3 níveis de detalhe:

NÍVEL 1 - EXECUTIVO (C-level):
- Máximo 5 bullet points
- Foco em impacto no negócio
- Recomendações estratégicas

NÍVEL 2 - GERENCIAL (Managers):  
- Detalhamento tático
- Métricas específicas
- Planos de ação com prazos

NÍVEL 3 - OPERACIONAL (Analistas):
- Dados técnicos completos
- Metodologia detalhada  
- Instruções específicas de implementação

DADOS: [input data]
```

---

## 🧪 Testing de Formatos

### **Test Suite para Output Validation**

```python
import pytest
from output_validator import validate_output_format

class TestOutputFormatting:
    
    def test_json_compliance_format(self):
        """Testa formato JSON para análise de compliance"""
        sample_response = """{
          "analise_id": "COMP-2024-001",
          "classificacao_risco": "ALTO",
          "score_risco": 7.5,
          "recomendacao": {"acao": "BLOQUEAR"}
        }"""
        
        result = validate_output_format(sample_response, "json", "compliance_schema")
        assert result["is_valid"] == True
        assert result["parsed_data"]["classificacao_risco"] in ["BAIXO", "MEDIO", "ALTO", "CRITICO"]
    
    def test_markdown_structure(self):
        """Testa estrutura de relatório Markdown"""
        sample_response = """
        # Análise de Performance Q3 2024
        ## Resumo Executivo
        - Revenue: R$ 1.2M
        ## Recomendações
        1. Otimizar conversão
        """
        
        result = validate_output_format(sample_response, "markdown", "report_template")
        assert "# Análise de Performance" in result["content"]
        assert "## Resumo Executivo" in result["content"]
        assert "## Recomendações" in result["content"]
    
    def test_format_consistency(self):
        """Testa consistência entre formatos diferentes do mesmo conteúdo"""
        base_data = {"revenue": 1000000, "conversion": 0.032}
        
        json_output = format_output(base_data, "json")
        table_output = format_output(base_data, "table")
        
        # Validar que os dados essenciais estão presentes em ambos formatos
        assert "1000000" in json_output or "1,000,000" in json_output
        assert "0.032" in json_output or "3.2%" in json_output
        assert "1,000,000" in table_output
        assert "3.2%" in table_output
```

---

## 🚀 Próximos Passos

### **Para Implementação**
1. **[Role Definition](role-definition.md)** - Papéis especializados com outputs específicos
2. **[Context Provision](context-provision.md)** - Gestão de contexto para formats complexos
3. **[Templates](prompt-templates-and-variables.md)** - Templates com formatting integrado

### **Para Automação**
1. **[Tools - Output Validator](../tools/prompt-validator.md)** - Validação automática de formatos
2. **[Testing Framework](../tests/validation-framework.md)** - Testes de consistência de formato
3. **[API Integration](../optimization/api-integration.md)** - Integração com sistemas corporativos

### **Para Casos Avançados**  
1. **[XML Tags Framework](../advanced/xml-tags-complete-guide.md)** - Estruturação complexa
2. **[Multi-format Responses](../advanced/multi-format-outputs.md)** - Múltiplos formatos simultâneos
3. **[Real-time Formatting](../optimization/streaming-responses.md)** - Formatação em streaming

---

*Output formatting preciso transforma LLMs de ferramentas de texto em componentes de sistemas corporativos integrados e auditáveis.*

---

**Desenvolvido por Dutt eCommerce Website Design - Integração de IA em infraestrutura corporativa e sistemas regulamentados.**