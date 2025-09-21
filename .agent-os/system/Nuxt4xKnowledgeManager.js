/**
 * Nuxt4xKnowledgeManager.js
 * Sistema de conhecimento full-stack para Nuxt 4.x com integração Nitro Engine
 * Baseado na seção 6.1 do PRD - Full-Stack Knowledge System
 * 
 * @author Murillo Dutt - Dutt eCommerce Website Design
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class Nuxt4xKnowledgeManager {
  constructor(options = {}) {
    this.rootPath = options.rootPath || process.cwd();
    this.cacheDir = options.cacheDir || path.join(this.rootPath, '.agent-os/cache');
    
    // Fontes de conhecimento Nuxt 4.x
    this.sources = {
      // Nuxt 4.x Core Sources
      official: 'https://nuxt.com/docs/4.x',
      ui: 'https://ui4.nuxt.com/docs',
      nitro: 'https://nitro.unjs.io/docs',
      llmsTxt: 'https://ui4.nuxt.com/.well-known/llms.txt',
      
      // Full-Stack Resources
      serverEngine: 'https://nitro.unjs.io/guide',
      deployment: 'https://nuxt.com/docs/4.x/getting-started/deployment',
      modules: 'https://nuxt.com/modules',
      
      // Community & Ecosystem
      community: ['Discord', 'GitHub', 'StackOverflow'],
      ecosystem: ['NuxtHub', 'Nuxt Studio', 'Nuxt UI Pro']
    };
    
    this.cache = new Map();
    this.index = null;
    this.nitroEngine = null;
    this.nuxt4xContent = null;
    
    // Configurações
    this.config = {
      cacheTimeout: 3600000, // 1 hora
      maxCacheSize: 1000,
      enableOfflineMode: true,
      autoUpdate: true,
      ...options.config
    };
  }

  async initialize() {
    try {
      console.log('Inicializando Nuxt4xKnowledgeManager...');
      
      // Criar diretórios necessários
      await this.ensureDirectories();
      
      // Carregar conhecimento Nuxt 4.x
      this.nuxt4xContent = await this.fetchNuxt4xDocs();
      
      // Inicializar Nitro Server Engine knowledge
      this.nitroEngine = await this.initializeNitroKnowledge();
      
      // Indexar documentação full-stack
      this.index = await this.buildFullStackIndex();
      
      // Pré-carregar padrões SSR e full-stack
      await this.preloadFullStackPatterns();
      
      console.log('Nuxt4xKnowledgeManager inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar Nuxt4xKnowledgeManager:', error);
      throw error;
    }
  }

  async ensureDirectories() {
    const dirs = [
      this.cacheDir,
      path.join(this.cacheDir, 'docs'),
      path.join(this.cacheDir, 'patterns'),
      path.join(this.cacheDir, 'components')
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
      }
    }
  }

  async fetchNuxt4xDocs() {
    try {
      console.log('Carregando documentação Nuxt 4.x...');
      
      // Tentar carregar do cache primeiro
      const cachedContent = await this.loadFromCache('nuxt4x-docs');
      if (cachedContent && !this.isCacheExpired(cachedContent.timestamp)) {
        console.log('Usando documentação Nuxt 4.x do cache');
        return cachedContent.data;
      }
      
      // Carregar documentação online (simulado para desenvolvimento local)
      const content = await this.loadLocalNuxt4xDocs();
      
      // Salvar no cache
      await this.saveToCache('nuxt4x-docs', content);
      
      return content;
    } catch (error) {
      console.warn('Erro ao carregar docs Nuxt 4.x, usando fallback:', error.message);
      return this.getFallbackNuxt4xDocs();
    }
  }

  async loadLocalNuxt4xDocs() {
    // Simular carregamento de documentação local
    return {
      // Core Nuxt 4.x Features
      framework: {
        version: '4.x',
        features: [
          'Universal Rendering',
          'Server-Side Rendering (SSR)',
          'Static Site Generation (SSG)',
          'Single Page Application (SPA)',
          'Hybrid Rendering',
          'Auto-imports',
          'File-based Routing',
          'TypeScript Support',
          'Vite Integration'
        ],
        improvements: [
          'Better Performance',
          'Smaller Bundle Size',
          'Improved Developer Experience',
          'Enhanced TypeScript Support',
          'Better Tree Shaking'
        ]
      },
      
      // SSR Capabilities
      ssr: {
        modes: ['universal', 'spa', 'static'],
        features: [
          'Server-Side Rendering',
          'Client-Side Hydration',
          'Route-level Rendering',
          'Incremental Static Regeneration',
          'Edge-Side Rendering'
        ],
        optimizations: [
          'Payload Reduction',
          'Selective Hydration',
          'Component Islands',
          'Streaming SSR'
        ]
      },
      
      // Full-Stack Features
      fullStack: {
        serverEngine: 'Nitro',
        features: [
          'API Routes',
          'Server Middleware',
          'Universal Deployment',
          'Storage Layer',
          'Caching System',
          'WebSocket Support'
        ],
        deployment: [
          'Vercel',
          'Netlify',
          'Cloudflare',
          'Node.js',
          'Static Hosting'
        ]
      },
      
      // Server Engine (Nitro)
      serverEngine: {
        name: 'Nitro',
        version: '2.x',
        features: [
          'Universal JavaScript Server',
          'Zero-Config Deployment',
          'Built-in Storage',
          'Route Rules',
          'Middleware System',
          'WebSocket Support'
        ],
        presets: [
          'node-server',
          'vercel',
          'netlify',
          'cloudflare-pages',
          'static'
        ]
      },
      
      // API Patterns
      apiRoutes: {
        patterns: [
          'RESTful APIs',
          'GraphQL Integration',
          'WebSocket APIs',
          'Server-Sent Events',
          'File Upload Handling'
        ],
        middleware: [
          'Authentication',
          'CORS',
          'Rate Limiting',
          'Validation',
          'Error Handling'
        ]
      },
      
      // UI Components
      components: {
        library: 'Nuxt UI v4',
        categories: [
          'Layout',
          'Navigation',
          'Forms',
          'Data Display',
          'Feedback',
          'Overlay',
          'Typography'
        ],
        features: [
          'Headless UI',
          'Tailwind CSS',
          'Dark Mode',
          'Accessibility',
          'TypeScript',
          'Customizable'
        ]
      },
      
      // Patterns
      patterns: {
        architectural: [
          'Composables Pattern',
          'Plugin System',
          'Module Architecture',
          'Middleware Chain',
          'State Management'
        ],
        performance: [
          'Code Splitting',
          'Lazy Loading',
          'Image Optimization',
          'Bundle Analysis',
          'Core Web Vitals'
        ]
      },
      
      // LLMs Integration
      llmsCapabilities: {
        features: [
          'AI-Powered Development',
          'Code Generation',
          'Documentation Generation',
          'Performance Optimization',
          'Accessibility Improvements'
        ],
        integrations: [
          'OpenAI',
          'Anthropic',
          'Local Models',
          'Custom Endpoints'
        ]
      }
    };
  }

  getFallbackNuxt4xDocs() {
    return {
      framework: { version: '4.x', features: ['SSR', 'SPA', 'SSG'] },
      ssr: { modes: ['universal', 'spa', 'static'] },
      fullStack: { serverEngine: 'Nitro' },
      serverEngine: { name: 'Nitro', version: '2.x' },
      apiRoutes: { patterns: ['REST', 'GraphQL'] },
      components: { library: 'Nuxt UI v4' },
      patterns: { architectural: ['Composables', 'Plugins'] },
      llmsCapabilities: { features: ['Code Generation'] }
    };
  }

  async initializeNitroKnowledge() {
    try {
      console.log('Inicializando conhecimento Nitro Engine...');
      
      const nitroKnowledge = {
        engine: {
          name: 'Nitro',
          description: 'Universal JavaScript Server Engine',
          features: [
            'Zero-Config Deployment',
            'Universal Rendering',
            'Built-in Storage',
            'Route Rules',
            'Middleware System'
          ]
        },
        
        deployment: {
          presets: {
            'node-server': {
              description: 'Node.js server deployment',
              config: { preset: 'node-server' }
            },
            'vercel': {
              description: 'Vercel serverless deployment',
              config: { preset: 'vercel' }
            },
            'netlify': {
              description: 'Netlify Functions deployment',
              config: { preset: 'netlify' }
            },
            'cloudflare-pages': {
              description: 'Cloudflare Pages deployment',
              config: { preset: 'cloudflare-pages' }
            },
            'static': {
              description: 'Static site generation',
              config: { preset: 'static' }
            }
          }
        },
        
        storage: {
          drivers: [
            'fs', 'redis', 'memory', 'cloudflare-kv',
            'vercel-kv', 'planetscale', 'mongodb'
          ],
          patterns: [
            'Key-Value Storage',
            'Database Integration',
            'File System Storage',
            'Cloud Storage'
          ]
        },
        
        middleware: {
          types: [
            'Route Middleware',
            'Server Middleware',
            'Error Middleware',
            'CORS Middleware'
          ],
          patterns: [
            'Authentication',
            'Rate Limiting',
            'Request Validation',
            'Response Transformation'
          ]
        }
      };
      
      await this.saveToCache('nitro-knowledge', nitroKnowledge);
      return nitroKnowledge;
    } catch (error) {
      console.warn('Erro ao inicializar Nitro knowledge:', error.message);
      return { engine: { name: 'Nitro' } };
    }
  }

  async buildFullStackIndex() {
    try {
      console.log('Construindo índice full-stack...');
      
      const index = {
        topics: new Map(),
        patterns: new Map(),
        components: new Map(),
        apis: new Map()
      };
      
      // Indexar tópicos do framework
      if (this.nuxt4xContent?.framework) {
        for (const feature of this.nuxt4xContent.framework.features || []) {
          index.topics.set(feature.toLowerCase(), {
            type: 'framework',
            content: feature,
            category: 'core'
          });
        }
      }
      
      // Indexar padrões arquiteturais
      if (this.nuxt4xContent?.patterns) {
        for (const pattern of this.nuxt4xContent.patterns.architectural || []) {
          index.patterns.set(pattern.toLowerCase(), {
            type: 'pattern',
            content: pattern,
            category: 'architectural'
          });
        }
      }
      
      // Indexar componentes
      if (this.nuxt4xContent?.components) {
        for (const category of this.nuxt4xContent.components.categories || []) {
          index.components.set(category.toLowerCase(), {
            type: 'component',
            content: category,
            category: 'ui'
          });
        }
      }
      
      // Indexar APIs
      if (this.nuxt4xContent?.apiRoutes) {
        for (const pattern of this.nuxt4xContent.apiRoutes.patterns || []) {
          index.apis.set(pattern.toLowerCase(), {
            type: 'api',
            content: pattern,
            category: 'server'
          });
        }
      }
      
      await this.saveToCache('fullstack-index', {
        topics: Array.from(index.topics.entries()),
        patterns: Array.from(index.patterns.entries()),
        components: Array.from(index.components.entries()),
        apis: Array.from(index.apis.entries())
      });
      
      console.log(`Índice construído com ${index.topics.size + index.patterns.size + index.components.size + index.apis.size} entradas`);
      return index;
    } catch (error) {
      console.error('Erro ao construir índice:', error);
      return { topics: new Map(), patterns: new Map(), components: new Map(), apis: new Map() };
    }
  }

  async preloadFullStackPatterns() {
    try {
      console.log('Pré-carregando padrões full-stack...');
      
      const patterns = {
        ssr: {
          'universal-rendering': {
            description: 'Renderização universal com SSR e hidratação',
            example: 'nuxt.config.ts com ssr: true',
            useCase: 'SEO e performance'
          },
          'static-generation': {
            description: 'Geração estática de páginas',
            example: 'nuxt generate',
            useCase: 'Sites estáticos e blogs'
          }
        },
        
        api: {
          'rest-endpoints': {
            description: 'Endpoints RESTful com Nitro',
            example: 'server/api/users/[id].ts',
            useCase: 'APIs CRUD'
          },
          'middleware-chain': {
            description: 'Cadeia de middleware para APIs',
            example: 'server/middleware/auth.ts',
            useCase: 'Autenticação e validação'
          }
        },
        
        deployment: {
          'vercel-deployment': {
            description: 'Deploy serverless na Vercel',
            example: 'preset: vercel',
            useCase: 'Aplicações serverless'
          },
          'static-hosting': {
            description: 'Hospedagem estática',
            example: 'preset: static',
            useCase: 'CDN e performance'
          }
        }
      };
      
      await this.saveToCache('fullstack-patterns', patterns);
      console.log('Padrões full-stack pré-carregados');
    } catch (error) {
      console.warn('Erro ao pré-carregar padrões:', error.message);
    }
  }

  async query(question, context = {}) {
    try {
      // 1. Verificar cache inteligente
      const cacheKey = this.generateCacheKey(question, context);
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (!this.isCacheExpired(cached.timestamp)) {
          return this.enhanceWithNuxt4x(cached.data);
        }
      }
      
      // 2. Análise de contexto Nuxt 4.x
      const queryType = this.analyzeQueryType(question);
      
      // 3. Buscar no índice especializado
      const localResult = await this.searchSpecializedIndex(question, queryType);
      if (localResult.confidence > 0.9) {
        const enhanced = this.enhanceWithNuxt4x(localResult);
        this.cache.set(cacheKey, { data: enhanced, timestamp: Date.now() });
        return enhanced;
      }
      
      // 4. Consultar conhecimento local
      const knowledgeResult = await this.queryLocalKnowledge(question, queryType);
      if (knowledgeResult.found) {
        this.cache.set(cacheKey, { data: knowledgeResult, timestamp: Date.now() });
        return knowledgeResult;
      }
      
      // 5. Fallback inteligente com Nitro
      return this.intelligentFallback(question, queryType);
    } catch (error) {
      console.error('Erro na consulta:', error);
      return this.intelligentFallback(question, 'general');
    }
  }

  analyzeQueryType(question) {
    const patterns = {
      ssr: /server.*render|ssr|hydrat|universal/i,
      fullStack: /api|server|backend|database|auth|full.*stack/i,
      deployment: /deploy|host|build|production|vercel|netlify/i,
      performance: /performance|optimize|speed|core.*vital|bundle/i,
      ui: /component|ui|interface|design|nuxt.*ui/i,
      nitro: /nitro|server.*engine|middleware/i,
      routing: /route|router|navigation|page/i,
      state: /state|store|pinia|vuex/i,
      composables: /composable|use|hook/i
    };
    
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(question)) return type;
    }
    
    return 'general';
  }

  async searchSpecializedIndex(question, queryType) {
    try {
      if (!this.index) return { confidence: 0 };
      
      const searchTerms = question.toLowerCase().split(/\s+/);
      const results = [];
      
      // Buscar em diferentes categorias baseado no tipo
      const searchMaps = {
        ssr: [this.index.topics, this.index.patterns],
        fullStack: [this.index.apis, this.index.patterns],
        ui: [this.index.components],
        nitro: [this.index.apis, this.index.patterns],
        general: [this.index.topics, this.index.patterns, this.index.components, this.index.apis]
      };
      
      const mapsToSearch = searchMaps[queryType] || searchMaps.general;
      
      for (const map of mapsToSearch) {
        for (const [key, value] of map) {
          const score = this.calculateRelevanceScore(searchTerms, key, value);
          if (score > 0.5) {
            results.push({ ...value, score, key });
          }
        }
      }
      
      if (results.length > 0) {
        const bestResult = results.sort((a, b) => b.score - a.score)[0];
        return {
          confidence: bestResult.score,
          type: queryType,
          content: bestResult.content,
          category: bestResult.category,
          suggestions: results.slice(1, 4)
        };
      }
      
      return { confidence: 0 };
    } catch (error) {
      console.error('Erro na busca especializada:', error);
      return { confidence: 0 };
    }
  }

  calculateRelevanceScore(searchTerms, key, value) {
    let score = 0;
    const keyWords = key.split(/[\s-_]+/);
    const contentWords = (value.content || '').toLowerCase().split(/\s+/);
    
    for (const term of searchTerms) {
      // Correspondência exata na chave
      if (key.includes(term)) score += 1.0;
      
      // Correspondência parcial na chave
      for (const keyWord of keyWords) {
        if (keyWord.includes(term) || term.includes(keyWord)) {
          score += 0.7;
        }
      }
      
      // Correspondência no conteúdo
      for (const contentWord of contentWords) {
        if (contentWord.includes(term) || term.includes(contentWord)) {
          score += 0.3;
        }
      }
    }
    
    return Math.min(score / searchTerms.length, 1.0);
  }

  async queryLocalKnowledge(question, queryType) {
    try {
      const knowledge = {
        ssr: this.getSSRKnowledge(question),
        fullStack: this.getFullStackKnowledge(question),
        deployment: this.getDeploymentKnowledge(question),
        performance: this.getPerformanceKnowledge(question),
        ui: this.getUIKnowledge(question),
        nitro: this.getNitroKnowledge(question),
        routing: this.getRoutingKnowledge(question),
        state: this.getStateKnowledge(question),
        composables: this.getComposablesKnowledge(question)
      };
      
      const result = knowledge[queryType] || knowledge.general;
      
      if (result) {
        return {
          found: true,
          type: queryType,
          answer: result.answer,
          examples: result.examples || [],
          references: result.references || [],
          nextSteps: result.nextSteps || []
        };
      }
      
      return { found: false };
    } catch (error) {
      console.error('Erro na consulta local:', error);
      return { found: false };
    }
  }

  getSSRKnowledge(question) {
    return {
      answer: 'Nuxt 4.x oferece renderização universal com SSR, SPA e SSG. Use `ssr: true` para renderização server-side completa.',
      examples: [
        'nuxt.config.ts: { ssr: true }',
        'Renderização híbrida com route rules',
        'Selective hydration para performance'
      ],
      references: ['https://nuxt.com/docs/4.x/guide/concepts/rendering'],
      nextSteps: ['Configurar route rules', 'Implementar lazy hydration']
    };
  }

  getFullStackKnowledge(question) {
    return {
      answer: 'Nuxt 4.x com Nitro Engine oferece desenvolvimento full-stack completo com APIs, middleware e deployment universal.',
      examples: [
        'server/api/users.ts para endpoints',
        'server/middleware/auth.ts para autenticação',
        'Integração com bancos de dados'
      ],
      references: ['https://nitro.unjs.io/guide'],
      nextSteps: ['Criar API routes', 'Configurar middleware', 'Setup de banco de dados']
    };
  }

  getDeploymentKnowledge(question) {
    return {
      answer: 'Nitro Engine suporta deployment universal com presets para Vercel, Netlify, Cloudflare e mais.',
      examples: [
        'preset: "vercel" para Vercel',
        'preset: "netlify" para Netlify',
        'preset: "static" para hospedagem estática'
      ],
      references: ['https://nuxt.com/docs/4.x/getting-started/deployment'],
      nextSteps: ['Escolher preset', 'Configurar variáveis de ambiente', 'Setup CI/CD']
    };
  }

  getPerformanceKnowledge(question) {
    return {
      answer: 'Nuxt 4.x inclui otimizações automáticas para Core Web Vitals, code splitting e lazy loading.',
      examples: [
        'Lazy loading automático de componentes',
        'Code splitting por rota',
        'Image optimization integrada'
      ],
      references: ['https://nuxt.com/docs/4.x/guide/concepts/performance'],
      nextSteps: ['Analisar bundle size', 'Implementar lazy loading', 'Otimizar imagens']
    };
  }

  getUIKnowledge(question) {
    return {
      answer: 'Nuxt UI v4 oferece componentes headless com Tailwind CSS, dark mode e acessibilidade.',
      examples: [
        '<UButton> para botões',
        '<UForm> para formulários',
        '<UModal> para modais'
      ],
      references: ['https://ui4.nuxt.com/docs'],
      nextSteps: ['Instalar @nuxt/ui', 'Configurar tema', 'Implementar componentes']
    };
  }

  getNitroKnowledge(question) {
    return {
      answer: 'Nitro Engine é o servidor universal do Nuxt 4.x com zero-config deployment e built-in storage.',
      examples: [
        'API routes automáticas',
        'Middleware system',
        'Storage layer integrado'
      ],
      references: ['https://nitro.unjs.io/docs'],
      nextSteps: ['Configurar storage', 'Criar middleware', 'Setup de cache']
    };
  }

  getRoutingKnowledge(question) {
    return {
      answer: 'Nuxt 4.x usa file-based routing com suporte a layouts, middleware e route rules.',
      examples: [
        'pages/index.vue para /',
        'pages/users/[id].vue para /users/:id',
        'layouts/default.vue para layout padrão'
      ],
      references: ['https://nuxt.com/docs/4.x/guide/directory-structure/pages'],
      nextSteps: ['Criar páginas', 'Configurar layouts', 'Adicionar middleware']
    };
  }

  getStateKnowledge(question) {
    return {
      answer: 'Nuxt 4.x recomenda Pinia para gerenciamento de estado com SSR support.',
      examples: [
        'stores/user.ts com Pinia',
        'useState() para estado reativo',
        'Server-side state hydration'
      ],
      references: ['https://nuxt.com/docs/4.x/getting-started/state-management'],
      nextSteps: ['Instalar Pinia', 'Criar stores', 'Configurar SSR state']
    };
  }

  getComposablesKnowledge(question) {
    return {
      answer: 'Nuxt 4.x oferece composables built-in e auto-import para lógica reutilizável.',
      examples: [
        'useFetch() para data fetching',
        'useRoute() para informações da rota',
        'useState() para estado reativo'
      ],
      references: ['https://nuxt.com/docs/4.x/guide/directory-structure/composables'],
      nextSteps: ['Criar composables customizados', 'Usar built-in composables', 'Configurar auto-imports']
    };
  }

  enhanceWithNuxt4x(result) {
    return {
      ...result,
      nuxt4xFeatures: this.getNuxt4xRelevantFeatures(result.type || 'general'),
      ssrCapabilities: this.getSSREnhancements(result.type || 'general'),
      fullStackOptions: this.getFullStackOptions(result.type || 'general'),
      deploymentStrategies: this.getDeploymentStrategies(result.type || 'general'),
      performanceOptimizations: this.getPerformanceOptimizations(result.type || 'general')
    };
  }

  getNuxt4xRelevantFeatures(topic) {
    const features = {
      ssr: ['Universal Rendering', 'Hydration', 'Route Rules'],
      fullStack: ['Nitro Engine', 'API Routes', 'Server Middleware'],
      ui: ['Nuxt UI v4', 'Tailwind CSS', 'Dark Mode'],
      performance: ['Code Splitting', 'Lazy Loading', 'Bundle Optimization'],
      deployment: ['Universal Deployment', 'Zero Config', 'Multiple Presets']
    };
    
    return features[topic] || features.ssr;
  }

  getSSREnhancements(topic) {
    return {
      modes: ['universal', 'spa', 'static'],
      optimizations: ['Selective Hydration', 'Payload Reduction', 'Streaming'],
      benefits: ['SEO', 'Performance', 'User Experience']
    };
  }

  getFullStackOptions(topic) {
    return {
      server: 'Nitro Engine',
      apis: ['REST', 'GraphQL', 'WebSocket'],
      storage: ['Built-in Storage', 'Database Integration'],
      deployment: ['Serverless', 'Traditional Server', 'Static']
    };
  }

  getDeploymentStrategies(topic) {
    return {
      serverless: ['Vercel', 'Netlify', 'Cloudflare'],
      traditional: ['Node.js Server', 'Docker', 'PM2'],
      static: ['CDN', 'GitHub Pages', 'Netlify']
    };
  }

  getPerformanceOptimizations(topic) {
    return {
      bundling: ['Tree Shaking', 'Code Splitting', 'Minification'],
      loading: ['Lazy Loading', 'Preloading', 'Prefetching'],
      caching: ['HTTP Cache', 'Service Worker', 'CDN'],
      metrics: ['Core Web Vitals', 'Bundle Analysis', 'Performance Monitoring']
    };
  }

  intelligentFallback(question, queryType) {
    return {
      found: true,
      type: 'fallback',
      answer: `Para questões sobre ${queryType} em Nuxt 4.x, recomendo consultar a documentação oficial ou usar os recursos de desenvolvimento integrados.`,
      suggestions: [
        'Consultar documentação oficial do Nuxt 4.x',
        'Verificar exemplos na comunidade',
        'Usar Nuxt DevTools para debugging',
        'Consultar repositório de exemplos'
      ],
      resources: [
        'https://nuxt.com/docs/4.x',
        'https://ui4.nuxt.com/docs',
        'https://nitro.unjs.io/docs'
      ]
    };
  }

  async loadFromCache(key) {
    try {
      const cachePath = path.join(this.cacheDir, `${key}.json`);
      const content = await fs.readFile(cachePath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  async saveToCache(key, data) {
    try {
      const cachePath = path.join(this.cacheDir, `${key}.json`);
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      await fs.writeFile(cachePath, JSON.stringify(cacheData, null, 2));
    } catch (error) {
      console.warn(`Erro ao salvar cache ${key}:`, error.message);
    }
  }

  isCacheExpired(timestamp) {
    return Date.now() - timestamp > this.config.cacheTimeout;
  }

  generateCacheKey(question, context) {
    const data = { question, context };
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  }

  // Métodos de limpeza e manutenção
  async clearCache() {
    try {
      this.cache.clear();
      const files = await fs.readdir(this.cacheDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          await fs.unlink(path.join(this.cacheDir, file));
        }
      }
      console.log('Cache limpo com sucesso');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  async updateKnowledge() {
    try {
      console.log('Atualizando base de conhecimento...');
      
      // Recarregar documentação
      this.nuxt4xContent = await this.fetchNuxt4xDocs();
      
      // Reconstruir índice
      this.index = await this.buildFullStackIndex();
      
      // Limpar cache antigo
      this.cache.clear();
      
      console.log('Base de conhecimento atualizada');
    } catch (error) {
      console.error('Erro ao atualizar conhecimento:', error);
    }
  }

  getStats() {
    return {
      cacheSize: this.cache.size,
      indexSize: this.index ? 
        this.index.topics.size + this.index.patterns.size + 
        this.index.components.size + this.index.apis.size : 0,
      lastUpdate: this.nuxt4xContent ? Date.now() : null,
      version: '1.0.0'
    };
  }
}

module.exports = Nuxt4xKnowledgeManager;