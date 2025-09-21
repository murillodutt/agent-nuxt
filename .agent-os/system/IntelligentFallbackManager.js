/**
 * IntelligentFallbackManager.js
 * Sistema Inteligente de Fallback para Agent OS Nuxt Development Agent
 * 
 * Implementa fallback inteligente com:
 * - Detecção automática de falhas
 * - Estratégias de recuperação adaptativas
 * - Cache de fallback
 * - Monitoramento de saúde do sistema
 * - Recuperação gradual
 * 
 * @author Murillo Dutt - Dutt eCommerce Website Design
 * @version 1.0.0
 * @since 2025-09-21
 */

class FailureDetector {
  constructor() {
    this.thresholds = {
      responseTime: 5000, // ms
      errorRate: 0.1, // 10%
      consecutiveFailures: 3,
      memoryUsage: 0.9, // 90%
      cpuUsage: 0.8 // 80%
    };
    
    this.metrics = {
      responseTime: [],
      errors: [],
      successes: [],
      memoryUsage: [],
      cpuUsage: []
    };
    
    this.consecutiveFailures = 0;
    this.lastHealthCheck = Date.now();
  }

  async detectFailure(operation, result, metrics = {}) {
    const failure = {
      timestamp: Date.now(),
      operation,
      type: null,
      severity: 'low',
      details: {},
      recoverable: true
    };

    // Detectar falha por timeout
    if (metrics.responseTime && metrics.responseTime > this.thresholds.responseTime) {
      failure.type = 'timeout';
      failure.severity = 'medium';
      failure.details.responseTime = metrics.responseTime;
      failure.details.threshold = this.thresholds.responseTime;
    }

    // Detectar falha por erro
    if (result && result.error) {
      failure.type = 'error';
      failure.severity = this.classifyErrorSeverity(result.error);
      failure.details.error = result.error;
      failure.details.stack = result.stack;
    }

    // Detectar falha por resultado inválido
    if (result && this.isInvalidResult(result, operation)) {
      failure.type = 'invalid_result';
      failure.severity = 'medium';
      failure.details.result = result;
    }

    // Detectar falha por recursos
    if (metrics.memoryUsage && metrics.memoryUsage > this.thresholds.memoryUsage) {
      failure.type = 'resource_exhaustion';
      failure.severity = 'high';
      failure.details.memoryUsage = metrics.memoryUsage;
    }

    // Atualizar métricas
    this.updateMetrics(operation, result, metrics, failure.type !== null);

    // Verificar falhas consecutivas
    if (failure.type !== null) {
      this.consecutiveFailures++;
      if (this.consecutiveFailures >= this.thresholds.consecutiveFailures) {
        failure.severity = 'critical';
        failure.details.consecutiveFailures = this.consecutiveFailures;
      }
    } else {
      this.consecutiveFailures = 0;
    }

    return failure.type !== null ? failure : null;
  }

  classifyErrorSeverity(error) {
    const errorMessage = error.message || error.toString();
    
    // Erros críticos
    if (errorMessage.includes('ECONNREFUSED') || 
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('TIMEOUT')) {
      return 'critical';
    }
    
    // Erros de alta severidade
    if (errorMessage.includes('Permission denied') ||
        errorMessage.includes('Access denied') ||
        errorMessage.includes('Authentication failed')) {
      return 'high';
    }
    
    // Erros de média severidade
    if (errorMessage.includes('Not found') ||
        errorMessage.includes('Invalid') ||
        errorMessage.includes('Malformed')) {
      return 'medium';
    }
    
    return 'low';
  }

  isInvalidResult(result, operation) {
    // Verificar se o resultado é válido para o tipo de operação
    switch (operation) {
      case 'component_search':
        return !result.components || !Array.isArray(result.components);
      
      case 'documentation_fetch':
        return !result.content || typeof result.content !== 'string';
      
      case 'code_generation':
        return !result.code || typeof result.code !== 'string';
      
      case 'context_compression':
        return !result.contexts || !Array.isArray(result.contexts);
      
      default:
        return false;
    }
  }

  updateMetrics(operation, result, metrics, isFailure) {
    const timestamp = Date.now();
    
    // Atualizar métricas de resposta
    if (metrics.responseTime) {
      this.metrics.responseTime.push({
        timestamp,
        value: metrics.responseTime,
        operation
      });
    }
    
    // Atualizar métricas de erro/sucesso
    if (isFailure) {
      this.metrics.errors.push({
        timestamp,
        operation,
        error: result?.error
      });
    } else {
      this.metrics.successes.push({
        timestamp,
        operation
      });
    }
    
    // Limpar métricas antigas (manter apenas últimas 1000)
    Object.keys(this.metrics).forEach(key => {
      if (this.metrics[key].length > 1000) {
        this.metrics[key] = this.metrics[key].slice(-1000);
      }
    });
  }

  getHealthStatus() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    // Calcular métricas da última hora
    const recentErrors = this.metrics.errors.filter(e => now - e.timestamp < oneHour);
    const recentSuccesses = this.metrics.successes.filter(s => now - s.timestamp < oneHour);
    const recentResponseTimes = this.metrics.responseTime.filter(r => now - r.timestamp < oneHour);
    
    const totalOperations = recentErrors.length + recentSuccesses.length;
    const errorRate = totalOperations > 0 ? recentErrors.length / totalOperations : 0;
    
    const avgResponseTime = recentResponseTimes.length > 0 
      ? recentResponseTimes.reduce((sum, r) => sum + r.value, 0) / recentResponseTimes.length
      : 0;
    
    let healthScore = 1.0;
    
    // Penalizar por alta taxa de erro
    if (errorRate > this.thresholds.errorRate) {
      healthScore -= (errorRate - this.thresholds.errorRate) * 2;
    }
    
    // Penalizar por tempo de resposta alto
    if (avgResponseTime > this.thresholds.responseTime) {
      healthScore -= 0.3;
    }
    
    // Penalizar por falhas consecutivas
    if (this.consecutiveFailures > 0) {
      healthScore -= this.consecutiveFailures * 0.1;
    }
    
    healthScore = Math.max(0, Math.min(1, healthScore));
    
    return {
      score: healthScore,
      status: this.getHealthStatusLabel(healthScore),
      metrics: {
        errorRate,
        avgResponseTime,
        consecutiveFailures: this.consecutiveFailures,
        totalOperations
      },
      timestamp: now
    };
  }

  getHealthStatusLabel(score) {
    if (score >= 0.9) return 'excellent';
    if (score >= 0.7) return 'good';
    if (score >= 0.5) return 'fair';
    if (score >= 0.3) return 'poor';
    return 'critical';
  }
}

class RecoveryStrategy {
  constructor() {
    this.strategies = new Map([
      ['timeout', this.handleTimeout.bind(this)],
      ['error', this.handleError.bind(this)],
      ['invalid_result', this.handleInvalidResult.bind(this)],
      ['resource_exhaustion', this.handleResourceExhaustion.bind(this)],
      ['network_failure', this.handleNetworkFailure.bind(this)]
    ]);
    
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2
    };
  }

  async executeRecovery(failure, originalOperation, context) {
    const strategy = this.strategies.get(failure.type);
    
    if (!strategy) {
      return this.defaultRecovery(failure, originalOperation, context);
    }
    
    try {
      const recoveryResult = await strategy(failure, originalOperation, context);
      
      return {
        success: true,
        result: recoveryResult,
        strategy: failure.type,
        attempts: recoveryResult.attempts || 1,
        recoveryTime: Date.now() - failure.timestamp
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        strategy: failure.type,
        fallbackUsed: true
      };
    }
  }

  async handleTimeout(failure, originalOperation, context) {
    // Estratégia para timeout: retry com timeout aumentado
    const newTimeout = Math.min(
      failure.details.threshold * 2,
      this.retryConfig.maxDelay
    );
    
    return await this.retryWithBackoff(
      originalOperation,
      context,
      { ...context.options, timeout: newTimeout }
    );
  }

  async handleError(failure, originalOperation, context) {
    const errorMessage = failure.details.error.message || '';
    
    // Estratégias específicas baseadas no tipo de erro
    if (errorMessage.includes('ECONNREFUSED')) {
      return await this.handleConnectionRefused(failure, originalOperation, context);
    }
    
    if (errorMessage.includes('ENOTFOUND')) {
      return await this.handleDNSFailure(failure, originalOperation, context);
    }
    
    if (errorMessage.includes('Authentication')) {
      return await this.handleAuthFailure(failure, originalOperation, context);
    }
    
    // Retry genérico para outros erros
    return await this.retryWithBackoff(originalOperation, context);
  }

  async handleInvalidResult(failure, originalOperation, context) {
    // Tentar com parâmetros diferentes ou fonte alternativa
    const alternativeContext = this.createAlternativeContext(context);
    
    return await this.retryWithBackoff(
      originalOperation,
      alternativeContext,
      alternativeContext.options
    );
  }

  async handleResourceExhaustion(failure, originalOperation, context) {
    // Aguardar e tentar com recursos reduzidos
    await this.delay(2000);
    
    const reducedContext = this.reduceResourceUsage(context);
    
    return await this.retryWithBackoff(
      originalOperation,
      reducedContext,
      reducedContext.options
    );
  }

  async handleNetworkFailure(failure, originalOperation, context) {
    // Tentar com diferentes endpoints ou configurações de rede
    const networkAlternatives = this.getNetworkAlternatives(context);
    
    for (const alternative of networkAlternatives) {
      try {
        const result = await originalOperation(alternative);
        return { result, attempts: networkAlternatives.indexOf(alternative) + 1 };
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('Todas as alternativas de rede falharam');
  }

  async handleConnectionRefused(failure, originalOperation, context) {
    // Aguardar e tentar novamente, possivelmente com endpoint alternativo
    await this.delay(3000);
    
    const alternativeEndpoints = this.getAlternativeEndpoints(context);
    
    for (const endpoint of alternativeEndpoints) {
      try {
        const alternativeContext = { ...context, endpoint };
        const result = await originalOperation(alternativeContext);
        return { result, endpoint, attempts: alternativeEndpoints.indexOf(endpoint) + 1 };
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('Todos os endpoints alternativos falharam');
  }

  async handleDNSFailure(failure, originalOperation, context) {
    // Tentar com DNS alternativo ou IP direto
    const dnsAlternatives = this.getDNSAlternatives(context);
    
    for (const dnsConfig of dnsAlternatives) {
      try {
        const alternativeContext = { ...context, dns: dnsConfig };
        const result = await originalOperation(alternativeContext);
        return { result, dnsConfig, attempts: dnsAlternatives.indexOf(dnsConfig) + 1 };
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('Todas as alternativas de DNS falharam');
  }

  async handleAuthFailure(failure, originalOperation, context) {
    // Tentar renovar token ou usar credenciais alternativas
    try {
      const refreshedContext = await this.refreshAuthentication(context);
      const result = await originalOperation(refreshedContext);
      return { result, authRefreshed: true, attempts: 1 };
    } catch (error) {
      throw new Error('Falha na renovação de autenticação');
    }
  }

  async retryWithBackoff(operation, context, options = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        if (attempt > 1) {
          const delay = Math.min(
            this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
            this.retryConfig.maxDelay
          );
          await this.delay(delay);
        }
        
        const result = await operation({ ...context, ...options });
        return { result, attempts: attempt };
        
      } catch (error) {
        lastError = error;
        
        // Se é o último attempt, não continuar
        if (attempt === this.retryConfig.maxRetries) {
          break;
        }
      }
    }
    
    throw lastError;
  }

  createAlternativeContext(context) {
    // Criar contexto alternativo com parâmetros diferentes
    return {
      ...context,
      options: {
        ...context.options,
        simplified: true,
        maxResults: Math.floor((context.options?.maxResults || 10) / 2),
        timeout: (context.options?.timeout || 5000) * 1.5
      }
    };
  }

  reduceResourceUsage(context) {
    // Reduzir uso de recursos
    return {
      ...context,
      options: {
        ...context.options,
        maxConcurrency: 1,
        batchSize: Math.max(1, Math.floor((context.options?.batchSize || 10) / 2)),
        cacheEnabled: false
      }
    };
  }

  getNetworkAlternatives(context) {
    // Retornar configurações de rede alternativas
    return [
      { ...context, timeout: 10000, retries: 1 },
      { ...context, timeout: 15000, retries: 0 },
      { ...context, useProxy: true, timeout: 20000 }
    ];
  }

  getAlternativeEndpoints(context) {
    // Retornar endpoints alternativos baseados no contexto
    const baseEndpoints = [
      'https://api.nuxtjs.org',
      'https://ui.nuxt.com/api',
      'https://content.nuxtjs.org/api'
    ];
    
    return baseEndpoints.filter(endpoint => endpoint !== context.endpoint);
  }

  getDNSAlternatives(context) {
    // Retornar configurações de DNS alternativas
    return [
      { servers: ['8.8.8.8', '8.8.4.4'] },
      { servers: ['1.1.1.1', '1.0.0.1'] },
      { servers: ['208.67.222.222', '208.67.220.220'] }
    ];
  }

  async refreshAuthentication(context) {
    // Simular renovação de autenticação
    // Em implementação real, isso faria chamada para renovar token
    return {
      ...context,
      auth: {
        ...context.auth,
        token: 'refreshed_token_' + Date.now(),
        refreshed: true
      }
    };
  }

  async defaultRecovery(failure, originalOperation, context) {
    // Estratégia padrão: retry simples
    return await this.retryWithBackoff(originalOperation, context);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class FallbackCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 1000;
    this.ttl = 24 * 60 * 60 * 1000; // 24 horas
    this.hitCount = 0;
    this.missCount = 0;
  }

  generateKey(operation, context) {
    // Gerar chave única baseada na operação e contexto
    const contextStr = JSON.stringify({
      operation,
      query: context.query,
      params: context.params,
      options: context.options
    });
    
    return this.simpleHash(contextStr);
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

  async get(operation, context) {
    const key = this.generateKey(operation, context);
    const cached = this.cache.get(key);
    
    if (!cached) {
      this.missCount++;
      return null;
    }
    
    // Verificar TTL
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }
    
    this.hitCount++;
    return {
      ...cached.data,
      fromCache: true,
      cacheAge: Date.now() - cached.timestamp
    };
  }

  async set(operation, context, data) {
    const key = this.generateKey(operation, context);
    
    // Limpar cache se estiver muito grande
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      operation,
      accessCount: 0
    });
  }

  evictOldest() {
    // Remover 10% dos itens mais antigos
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = Math.floor(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  getCacheStats() {
    const total = this.hitCount + this.missCount;
    const hitRate = total > 0 ? this.hitCount / total : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: Math.round(hitRate * 100) / 100,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  estimateMemoryUsage() {
    // Estimativa simples do uso de memória
    let totalSize = 0;
    
    for (const [key, value] of this.cache) {
      totalSize += key.length * 2; // Aproximação para string
      totalSize += JSON.stringify(value).length * 2;
    }
    
    return totalSize;
  }

  clear() {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }
}

class HealthMonitor {
  constructor() {
    this.healthHistory = [];
    this.alertThresholds = {
      criticalHealth: 0.3,
      poorHealth: 0.5,
      consecutiveFailures: 5
    };
    
    this.alerts = [];
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  startMonitoring(intervalMs = 60000) {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
  }

  async performHealthCheck() {
    const healthStatus = {
      timestamp: Date.now(),
      systemHealth: await this.checkSystemHealth(),
      serviceHealth: await this.checkServiceHealth(),
      resourceHealth: await this.checkResourceHealth()
    };
    
    this.healthHistory.push(healthStatus);
    
    // Manter apenas últimas 1000 entradas
    if (this.healthHistory.length > 1000) {
      this.healthHistory = this.healthHistory.slice(-1000);
    }
    
    // Verificar se precisa gerar alertas
    await this.checkForAlerts(healthStatus);
    
    return healthStatus;
  }

  async checkSystemHealth() {
    // Verificar saúde geral do sistema
    return {
      status: 'healthy',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: await this.getCPUUsage()
    };
  }

  async checkServiceHealth() {
    // Verificar saúde dos serviços
    const services = [
      'nuxt_ui_service',
      'documentation_service',
      'context_service',
      'learning_service'
    ];
    
    const serviceStatus = {};
    
    for (const service of services) {
      serviceStatus[service] = await this.checkServiceStatus(service);
    }
    
    return serviceStatus;
  }

  async checkResourceHealth() {
    // Verificar saúde dos recursos
    return {
      diskSpace: await this.checkDiskSpace(),
      networkLatency: await this.checkNetworkLatency(),
      databaseConnections: await this.checkDatabaseConnections()
    };
  }

  async getCPUUsage() {
    // Implementação simplificada de uso de CPU
    return Math.random() * 0.5; // 0-50% simulado
  }

  async checkServiceStatus(serviceName) {
    // Simular verificação de status do serviço
    return {
      status: Math.random() > 0.1 ? 'healthy' : 'unhealthy',
      responseTime: Math.random() * 1000,
      lastCheck: Date.now()
    };
  }

  async checkDiskSpace() {
    // Simular verificação de espaço em disco
    return {
      available: Math.random() * 100,
      used: Math.random() * 100,
      total: 100
    };
  }

  async checkNetworkLatency() {
    // Simular verificação de latência de rede
    return Math.random() * 100;
  }

  async checkDatabaseConnections() {
    // Simular verificação de conexões de banco
    return {
      active: Math.floor(Math.random() * 10),
      idle: Math.floor(Math.random() * 5),
      total: 15
    };
  }

  async checkForAlerts(healthStatus) {
    const alerts = [];
    
    // Verificar saúde crítica do sistema
    if (healthStatus.systemHealth.memoryUsage.heapUsed / healthStatus.systemHealth.memoryUsage.heapTotal > 0.9) {
      alerts.push({
        type: 'critical',
        message: 'Uso de memória crítico',
        timestamp: Date.now(),
        details: healthStatus.systemHealth.memoryUsage
      });
    }
    
    // Verificar serviços não saudáveis
    Object.entries(healthStatus.serviceHealth).forEach(([service, status]) => {
      if (status.status === 'unhealthy') {
        alerts.push({
          type: 'warning',
          message: `Serviço ${service} não está saudável`,
          timestamp: Date.now(),
          details: status
        });
      }
    });
    
    // Adicionar alertas à lista
    this.alerts.push(...alerts);
    
    // Manter apenas últimos 100 alertas
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  getHealthReport() {
    const recentHistory = this.healthHistory.slice(-10);
    
    if (recentHistory.length === 0) {
      return { message: 'Nenhum dado de saúde disponível' };
    }
    
    const latestHealth = recentHistory[recentHistory.length - 1];
    const recentAlerts = this.alerts.filter(alert => 
      Date.now() - alert.timestamp < 60 * 60 * 1000 // Última hora
    );
    
    return {
      timestamp: Date.now(),
      currentHealth: latestHealth,
      recentAlerts: recentAlerts,
      trends: this.calculateHealthTrends(recentHistory),
      recommendations: this.generateHealthRecommendations(latestHealth, recentAlerts)
    };
  }

  calculateHealthTrends(history) {
    if (history.length < 2) return {};
    
    const first = history[0];
    const last = history[history.length - 1];
    
    return {
      memoryTrend: this.calculateTrend(
        first.systemHealth.memoryUsage.heapUsed,
        last.systemHealth.memoryUsage.heapUsed
      ),
      uptimeTrend: 'stable', // Uptime sempre cresce
      serviceTrend: this.calculateServiceTrend(history)
    };
  }

  calculateTrend(oldValue, newValue) {
    const change = (newValue - oldValue) / oldValue;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  calculateServiceTrend(history) {
    // Calcular tendência geral dos serviços
    let healthyCount = 0;
    let totalChecks = 0;
    
    history.forEach(h => {
      Object.values(h.serviceHealth).forEach(service => {
        totalChecks++;
        if (service.status === 'healthy') healthyCount++;
      });
    });
    
    const healthRatio = healthyCount / totalChecks;
    
    if (healthRatio > 0.9) return 'excellent';
    if (healthRatio > 0.7) return 'good';
    if (healthRatio > 0.5) return 'fair';
    return 'poor';
  }

  generateHealthRecommendations(currentHealth, recentAlerts) {
    const recommendations = [];
    
    // Recomendações baseadas no uso de memória
    const memoryUsage = currentHealth.systemHealth.memoryUsage.heapUsed / 
                       currentHealth.systemHealth.memoryUsage.heapTotal;
    
    if (memoryUsage > 0.8) {
      recommendations.push('Considerar aumentar limite de memória ou otimizar uso');
    }
    
    // Recomendações baseadas em alertas
    const criticalAlerts = recentAlerts.filter(a => a.type === 'critical');
    if (criticalAlerts.length > 0) {
      recommendations.push('Investigar e resolver alertas críticos imediatamente');
    }
    
    // Recomendações baseadas em serviços
    const unhealthyServices = Object.entries(currentHealth.serviceHealth)
      .filter(([_, status]) => status.status === 'unhealthy');
    
    if (unhealthyServices.length > 0) {
      recommendations.push(`Verificar serviços não saudáveis: ${unhealthyServices.map(([name]) => name).join(', ')}`);
    }
    
    return recommendations;
  }
}

class IntelligentFallbackManager {
  constructor(config = {}) {
    this.config = {
      enableHealthMonitoring: true,
      enableFallbackCache: true,
      maxRecoveryAttempts: 3,
      healthCheckInterval: 60000,
      cacheSize: 1000,
      cacheTTL: 24 * 60 * 60 * 1000,
      ...config
    };
    
    this.failureDetector = new FailureDetector();
    this.recoveryStrategy = new RecoveryStrategy();
    this.fallbackCache = new FallbackCache();
    this.healthMonitor = new HealthMonitor();
    
    this.operationHistory = [];
    this.recoveryStats = {
      totalFailures: 0,
      successfulRecoveries: 0,
      failedRecoveries: 0,
      cacheHits: 0
    };
    
    if (this.config.enableHealthMonitoring) {
      this.healthMonitor.startMonitoring(this.config.healthCheckInterval);
    }
  }

  async executeWithFallback(operation, context, options = {}) {
    const startTime = Date.now();
    const operationId = `op_${startTime}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Verificar cache primeiro
      if (this.config.enableFallbackCache) {
        const cachedResult = await this.fallbackCache.get(operation.name, context);
        if (cachedResult) {
          this.recoveryStats.cacheHits++;
          return {
            success: true,
            result: cachedResult,
            fromCache: true,
            operationId
          };
        }
      }
      
      // Executar operação principal
      const result = await this.executeOperation(operation, context, options);
      
      // Armazenar resultado bem-sucedido no cache
      if (this.config.enableFallbackCache && result) {
        await this.fallbackCache.set(operation.name, context, result);
      }
      
      // Registrar sucesso
      this.recordOperation(operationId, operation.name, context, result, null, Date.now() - startTime);
      
      return {
        success: true,
        result,
        operationId,
        responseTime: Date.now() - startTime
      };
      
    } catch (error) {
      // Detectar falha
      const failure = await this.failureDetector.detectFailure(
        operation.name,
        { error },
        { responseTime: Date.now() - startTime }
      );
      
      if (failure) {
        this.recoveryStats.totalFailures++;
        
        // Tentar recuperação
        const recoveryResult = await this.attemptRecovery(
          failure,
          operation,
          context,
          options
        );
        
        if (recoveryResult.success) {
          this.recoveryStats.successfulRecoveries++;
          
          // Armazenar resultado recuperado no cache
          if (this.config.enableFallbackCache && recoveryResult.result) {
            await this.fallbackCache.set(operation.name, context, recoveryResult.result);
          }
          
          // Registrar recuperação bem-sucedida
          this.recordOperation(
            operationId,
            operation.name,
            context,
            recoveryResult.result,
            failure,
            Date.now() - startTime
          );
          
          return {
            success: true,
            result: recoveryResult.result,
            recovered: true,
            recoveryStrategy: recoveryResult.strategy,
            operationId,
            responseTime: Date.now() - startTime
          };
          
        } else {
          this.recoveryStats.failedRecoveries++;
          
          // Tentar fallback do cache como último recurso
          if (this.config.enableFallbackCache) {
            const staleResult = await this.getStaleFromCache(operation.name, context);
            if (staleResult) {
              return {
                success: true,
                result: staleResult,
                fromStaleCache: true,
                originalError: error.message,
                operationId
              };
            }
          }
          
          // Registrar falha completa
          this.recordOperation(
            operationId,
            operation.name,
            context,
            null,
            failure,
            Date.now() - startTime
          );
          
          throw new Error(`Operação falhou após tentativas de recuperação: ${error.message}`);
        }
      } else {
        // Falha não detectada como recuperável
        throw error;
      }
    }
  }

  async executeOperation(operation, context, options) {
    const timeout = options.timeout || 5000;
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Operation timeout'));
      }, timeout);
      
      try {
        const result = operation(context);
        
        if (result && typeof result.then === 'function') {
          // Promise
          result
            .then(res => {
              clearTimeout(timer);
              resolve(res);
            })
            .catch(err => {
              clearTimeout(timer);
              reject(err);
            });
        } else {
          // Resultado síncrono
          clearTimeout(timer);
          resolve(result);
        }
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  async attemptRecovery(failure, operation, context, options) {
    let recoveryAttempts = 0;
    const maxAttempts = this.config.maxRecoveryAttempts;
    
    while (recoveryAttempts < maxAttempts) {
      recoveryAttempts++;
      
      try {
        const recoveryResult = await this.recoveryStrategy.executeRecovery(
          failure,
          operation,
          context
        );
        
        if (recoveryResult.success) {
          return recoveryResult;
        }
        
      } catch (recoveryError) {
        console.warn(`Tentativa de recuperação ${recoveryAttempts} falhou:`, recoveryError.message);
        
        if (recoveryAttempts === maxAttempts) {
          return {
            success: false,
            error: recoveryError.message,
            attempts: recoveryAttempts
          };
        }
      }
    }
    
    return {
      success: false,
      error: 'Máximo de tentativas de recuperação excedido',
      attempts: recoveryAttempts
    };
  }

  async getStaleFromCache(operationName, context) {
    // Buscar resultado em cache mesmo que expirado
    const key = this.fallbackCache.generateKey(operationName, context);
    const cached = this.fallbackCache.cache.get(key);
    
    if (cached) {
      return {
        ...cached.data,
        stale: true,
        age: Date.now() - cached.timestamp
      };
    }
    
    return null;
  }

  recordOperation(operationId, operationName, context, result, failure, responseTime) {
    this.operationHistory.push({
      id: operationId,
      operation: operationName,
      context: {
        query: context.query,
        params: context.params
      },
      result: result ? 'success' : 'failure',
      failure,
      responseTime,
      timestamp: Date.now()
    });
    
    // Manter apenas últimas 1000 operações
    if (this.operationHistory.length > 1000) {
      this.operationHistory = this.operationHistory.slice(-1000);
    }
  }

  getSystemStatus() {
    const healthStatus = this.failureDetector.getHealthStatus();
    const cacheStats = this.fallbackCache.getCacheStats();
    const healthReport = this.healthMonitor.getHealthReport();
    
    return {
      timestamp: Date.now(),
      health: healthStatus,
      cache: cacheStats,
      recovery: this.recoveryStats,
      monitoring: {
        enabled: this.config.enableHealthMonitoring,
        alerts: healthReport.recentAlerts?.length || 0
      },
      operations: {
        total: this.operationHistory.length,
        recent_failures: this.getRecentFailures(),
        success_rate: this.calculateSuccessRate()
      }
    };
  }

  getRecentFailures() {
    const oneHour = 60 * 60 * 1000;
    const recent = this.operationHistory.filter(op => 
      Date.now() - op.timestamp < oneHour && op.result === 'failure'
    );
    
    return recent.length;
  }

  calculateSuccessRate() {
    if (this.operationHistory.length === 0) return 1.0;
    
    const successes = this.operationHistory.filter(op => op.result === 'success').length;
    return successes / this.operationHistory.length;
  }

  generateSystemReport() {
    const status = this.getSystemStatus();
    const healthReport = this.healthMonitor.getHealthReport();
    
    return {
      timestamp: Date.now(),
      system_status: status,
      health_report: healthReport,
      recommendations: this.generateSystemRecommendations(status),
      configuration: this.config
    };
  }

  generateSystemRecommendations(status) {
    const recommendations = [];
    
    // Recomendações baseadas na taxa de sucesso
    if (status.operations.success_rate < 0.9) {
      recommendations.push('Taxa de sucesso baixa - investigar causas de falhas');
    }
    
    // Recomendações baseadas no cache
    if (status.cache.hitRate < 0.3) {
      recommendations.push('Taxa de hit do cache baixa - considerar ajustar TTL ou estratégia de cache');
    }
    
    // Recomendações baseadas na saúde
    if (status.health.score < 0.7) {
      recommendations.push('Saúde do sistema comprometida - verificar recursos e configurações');
    }
    
    // Recomendações baseadas em falhas recentes
    if (status.operations.recent_failures > 10) {
      recommendations.push('Muitas falhas recentes - investigar problemas sistêmicos');
    }
    
    return recommendations;
  }

  async shutdown() {
    // Parar monitoramento
    this.healthMonitor.stopMonitoring();
    
    // Limpar caches
    this.fallbackCache.clear();
    
    // Gerar relatório final
    const finalReport = this.generateSystemReport();
    
    console.log('IntelligentFallbackManager desligado. Relatório final:', finalReport);
    
    return finalReport;
  }
}

module.exports = {
  IntelligentFallbackManager,
  FailureDetector,
  RecoveryStrategy,
  FallbackCache,
  HealthMonitor
};