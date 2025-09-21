/**
 * AdvancedLearningAgent.js
 * Sistema de Aprendizado Contínuo para Agent OS Nuxt Development Agent
 * 
 * Implementa aprendizado adaptativo avançado com:
 * - Grafo de conhecimento dinâmico
 * - Reconhecimento de padrões
 * - Processamento de feedback
 * - Análise de performance
 * 
 * @author Murillo Dutt - Dutt eCommerce Website Design
 * @version 1.0.0
 * @since 2025-09-21
 */

class KnowledgeGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.weights = new Map();
    this.lastUpdate = Date.now();
  }

  async updateFromInteraction(data) {
    const { patterns, feedback, outcome, timestamp } = data;
    
    // Atualizar nós do grafo
    for (const pattern of patterns) {
      await this.addOrUpdateNode(pattern.id, {
        type: pattern.type,
        context: pattern.context,
        success_rate: this.calculateSuccessRate(pattern.id, outcome),
        last_used: timestamp,
        frequency: this.incrementFrequency(pattern.id)
      });
    }

    // Atualizar conexões baseadas no feedback
    if (feedback && feedback.rating > 3) {
      await this.strengthenConnections(patterns);
    } else if (feedback && feedback.rating < 3) {
      await this.weakenConnections(patterns);
    }

    this.lastUpdate = timestamp;
  }

  async addOrUpdateNode(nodeId, data) {
    if (this.nodes.has(nodeId)) {
      const existing = this.nodes.get(nodeId);
      this.nodes.set(nodeId, { ...existing, ...data });
    } else {
      this.nodes.set(nodeId, {
        id: nodeId,
        created: Date.now(),
        ...data
      });
    }
  }

  calculateSuccessRate(patternId, outcome) {
    const history = this.getPatternHistory(patternId);
    const successCount = history.filter(h => h.outcome === 'success').length;
    return history.length > 0 ? successCount / history.length : 0.5;
  }

  getPatternHistory(patternId) {
    // Implementar recuperação do histórico do padrão
    return [];
  }

  incrementFrequency(patternId) {
    const node = this.nodes.get(patternId);
    return node ? (node.frequency || 0) + 1 : 1;
  }

  async strengthenConnections(patterns) {
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const edgeId = `${patterns[i].id}-${patterns[j].id}`;
        const currentWeight = this.weights.get(edgeId) || 0;
        this.weights.set(edgeId, Math.min(currentWeight + 0.1, 1.0));
      }
    }
  }

  async weakenConnections(patterns) {
    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        const edgeId = `${patterns[i].id}-${patterns[j].id}`;
        const currentWeight = this.weights.get(edgeId) || 0;
        this.weights.set(edgeId, Math.max(currentWeight - 0.1, 0.0));
      }
    }
  }
}

class PatternRecognizer {
  constructor() {
    this.patterns = new Map();
    this.thresholds = {
      similarity: 0.8,
      frequency: 3,
      success_rate: 0.7
    };
  }

  async analyze(interaction) {
    const { query, context, response, outcome } = interaction;
    
    const patterns = [];
    
    // Reconhecer padrões de query
    const queryPatterns = await this.recognizeQueryPatterns(query);
    patterns.push(...queryPatterns);
    
    // Reconhecer padrões de contexto
    const contextPatterns = await this.recognizeContextPatterns(context);
    patterns.push(...contextPatterns);
    
    // Reconhecer padrões de resposta
    const responsePatterns = await this.recognizeResponsePatterns(response);
    patterns.push(...responsePatterns);
    
    // Reconhecer padrões de outcome
    const outcomePatterns = await this.recognizeOutcomePatterns(outcome);
    patterns.push(...outcomePatterns);

    return patterns;
  }

  async recognizeQueryPatterns(query) {
    const patterns = [];
    
    // Padrões de tipo de query
    if (this.isComponentQuery(query)) {
      patterns.push({
        id: 'component_query',
        type: 'query_type',
        context: 'nuxt_ui_component',
        confidence: 0.9
      });
    }
    
    if (this.isConfigurationQuery(query)) {
      patterns.push({
        id: 'configuration_query',
        type: 'query_type',
        context: 'nuxt_config',
        confidence: 0.85
      });
    }
    
    if (this.isPerformanceQuery(query)) {
      patterns.push({
        id: 'performance_query',
        type: 'query_type',
        context: 'optimization',
        confidence: 0.8
      });
    }

    return patterns;
  }

  async recognizeContextPatterns(context) {
    const patterns = [];
    
    // Padrões de contexto de projeto
    if (context.includes('nuxt.config')) {
      patterns.push({
        id: 'nuxt_config_context',
        type: 'context_type',
        context: 'configuration',
        confidence: 0.95
      });
    }
    
    if (context.includes('components/')) {
      patterns.push({
        id: 'component_context',
        type: 'context_type',
        context: 'component_development',
        confidence: 0.9
      });
    }

    return patterns;
  }

  async recognizeResponsePatterns(response) {
    const patterns = [];
    
    // Padrões de tipo de resposta
    if (this.containsCodeBlock(response)) {
      patterns.push({
        id: 'code_response',
        type: 'response_type',
        context: 'implementation',
        confidence: 0.9
      });
    }
    
    if (this.containsExplanation(response)) {
      patterns.push({
        id: 'explanation_response',
        type: 'response_type',
        context: 'educational',
        confidence: 0.8
      });
    }

    return patterns;
  }

  async recognizeOutcomePatterns(outcome) {
    const patterns = [];
    
    if (outcome === 'success') {
      patterns.push({
        id: 'successful_interaction',
        type: 'outcome',
        context: 'positive_feedback',
        confidence: 1.0
      });
    } else if (outcome === 'failure') {
      patterns.push({
        id: 'failed_interaction',
        type: 'outcome',
        context: 'negative_feedback',
        confidence: 1.0
      });
    }

    return patterns;
  }

  isComponentQuery(query) {
    const componentKeywords = ['component', 'button', 'input', 'modal', 'card', 'form'];
    return componentKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  isConfigurationQuery(query) {
    const configKeywords = ['config', 'setup', 'install', 'configure'];
    return configKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  isPerformanceQuery(query) {
    const perfKeywords = ['performance', 'optimize', 'speed', 'slow', 'fast'];
    return perfKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  containsCodeBlock(response) {
    return response.includes('```') || response.includes('<code>');
  }

  containsExplanation(response) {
    const explanationIndicators = ['because', 'this is', 'the reason', 'explanation'];
    return explanationIndicators.some(indicator => 
      response.toLowerCase().includes(indicator)
    );
  }
}

class FeedbackProcessor {
  constructor() {
    this.feedbackHistory = [];
    this.sentimentAnalyzer = new SentimentAnalyzer();
  }

  async process(feedbackData) {
    const { feedback, interaction, timestamp } = feedbackData;
    
    // Processar feedback estruturado
    const processedFeedback = await this.processFeedback(feedback);
    
    // Analisar sentimento
    const sentiment = await this.sentimentAnalyzer.analyze(feedback.text || '');
    
    // Extrair insights
    const insights = await this.extractInsights(processedFeedback, interaction);
    
    // Armazenar no histórico
    this.feedbackHistory.push({
      timestamp,
      feedback: processedFeedback,
      sentiment,
      insights,
      interaction_id: interaction.id
    });

    return {
      processed: processedFeedback,
      sentiment,
      insights,
      recommendations: await this.generateRecommendations(insights)
    };
  }

  async processFeedback(feedback) {
    return {
      rating: feedback.rating || 0,
      text: feedback.text || '',
      categories: this.categorizeFeedback(feedback),
      actionable_items: this.extractActionableItems(feedback),
      priority: this.calculatePriority(feedback)
    };
  }

  categorizeFeedback(feedback) {
    const categories = [];
    
    if (feedback.text) {
      const text = feedback.text.toLowerCase();
      
      if (text.includes('accuracy') || text.includes('correct')) {
        categories.push('accuracy');
      }
      
      if (text.includes('speed') || text.includes('fast') || text.includes('slow')) {
        categories.push('performance');
      }
      
      if (text.includes('helpful') || text.includes('useful')) {
        categories.push('usefulness');
      }
      
      if (text.includes('clear') || text.includes('understand')) {
        categories.push('clarity');
      }
    }

    return categories;
  }

  extractActionableItems(feedback) {
    const items = [];
    
    if (feedback.rating < 3) {
      items.push('improve_response_quality');
    }
    
    if (feedback.text && feedback.text.includes('wrong')) {
      items.push('verify_accuracy');
    }
    
    if (feedback.text && feedback.text.includes('slow')) {
      items.push('optimize_performance');
    }

    return items;
  }

  calculatePriority(feedback) {
    if (feedback.rating <= 2) return 'high';
    if (feedback.rating <= 3) return 'medium';
    return 'low';
  }

  async extractInsights(processedFeedback, interaction) {
    return {
      improvement_areas: this.identifyImprovementAreas(processedFeedback),
      success_factors: this.identifySuccessFactors(processedFeedback),
      pattern_correlations: await this.findPatternCorrelations(processedFeedback, interaction)
    };
  }

  identifyImprovementAreas(feedback) {
    const areas = [];
    
    if (feedback.rating < 4) {
      areas.push('overall_quality');
    }
    
    feedback.categories.forEach(category => {
      if (feedback.rating < 4) {
        areas.push(category);
      }
    });

    return areas;
  }

  identifySuccessFactors(feedback) {
    const factors = [];
    
    if (feedback.rating >= 4) {
      factors.push(...feedback.categories);
    }

    return factors;
  }

  async findPatternCorrelations(feedback, interaction) {
    // Implementar correlação entre feedback e padrões de interação
    return [];
  }

  async generateRecommendations(insights) {
    const recommendations = [];
    
    insights.improvement_areas.forEach(area => {
      switch (area) {
        case 'accuracy':
          recommendations.push('Implementar validação adicional de respostas');
          break;
        case 'performance':
          recommendations.push('Otimizar tempo de resposta');
          break;
        case 'clarity':
          recommendations.push('Melhorar estrutura das explicações');
          break;
      }
    });

    return recommendations;
  }
}

class SentimentAnalyzer {
  constructor() {
    this.positiveWords = ['good', 'great', 'excellent', 'helpful', 'useful', 'clear'];
    this.negativeWords = ['bad', 'wrong', 'confusing', 'slow', 'unhelpful', 'unclear'];
  }

  async analyze(text) {
    if (!text) return { score: 0, label: 'neutral' };
    
    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
      if (this.positiveWords.includes(word)) score += 1;
      if (this.negativeWords.includes(word)) score -= 1;
    });
    
    // Normalizar score
    const normalizedScore = Math.max(-1, Math.min(1, score / words.length));
    
    let label = 'neutral';
    if (normalizedScore > 0.1) label = 'positive';
    else if (normalizedScore < -0.1) label = 'negative';
    
    return { score: normalizedScore, label };
  }
}

class PerformanceAnalyzer {
  constructor() {
    this.metrics = new Map();
    this.benchmarks = {
      response_time: 2000, // ms
      accuracy: 0.95,
      user_satisfaction: 4.0
    };
  }

  async analyzeInteraction(interaction) {
    const metrics = {
      response_time: this.calculateResponseTime(interaction),
      accuracy: await this.calculateAccuracy(interaction),
      user_satisfaction: this.calculateUserSatisfaction(interaction),
      token_efficiency: this.calculateTokenEfficiency(interaction),
      context_relevance: await this.calculateContextRelevance(interaction)
    };

    // Armazenar métricas
    this.metrics.set(interaction.id, {
      timestamp: interaction.timestamp,
      metrics,
      benchmarks_met: this.checkBenchmarks(metrics)
    });

    return metrics;
  }

  calculateResponseTime(interaction) {
    return interaction.end_time - interaction.start_time;
  }

  async calculateAccuracy(interaction) {
    // Implementar cálculo de precisão baseado em feedback e validação
    if (interaction.feedback && interaction.feedback.rating) {
      return interaction.feedback.rating / 5.0;
    }
    return 0.8; // Default
  }

  calculateUserSatisfaction(interaction) {
    if (interaction.feedback && interaction.feedback.rating) {
      return interaction.feedback.rating;
    }
    return 3.5; // Default
  }

  calculateTokenEfficiency(interaction) {
    const tokensUsed = interaction.tokens_used || 0;
    const responseQuality = interaction.feedback?.rating || 3.5;
    
    // Eficiência = qualidade / tokens (normalizado)
    return responseQuality / Math.max(1, tokensUsed / 1000);
  }

  async calculateContextRelevance(interaction) {
    // Implementar cálculo de relevância do contexto
    return 0.85; // Default
  }

  checkBenchmarks(metrics) {
    return {
      response_time: metrics.response_time <= this.benchmarks.response_time,
      accuracy: metrics.accuracy >= this.benchmarks.accuracy,
      user_satisfaction: metrics.user_satisfaction >= this.benchmarks.user_satisfaction
    };
  }

  generatePerformanceReport() {
    const allMetrics = Array.from(this.metrics.values());
    
    if (allMetrics.length === 0) {
      return { message: 'Nenhuma métrica disponível' };
    }

    const averages = {
      response_time: this.calculateAverage(allMetrics, 'response_time'),
      accuracy: this.calculateAverage(allMetrics, 'accuracy'),
      user_satisfaction: this.calculateAverage(allMetrics, 'user_satisfaction'),
      token_efficiency: this.calculateAverage(allMetrics, 'token_efficiency')
    };

    return {
      period: {
        start: Math.min(...allMetrics.map(m => m.timestamp)),
        end: Math.max(...allMetrics.map(m => m.timestamp)),
        interactions: allMetrics.length
      },
      averages,
      benchmarks: this.benchmarks,
      performance_score: this.calculateOverallScore(averages),
      recommendations: this.generatePerformanceRecommendations(averages)
    };
  }

  calculateAverage(metrics, field) {
    const values = metrics.map(m => m.metrics[field]).filter(v => v !== undefined);
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  calculateOverallScore(averages) {
    const weights = {
      response_time: 0.2,
      accuracy: 0.4,
      user_satisfaction: 0.3,
      token_efficiency: 0.1
    };

    let score = 0;
    score += (this.benchmarks.response_time / Math.max(averages.response_time, 1)) * weights.response_time;
    score += averages.accuracy * weights.accuracy;
    score += (averages.user_satisfaction / 5.0) * weights.user_satisfaction;
    score += Math.min(averages.token_efficiency, 1.0) * weights.token_efficiency;

    return Math.min(1.0, score);
  }

  generatePerformanceRecommendations(averages) {
    const recommendations = [];

    if (averages.response_time > this.benchmarks.response_time) {
      recommendations.push('Otimizar tempo de resposta através de cache e compressão de contexto');
    }

    if (averages.accuracy < this.benchmarks.accuracy) {
      recommendations.push('Melhorar precisão através de validação adicional e fallback inteligente');
    }

    if (averages.user_satisfaction < this.benchmarks.user_satisfaction) {
      recommendations.push('Aprimorar qualidade das respostas baseado no feedback dos usuários');
    }

    if (averages.token_efficiency < 0.5) {
      recommendations.push('Implementar compressão mais agressiva de contexto');
    }

    return recommendations;
  }
}

class AdvancedLearningAgent {
  constructor(config = {}) {
    this.config = {
      learning_rate: 0.01,
      feedback_weight: 0.3,
      pattern_threshold: 0.8,
      max_patterns: 10000,
      ...config
    };
    
    this.knowledgeGraph = new KnowledgeGraph();
    this.patternRecognizer = new PatternRecognizer();
    this.feedbackProcessor = new FeedbackProcessor();
    this.performanceAnalyzer = new PerformanceAnalyzer();
    
    this.isLearning = false;
    this.learningHistory = [];
  }

  async processInteraction(interaction) {
    const {
      query,
      context,
      response,
      feedback,
      outcome,
      timestamp,
      userId
    } = interaction;

    try {
      // Extrair padrões da interação
      const patterns = await this.patternRecognizer.analyze({
        query,
        context,
        response,
        outcome
      });

      // Atualizar grafo de conhecimento
      await this.knowledgeGraph.updateFromInteraction({
        patterns,
        feedback,
        outcome,
        timestamp
      });

      // Processar feedback se disponível
      let feedbackResult = null;
      if (feedback) {
        feedbackResult = await this.feedbackProcessor.process({
          feedback,
          interaction,
          timestamp
        });
      }

      // Analisar performance
      const performanceMetrics = await this.performanceAnalyzer.analyzeInteraction({
        id: interaction.id || `${timestamp}-${userId}`,
        start_time: interaction.start_time || timestamp - 1000,
        end_time: timestamp,
        feedback,
        tokens_used: interaction.tokens_used,
        timestamp
      });

      // Registrar no histórico de aprendizado
      this.learningHistory.push({
        timestamp,
        patterns,
        feedback: feedbackResult,
        performance: performanceMetrics,
        improvements: await this.identifyImprovements(patterns, feedbackResult, performanceMetrics)
      });

      // Aplicar aprendizado se necessário
      if (this.shouldTriggerLearning()) {
        await this.triggerLearningCycle();
      }

      return {
        patterns,
        feedback: feedbackResult,
        performance: performanceMetrics,
        learning_triggered: this.isLearning
      };

    } catch (error) {
      console.error('Erro no processamento de interação:', error);
      return {
        error: error.message,
        patterns: [],
        feedback: null,
        performance: null
      };
    }
  }

  async identifyImprovements(patterns, feedbackResult, performanceMetrics) {
    const improvements = [];

    // Melhorias baseadas em padrões
    if (patterns.length > 0) {
      const lowConfidencePatterns = patterns.filter(p => p.confidence < 0.7);
      if (lowConfidencePatterns.length > 0) {
        improvements.push({
          type: 'pattern_recognition',
          description: 'Melhorar reconhecimento de padrões com baixa confiança',
          patterns: lowConfidencePatterns.map(p => p.id)
        });
      }
    }

    // Melhorias baseadas em feedback
    if (feedbackResult && feedbackResult.insights) {
      feedbackResult.insights.improvement_areas.forEach(area => {
        improvements.push({
          type: 'feedback_based',
          description: `Melhorar área: ${area}`,
          area
        });
      });
    }

    // Melhorias baseadas em performance
    if (performanceMetrics) {
      const benchmarksMet = performanceMetrics.benchmarks_met || {};
      Object.entries(benchmarksMet).forEach(([metric, met]) => {
        if (!met) {
          improvements.push({
            type: 'performance',
            description: `Melhorar métrica: ${metric}`,
            metric,
            current_value: performanceMetrics[metric]
          });
        }
      });
    }

    return improvements;
  }

  shouldTriggerLearning() {
    // Trigger learning baseado em:
    // 1. Número de interações desde último aprendizado
    // 2. Qualidade do feedback recente
    // 3. Performance metrics
    
    const recentHistory = this.learningHistory.slice(-10);
    
    if (recentHistory.length < 5) return false;
    
    const avgFeedbackRating = recentHistory
      .filter(h => h.feedback && h.feedback.processed.rating)
      .reduce((sum, h) => sum + h.feedback.processed.rating, 0) / recentHistory.length;
    
    const avgPerformanceScore = recentHistory
      .reduce((sum, h) => sum + (h.performance.accuracy || 0.8), 0) / recentHistory.length;
    
    // Trigger se feedback ou performance estão abaixo do threshold
    return avgFeedbackRating < 3.5 || avgPerformanceScore < 0.85;
  }

  async triggerLearningCycle() {
    if (this.isLearning) return;
    
    this.isLearning = true;
    
    try {
      console.log('Iniciando ciclo de aprendizado...');
      
      // Analisar histórico recente
      const recentHistory = this.learningHistory.slice(-50);
      
      // Identificar padrões de melhoria
      const improvementPatterns = await this.analyzeImprovementPatterns(recentHistory);
      
      // Atualizar configurações baseado no aprendizado
      await this.updateConfiguration(improvementPatterns);
      
      // Otimizar grafo de conhecimento
      await this.optimizeKnowledgeGraph();
      
      console.log('Ciclo de aprendizado concluído');
      
    } catch (error) {
      console.error('Erro no ciclo de aprendizado:', error);
    } finally {
      this.isLearning = false;
    }
  }

  async analyzeImprovementPatterns(history) {
    const patterns = {
      common_issues: {},
      success_factors: {},
      performance_trends: {}
    };

    history.forEach(entry => {
      // Analisar issues comuns
      if (entry.improvements) {
        entry.improvements.forEach(improvement => {
          const key = improvement.type;
          patterns.common_issues[key] = (patterns.common_issues[key] || 0) + 1;
        });
      }

      // Analisar fatores de sucesso
      if (entry.feedback && entry.feedback.insights.success_factors) {
        entry.feedback.insights.success_factors.forEach(factor => {
          patterns.success_factors[factor] = (patterns.success_factors[factor] || 0) + 1;
        });
      }
    });

    return patterns;
  }

  async updateConfiguration(patterns) {
    // Atualizar thresholds baseado nos padrões identificados
    if (patterns.common_issues.pattern_recognition > 5) {
      this.patternRecognizer.thresholds.similarity *= 0.95; // Reduzir threshold para capturar mais padrões
    }

    if (patterns.common_issues.performance > 3) {
      this.config.learning_rate *= 1.1; // Aumentar taxa de aprendizado
    }
  }

  async optimizeKnowledgeGraph() {
    // Remover nós com baixa utilidade
    const cutoffDate = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 dias
    
    for (const [nodeId, node] of this.knowledgeGraph.nodes) {
      if (node.last_used < cutoffDate && node.frequency < 3) {
        this.knowledgeGraph.nodes.delete(nodeId);
      }
    }

    // Otimizar pesos das conexões
    for (const [edgeId, weight] of this.knowledgeGraph.weights) {
      if (weight < 0.1) {
        this.knowledgeGraph.weights.delete(edgeId);
      }
    }
  }

  async generateLearningReport() {
    const performanceReport = this.performanceAnalyzer.generatePerformanceReport();
    const recentHistory = this.learningHistory.slice(-100);
    
    return {
      timestamp: Date.now(),
      performance: performanceReport,
      learning_stats: {
        total_interactions: this.learningHistory.length,
        recent_interactions: recentHistory.length,
        knowledge_graph_size: this.knowledgeGraph.nodes.size,
        pattern_count: this.patternRecognizer.patterns.size,
        learning_cycles: this.learningHistory.filter(h => h.learning_triggered).length
      },
      insights: {
        top_patterns: await this.getTopPatterns(),
        improvement_areas: await this.getTopImprovementAreas(recentHistory),
        success_factors: await this.getTopSuccessFactors(recentHistory)
      },
      recommendations: await this.generateSystemRecommendations()
    };
  }

  async getTopPatterns() {
    const patternFrequency = new Map();
    
    this.learningHistory.forEach(entry => {
      entry.patterns.forEach(pattern => {
        const count = patternFrequency.get(pattern.id) || 0;
        patternFrequency.set(pattern.id, count + 1);
      });
    });

    return Array.from(patternFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ id, count }));
  }

  async getTopImprovementAreas(history) {
    const areas = {};
    
    history.forEach(entry => {
      if (entry.improvements) {
        entry.improvements.forEach(improvement => {
          areas[improvement.type] = (areas[improvement.type] || 0) + 1;
        });
      }
    });

    return Object.entries(areas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([area, count]) => ({ area, count }));
  }

  async getTopSuccessFactors(history) {
    const factors = {};
    
    history.forEach(entry => {
      if (entry.feedback && entry.feedback.insights.success_factors) {
        entry.feedback.insights.success_factors.forEach(factor => {
          factors[factor] = (factors[factor] || 0) + 1;
        });
      }
    });

    return Object.entries(factors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([factor, count]) => ({ factor, count }));
  }

  async generateSystemRecommendations() {
    const recommendations = [];
    
    const performanceReport = this.performanceAnalyzer.generatePerformanceReport();
    
    if (performanceReport.recommendations) {
      recommendations.push(...performanceReport.recommendations);
    }

    // Adicionar recomendações específicas do sistema de aprendizado
    if (this.knowledgeGraph.nodes.size > this.config.max_patterns) {
      recommendations.push('Implementar limpeza automática do grafo de conhecimento');
    }

    if (this.learningHistory.length > 1000) {
      recommendations.push('Arquivar histórico antigo de aprendizado');
    }

    return recommendations;
  }
}

module.exports = {
  AdvancedLearningAgent,
  KnowledgeGraph,
  PatternRecognizer,
  FeedbackProcessor,
  PerformanceAnalyzer,
  SentimentAnalyzer
};