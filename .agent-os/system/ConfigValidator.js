/**
 * ConfigValidator.js
 * Sistema de Validação de Integridade para Agent OS
 * Implementa as especificações da seção 4.3 do PRD
 */

import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { execSync } from 'child_process';
import semver from 'semver';

export class ConfigValidator {
  constructor(config = {}) {
    this.config = {
      systemVersion: config.systemVersion || '1.0.0',
      strictMode: config.strictMode !== false,
      autoFix: config.autoFix || false,
      validationRules: config.validationRules || {},
      ...config
    };
    
    this.validationResults = new Map();
    this.supportedExtensions = ['.yaml', '.yml', '.json', '.js', '.ts', '.vue', '.md'];
  }

  /**
   * Valida um arquivo específico
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<Object>} - Resultado da validação
   */
  async validateFile(filePath) {
    try {
      const extension = path.extname(filePath).toLowerCase();
      const content = await fs.readFile(filePath, 'utf8');
      const stats = await fs.stat(filePath);

      let result = {
        file: filePath,
        valid: true,
        errors: [],
        warnings: [],
        info: [],
        size: stats.size,
        lastModified: stats.mtime,
        extension
      };

      // Validação por tipo de arquivo
      switch (extension) {
        case '.yaml':
        case '.yml':
          result = { ...result, ...await this.validateYAML(content, filePath) };
          break;
        case '.json':
          result = { ...result, ...await this.validateJSON(content, filePath) };
          break;
        case '.js':
        case '.ts':
          result = { ...result, ...await this.validateJavaScript(content, filePath) };
          break;
        case '.vue':
          result = { ...result, ...await this.validateVue(content, filePath) };
          break;
        case '.md':
          result = { ...result, ...await this.validateMarkdown(content, filePath) };
          break;
        default:
          result.warnings.push(`Tipo de arquivo não suportado para validação: ${extension}`);
      }

      // Validações gerais
      await this.validateFileSize(result);
      await this.validateEncoding(content, result);
      await this.validateNaming(filePath, result);

      // Validação de compatibilidade
      const compatibilityResult = await this.validateCompatibility(filePath, content);
      result.compatible = compatibilityResult.compatible;
      if (!compatibilityResult.compatible) {
        result.errors.push(compatibilityResult.message);
        if (compatibilityResult.suggestion) {
          result.info.push(`Sugestão: ${compatibilityResult.suggestion}`);
        }
      }

      // Determinar status final
      result.valid = result.errors.length === 0;
      
      // Armazenar resultado
      this.validationResults.set(filePath, result);

      return result;

    } catch (error) {
      const errorResult = {
        file: filePath,
        valid: false,
        errors: [`Erro ao validar arquivo: ${error.message}`],
        warnings: [],
        info: [],
        exception: error
      };
      
      this.validationResults.set(filePath, errorResult);
      return errorResult;
    }
  }

  /**
   * Valida arquivo YAML
   * @param {string} content - Conteúdo do arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<Object>} - Resultado da validação
   */
  async validateYAML(content, filePath) {
    const result = { errors: [], warnings: [], info: [] };

    try {
      const parsed = yaml.parse(content);
      result.info.push('YAML válido');
      
      // Validações específicas do YAML
      if (typeof parsed === 'object' && parsed !== null) {
        // Verificar estrutura esperada para arquivos de configuração
        if (filePath.includes('config') || filePath.includes('.agent-os')) {
          await this.validateConfigStructure(parsed, result);
        }
        
        // Verificar duplicatas de chaves
        this.checkDuplicateKeys(content, result);
        
        // Verificar indentação consistente
        this.checkYAMLIndentation(content, result);
      }

    } catch (error) {
      result.errors.push(`YAML inválido: ${error.message}`);
      
      if (error.mark) {
        result.errors.push(`Linha ${error.mark.line + 1}, Coluna ${error.mark.column + 1}`);
      }
    }

    return result;
  }

  /**
   * Valida arquivo JSON
   * @param {string} content - Conteúdo do arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<Object>} - Resultado da validação
   */
  async validateJSON(content, filePath) {
    const result = { errors: [], warnings: [], info: [] };

    try {
      const parsed = JSON.parse(content);
      result.info.push('JSON válido');
      
      // Validações específicas do JSON
      if (filePath.includes('package.json')) {
        await this.validatePackageJSON(parsed, result);
      } else if (filePath.includes('tsconfig.json')) {
        await this.validateTSConfig(parsed, result);
      } else if (filePath.includes('nuxt.config')) {
        await this.validateNuxtConfig(parsed, result);
      }
      
      // Verificar formatação
      const formatted = JSON.stringify(parsed, null, 2);
      if (content.trim() !== formatted) {
        result.warnings.push('JSON não está formatado corretamente');
      }

    } catch (error) {
      result.errors.push(`JSON inválido: ${error.message}`);
      
      // Tentar identificar linha do erro
      const lines = content.split('\n');
      const errorMatch = error.message.match(/position (\d+)/);
      if (errorMatch) {
        const position = parseInt(errorMatch[1]);
        let currentPos = 0;
        for (let i = 0; i < lines.length; i++) {
          currentPos += lines[i].length + 1;
          if (currentPos >= position) {
            result.errors.push(`Erro próximo à linha ${i + 1}`);
            break;
          }
        }
      }
    }

    return result;
  }

  /**
   * Valida arquivo JavaScript/TypeScript
   * @param {string} content - Conteúdo do arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<Object>} - Resultado da validação
   */
  async validateJavaScript(content, filePath) {
    const result = { errors: [], warnings: [], info: [] };

    try {
      // Verificar sintaxe básica usando Node.js
      const isTypeScript = filePath.endsWith('.ts');
      
      if (isTypeScript) {
        // Para TypeScript, verificar se tsc está disponível
        try {
          execSync('tsc --version', { stdio: 'ignore' });
          result.info.push('TypeScript detectado');
        } catch {
          result.warnings.push('TypeScript Compiler não encontrado');
        }
      }

      // Validações de padrões de código
      await this.validateCodePatterns(content, result, filePath);
      
      // Verificar imports/exports
      this.validateImportsExports(content, result);
      
      // Verificar convenções de nomenclatura
      this.validateNamingConventions(content, result);

    } catch (error) {
      result.errors.push(`Erro de sintaxe JavaScript/TypeScript: ${error.message}`);
    }

    return result;
  }

  /**
   * Valida arquivo Vue
   * @param {string} content - Conteúdo do arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<Object>} - Resultado da validação
   */
  async validateVue(content, filePath) {
    const result = { errors: [], warnings: [], info: [] };

    try {
      // Verificar estrutura básica do componente Vue
      const hasTemplate = /<template[^>]*>/.test(content);
      const hasScript = /<script[^>]*>/.test(content);
      const hasStyle = /<style[^>]*>/.test(content);

      if (!hasTemplate && !hasScript) {
        result.errors.push('Componente Vue deve ter pelo menos <template> ou <script>');
      }

      if (hasTemplate) {
        result.info.push('Template encontrado');
        this.validateVueTemplate(content, result);
      }

      if (hasScript) {
        result.info.push('Script encontrado');
        this.validateVueScript(content, result);
      }

      if (hasStyle) {
        result.info.push('Estilos encontrados');
        this.validateVueStyle(content, result);
      }

      // Verificar Composition API vs Options API
      this.detectVueAPIStyle(content, result);

    } catch (error) {
      result.errors.push(`Erro ao validar componente Vue: ${error.message}`);
    }

    return result;
  }

  /**
   * Valida arquivo Markdown
   * @param {string} content - Conteúdo do arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<Object>} - Resultado da validação
   */
  async validateMarkdown(content, filePath) {
    const result = { errors: [], warnings: [], info: [] };

    try {
      // Verificar estrutura de cabeçalhos
      this.validateMarkdownHeaders(content, result);
      
      // Verificar links
      await this.validateMarkdownLinks(content, result, filePath);
      
      // Verificar blocos de código
      this.validateCodeBlocks(content, result);
      
      // Verificar frontmatter (se presente)
      if (content.startsWith('---')) {
        this.validateFrontmatter(content, result);
      }

    } catch (error) {
      result.errors.push(`Erro ao validar Markdown: ${error.message}`);
    }

    return result;
  }

  /**
   * Valida compatibilidade com versão do sistema
   * @param {string} filePath - Caminho do arquivo
   * @param {string} content - Conteúdo do arquivo
   * @returns {Promise<Object>} - Resultado da compatibilidade
   */
  async validateCompatibility(filePath, content = null) {
    try {
      if (!content) {
        content = await fs.readFile(filePath, 'utf8');
      }

      // Verificar se é arquivo de configuração
      if (filePath.includes('config') || path.extname(filePath) === '.yaml') {
        try {
          const config = yaml.parse(content);
          
          if (config && config.version) {
            const configVersion = config.version;
            const systemVersion = this.config.systemVersion;
            
            // Verificar compatibilidade semântica
            if (!semver.satisfies(systemVersion, `>=${configVersion}`)) {
              return {
                compatible: false,
                message: `Versão incompatível: config ${configVersion} vs sistema ${systemVersion}`,
                suggestion: 'Atualize a configuração ou o sistema'
              };
            }
          }
        } catch {
          // Não é YAML válido, pular verificação de versão
        }
      }

      // Verificar dependências do Node.js
      if (filePath.includes('package.json')) {
        try {
          const pkg = JSON.parse(content);
          return await this.validateNodeCompatibility(pkg);
        } catch {
          // JSON inválido, será capturado em outra validação
        }
      }

      return { compatible: true };

    } catch (error) {
      return {
        compatible: false,
        message: `Erro ao verificar compatibilidade: ${error.message}`
      };
    }
  }

  /**
   * Valida múltiplos arquivos
   * @param {Array<string>} filePaths - Lista de caminhos
   * @returns {Promise<Object>} - Resultado consolidado
   */
  async validateFiles(filePaths) {
    const results = [];
    const summary = {
      total: filePaths.length,
      valid: 0,
      invalid: 0,
      warnings: 0,
      errors: 0
    };

    for (const filePath of filePaths) {
      const result = await this.validateFile(filePath);
      results.push(result);
      
      if (result.valid) {
        summary.valid++;
      } else {
        summary.invalid++;
      }
      
      summary.warnings += result.warnings?.length || 0;
      summary.errors += result.errors?.length || 0;
    }

    return {
      results,
      summary,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Valida diretório inteiro
   * @param {string} dirPath - Caminho do diretório
   * @param {Object} options - Opções de validação
   * @returns {Promise<Object>} - Resultado da validação
   */
  async validateDirectory(dirPath, options = {}) {
    const {
      recursive = true,
      extensions = this.supportedExtensions,
      exclude = ['node_modules', '.git', 'dist', 'build']
    } = options;

    const files = await this.scanDirectory(dirPath, { recursive, extensions, exclude });
    return await this.validateFiles(files);
  }

  /**
   * Escaneia diretório em busca de arquivos
   * @param {string} dirPath - Caminho do diretório
   * @param {Object} options - Opções de escaneamento
   * @returns {Promise<Array<string>>} - Lista de arquivos
   */
  async scanDirectory(dirPath, options = {}) {
    const {
      recursive = true,
      extensions = this.supportedExtensions,
      exclude = []
    } = options;

    const files = [];

    async function scan(currentPath) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (exclude.some(pattern => entry.name.includes(pattern))) {
          continue;
        }

        if (entry.isDirectory() && recursive) {
          await scan(fullPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    }

    await scan(dirPath);
    return files;
  }

  /**
   * Gera relatório de validação
   * @param {Object} validationResult - Resultado da validação
   * @returns {string} - Relatório formatado
   */
  generateReport(validationResult) {
    const { results, summary } = validationResult;
    
    let report = `# Relatório de Validação\n\n`;
    report += `**Data:** ${new Date().toLocaleString('pt-BR')}\n`;
    report += `**Total de arquivos:** ${summary.total}\n`;
    report += `**Válidos:** ${summary.valid} ✅\n`;
    report += `**Inválidos:** ${summary.invalid} ❌\n`;
    report += `**Avisos:** ${summary.warnings} ⚠️\n`;
    report += `**Erros:** ${summary.errors} 🚫\n\n`;

    if (summary.invalid > 0) {
      report += `## Arquivos com Problemas\n\n`;
      
      for (const result of results) {
        if (!result.valid || result.warnings.length > 0) {
          report += `### ${result.file}\n\n`;
          
          if (result.errors.length > 0) {
            report += `**Erros:**\n`;
            for (const error of result.errors) {
              report += `- 🚫 ${error}\n`;
            }
            report += `\n`;
          }
          
          if (result.warnings.length > 0) {
            report += `**Avisos:**\n`;
            for (const warning of result.warnings) {
              report += `- ⚠️ ${warning}\n`;
            }
            report += `\n`;
          }
          
          if (result.info.length > 0) {
            report += `**Informações:**\n`;
            for (const info of result.info) {
              report += `- ℹ️ ${info}\n`;
            }
            report += `\n`;
          }
        }
      }
    }

    return report;
  }

  // Métodos auxiliares de validação específica

  async validateConfigStructure(config, result) {
    const requiredFields = ['version'];
    
    for (const field of requiredFields) {
      if (!(field in config)) {
        result.warnings.push(`Campo obrigatório ausente: ${field}`);
      }
    }
  }

  checkDuplicateKeys(content, result) {
    const lines = content.split('\n');
    const keys = new Set();
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const keyMatch = line.match(/^([^:]+):/);
      
      if (keyMatch) {
        const key = keyMatch[1].trim();
        if (keys.has(key)) {
          result.warnings.push(`Chave duplicada encontrada: ${key} (linha ${i + 1})`);
        }
        keys.add(key);
      }
    }
  }

  checkYAMLIndentation(content, result) {
    const lines = content.split('\n');
    let expectedIndent = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') continue;
      
      const indent = line.length - line.trimStart().length;
      if (indent % 2 !== 0) {
        result.warnings.push(`Indentação inconsistente na linha ${i + 1} (use múltiplos de 2 espaços)`);
      }
    }
  }

  async validatePackageJSON(pkg, result) {
    const requiredFields = ['name', 'version'];
    
    for (const field of requiredFields) {
      if (!pkg[field]) {
        result.errors.push(`Campo obrigatório ausente no package.json: ${field}`);
      }
    }
    
    if (pkg.version && !semver.valid(pkg.version)) {
      result.errors.push(`Versão inválida no package.json: ${pkg.version}`);
    }
  }

  async validateNodeCompatibility(pkg) {
    if (pkg.engines && pkg.engines.node) {
      const nodeVersion = process.version;
      const requiredVersion = pkg.engines.node;
      
      if (!semver.satisfies(nodeVersion, requiredVersion)) {
        return {
          compatible: false,
          message: `Node.js ${nodeVersion} não satisfaz requisito ${requiredVersion}`,
          suggestion: `Atualize Node.js para versão compatível com ${requiredVersion}`
        };
      }
    }
    
    return { compatible: true };
  }

  validateImportsExports(content, result) {
    // Verificar imports não utilizados (básico)
    const importMatches = content.match(/import\s+.*?\s+from\s+['"][^'"]+['"]/g) || [];
    const exportMatches = content.match(/export\s+.*?/g) || [];
    
    result.info.push(`${importMatches.length} imports encontrados`);
    result.info.push(`${exportMatches.length} exports encontrados`);
  }

  validateNamingConventions(content, result) {
    // Verificar convenções básicas de nomenclatura
    const functionMatches = content.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
    const classMatches = content.match(/class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
    
    for (const match of functionMatches) {
      const name = match.split(' ')[1];
      if (name && name[0] === name[0].toUpperCase()) {
        result.warnings.push(`Função ${name} deveria começar com letra minúscula`);
      }
    }
    
    for (const match of classMatches) {
      const name = match.split(' ')[1];
      if (name && name[0] === name[0].toLowerCase()) {
        result.warnings.push(`Classe ${name} deveria começar com letra maiúscula`);
      }
    }
  }

  validateVueTemplate(content, result) {
    const templateMatch = content.match(/<template[^>]*>([\s\S]*?)<\/template>/);
    if (templateMatch) {
      const template = templateMatch[1];
      
      // Verificar se tem elemento raiz
      const rootElements = template.match(/<[^\/!][^>]*>/g) || [];
      if (rootElements.length === 0) {
        result.warnings.push('Template Vue parece estar vazio');
      }
    }
  }

  validateVueScript(content, result) {
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      const script = scriptMatch[1];
      
      // Verificar se usa Composition API ou Options API
      if (script.includes('defineComponent') || script.includes('setup(')) {
        result.info.push('Composition API detectada');
      } else if (script.includes('export default {')) {
        result.info.push('Options API detectada');
      }
    }
  }

  validateVueStyle(content, result) {
    const styleMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
    
    for (const styleMatch of styleMatches) {
      if (styleMatch.includes('scoped')) {
        result.info.push('Estilos scoped encontrados');
      }
      
      if (styleMatch.includes('lang="scss"') || styleMatch.includes('lang="sass"')) {
        result.info.push('SCSS/Sass detectado');
      }
    }
  }

  detectVueAPIStyle(content, result) {
    const hasCompositionAPI = content.includes('setup(') || content.includes('defineComponent');
    const hasOptionsAPI = content.includes('data()') || content.includes('methods:');
    
    if (hasCompositionAPI && hasOptionsAPI) {
      result.warnings.push('Mistura de Composition API e Options API detectada');
    }
  }

  validateMarkdownHeaders(content, result) {
    const lines = content.split('\n');
    let lastHeaderLevel = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headerMatch = line.match(/^(#{1,6})\s+(.+)/);
      
      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2];
        
        if (level > lastHeaderLevel + 1) {
          result.warnings.push(`Salto de nível de cabeçalho na linha ${i + 1}: h${lastHeaderLevel} para h${level}`);
        }
        
        lastHeaderLevel = level;
      }
    }
  }

  async validateMarkdownLinks(content, result, filePath) {
    const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    
    for (const linkMatch of linkMatches) {
      const urlMatch = linkMatch.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (urlMatch) {
        const url = urlMatch[2];
        
        // Verificar links relativos
        if (!url.startsWith('http') && !url.startsWith('#')) {
          const linkPath = path.resolve(path.dirname(filePath), url);
          try {
            await fs.access(linkPath);
          } catch {
            result.warnings.push(`Link quebrado: ${url}`);
          }
        }
      }
    }
  }

  validateCodeBlocks(content, result) {
    const codeBlockMatches = content.match(/```[\s\S]*?```/g) || [];
    
    for (const block of codeBlockMatches) {
      const langMatch = block.match(/```(\w+)/);
      if (!langMatch) {
        result.warnings.push('Bloco de código sem linguagem especificada');
      }
    }
  }

  validateFrontmatter(content, result) {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      try {
        yaml.parse(frontmatterMatch[1]);
        result.info.push('Frontmatter YAML válido');
      } catch (error) {
        result.errors.push(`Frontmatter inválido: ${error.message}`);
      }
    }
  }

  async validateCodePatterns(content, result, filePath) {
    // Verificar padrões específicos do projeto
    if (filePath.includes('.agent-os')) {
      // Validações específicas para arquivos do Agent OS
      if (content.includes('console.log') && !filePath.includes('test')) {
        result.warnings.push('console.log encontrado em código de produção');
      }
    }
  }

  async validateFileSize(result) {
    const maxSize = 1024 * 1024; // 1MB
    
    if (result.size > maxSize) {
      result.warnings.push(`Arquivo muito grande: ${this.formatBytes(result.size)} (máximo recomendado: 1MB)`);
    }
  }

  async validateEncoding(content, result) {
    // Verificar se contém caracteres não-UTF8
    try {
      Buffer.from(content, 'utf8').toString('utf8');
    } catch {
      result.errors.push('Arquivo não está em codificação UTF-8');
    }
  }

  async validateNaming(filePath, result) {
    const fileName = path.basename(filePath);
    
    // Verificar convenções de nomenclatura
    if (fileName.includes(' ')) {
      result.warnings.push('Nome do arquivo contém espaços (use hífens ou underscores)');
    }
    
    if (fileName !== fileName.toLowerCase() && !fileName.includes('.')) {
      result.warnings.push('Nome do arquivo deveria estar em minúsculas');
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default ConfigValidator;