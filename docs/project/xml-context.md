# **Estratégias de Construção de Contexto e Arquiteturas de Multi-Chain Prompts para Mitigação de Alucinações e Otimização de Desempenho de LLMs**

## **1\. Resumo Executivo**

A análise sistemática da construção de contexto para Large Language Models (LLMs) revela que não existe um método único e universalmente superior. Em vez disso, a maximização do desempenho, a eliminação de alucinações e a garantia de precisão exigem uma abordagem arquitetural e multifacetada. A engenharia de prompts, que no passado era vista como uma "arte" de formulação de texto, evoluiu para uma disciplina de engenharia de sistemas. A otimização de modelos de ponta, como o GPT-5, transcende a mera linguagem natural, integrando-se profundamente com os novos parâmetros e as capacidades das interfaces de programação (APIs).

O método mais eficiente e preciso, portanto, é a implementação de um pipeline de engenharia que combine três pilares estratégicos: (1) a estruturação rigorosa do contexto de entrada, (2) a orquestração de tarefas complexas através de Multi-Chain Prompts (MCPs), e (3) a sinergia com mecanismos de raciocínio internos e saídas estruturadas. A mitigação de alucinações não se resolve apenas na fase de entrada, mas também por meio de camadas de validação pós-geração, que gerenciam o paradoxo da plausibilidade inerente aos modelos de raciocínio avançado.

As principais descobertas deste estudo incluem:

* A precisão e a fiabilidade da saída de uma LLM dependem diretamente da capacidade de impor uma lógica externa ao seu processo de correspondência de padrões probabilísticos.  
* A utilização de Saídas Estruturadas (como Function Calling ou Context-Free Grammar) é um componente crítico da construção de contexto em fluxos de trabalho de múltiplos passos, pois garante que a saída de um prompt seja uma entrada limpa e consistente para o próximo.  
* A Responses API do GPT-5 introduz uma forma de persistir e reutilizar o contexto de raciocínio interno do modelo, otimizando não apenas o desempenho, mas também o custo operacional em termos de tokens.

A principal recomendação é a adoção de uma arquitetura híbrida de fluxos de trabalho de MCPs, que utiliza Saídas Estruturadas e Raciocínio Explícito (Chain-of-Thought) para maximizar a fiabilidade, e uma camada de validação subsequente para garantir a veracidade dos resultados.

## **2\. Fundamentos do Contexto e Raciocínio em LLMs**

### **A Natureza Probabilística do Raciocínio**

No seu núcleo, os Large Language Models (LLMs) são sistemas treinados para prever a próxima palavra com base em padrões probabilísticos aprendidos em vastos corpora de texto.1 Este paradigma de treino fundamentalmente molda a forma como abordam as tarefas de raciocínio. Ao invés de empregarem uma lógica verdadeira e dedutiva, os modelos realizam uma correspondência sofisticada de padrões, procurando semelhanças entre a entrada atual e os padrões encontrados nos seus dados de treino.1 O raciocínio in-contexto, onde o modelo gera uma resposta com base no contexto fornecido no prompt, é a principal forma pela qual estes sistemas operam fora do treino.1

Esta natureza probabilística cria desafios significativos. Os modelos podem ter dificuldade em generalizar para além dos padrões de treino, aplicar consistentemente princípios lógicos e coordenar múltiplos passos de raciocínio, especialmente em cenários novos ou fora da distribuição.1 O gap entre o raciocínio humano e o do LLM torna-se evidente em tarefas que exigem uma lógica explícita e uma resolução de problemas estruturada.2

### **O Raciocínio Estruturado como Ponte para a Lógica Humana**

O contexto fornecido no prompt atua como uma "base de conhecimento" temporária ou um "estado" para o modelo, permitindo-lhe realizar tarefas através de um processo denominado "aprendizagem em contexto" (in-context learning).1 A qualidade e a estrutura deste contexto são, por conseguinte, críticas para superar as limitações inerentes do raciocínio do modelo.

A pesquisa recente demonstra que a lacuna de raciocínio pode ser significativamente reduzida ao impor uma estrutura externa ao modelo. O ato de converter dados não estruturados em formatos estruturados, anotando explicitamente as etapas de raciocínio com tags ou rótulos, fortalece as capacidades de raciocínio dos LLMs.2 Esta abordagem permite que a LLM, por si só uma "caixa preta" de correspondência de padrões, seja orientada a seguir um caminho de raciocínio que se torna explícito e verificável. Esta imposição de uma lógica externa força o modelo a desviar-se da sua natureza puramente probabilística e a mover-se em direção a um processo mais determinístico e lógico. A prática de estruturar o prompt não é apenas sobre clareza; é uma estratégia de engenharia que visa impor um processo lógico, o que é fundamental para a precisão e a mitigação de falhas em tarefas de raciocínio complexo.

## **3\. Pilares Estratégicos para a Construção de Contexto**

### **3.1. Engenharia de Prompts Estruturada com Tags**

A estruturação do prompt é a fundação para uma construção de contexto precisa. Uma técnica eficaz é a utilização de tags ou delimitadores, como as tags XML, para separar e demarcar as várias componentes da entrada.3 Em vez de processar um único bloco de texto monolítico, o LLM pode identificar e tratar cada segmento — sejam instruções, contexto, dados de entrada ou exemplos — de acordo com o seu propósito específico, conforme definido pelas tags.3

Esta abordagem oferece vários benefícios notáveis. Em primeiro lugar, cria limites claros que impedem que as diferentes partes do prompt se "contaminem" umas às outras, garantindo que o modelo entenda onde as instruções terminam e onde os dados de entrada começam.3 Em segundo lugar, reduz a ambiguidade em prompts complexos com múltiplas seções ou dados hierárquicos, melhorando a adesão às instruções.3 A precisão cirúrgica com que modelos como o GPT-5 seguem as instruções do prompt demonstra a importância desta "gramática do prompt".4 A utilização de tags com nomes semânticos e consistentes, como

\<instruction\> e \<data\_to\_process\>, melhora a interpretabilidade tanto para humanos quanto para o modelo.3 Em ambientes de segurança sensíveis, as tags XML podem também atuar como uma camada de defesa, isolando a entrada potencialmente não confiável do utilizador das instruções do sistema, prevenindo ataques de injeção de prompt.3

### **3.2. Saídas Estruturadas e Gramáticas**

A integração de LLMs com sistemas de backend, como pipelines de dados ou APIs, exige que as saídas dos modelos sejam consistentes, confiáveis e formatadas com precisão.5 A saída em texto livre é inerentemente propensa a inconsistências, podendo ser cortada inesperadamente ou variar entre chamadas.6 As Saídas Estruturadas, que garantem que as respostas do modelo sigam um formato predefinido como JSON ou XML, resolvem este problema.5

As técnicas para obter saídas estruturadas evoluíram:

* **Instruções no Prompt:** A abordagem mais simples envolve instruir o modelo a "retornar apenas JSON", mas esta técnica é inconsistente e pode falhar em produzir uma saída válida.6  
* **Function Calling:** Uma abordagem mais robusta, onde o modelo é fornecido com um esquema de API predefinido e retorna uma carga útil estruturada (normalmente em JSON) que adere a esse esquema.6 Os modelos mais recentes foram especificamente otimizados para esta tarefa, garantindo um desempenho superior.7  
* **Gramática Livre de Contexto (CFG):** O GPT-5 introduziu o suporte para CFG, que atua como um "contrato" para garantir que a saída do modelo seja sintaticamente válida para uma linguagem de programação ou outro formato personalizado.8 Esta técnica garante uma confiabilidade de 100% na formatação, sendo ideal para sistemas que exigem consistência e precisão.5

A Saída Estruturada é um componente fundamental na construção de contexto em fluxos de trabalho de múltiplos passos. A saída de um passo de raciocínio, por exemplo, um JSON validado, pode ser utilizada como uma entrada limpa e precisa para o passo seguinte, permitindo a automação e a confiabilidade de toda a cadeia de processamento.5 A introdução de CFG e Function Calling nativa em modelos de ponta eleva a fiabilidade de toda a arquitetura de Multi-Chain Prompt.

### **3.3. Multi-Chain Prompts (MCPs) e a Arquitetura de Fluxo de Trabalho**

Os Multi-Chain Prompts (MCPs), ou encadeamento de prompts, são a orquestração de prompts numa sequência lógica, onde a saída de um prompt serve como entrada para o próximo.10 Esta abordagem modular permite que as LLMs resolvam tarefas complexas e multi-etapas que seriam impossíveis com um único prompt, como processamento de texto em várias etapas, sumarização ou resposta a perguntas complexas.10

Existem vários tipos de encadeamento para suportar fluxos de trabalho diversos:

* **Enadeamento Sequencial:** A saída de um passo é diretamente a entrada do próximo, como na extração de palavras-chave.10  
* **Enadeamento Ramificado:** Permite a tomada de decisões no fluxo de trabalho com base nos resultados de um passo, como a geração de um resumo de sentimentos.10  
* **Enadeamento Iterativo:** O fluxo de trabalho se adapta com base nas saídas em tempo real, refinando uma tarefa como a sumarização.10  
* **Enadeamento Dinâmico:** Adapta o fluxo de trabalho com base nas condições mutáveis.10  
* **Enadeamento Recursivo:** Divide grandes entradas em pedaços menores para processamento individual e combina os resultados, útil para documentos extensos.10

Ferramentas como o LangChain foram projetadas para simplificar a orquestração de MCPs, abstraindo a complexidade da gestão de prompts e permitindo aos desenvolvedores focar-se na resolução dos problemas.10 Em cenários de automação de suporte ao cliente, esta arquitetura permite quebra-se a tarefa de lidar com uma consulta complexa em prompts modulares, garantindo respostas mais personalizadas e precisas.11

## **4\. Mitigação de Alucinações: Técnicas e Trade-offs**

### **4.1. Raciocínio Explícito: O Poder da Cadeia de Pensamento (CoT)**

A técnica de Chain-of-Thought (CoT) é uma abordagem fundamental onde o prompt instrui o modelo a decompor um problema em etapas de raciocínio intermediárias antes de fornecer a resposta final.1 Ao forçar o modelo a "pensar em voz alta", o CoT torna o processo de raciocínio explícito e verificável.1 Estudos mostram que o CoT melhora significativamente a precisão em tarefas de raciocínio complexo, com reduções de até 28% em erros matemáticos.13

No entanto, a utilização do CoT apresenta um paradoxo crítico: embora reduza a *frequência* das alucinações, torna as alucinações remanescentes mais difíceis de *detetar*.14 O raciocínio passo a passo amplifica semanticamente a "confiança" interna do modelo, o que resulta na produção de tokens incorretos com alta probabilidade.14 Como resultado, as alucinações geradas por um modelo que usa CoT parecem mais plausíveis, ofuscando os sinais de alerta utilizados por métodos de deteção.14 Para aplicações de alta criticidade, a simples aplicação do CoT não é suficiente; é imperativo combiná-lo com uma camada de validação posterior para garantir a veracidade da saída.

### **4.2. Recuperação-Aumentada de Geração (RAG)**

O RAG é uma técnica que combate as alucinações ao "ancorar" as respostas do modelo em dados factuais recuperados de uma fonte de dados externa.16 Ao invés de confiar apenas na sua base de conhecimento interna, a LLM utiliza a informação recuperada para gerar a sua resposta, garantindo que seja baseada em factos e não em informações fabricadas.16 Existem variações do RAG, como a estrutura

Decompose and Query, que quebra a consulta do utilizador em sub-perguntas para pesquisa, e o FreshPrompt, que utiliza um motor de busca atualizado para recuperar informações relevantes.16

### **4.3. Aprendizagem por Reforço e Alinhamento Deliberativo**

Além das técnicas de engenharia de prompts, a mitigação de alucinações também é abordada na fase de treino do modelo. O Reinforcement Learning from Human Feedback (RLHF) refina o comportamento do modelo com base na avaliação de revisores humanos, reduzindo os erros factuais em até 40%.13 Uma técnica mais avançada, o Alinhamento Deliberativo, ensina o modelo a raciocinar sobre as especificações de segurança antes de gerar uma resposta, o que aumenta a resistência contra ataques adversariais.1

## **5\. Otimização de Desempenho com Parâmetros e APIs de Próxima Geração**

A nova geração de LLMs, como o GPT-5, oferece controles refinados de desenvolvimento que elevam a otimização de uma técnica de prompt para uma decisão de design de sistema.

### **Controle de Raciocínio com reasoning\_effort**

O parâmetro reasoning\_effort controla o quão intensamente o modelo "pensa" e a sua propensão para utilizar ferramentas.4 Ele permite um compromisso entre latência, custo e qualidade:

* low: Ideal para tarefas leves, rápidas e determinísticas, como extração ou formatação, onde o raciocínio complexo não é necessário.8  
* medium (default): Um equilíbrio entre desempenho e custo.4  
* high: Recomendado para tarefas complexas que exigem planeamento multi-etapas, como design de sistemas ou fluxos de trabalho que dependem do uso extensivo de ferramentas.4

Ajustar este parâmetro com base na complexidade da tarefa permite uma otimização precisa, evitando que o modelo "pense demais" para tarefas simples e garantindo que ele dedique o esforço adequado para problemas mais complexos.4

### **Persistência de Contexto com a Responses API**

Um dos avanços mais significativos no GPT-5 é a Responses API, que permite a persistência do contexto de raciocínio interno do modelo.17 Em fluxos de trabalho de múltiplos turnos, os modelos convencionais descartam os tokens de raciocínio após cada interação.17 No entanto, a

Responses API permite que estes tokens de raciocínio, que representam o "pensamento" do modelo, persistam. Ao incluir o previous\_response\_id em mensagens subsequentes, o modelo pode aceder ao seu raciocínio anterior, o que "conserva os tokens CoT" e elimina a necessidade de reconstruir o plano a cada passo.17

A capacidade de persistir e reutilizar estes tokens de raciocínio é uma forma de otimização que não é apenas para o desempenho, mas também para o custo. Os tokens de raciocínio têm um custo associado, e a sua reutilização e não-regeneração em cada turno representam uma economia direta de custos operacionais. Esta característica transforma os tokens de raciocínio num ativo de negócio, elevando a otimização de contexto a uma decisão estratégica de arquitetura de software e eficiência de custos.

### **Parâmetros Adicionais**

* **Verbosity:** Este novo parâmetro de API influencia o comprimento da resposta final, com valores como low, medium e high para respostas curtas, equilibradas ou verbosas.8  
* **Free-Form Function Calling:** Permite a geração de payloads de texto bruto, como scripts Python ou queries SQL, diretamente para uma ferramenta externa sem a necessidade de uma formatação JSON, oferecendo maior flexibilidade para runtimes específicos.8

## **6\. Análise Comparativa e Recomendações**

### **6.1. Matriz de Métodos de Construção de Contexto**

A tabela a seguir oferece uma visão comparativa das principais técnicas para a construção de contexto e a mitigação de falhas em LLMs. Cada método tem as suas próprias vantagens e desvantagens, e a eficácia máxima é alcançada através da sua combinação estratégica.

| Técnica | Eficácia na Redução de Alucinações | Custo (Tokens/Latência) | Nível de Precisão | Complexidade de Implementação | Casos de Uso Ideais |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Raciocínio Explícito (CoT)** | **Alta**. Reduz a frequência, mas pode tornar as restantes mais plausíveis e difíceis de detetar. | **Moderado**. Aumenta o uso de tokens e a latência. | **Alta**. Melhora a capacidade de raciocínio. | **Baixa**. Simplesmente adicionar uma instrução. | Tarefas de raciocínio complexo, problemas matemáticos, lógica. |
| **Recuperação-Aumentada de Geração (RAG)** | **Muito Alta**. Ancorado em factos externos, reduz alucinações de factos. | **Alta**. Requer buscas externas, que podem ser custosas em tempo e recursos. | **Alta**. Depende da qualidade e da relevância dos dados recuperados. | **Moderada a Alta**. Exige um pipeline de recuperação e uma base de conhecimento. | Respostas a perguntas sobre dados proprietários ou factos atuais, resumo de documentos. |
| **Saídas Estruturadas (CFG/Function Calling)** | **Alta**. A restrição do formato reduz a variabilidade e as alucinações estruturais. | **Baixa**. Reduz a imprevisibilidade, mas pode ter um pequeno aumento de latência. | **Muito Alta**. Garante a conformidade sintática e o tipo de dados. | **Moderada**. Requer a definição de esquemas (JSON Schema). | Integração com APIs, automação de backend, manipulação de dados. |
| **Tags XML/Delimitadores** | **Moderada**. Reduz a ambiguidade, mas não aborda alucinações de factos. | **Baixa**. Adiciona alguns tokens, mas melhora a eficiência do processamento. | **Alta**. Melhora a adesão às instruções. | **Baixa**. Simples a implementar. | Prompts complexos com múltiplas partes (instruções, contexto, exemplos, dados). |
| **Parâmetros de API (reasoning\_effort)** | **Variável**. Aumenta o raciocínio, melhorando a precisão, mas pode aumentar a plausibilidade das alucinações. | **Variável**. low reduz latência, high aumenta o custo de tokens e a latência. | **Variável**. Ajustável de acordo com a necessidade da tarefa. | **Baixa**. Simples de configurar na chamada da API. | Otimização de desempenho e custo para fluxos de trabalho específicos. |

### **6.2. Estratégia Integrada: O Método Híbrido**

A abordagem recomendada é a de um pipeline de fluxo de trabalho de MCPs que integra as melhores aspetos de cada técnica. Este método híbrido maximiza a precisão, fiabilidade e eficiência:

1. **Contextualização Inicial:** O prompt inicial utiliza tags XML para demarcar claramente as instruções, o papel da LLM e a consulta do utilizador. Para perguntas de domínio específico, uma etapa de RAG é acionada para recuperar o contexto relevante, garantindo que a resposta seja baseada em factos.  
2. **Raciocínio Explícito (CoT):** A LLM é instruída a decompor a tarefa e a gerar o raciocínio passo a passo antes de produzir a resposta final. Esta etapa aumenta a probabilidade de um resultado preciso. A Responses API é utilizada para persistir este raciocínio, permitindo que os passos subsequentes da cadeia o consultem.  
3. **Geração Estruturada:** No passo final do fluxo de trabalho, o modelo utiliza Function Calling ou CFG para formatar a resposta de forma consistente e validada para o backend. Esta etapa garante que a saída seja útil para a automação e que a cadeia não seja interrompida por erros de formatação.  
4. **Otimização de Desempenho:** O parâmetro reasoning\_effort é ajustado para equilibrar a precisão e o custo. Para tarefas que exigem raciocínio complexo, ele é definido como high. Para tarefas de extração simples, ele pode ser definido como low para reduzir a latência.  
5. **Validação Pós-Geração:** Uma camada de verificação posterior é implementada para mitigar o paradoxo do CoT. Esta camada valida a resposta final contra a base de conhecimento ou dados externos, garantindo que o resultado plausível não seja uma alucinação.

## **7\. Conclusões e Futuras Tendências**

O método mais eficaz na construção de contexto para LLMs não é um prompt estático, mas uma arquitetura de sistema robusta. A otimização de desempenho e a mitigação de alucinações estão intrinsecamente ligadas à capacidade de controlar e persistir o raciocínio interno do modelo, bem como à sua capacidade de produzir saídas estruturadas e consistentes para automação. A engenharia de prompts evoluiu de uma "arte de prompt" para uma "disciplina de engenharia de IA," focada na orquestração de fluxos de trabalho, na validação de dados e na otimização de custo a nível de token.

### **Desafios e Lacunas**

Apesar dos avanços, persistem desafios. A pesquisa futura deve focar-se em como superar o paradoxo do CoT, desenvolvendo métodos de deteção de alucinações que sejam mais robustos à plausibilidade induzida pelo raciocínio. Adicionalmente, o ecossistema de modelos de código aberto ainda não alcançou o mesmo nível de fiabilidade nas saídas estruturadas que os modelos proprietários 7, o que representa uma lacuna crítica para a adoção generalizada em aplicações de produção. A consistência na ordenação de campos em saídas estruturadas também se revelou ser um fator crítico para o desempenho 18, e a investigação contínua nestas nuances de formatação será crucial para o avanço da disciplina.

#### **Referências citadas**

1. The Ultimate Guide to LLM Reasoning (2025) \- Kili Technology, acessado em setembro 21, 2025, [https://kili-technology.com/large-language-models-llms/llm-reasoning-guide](https://kili-technology.com/large-language-models-llms/llm-reasoning-guide)  
2. Enhancing Large Language Models through Structured Reasoning \- arXiv, acessado em setembro 21, 2025, [https://arxiv.org/html/2506.20241v1](https://arxiv.org/html/2506.20241v1)  
3. Effective Prompt Engineering: Mastering XML Tags for Clarity, Precision, and Security in LLMs | by Tech for Humans | Medium, acessado em setembro 21, 2025, [https://medium.com/@TechforHumans/effective-prompt-engineering-mastering-xml-tags-for-clarity-precision-and-security-in-llms-992cae203fdc](https://medium.com/@TechforHumans/effective-prompt-engineering-mastering-xml-tags-for-clarity-precision-and-security-in-llms-992cae203fdc)  
4. GPT-5 prompting guide | OpenAI Cookbook, acessado em setembro 21, 2025, [https://cookbook.openai.com/examples/gpt-5/gpt-5\_prompting\_guide](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide)  
5. Structured Outputs: Everything You Should Know \- Humanloop, acessado em setembro 21, 2025, [https://humanloop.com/blog/structured-outputs](https://humanloop.com/blog/structured-outputs)  
6. How to get structured output from LLM's \- A practical guide | AWS Builder Center, acessado em setembro 21, 2025, [https://builder.aws.com/content/2wzRXcEcE7u3LfukKwiYIf75Rpw/how-to-get-structured-output-from-llms-a-practical-guide](https://builder.aws.com/content/2wzRXcEcE7u3LfukKwiYIf75Rpw/how-to-get-structured-output-from-llms-a-practical-guide)  
7. Mastering Structured Output in LLMs 1: JSON output with LangChain | by Andrew Docherty, acessado em setembro 21, 2025, [https://medium.com/@docherty/mastering-structured-output-in-llms-choosing-the-right-model-for-json-output-with-langchain-be29fb6f6675](https://medium.com/@docherty/mastering-structured-output-in-llms-choosing-the-right-model-for-json-output-with-langchain-be29fb6f6675)  
8. GPT-5 New Params and Tools \- OpenAI Cookbook, acessado em setembro 21, 2025, [https://cookbook.openai.com/examples/gpt-5/gpt-5\_new\_params\_and\_tools](https://cookbook.openai.com/examples/gpt-5/gpt-5_new_params_and_tools)  
9. How to Use GPT-5's new parameters and tools: A Practical Guide \- Zenn, acessado em setembro 21, 2025, [https://zenn.dev/saan/articles/cacd08799fb02a](https://zenn.dev/saan/articles/cacd08799fb02a)  
10. Prompt Chaining Langchain | IBM, acessado em setembro 21, 2025, [https://www.ibm.com/think/tutorials/prompt-chaining-langchain](https://www.ibm.com/think/tutorials/prompt-chaining-langchain)  
11. What is prompt chaining? \- IBM, acessado em setembro 21, 2025, [https://www.ibm.com/think/topics/prompt-chaining](https://www.ibm.com/think/topics/prompt-chaining)  
12. Mastering Prompt Engineering: Real-World Case Studies & Industry Playbooks | by Rohan Mistry | Medium, acessado em setembro 21, 2025, [https://medium.com/@rohanmistry231/mastering-prompt-engineering-real-world-case-studies-industry-playbooks-d429cf0a84ec](https://medium.com/@rohanmistry231/mastering-prompt-engineering-real-world-case-studies-industry-playbooks-d429cf0a84ec)  
13. How to Prevent LLM Hallucinations: 5 Proven Strategies \- Voiceflow, acessado em setembro 21, 2025, [https://www.voiceflow.com/blog/prevent-llm-hallucinations](https://www.voiceflow.com/blog/prevent-llm-hallucinations)  
14. Chain-of-Thought Prompting Obscures Hallucination Cues in Large Language Models: An Empirical Evaluation \- arXiv, acessado em setembro 21, 2025, [https://arxiv.org/html/2506.17088v3](https://arxiv.org/html/2506.17088v3)  
15. Large Language Models And Hallucinations: Reasoning Impacts Detection Accuracy., acessado em setembro 21, 2025, [https://quantumzeitgeist.com/large-language-models-and-hallucinations-reasoning-impacts-detection-accuracy/](https://quantumzeitgeist.com/large-language-models-and-hallucinations-reasoning-impacts-detection-accuracy/)  
16. Beyond Traditional Fine-tuning: Exploring Advanced Techniques to Mitigate LLM Hallucinations \- Hugging Face, acessado em setembro 21, 2025, [https://huggingface.co/blog/Imama/pr](https://huggingface.co/blog/Imama/pr)  
17. Better performance from reasoning models using the Responses API, acessado em setembro 21, 2025, [https://cookbook.openai.com/examples/responses\_api/reasoning\_items](https://cookbook.openai.com/examples/responses_api/reasoning_items)  
18. Order of fields in Structured output can hurt LLMs output \- Dhaval Singh's Blog, acessado em setembro 21, 2025, [https://www.dsdev.in/order-of-fields-in-structured-output-can-hurt-llms-output](https://www.dsdev.in/order-of-fields-in-structured-output-can-hurt-llms-output)