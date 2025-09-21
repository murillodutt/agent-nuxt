/**
 * DocumentationGenerator.js
 * Sistema de geração automática de documentação para Agent OS
 * Baseado na seção 5.3 do PRD - Manutenção Automática
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class DocumentationGenerator {
  constructor(options = {}) {
    this.rootPath = options.rootPath || process.cwd();
    this.docsPath = options.docsPath || path.join(this.rootPath, 'docs');
    this.outputPath = options.outputPath || path.join(this.docsPath, 'generated');
    this.templates = new Map();
    this.cache = new Map();
    this.config = {
      autoUpdate: true,
      validateLinks: true,
      generateTOC: true,
      includeExamples: true,
      formats: ['markdown', 'json', 'html'],
      ...options.config
    };
  }

  async initialize() {
    try {
      // Criar diretórios necessários
      await this.ensureDirectories();
      
      // Carregar templates
      await this.loadTemplates();
      
      // Inicializar cache
      await this.initializeCache();
      
      console.log('DocumentationGenerator inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar DocumentationGenerator:', error);
      throw error;
    }
  }

  async ensureDirectories() {
    const dirs = [
      this.docsPath,
      this.outputPath,
      path.join(this.outputPath, 'api'),
      path.join(this.outputPath, 'components'),
      path.join(this.outputPath, 'guides')
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
      }
    }
  }

  async loadTemplates() {
    const templateDir = path.join(__dirname, '../templates');
    
    try {
      const files = await fs.readdir(templateDir);
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const templateName = path.basename(file, '.md');
          const templateContent = await fs.readFile(
            path.join(templateDir, file), 
            'utf-8'
          );
          this.templates.set(templateName, templateContent);
        }
      }
    } catch (error) {
      console.warn('Templates não encontrados, usando templates padrão');
      this.loadDefaultTemplates();
    }
  }

  loadDefaultTemplates() {
    this.templates.set('api-reference', `# API Reference

## {{title}}

**Version:** {{version}}

{{#endpoints}}
### {{method}} {{path}}

{{description}}

**Parameters:**
{{#parameters}}
- \`{{name}}\` ({{type}}) - {{description}}
{{/parameters}}

**Response:**
\`\`\`json
{{response_example}}
\`\`\`

{{/endpoints}}
`);

    this.templates.set('component-doc', `# {{name}}

{{description}}

## Usage

\`\`\`vue
{{usage_example}}
\`\`\`

## Props

{{#props}}
- \`{{name}}\` ({{type}}) - {{description}}
{{/props}}

## Events

{{#events}}
- \`{{name}}\` - {{description}}
{{/events}}
`);
  }

  async generateAPIReference() {
    try {
      console.log('Gerando referência da API...');
      
      const routes = await this.scanAPIRoutes();
      const schemas = await this.extractSchemas();
      
      const documentation = {
        title: 'API Reference',
        version: await this.getAPIVersion(),
        generated_at: new Date().toISOString(),
        endpoints: routes.map(route => ({
          path: route.path,
          method: route.method,
          description: route.description || 'Endpoint description',
          parameters: route.parameters || [],
          responses: route.responses || {},
          examples: route.examples || {},
          schema: schemas[route.path] || null
        }))
      };
      
      // Gerar documentação em múltiplos formatos
      await this.writeDocumentation('api-reference', documentation);
      
      console.log(`API Reference gerada com ${routes.length} endpoints`);
      return documentation;
    } catch (error) {
      console.error('Erro ao gerar API Reference:', error);
      throw error;
    }
  }

  async scanAPIRoutes() {
    const routes = [];
    const apiDir = path.join(this.rootPath, 'server/api');
    
    try {
      const files = await this.scanDirectory(apiDir, '.js', '.ts', '.vue');
      
      for (const file of files) {
        const routeInfo = await this.extractRouteInfo(file);
        if (routeInfo) {
          routes.push(routeInfo);
        }
      }
    } catch (error) {
      console.warn('Diretório de API não encontrado:', apiDir);
    }
    
    return routes;
  }

  async extractRouteInfo(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(this.rootPath, filePath);
      
      // Extrair informações da rota baseado no conteúdo
      const routeInfo = {
        path: this.filePathToRoute(relativePath),
        method: this.extractMethod(content),
        description: this.extractDescription(content),
        parameters: this.extractParameters(content),
        responses: this.extractResponses(content),
        examples: this.extractExamples(content),
        file: relativePath
      };
      
      return routeInfo;
    } catch (error) {
      console.warn(`Erro ao processar rota ${filePath}:`, error.message);
      return null;
    }
  }

  filePathToRoute(filePath) {
    return filePath
      .replace(/^server\/api/, '')
      .replace(/\.(js|ts|vue)$/, '')
      .replace(/\[([^\]]+)\]/g, ':$1')
      .replace(/\/index$/, '') || '/';
  }

  extractMethod(content) {
    const methodMatch = content.match(/export\s+default\s+defineEventHandler|export\s+const\s+(get|post|put|delete|patch)/i);
    return methodMatch ? (methodMatch[1] || 'GET').toUpperCase() : 'GET';
  }

  extractDescription(content) {
    const commentMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/);
    return commentMatch ? commentMatch[1] : null;
  }

  extractParameters(content) {
    const params = [];
    
    // Extrair parâmetros de query
    const queryMatches = content.matchAll(/getQuery\(\s*event\s*\)\.(\w+)/g);
    for (const match of queryMatches) {
      params.push({
        name: match[1],
        type: 'string',
        in: 'query',
        description: `Query parameter ${match[1]}`
      });
    }
    
    // Extrair parâmetros de body
    const bodyMatches = content.matchAll(/readBody\(\s*event\s*\)\.(\w+)/g);
    for (const match of bodyMatches) {
      params.push({
        name: match[1],
        type: 'string',
        in: 'body',
        description: `Body parameter ${match[1]}`
      });
    }
    
    return params;
  }

  extractResponses(content) {
    const responses = {};
    
    // Detectar possíveis códigos de resposta
    const statusMatches = content.matchAll(/setResponseStatus\(\s*event,\s*(\d+)/g);
    for (const match of statusMatches) {
      responses[match[1]] = {
        description: `Response with status ${match[1]}`
      };
    }
    
    if (Object.keys(responses).length === 0) {
      responses['200'] = { description: 'Success' };
    }
    
    return responses;
  }

  extractExamples(content) {
    const examples = {};
    
    // Tentar extrair exemplos de retorno
    const returnMatch = content.match(/return\s+({[\s\S]*?})/);
    if (returnMatch) {
      try {
        examples.response = JSON.parse(returnMatch[1]);
      } catch {
        examples.response = returnMatch[1];
      }
    }
    
    return examples;
  }

  async extractSchemas() {
    const schemas = {};
    const schemaDir = path.join(this.rootPath, 'schemas');
    
    try {
      const files = await this.scanDirectory(schemaDir, '.json', '.js', '.ts');
      
      for (const file of files) {
        const schemaName = path.basename(file, path.extname(file));
        const schemaContent = await this.loadSchema(file);
        if (schemaContent) {
          schemas[schemaName] = schemaContent;
        }
      }
    } catch (error) {
      console.warn('Schemas não encontrados');
    }
    
    return schemas;
  }

  async loadSchema(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      if (filePath.endsWith('.json')) {
        return JSON.parse(content);
      } else {
        // Para arquivos JS/TS, tentar extrair schema exportado
        const schemaMatch = content.match(/export\s+(?:default\s+)?({[\s\S]*})/);
        if (schemaMatch) {
          return eval(`(${schemaMatch[1]})`);
        }
      }
    } catch (error) {
      console.warn(`Erro ao carregar schema ${filePath}:`, error.message);
    }
    
    return null;
  }

  async getAPIVersion() {
    try {
      const packagePath = path.join(this.rootPath, 'package.json');
      const packageContent = await fs.readFile(packagePath, 'utf-8');
      const packageData = JSON.parse(packageContent);
      return packageData.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  async updateTableOfContents() {
    try {
      console.log('Atualizando índice de documentação...');
      
      const docs = await this.scanDocuments();
      const toc = this.generateTOC(docs);
      
      // Atualizar README principal
      await this.updateFile('README.md', {
        section: 'table-of-contents',
        content: toc
      });
      
      // Gerar índice separado
      await this.writeMarkdown('docs/TABLE_OF_CONTENTS.md', {
        title: 'Índice de Documentação',
        content: toc,
        generated_at: new Date().toISOString()
      });
      
      console.log(`Índice atualizado com ${docs.length} documentos`);
      return toc;
    } catch (error) {
      console.error('Erro ao atualizar índice:', error);
      throw error;
    }
  }

  async scanDocuments() {
    const docs = [];
    const docDirs = [
      path.join(this.rootPath, 'docs'),
      path.join(this.rootPath, 'README.md')
    ];
    
    for (const dir of docDirs) {
      try {
        if (dir.endsWith('.md')) {
          // Arquivo único
          const stat = await fs.stat(dir);
          if (stat.isFile()) {
            docs.push(await this.analyzeDocument(dir));
          }
        } else {
          // Diretório
          const files = await this.scanDirectory(dir, '.md');
          for (const file of files) {
            docs.push(await this.analyzeDocument(file));
          }
        }
      } catch (error) {
        console.warn(`Erro ao escanear ${dir}:`, error.message);
      }
    }
    
    return docs.filter(doc => doc !== null);
  }

  async analyzeDocument(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(this.rootPath, filePath);
      
      return {
        path: relativePath,
        title: this.extractTitle(content),
        headings: this.extractHeadings(content),
        links: this.extractLinks(content),
        size: content.length,
        lastModified: (await fs.stat(filePath)).mtime
      };
    } catch (error) {
      console.warn(`Erro ao analisar documento ${filePath}:`, error.message);
      return null;
    }
  }

  extractTitle(content) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1] : 'Untitled';
  }

  extractHeadings(content) {
    const headings = [];
    const headingMatches = content.matchAll(/^(#{1,6})\s+(.+)$/gm);
    
    for (const match of headingMatches) {
      headings.push({
        level: match[1].length,
        text: match[2],
        anchor: this.generateAnchor(match[2])
      });
    }
    
    return headings;
  }

  extractLinks(content) {
    const links = [];
    const linkMatches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
    
    let lineNumber = 1;
    const lines = content.split('\n');
    
    for (const match of linkMatches) {
      // Encontrar linha do link
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(match[0])) {
          lineNumber = i + 1;
          break;
        }
      }
      
      links.push({
        text: match[1],
        url: match[2],
        line: lineNumber,
        isInternal: !match[2].startsWith('http')
      });
    }
    
    return links;
  }

  generateAnchor(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  generateTOC(docs) {
    let toc = '# Índice de Documentação\n\n';
    
    // Organizar por diretório
    const byDirectory = {};
    
    for (const doc of docs) {
      const dir = path.dirname(doc.path);
      if (!byDirectory[dir]) {
        byDirectory[dir] = [];
      }
      byDirectory[dir].push(doc);
    }
    
    // Gerar TOC hierárquico
    for (const [dir, dirDocs] of Object.entries(byDirectory)) {
      if (dir !== '.') {
        toc += `## ${dir}\n\n`;
      }
      
      for (const doc of dirDocs.sort((a, b) => a.title.localeCompare(b.title))) {
        toc += `- [${doc.title}](${doc.path})\n`;
        
        // Adicionar sub-headings principais
        const mainHeadings = doc.headings.filter(h => h.level <= 3);
        for (const heading of mainHeadings.slice(0, 5)) {
          const indent = '  '.repeat(heading.level - 1);
          toc += `${indent}- [${heading.text}](${doc.path}#${heading.anchor})\n`;
        }
      }
      
      toc += '\n';
    }
    
    return toc;
  }

  async validateLinks() {
    try {
      console.log('Validando links da documentação...');
      
      const docs = await this.scanDocuments();
      const brokenLinks = [];
      
      for (const doc of docs) {
        for (const link of doc.links) {
          const isValid = await this.validateLink(link, doc.path);
          if (!isValid) {
            brokenLinks.push({
              file: doc.path,
              link: link.url,
              text: link.text,
              line: link.line
            });
          }
        }
      }
      
      if (brokenLinks.length > 0) {
        await this.reportBrokenLinks(brokenLinks);
      }
      
      console.log(`Validação concluída: ${brokenLinks.length} links quebrados encontrados`);
      return brokenLinks;
    } catch (error) {
      console.error('Erro ao validar links:', error);
      throw error;
    }
  }

  async validateLink(link, docPath) {
    try {
      if (link.url.startsWith('http')) {
        // Link externo - verificar se responde
        const response = await fetch(link.url, { method: 'HEAD', timeout: 5000 });
        return response.ok;
      } else {
        // Link interno - verificar se arquivo existe
        const linkPath = path.resolve(path.dirname(docPath), link.url);
        await fs.access(linkPath);
        return true;
      }
    } catch {
      return false;
    }
  }

  async reportBrokenLinks(brokenLinks) {
    const report = {
      title: 'Relatório de Links Quebrados',
      generated_at: new Date().toISOString(),
      total_broken: brokenLinks.length,
      links: brokenLinks
    };
    
    await this.writeDocumentation('broken-links-report', report);
    
    console.warn(`⚠️  ${brokenLinks.length} links quebrados encontrados. Veja o relatório em docs/generated/broken-links-report.md`);
  }

  async writeDocumentation(name, data) {
    const formats = this.config.formats;
    
    for (const format of formats) {
      switch (format) {
        case 'markdown':
          await this.writeMarkdown(`${this.outputPath}/${name}.md`, data);
          break;
        case 'json':
          await this.writeJSON(`${this.outputPath}/${name}.json`, data);
          break;
        case 'html':
          await this.writeHTML(`${this.outputPath}/${name}.html`, data);
          break;
      }
    }
  }

  async writeMarkdown(filePath, data) {
    let content = '';
    
    if (typeof data === 'string') {
      content = data;
    } else {
      // Usar template se disponível
      const templateName = path.basename(filePath, '.md');
      const template = this.templates.get(templateName) || this.templates.get('default');
      
      if (template) {
        content = this.renderTemplate(template, data);
      } else {
        content = this.dataToMarkdown(data);
      }
    }
    
    await fs.writeFile(filePath, content, 'utf-8');
  }

  async writeJSON(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async writeHTML(filePath, data) {
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>${data.title || 'Documentation'}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1, h2, h3 { color: #333; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
        code { background: #f5f5f5; padding: 2px 4px; border-radius: 2px; }
    </style>
</head>
<body>
    ${this.dataToHTML(data)}
</body>
</html>`;
    
    await fs.writeFile(filePath, html, 'utf-8');
  }

  renderTemplate(template, data) {
    let rendered = template;
    
    // Substituições simples
    rendered = rendered.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
    
    // Loops simples
    rendered = rendered.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
      const items = data[key];
      if (!Array.isArray(items)) return '';
      
      return items.map(item => {
        let itemContent = content;
        for (const [itemKey, itemValue] of Object.entries(item)) {
          itemContent = itemContent.replace(
            new RegExp(`\\{\\{${itemKey}\\}\\}`, 'g'),
            itemValue || ''
          );
        }
        return itemContent;
      }).join('');
    });
    
    return rendered;
  }

  dataToMarkdown(data) {
    let md = '';
    
    if (data.title) {
      md += `# ${data.title}\n\n`;
    }
    
    if (data.description) {
      md += `${data.description}\n\n`;
    }
    
    if (data.generated_at) {
      md += `*Gerado em: ${new Date(data.generated_at).toLocaleString()}*\n\n`;
    }
    
    // Converter dados estruturados para markdown
    for (const [key, value] of Object.entries(data)) {
      if (['title', 'description', 'generated_at'].includes(key)) continue;
      
      md += `## ${key.charAt(0).toUpperCase() + key.slice(1)}\n\n`;
      
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'object') {
            md += `### ${item.name || item.title || 'Item'}\n\n`;
            for (const [itemKey, itemValue] of Object.entries(item)) {
              md += `**${itemKey}:** ${itemValue}\n\n`;
            }
          } else {
            md += `- ${item}\n`;
          }
        }
      } else if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
          md += `**${subKey}:** ${subValue}\n\n`;
        }
      } else {
        md += `${value}\n\n`;
      }
    }
    
    return md;
  }

  dataToHTML(data) {
    let html = '';
    
    if (data.title) {
      html += `<h1>${data.title}</h1>`;
    }
    
    if (data.description) {
      html += `<p>${data.description}</p>`;
    }
    
    // Converter dados para HTML
    for (const [key, value] of Object.entries(data)) {
      if (['title', 'description'].includes(key)) continue;
      
      html += `<h2>${key.charAt(0).toUpperCase() + key.slice(1)}</h2>`;
      
      if (Array.isArray(value)) {
        html += '<ul>';
        for (const item of value) {
          html += `<li>${typeof item === 'object' ? JSON.stringify(item) : item}</li>`;
        }
        html += '</ul>';
      } else if (typeof value === 'object') {
        html += '<dl>';
        for (const [subKey, subValue] of Object.entries(value)) {
          html += `<dt>${subKey}</dt><dd>${subValue}</dd>`;
        }
        html += '</dl>';
      } else {
        html += `<p>${value}</p>`;
      }
    }
    
    return html;
  }

  async updateFile(filePath, update) {
    try {
      const fullPath = path.resolve(this.rootPath, filePath);
      let content = '';
      
      try {
        content = await fs.readFile(fullPath, 'utf-8');
      } catch {
        // Arquivo não existe, criar novo
      }
      
      // Atualizar seção específica
      if (update.section) {
        const sectionRegex = new RegExp(
          `<!-- ${update.section} start -->([\\s\\S]*?)<!-- ${update.section} end -->`,
          'g'
        );
        
        const sectionContent = `<!-- ${update.section} start -->\n${update.content}\n<!-- ${update.section} end -->`;
        
        if (sectionRegex.test(content)) {
          content = content.replace(sectionRegex, sectionContent);
        } else {
          content += `\n\n${sectionContent}\n`;
        }
      } else {
        content = update.content;
      }
      
      await fs.writeFile(fullPath, content, 'utf-8');
    } catch (error) {
      console.error(`Erro ao atualizar arquivo ${filePath}:`, error);
      throw error;
    }
  }

  async scanDirectory(dir, ...extensions) {
    const files = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...await this.scanDirectory(fullPath, ...extensions));
        } else if (extensions.some(ext => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Erro ao escanear diretório ${dir}:`, error.message);
    }
    
    return files;
  }

  async initializeCache() {
    this.cache.clear();
    console.log('Cache do DocumentationGenerator inicializado');
  }

  generateCacheKey(data) {
    return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
  }
}

module.exports = DocumentationGenerator;