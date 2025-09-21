/**
 * AdvancedContextCompressor.js
 * Sistema Avançado de Compressão de Contexto para Agent OS Nuxt Development Agent
 * 
 * Implementa compressão inteligente de contexto com:
 * - Remoção de duplicatas semânticas
 * - Compressão de espaços em branco
 * - Abreviação de termos técnicos
 * - Sumarização semântica
 * - Preservação de informações críticas
 * 
 * @author Murillo Dutt - Dutt eCommerce Website Design
 * @version 1.0.0
 * @since 2025-09-21
 */

class SemanticDeduplicator {
  constructor() {
    this.similarityThreshold = 0.85;
    this.cache = new Map();
  }

  async removeDuplicates(contexts) {
    const uniqueContexts = [];
    const processedHashes = new Set();

    for (const context of contexts) {
      const hash = await this.generateSemanticHash(context);
      
      if (!processedHashes.has(hash)) {
        const isDuplicate = await this.findSimilarContext(context, uniqueContexts);
        
        if (!isDuplicate) {
          uniqueContexts.push(context);
          processedHashes.add(hash);
        }
      }
    }

    return uniqueContexts;
  }

  async generateSemanticHash(context) {
    // Gerar hash baseado no conteúdo semântico
    const normalized = this.normalizeText(context.content || context);
    const words = normalized.split(/\s+/).filter(word => word.length > 2);
    const significantWords = words.slice(0, 20).sort().join('|');
    
    return this.simpleHash(significantWords);
  }

  normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  async findSimilarContext(context, existingContexts) {
    const contextText = context.content || context;
    
    for (const existing of existingContexts) {
      const existingText = existing.content || existing;
      const similarity = await this.calculateSimilarity(contextText, existingText);
      
      if (similarity > this.similarityThreshold) {
        return true;
      }
    }
    
    return false;
  }

  async calculateSimilarity(text1, text2) {
    // Implementação simplificada de similaridade baseada em palavras comuns
    const words1 = new Set(this.normalizeText(text1).split(/\s+/));
    const words2 = new Set(this.normalizeText(text2).split(/\s+/));
    
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }
}

class WhitespaceCompressor {
  constructor() {
    this.preserveCodeBlocks = true;
    this.preserveFormatting = ['json', 'yaml', 'xml'];
  }

  compress(text) {
    if (!text || typeof text !== 'string') return text;

    // Identificar e preservar blocos de código
    const codeBlocks = [];
    let processedText = text;

    if (this.preserveCodeBlocks) {
      processedText = this.extractCodeBlocks(text, codeBlocks);
    }

    // Compressão de espaços em branco
    processedText = processedText
      // Remover espaços no início e fim das linhas
      .replace(/^[ \t]+|[ \t]+$/gm, '')
      // Reduzir múltiplas linhas vazias para uma
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Reduzir múltiplos espaços para um
      .replace(/[ \t]+/g, ' ')
      // Remover espaços antes de pontuação
      .replace(/\s+([,.;:!?])/g, '$1')
      // Remover espaços desnecessários em listas
      .replace(/\n\s*[-*+]\s+/g, '\n- ');

    // Restaurar blocos de código
    if (this.preserveCodeBlocks) {
      processedText = this.restoreCodeBlocks(processedText, codeBlocks);
    }

    return processedText.trim();
  }

  extractCodeBlocks(text, codeBlocks) {
    const codeBlockRegex = /```[\s\S]*?```|`[^`]+`/g;
    let match;
    let processedText = text;
    let index = 0;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const placeholder = `__CODE_BLOCK_${index}__`;
      codeBlocks.push({
        placeholder,
        content: match[0]
      });
      processedText = processedText.replace(match[0], placeholder);
      index++;
    }

    return processedText;
  }

  restoreCodeBlocks(text, codeBlocks) {
    let restoredText = text;
    
    codeBlocks.forEach(block => {
      restoredText = restoredText.replace(block.placeholder, block.content);
    });

    return restoredText;
  }
}

class TechnicalAbbreviator {
  constructor() {
    this.abbreviations = new Map([
      // Nuxt/Vue específicos
      ['component', 'comp'],
      ['configuration', 'config'],
      ['application', 'app'],
      ['development', 'dev'],
      ['production', 'prod'],
      ['environment', 'env'],
      ['directory', 'dir'],
      ['repository', 'repo'],
      ['documentation', 'docs'],
      ['implementation', 'impl'],
      ['interface', 'iface'],
      ['parameter', 'param'],
      ['property', 'prop'],
      ['function', 'fn'],
      ['variable', 'var'],
      ['constant', 'const'],
      ['reference', 'ref'],
      ['template', 'tmpl'],
      ['stylesheet', 'css'],
      ['javascript', 'js'],
      ['typescript', 'ts'],
      ['package.json', 'pkg.json'],
      ['nuxt.config', 'nuxt.cfg'],
      
      // Termos técnicos gerais
      ['performance', 'perf'],
      ['optimization', 'opt'],
      ['accessibility', 'a11y'],
      ['internationalization', 'i18n'],
      ['localization', 'l10n'],
      ['responsive', 'resp'],
      ['mobile', 'mob'],
      ['desktop', 'desk'],
      ['browser', 'br'],
      ['server', 'srv'],
      ['client', 'cli'],
      ['database', 'db'],
      ['authentication', 'auth'],
      ['authorization', 'authz'],
      ['middleware', 'mw'],
      ['framework', 'fw'],
      ['library', 'lib'],
      ['module', 'mod'],
      ['plugin', 'plg'],
      ['extension', 'ext'],
      ['version', 'ver'],
      ['release', 'rel'],
      ['build', 'bld'],
      ['deployment', 'deploy'],
      ['continuous integration', 'CI'],
      ['continuous deployment', 'CD']
    ]);

    this.contextualAbbreviations = new Map([
      // Contexto de desenvolvimento
      ['development environment', 'dev env'],
      ['production environment', 'prod env'],
      ['test environment', 'test env'],
      
      // Contexto de Nuxt
      ['Nuxt application', 'Nuxt app'],
      ['Vue component', 'Vue comp'],
      ['Nuxt configuration', 'Nuxt config'],
      ['server-side rendering', 'SSR'],
      ['static site generation', 'SSG'],
      ['single page application', 'SPA'],
      
      // Contexto de UI
      ['user interface', 'UI'],
      ['user experience', 'UX'],
      ['responsive design', 'resp design'],
      ['mobile first', 'mobile-1st'],
      
      // Contexto de performance
      ['Core Web Vitals', 'CWV'],
      ['Largest Contentful Paint', 'LCP'],
      ['First Input Delay', 'FID'],
      ['Cumulative Layout Shift', 'CLS']
    ]);

    this.preserveTerms = new Set([
      'API', 'URL', 'HTTP', 'HTTPS', 'JSON', 'XML', 'HTML', 'CSS', 'DOM',
      'SEO', 'PWA', 'SPA', 'SSR', 'SSG', 'CDN', 'DNS', 'SSL', 'TLS'
    ]);
  }

  abbreviate(text, aggressiveness = 'medium') {
    if (!text || typeof text !== 'string') return text;

    let processedText = text;

    // Aplicar abreviações contextuais primeiro
    for (const [full, abbrev] of this.contextualAbbreviations) {
      const regex = new RegExp(`\\b${this.escapeRegex(full)}\\b`, 'gi');
      processedText = processedText.replace(regex, abbrev);
    }

    // Aplicar abreviações simples baseado no nível de agressividade
    const abbreviationsToApply = this.selectAbbreviations(aggressiveness);
    
    for (const [full, abbrev] of abbreviationsToApply) {
      if (!this.preserveTerms.has(full.toUpperCase())) {
        const regex = new RegExp(`\\b${this.escapeRegex(full)}\\b`, 'gi');
        processedText = processedText.replace(regex, abbrev);
      }
    }

    return processedText;
  }

  selectAbbreviations(aggressiveness) {
    const allAbbreviations = Array.from(this.abbreviations.entries());
    
    switch (aggressiveness) {
      case 'low':
        // Apenas abreviações muito comuns e seguras
        return allAbbreviations.filter(([full, abbrev]) => 
          ['config', 'app', 'dev', 'prod', 'docs', 'repo'].includes(abbrev)
        );
      
      case 'high':
        // Todas as abreviações
        return allAbbreviations;
      
      case 'medium':
      default:
        // Abreviações moderadas, excluindo as muito técnicas
        return allAbbreviations.filter(([full, abbrev]) => 
          !['iface', 'tmpl', 'authz', 'plg'].includes(abbrev)
        );
    }
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  expandAbbreviations(text) {
    // Função para reverter abreviações se necessário
    let processedText = text;

    // Reverter abreviações contextuais
    for (const [full, abbrev] of this.contextualAbbreviations) {
      const regex = new RegExp(`\\b${this.escapeRegex(abbrev)}\\b`, 'gi');
      processedText = processedText.replace(regex, full);
    }

    // Reverter abreviações simples
    for (const [full, abbrev] of this.abbreviations) {
      const regex = new RegExp(`\\b${this.escapeRegex(abbrev)}\\b`, 'gi');
      processedText = processedText.replace(regex, full);
    }

    return processedText;
  }
}

class SemanticSummarizer {
  constructor() {
    this.maxSummaryLength = 500;
    this.keywordDensityThreshold = 0.02;
    this.sentenceImportanceThreshold = 0.6;
  }

  async summarize(text, targetLength = null) {
    if (!text || typeof text !== 'string') return text;

    const actualTargetLength = targetLength || this.maxSummaryLength;
    
    if (text.length <= actualTargetLength) {
      return text;
    }

    // Dividir em sentenças
    const sentences = this.splitIntoSentences(text);
    
    if (sentences.length <= 3) {
      return text; // Muito curto para sumarizar
    }

    // Calcular importância das sentenças
    const sentenceScores = await this.calculateSentenceImportance(sentences, text);
    
    // Selecionar sentenças mais importantes
    const importantSentences = this.selectImportantSentences(
      sentences, 
      sentenceScores, 
      actualTargetLength
    );

    // Reorganizar na ordem original
    const summary = this.reconstructSummary(sentences, importantSentences);

    return summary;
  }

  splitIntoSentences(text) {
    // Dividir em sentenças preservando estrutura
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10);
  }

  async calculateSentenceImportance(sentences, fullText) {
    const scores = [];
    const keywords = this.extractKeywords(fullText);
    const keywordSet = new Set(keywords);

    for (const sentence of sentences) {
      let score = 0;
      
      // Score baseado em palavras-chave
      const sentenceWords = this.extractWords(sentence);
      const keywordMatches = sentenceWords.filter(word => keywordSet.has(word));
      score += (keywordMatches.length / sentenceWords.length) * 0.4;
      
      // Score baseado na posição (início e fim são mais importantes)
      const position = sentences.indexOf(sentence);
      const positionScore = this.calculatePositionScore(position, sentences.length);
      score += positionScore * 0.3;
      
      // Score baseado no comprimento (sentenças muito curtas ou longas são menos importantes)
      const lengthScore = this.calculateLengthScore(sentence.length);
      score += lengthScore * 0.2;
      
      // Score baseado em indicadores de importância
      const importanceScore = this.calculateImportanceIndicators(sentence);
      score += importanceScore * 0.1;

      scores.push(score);
    }

    return scores;
  }

  extractKeywords(text) {
    const words = this.extractWords(text);
    const wordFreq = new Map();
    
    // Contar frequência das palavras
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });

    // Filtrar palavras muito comuns ou muito raras
    const totalWords = words.length;
    const keywords = [];
    
    for (const [word, freq] of wordFreq) {
      const density = freq / totalWords;
      if (density >= this.keywordDensityThreshold && density <= 0.1) {
        keywords.push(word);
      }
    }

    return keywords.slice(0, 20); // Top 20 keywords
  }

  extractWords(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !this.isStopWord(word));
  }

  isStopWord(word) {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
      'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
      'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
      'o', 'a', 'e', 'de', 'do', 'da', 'em', 'um', 'uma', 'para', 'com',
      'por', 'ser', 'ter', 'estar', 'que', 'não', 'se', 'como', 'mais'
    ]);
    
    return stopWords.has(word);
  }

  calculatePositionScore(position, totalSentences) {
    // Sentenças no início e fim são mais importantes
    const normalizedPosition = position / (totalSentences - 1);
    
    if (normalizedPosition <= 0.2) return 1.0; // Início
    if (normalizedPosition >= 0.8) return 0.8; // Fim
    return 0.5; // Meio
  }

  calculateLengthScore(length) {
    // Sentenças de tamanho médio são preferidas
    if (length < 20) return 0.3;
    if (length > 200) return 0.4;
    return 1.0;
  }

  calculateImportanceIndicators(sentence) {
    let score = 0;
    const lowerSentence = sentence.toLowerCase();
    
    // Indicadores de importância
    const importanceIndicators = [
      'importante', 'crucial', 'essencial', 'fundamental', 'crítico',
      'principal', 'chave', 'básico', 'necessário', 'obrigatório',
      'important', 'crucial', 'essential', 'fundamental', 'critical',
      'main', 'key', 'basic', 'necessary', 'required'
    ];
    
    importanceIndicators.forEach(indicator => {
      if (lowerSentence.includes(indicator)) {
        score += 0.1;
      }
    });

    // Penalizar sentenças com muitas palavras de transição
    const transitionWords = ['however', 'therefore', 'moreover', 'furthermore'];
    transitionWords.forEach(word => {
      if (lowerSentence.includes(word)) {
        score -= 0.05;
      }
    });

    return Math.max(0, Math.min(1, score));
  }

  selectImportantSentences(sentences, scores, targetLength) {
    // Criar array de sentenças com scores
    const sentencesWithScores = sentences.map((sentence, index) => ({
      sentence,
      score: scores[index],
      index,
      length: sentence.length
    }));

    // Ordenar por score
    sentencesWithScores.sort((a, b) => b.score - a.score);

    // Selecionar sentenças até atingir o tamanho alvo
    const selected = [];
    let currentLength = 0;

    for (const item of sentencesWithScores) {
      if (currentLength + item.length <= targetLength) {
        selected.push(item);
        currentLength += item.length;
      }
    }

    // Se não conseguiu selecionar nenhuma, pegar pelo menos a mais importante
    if (selected.length === 0 && sentencesWithScores.length > 0) {
      selected.push(sentencesWithScores[0]);
    }

    return selected;
  }

  reconstructSummary(originalSentences, selectedSentences) {
    // Ordenar sentenças selecionadas pela ordem original
    selectedSentences.sort((a, b) => a.index - b.index);
    
    // Reconstruir o texto
    return selectedSentences
      .map(item => item.sentence)
      .join('. ')
      .replace(/\.\s*\./g, '.') + '.';
  }
}

class AdvancedContextCompressor {
  constructor(config = {}) {
    this.config = {
      maxContextLength: 8000,
      compressionLevel: 'medium', // low, medium, high, aggressive
      preserveCriticalInfo: true,
      enableSemanticDeduplication: true,
      enableWhitespaceCompression: true,
      enableAbbreviation: true,
      enableSummarization: true,
      ...config
    };

    this.semanticDeduplicator = new SemanticDeduplicator();
    this.whitespaceCompressor = new WhitespaceCompressor();
    this.technicalAbbreviator = new TechnicalAbbreviator();
    this.semanticSummarizer = new SemanticSummarizer();

    this.compressionStats = {
      totalCompressions: 0,
      totalOriginalLength: 0,
      totalCompressedLength: 0,
      averageCompressionRatio: 0
    };
  }

  async compress(contexts, options = {}) {
    const startTime = Date.now();
    const mergedOptions = { ...this.config, ...options };
    
    try {
      // Validar entrada
      if (!contexts || contexts.length === 0) {
        return { contexts: [], stats: this.getCompressionStats(0, 0, 0) };
      }

      // Normalizar contextos para array de objetos
      const normalizedContexts = this.normalizeContexts(contexts);
      const originalLength = this.calculateTotalLength(normalizedContexts);

      let processedContexts = [...normalizedContexts];

      // Etapa 1: Remoção de duplicatas semânticas
      if (mergedOptions.enableSemanticDeduplication) {
        processedContexts = await this.semanticDeduplicator.removeDuplicates(processedContexts);
      }

      // Etapa 2: Compressão de espaços em branco
      if (mergedOptions.enableWhitespaceCompression) {
        processedContexts = this.compressWhitespace(processedContexts);
      }

      // Etapa 3: Abreviação de termos técnicos
      if (mergedOptions.enableAbbreviation) {
        processedContexts = this.abbreviateTerms(processedContexts, mergedOptions.compressionLevel);
      }

      // Etapa 4: Sumarização semântica (se ainda exceder o limite)
      const currentLength = this.calculateTotalLength(processedContexts);
      if (mergedOptions.enableSummarization && currentLength > mergedOptions.maxContextLength) {
        processedContexts = await this.summarizeContexts(
          processedContexts, 
          mergedOptions.maxContextLength
        );
      }

      // Etapa 5: Compressão final agressiva (se necessário)
      const finalLength = this.calculateTotalLength(processedContexts);
      if (finalLength > mergedOptions.maxContextLength && mergedOptions.compressionLevel === 'aggressive') {
        processedContexts = await this.aggressiveCompression(
          processedContexts, 
          mergedOptions.maxContextLength
        );
      }

      const compressedLength = this.calculateTotalLength(processedContexts);
      const processingTime = Date.now() - startTime;

      // Atualizar estatísticas
      this.updateCompressionStats(originalLength, compressedLength);

      return {
        contexts: processedContexts,
        stats: this.getCompressionStats(originalLength, compressedLength, processingTime),
        metadata: {
          originalCount: normalizedContexts.length,
          compressedCount: processedContexts.length,
          compressionSteps: this.getAppliedSteps(mergedOptions),
          preservedCriticalInfo: mergedOptions.preserveCriticalInfo
        }
      };

    } catch (error) {
      console.error('Erro na compressão de contexto:', error);
      return {
        contexts: contexts,
        error: error.message,
        stats: this.getCompressionStats(0, 0, Date.now() - startTime)
      };
    }
  }

  normalizeContexts(contexts) {
    if (!Array.isArray(contexts)) {
      contexts = [contexts];
    }

    return contexts.map((context, index) => {
      if (typeof context === 'string') {
        return {
          id: `context_${index}`,
          content: context,
          type: 'text',
          priority: 'normal'
        };
      } else if (typeof context === 'object' && context !== null) {
        return {
          id: context.id || `context_${index}`,
          content: context.content || context.text || JSON.stringify(context),
          type: context.type || 'text',
          priority: context.priority || 'normal',
          metadata: context.metadata || {}
        };
      } else {
        return {
          id: `context_${index}`,
          content: String(context),
          type: 'text',
          priority: 'normal'
        };
      }
    });
  }

  calculateTotalLength(contexts) {
    return contexts.reduce((total, context) => {
      return total + (context.content ? context.content.length : 0);
    }, 0);
  }

  compressWhitespace(contexts) {
    return contexts.map(context => ({
      ...context,
      content: this.whitespaceCompressor.compress(context.content)
    }));
  }

  abbreviateTerms(contexts, compressionLevel) {
    return contexts.map(context => ({
      ...context,
      content: this.technicalAbbreviator.abbreviate(context.content, compressionLevel)
    }));
  }

  async summarizeContexts(contexts, maxLength) {
    // Calcular tamanho alvo para cada contexto baseado na prioridade
    const totalCurrentLength = this.calculateTotalLength(contexts);
    const compressionRatio = maxLength / totalCurrentLength;

    const summarizedContexts = [];

    for (const context of contexts) {
      const targetLength = Math.floor(context.content.length * compressionRatio);
      
      // Contextos críticos recebem mais espaço
      const adjustedTargetLength = context.priority === 'high' 
        ? Math.floor(targetLength * 1.5)
        : context.priority === 'low'
        ? Math.floor(targetLength * 0.7)
        : targetLength;

      const summarizedContent = await this.semanticSummarizer.summarize(
        context.content, 
        Math.max(100, adjustedTargetLength) // Mínimo de 100 caracteres
      );

      summarizedContexts.push({
        ...context,
        content: summarizedContent,
        originalLength: context.content.length,
        summarized: true
      });
    }

    return summarizedContexts;
  }

  async aggressiveCompression(contexts, maxLength) {
    // Ordenar por prioridade
    const sortedContexts = contexts.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    const compressedContexts = [];
    let currentLength = 0;

    for (const context of sortedContexts) {
      const remainingLength = maxLength - currentLength;
      
      if (remainingLength <= 100) break; // Não vale a pena continuar

      let contextContent = context.content;
      
      // Aplicar compressão agressiva
      if (contextContent.length > remainingLength) {
        // Tentar sumarização mais agressiva
        contextContent = await this.semanticSummarizer.summarize(
          contextContent, 
          Math.floor(remainingLength * 0.8)
        );
        
        // Se ainda for muito grande, truncar preservando início e fim
        if (contextContent.length > remainingLength) {
          const halfLength = Math.floor(remainingLength / 2) - 10;
          const start = contextContent.substring(0, halfLength);
          const end = contextContent.substring(contextContent.length - halfLength);
          contextContent = start + ' [...] ' + end;
        }
      }

      compressedContexts.push({
        ...context,
        content: contextContent,
        aggressivelyCompressed: true
      });

      currentLength += contextContent.length;
    }

    return compressedContexts;
  }

  updateCompressionStats(originalLength, compressedLength) {
    this.compressionStats.totalCompressions++;
    this.compressionStats.totalOriginalLength += originalLength;
    this.compressionStats.totalCompressedLength += compressedLength;
    
    this.compressionStats.averageCompressionRatio = 
      this.compressionStats.totalCompressedLength / this.compressionStats.totalOriginalLength;
  }

  getCompressionStats(originalLength, compressedLength, processingTime) {
    const compressionRatio = originalLength > 0 ? compressedLength / originalLength : 1;
    const spaceSaved = originalLength - compressedLength;
    const spaceSavedPercentage = originalLength > 0 ? (spaceSaved / originalLength) * 100 : 0;

    return {
      originalLength,
      compressedLength,
      compressionRatio,
      spaceSaved,
      spaceSavedPercentage: Math.round(spaceSavedPercentage * 100) / 100,
      processingTime,
      efficiency: processingTime > 0 ? spaceSaved / processingTime : 0
    };
  }

  getAppliedSteps(options) {
    const steps = [];
    
    if (options.enableSemanticDeduplication) steps.push('semantic_deduplication');
    if (options.enableWhitespaceCompression) steps.push('whitespace_compression');
    if (options.enableAbbreviation) steps.push('technical_abbreviation');
    if (options.enableSummarization) steps.push('semantic_summarization');
    if (options.compressionLevel === 'aggressive') steps.push('aggressive_compression');

    return steps;
  }

  async decompressContext(compressedContext) {
    // Função para reverter algumas compressões quando necessário
    let decompressedContent = compressedContext.content;

    // Expandir abreviações
    decompressedContent = this.technicalAbbreviator.expandAbbreviations(decompressedContent);

    return {
      ...compressedContext,
      content: decompressedContent,
      decompressed: true
    };
  }

  generateCompressionReport() {
    return {
      timestamp: Date.now(),
      totalCompressions: this.compressionStats.totalCompressions,
      averageCompressionRatio: Math.round(this.compressionStats.averageCompressionRatio * 100) / 100,
      totalSpaceSaved: this.compressionStats.totalOriginalLength - this.compressionStats.totalCompressedLength,
      configuration: this.config,
      recommendations: this.generateOptimizationRecommendations()
    };
  }

  generateOptimizationRecommendations() {
    const recommendations = [];
    
    if (this.compressionStats.averageCompressionRatio > 0.8) {
      recommendations.push('Considerar aumentar o nível de compressão para economizar mais espaço');
    }
    
    if (this.compressionStats.averageCompressionRatio < 0.3) {
      recommendations.push('Compressão muito agressiva pode estar perdendo informações importantes');
    }
    
    if (this.compressionStats.totalCompressions > 100) {
      recommendations.push('Considerar implementar cache de contextos comprimidos');
    }

    return recommendations;
  }
}

module.exports = {
  AdvancedContextCompressor,
  SemanticDeduplicator,
  WhitespaceCompressor,
  TechnicalAbbreviator,
  SemanticSummarizer
};