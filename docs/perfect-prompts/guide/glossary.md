# Glossário Técnico de Prompt Engineering

**Referência Completa** | **Versão 1.0** | **Dutt eCommerce Website Design**

---

## A

### **Agent (Agente)**
Sistema autônomo baseado em LLM capaz de executar sequências de tarefas, tomar decisões e interagir com APIs externas. Frequentemente usado em automações corporativas.

**Exemplo prático**: Agent de compliance que monitora transações, identifica irregularidades e gera relatórios automaticamente.

### **API (Application Programming Interface)**
Interface para integração de LLMs com sistemas corporativos, permitindo automação de prompts e processamento programático de respostas.

**Modelos principais**: OpenAI API, Anthropic Claude API, Google Gemini API.

### **Alucinação (Hallucination)**
Geração de informações incorretas ou inventadas pelo modelo, apresentadas com aparente confiança. Principal risco em aplicações críticas.

**Prevenção**: Validation frameworks, fact-checking, temperature baixa, prompts estruturados.

---

## B

### **Batch Processing (Processamento em Lote)**
Técnica de envio de múltiplos prompts simultaneamente para otimizar custos e latência. Essencial para operações de alto volume.

**Casos de uso**: Análise de milhares de documentos, geração de relatórios mensais, processamento de dados históricos.

### **BCB (Banco Central do Brasil)**
Órgão regulador brasileiro. Referência constante em prompts para setor financeiro, especialmente para compliance e análise de risco.

**Regulamentações relevantes**: Circular 3.542 (AML), Resolution 4.658 (Open Banking), PIX regulations.

---

## C

### **Chain of Thought (CoT)**
Técnica que instrui o modelo a explicitar seu processo de raciocínio passo a passo, melhorando a qualidade de análises complexas.

**Implementação básica**: "Pense passo a passo antes de responder."
**Implementação avançada**: Estruturação detalhada do processo de reasoning.

### **Context Window (Janela de Contexto)**
Quantidade máxima de tokens (input + output) que um modelo pode processar em uma única interação.

**Limites atuais (2025)**:
- Claude 3.5 Sonnet: 200K tokens
- GPT-4 Turbo: 128K tokens  
- Gemini Pro: 2M tokens

### **Context Management (Gestão de Contexto)**
Estratégias para otimizar o uso da janela de contexto, incluindo compressão, chunking e priorização de informações.

### **Completion**
Resposta gerada pelo modelo baseada no prompt fornecido. Também se refere ao endpoint de API para geração de texto.

### **Compliance**
Aderência a regulamentações setoriais. Aspecto crítico em prompts para setores regulamentados (financeiro, saúde, governo).

---

## D

### **Delimiter (Delimitador)**
Marcadores utilizados para separar seções do prompt e evitar prompt injection. Comumente XML tags ou símbolos especiais.

**Exemplos**: `<instructions>`, `###`, `---`, `"""`.

### **Documentation Generation**
Aplicação de LLMs para criação automática de documentação técnica, manuais de usuário e especificações.

---

## E

### **Embedding**
Representação numérica de texto que permite comparações semânticas. Usado em RAG e sistemas de busca inteligente.

### **Extended Context** 
Técnicas para trabalhar com informações que excedem a janela de contexto através de chunking, summarization e retrieval.

---

## F

### **Few-shot Learning**
Técnica onde alguns exemplos são fornecidos no prompt para treinar o comportamento desejado sem fine-tuning.

**Estrutura típica**:
```
Exemplo 1: Input → Output desejado
Exemplo 2: Input → Output desejado  
Exemplo 3: Input → Output desejado
Seu input: [dados reais]
```

### **Fine-tuning**
Processo de especialização de um modelo base para domínios específicos através de treinamento adicional.

**Alternativas**: In-context learning, RAG, prompt optimization.

### **Function Calling**
Capacidade do modelo de executar funções/ferramentas externas durante o processamento, permitindo integrações dinâmicas.

**Casos de uso**: Consulta de APIs, cálculos matemáticos, verificação de fatos em tempo real.

---

## G

### **Grounding**
Ancoragem das respostas do modelo em fontes de informação confiáveis para reduzir alucinações.

**Métodos**: RAG, citation requirements, fact-checking prompts.

---

## H

### **Hyperparameter**
Configurações que controlam o comportamento do modelo:
- **Temperature**: Controla aleatoriedade (0.0 = determinístico, 1.0 = criativo)
- **Top-p**: Controla diversidade de vocabulário  
- **Max tokens**: Limite de tokens no output
- **Frequency penalty**: Reduz repetições

---

## I

### **Instruction Following**
Capacidade do modelo de seguir instruções complexas e estruturadas. Base do prompt engineering moderno.

### **In-context Learning**
Habilidade de aprender padrões através de exemplos fornecidos no prompt, sem modificar os parâmetros do modelo.

---

## J

### **JSON Mode**
Configuração que força o modelo a responder exclusivamente em formato JSON válido, essencial para integrações programáticas.

**Implementação OpenAI**: `response_format={"type": "json_object"}`

---

## L

### **LLM (Large Language Model)**
Modelo de linguagem de grande escala treinado em vastos conjuntos de dados textuais. Base dos sistemas de prompt engineering.

**Modelos líderes (2025)**: GPT-4, Claude 3.5, Gemini Pro, Llama 2/3.

### **LGPD (Lei Geral de Proteção de Dados)**
Regulamentação brasileira de privacidade. Impacta prompts que processam dados pessoais.

**Implicações**: Anonimização de dados, consent management, direito de esquecimento.

---

## M

### **Multimodal**
Capacidade de processar múltiplos tipos de dados (texto, imagem, áudio) em um único prompt.

**Casos de uso**: Análise de documentos com gráficos, OCR inteligente, descrição de imagens.

### **Multi-shot Prompting** 
Extensão do few-shot com muitos exemplos (10+) para treinamento de comportamentos complexos.

---

## O

### **One-shot Learning**
Fornecimento de apenas um exemplo no prompt para demonstrar o padrão desejado.

### **Output Formatting**
Especificação precisa da estrutura de resposta desejada (JSON, XML, tabelas, listas).

---

## P

### **Prefill (Prefilling)**
Técnica onde parte da resposta é pré-escrita para guiar a continuação do modelo em direção específica.

**Exemplo Anthropic Claude**:
```
Human: Analise este documento...
Assistant: Baseado na análise do documento, identifiquei os seguintes pontos críticos:

1.
```

### **Prompt Injection**
Tentativa maliciosa de manipular o comportamento do modelo através de instruções escondidas no input do usuário.

**Prevenção**: Input sanitization, delimitadores, validation layers.

### **Prompt Template**
Estrutura reutilizável com placeholders para diferentes inputs, permitindo padronização e automação.

---

## Q

### **Quality Assurance (QA)**
Processos de validação da qualidade de outputs, incluindo accuracy, consistency e compliance checks.

---

## R

### **RAG (Retrieval Augmented Generation)**
Sistema que combina geração de texto com busca em base de conhecimento externa para informações atualizadas.

**Componentes**: Vector database, embedding model, retrieval system, generation model.

### **Role-playing**
Atribuição de papel específico ao modelo para direcionar perspectiva e expertise das respostas.

**Exemplos setoriais**: 
- "Você é um auditor sênior..."
- "Você é um especialista em UX..."  
- "Você é um analista de compliance BCB..."

---

## S

### **System Prompt**
Instruções iniciais que definem comportamento, personalidade e constraints do modelo para toda a conversação.

**Diferença do user prompt**: System prompt = configuração persistente; User prompt = instrução específica.

### **Structured Output**
Resposta em formato predefinido (JSON, XML, tabela) para facilitar processamento programático.

### **Streaming**
Transmissão progressiva da resposta à medida que é gerada, melhorando percepção de performance.

---

## T

### **Temperature**
Parâmetro que controla a aleatoriedade das respostas:
- **0.0-0.3**: Determinístico, ideal para análises
- **0.4-0.7**: Balanceado  
- **0.8-1.0**: Criativo, ideal para brainstorming

### **Token**
Unidade básica de processamento (geralmente ~4 caracteres em português). Base para cálculo de custos e limites.

**Estimativa rápida**: 1 página = ~500-1000 tokens.

### **Top-p (Nucleus Sampling)**
Parâmetro que controla diversidade de vocabulário considerando apenas os tokens mais prováveis.

**Recomendação**: 0.9 para a maioria dos casos corporativos.

---

## V

### **Validation Framework**
Sistema de verificação automática da qualidade e conformidade de outputs antes do uso em produção.

**Componentes**: Schema validation, fact-checking, compliance checks.

### **Vector Database**
Base de dados otimizada para armazenar e buscar embeddings, essencial para implementações RAG.

**Soluções populares**: Pinecone, Weaviate, Chroma, Qdrant.

---

## X

### **XML Tags**
Sistema de estruturação de prompts usando tags XML para organizar seções e melhorar interpretação.

**Exemplo**:
```xml
<instructions>
Analise o documento fornecido
</instructions>

<context>  
Você é um especialista em compliance
</context>

<output_format>
Responda em formato JSON estruturado
</output_format>
```

---

## Z

### **Zero-shot Learning**
Execução de tarefas sem exemplos prévios, baseando-se apenas na instrução e conhecimento pré-treinado do modelo.

**Vantagem**: Simplicidade e velocidade.  
**Desvantagem**: Menor precisão comparado a few-shot.

---

## 🔗 Referências Cruzadas

### **Por Categoria de Uso**

#### **Conformidade Regulatória**
- [BCB](#bcb-banco-central-do-brasil)
- [LGPD](#lgpd-lei-geral-de-proteção-de-dados)  
- [Compliance](#compliance)
- [Validation Framework](#validation-framework)

#### **Otimização Técnica**
- [Context Management](#context-management)
- [Batch Processing](#batch-processing-processamento-em-lote)
- [Token](#token)
- [Temperature](#temperature)

#### **Estruturação Avançada**
- [XML Tags](#xml-tags)
- [Chain of Thought](#chain-of-thought-cot)
- [System Prompt](#system-prompt)
- [Few-shot Learning](#few-shot-learning)

#### **Integração Corporativa**
- [Function Calling](#function-calling)
- [API](#api-application-programming-interface)
- [RAG](#rag-retrieval-augmented-generation)
- [Structured Output](#structured-output)

---

*Este glossário é mantido atualizado com as últimas práticas e tecnologias do mercado. Desenvolvido por **Dutt eCommerce Website Design**.*