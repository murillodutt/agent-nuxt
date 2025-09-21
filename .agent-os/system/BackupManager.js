/**
 * BackupManager.js
 * Sistema de Backup Automático para Agent OS
 * Implementa as especificações da seção 4.2 do PRD
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import yaml from 'yaml';
import { createReadStream, createWriteStream } from 'fs';
import { createGzip, createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';

export class BackupManager {
  constructor(config = {}) {
    this.config = {
      backupDir: config.backupDir || '.agent-os/_backups',
      retention: {
        backups: config.retention?.backups || 30, // dias
        versions: config.retention?.versions || 10, // últimas versões
        maxSize: config.retention?.maxSize || '1GB'
      },
      compression: config.compression || 'gzip',
      encryption: config.encryption || false,
      autoCleanup: config.autoCleanup !== false,
      ...config
    };
    
    this.backupLog = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Criar diretório de backup
    await fs.mkdir(this.config.backupDir, { recursive: true });
    
    // Carregar log de backups existentes
    await this.loadBackupLog();
    
    // Configurar limpeza automática
    if (this.config.autoCleanup) {
      this.scheduleCleanup();
    }
    
    this.initialized = true;
  }

  /**
   * Cria backup de um arquivo
   * @param {string} filePath - Caminho do arquivo original
   * @param {string} reason - Motivo do backup
   * @returns {Promise<string>} - Caminho do backup criado
   */
  async createBackup(filePath, reason = 'modification') {
    await this.initialize();

    try {
      // Verificar se arquivo existe
      await fs.access(filePath);
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = path.basename(filePath);
      const fileHash = await this.calculateFileHash(filePath);
      
      // Verificar se já existe backup idêntico
      const existingBackup = await this.findExistingBackup(filePath, fileHash);
      if (existingBackup) {
        console.log(`Backup idêntico já existe: ${existingBackup.path}`);
        return existingBackup.path;
      }

      const backupFileName = `${timestamp}_${reason}_${fileName}`;
      const backupPath = path.join(this.config.backupDir, backupFileName);
      
      // Criar backup com compressão opcional
      if (this.config.compression === 'gzip') {
        await this.createCompressedBackup(filePath, `${backupPath}.gz`);
      } else {
        await fs.copyFile(filePath, backupPath);
      }

      // Obter informações do arquivo
      const stats = await fs.stat(filePath);
      
      // Registrar backup
      const backupInfo = {
        id: crypto.randomUUID(),
        original: filePath,
        backup: this.config.compression === 'gzip' ? `${backupPath}.gz` : backupPath,
        timestamp: new Date().toISOString(),
        reason,
        size: stats.size,
        hash: fileHash,
        compressed: this.config.compression === 'gzip',
        encrypted: this.config.encryption
      };

      await this.logBackup(backupInfo);
      
      console.log(`✅ Backup criado: ${backupInfo.backup}`);
      return backupInfo.backup;

    } catch (error) {
      console.error(`❌ Erro ao criar backup de ${filePath}:`, error.message);
      throw new Error(`Falha ao criar backup: ${error.message}`);
    }
  }

  /**
   * Restaura arquivo de um backup
   * @param {string} filePath - Caminho do arquivo a ser restaurado
   * @param {string} backupId - ID do backup ou 'latest'
   * @returns {Promise<Object>} - Resultado da operação
   */
  async rollback(filePath, backupId = 'latest') {
    await this.initialize();

    try {
      const backup = await this.getBackup(filePath, backupId);
      
      if (!backup) {
        throw new Error(`Backup não encontrado: ${backupId}`);
      }

      // Criar backup do estado atual antes do rollback
      const preRollbackBackup = await this.createBackup(filePath, 'pre_rollback');

      // Restaurar arquivo
      if (backup.compressed) {
        await this.restoreCompressedBackup(backup.backup, filePath);
      } else {
        await fs.copyFile(backup.backup, filePath);
      }

      const result = {
        success: true,
        restored: filePath,
        from: backup.backup,
        timestamp: new Date().toISOString(),
        preRollbackBackup
      };

      console.log(`✅ Rollback realizado: ${filePath} ← ${backup.backup}`);
      return result;

    } catch (error) {
      console.error(`❌ Erro no rollback de ${filePath}:`, error.message);
      throw new Error(`Falha no rollback: ${error.message}`);
    }
  }

  /**
   * Lista backups disponíveis para um arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<Array>} - Lista de backups
   */
  async listBackups(filePath = null) {
    await this.initialize();

    const backups = Array.from(this.backupLog.values());
    
    if (filePath) {
      return backups
        .filter(backup => backup.original === filePath)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Obtém informações de um backup específico
   * @param {string} filePath - Caminho do arquivo
   * @param {string} backupId - ID do backup ou 'latest'
   * @returns {Promise<Object|null>} - Informações do backup
   */
  async getBackup(filePath, backupId = 'latest') {
    const backups = await this.listBackups(filePath);
    
    if (backupId === 'latest') {
      return backups[0] || null;
    }

    return backups.find(backup => backup.id === backupId) || null;
  }

  /**
   * Remove backups antigos baseado na política de retenção
   */
  async cleanup() {
    await this.initialize();

    const now = new Date();
    const retentionDays = this.config.retention.backups;
    const maxVersions = this.config.retention.versions;
    
    // Agrupar backups por arquivo original
    const backupsByFile = new Map();
    
    for (const backup of this.backupLog.values()) {
      if (!backupsByFile.has(backup.original)) {
        backupsByFile.set(backup.original, []);
      }
      backupsByFile.get(backup.original).push(backup);
    }

    let removedCount = 0;

    for (const [filePath, backups] of backupsByFile) {
      // Ordenar por timestamp (mais recente primeiro)
      backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      for (let i = 0; i < backups.length; i++) {
        const backup = backups[i];
        const backupDate = new Date(backup.timestamp);
        const daysDiff = (now - backupDate) / (1000 * 60 * 60 * 24);

        // Remover se exceder retenção de dias ou número de versões
        const shouldRemove = daysDiff > retentionDays || i >= maxVersions;

        if (shouldRemove) {
          try {
            await fs.unlink(backup.backup);
            this.backupLog.delete(backup.id);
            removedCount++;
            console.log(`🗑️  Backup removido: ${backup.backup}`);
          } catch (error) {
            console.warn(`⚠️  Erro ao remover backup ${backup.backup}:`, error.message);
          }
        }
      }
    }

    if (removedCount > 0) {
      await this.saveBackupLog();
      console.log(`✅ Limpeza concluída: ${removedCount} backups removidos`);
    }

    return { removed: removedCount };
  }

  /**
   * Calcula hash SHA-256 de um arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<string>} - Hash do arquivo
   */
  async calculateFileHash(filePath) {
    const hash = crypto.createHash('sha256');
    const stream = createReadStream(filePath);
    
    for await (const chunk of stream) {
      hash.update(chunk);
    }
    
    return hash.digest('hex');
  }

  /**
   * Verifica se já existe backup idêntico
   * @param {string} filePath - Caminho do arquivo
   * @param {string} fileHash - Hash do arquivo
   * @returns {Promise<Object|null>} - Backup existente ou null
   */
  async findExistingBackup(filePath, fileHash) {
    const backups = await this.listBackups(filePath);
    return backups.find(backup => backup.hash === fileHash) || null;
  }

  /**
   * Cria backup comprimido
   * @param {string} sourcePath - Arquivo origem
   * @param {string} targetPath - Arquivo destino comprimido
   */
  async createCompressedBackup(sourcePath, targetPath) {
    const source = createReadStream(sourcePath);
    const destination = createWriteStream(targetPath);
    const gzip = createGzip();

    await pipeline(source, gzip, destination);
  }

  /**
   * Restaura backup comprimido
   * @param {string} backupPath - Arquivo backup comprimido
   * @param {string} targetPath - Arquivo destino
   */
  async restoreCompressedBackup(backupPath, targetPath) {
    const source = createReadStream(backupPath);
    const destination = createWriteStream(targetPath);
    const gunzip = createGunzip();

    await pipeline(source, gunzip, destination);
  }

  /**
   * Registra informações do backup
   * @param {Object} backupInfo - Informações do backup
   */
  async logBackup(backupInfo) {
    this.backupLog.set(backupInfo.id, backupInfo);
    await this.saveBackupLog();
  }

  /**
   * Carrega log de backups do disco
   */
  async loadBackupLog() {
    const logPath = path.join(this.config.backupDir, 'backup-log.yaml');
    
    try {
      const content = await fs.readFile(logPath, 'utf8');
      const data = yaml.parse(content);
      
      if (data && data.backups) {
        for (const backup of data.backups) {
          this.backupLog.set(backup.id, backup);
        }
      }
    } catch (error) {
      // Log não existe ainda, será criado no primeiro backup
      console.log('📝 Criando novo log de backups...');
    }
  }

  /**
   * Salva log de backups no disco
   */
  async saveBackupLog() {
    const logPath = path.join(this.config.backupDir, 'backup-log.yaml');
    const data = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      backups: Array.from(this.backupLog.values())
    };

    await fs.writeFile(logPath, yaml.stringify(data), 'utf8');
  }

  /**
   * Agenda limpeza automática
   */
  scheduleCleanup() {
    // Executar limpeza a cada 24 horas
    setInterval(async () => {
      try {
        await this.cleanup();
      } catch (error) {
        console.error('❌ Erro na limpeza automática:', error.message);
      }
    }, 24 * 60 * 60 * 1000);

    console.log('⏰ Limpeza automática agendada (24h)');
  }

  /**
   * Obtém estatísticas dos backups
   * @returns {Promise<Object>} - Estatísticas
   */
  async getStats() {
    await this.initialize();

    const backups = Array.from(this.backupLog.values());
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
    const fileGroups = new Map();

    for (const backup of backups) {
      if (!fileGroups.has(backup.original)) {
        fileGroups.set(backup.original, []);
      }
      fileGroups.get(backup.original).push(backup);
    }

    return {
      totalBackups: backups.length,
      totalSize: totalSize,
      totalSizeFormatted: this.formatBytes(totalSize),
      filesWithBackups: fileGroups.size,
      averageBackupsPerFile: Math.round(backups.length / fileGroups.size),
      oldestBackup: backups.length > 0 ? 
        backups.reduce((oldest, backup) => 
          new Date(backup.timestamp) < new Date(oldest.timestamp) ? backup : oldest
        ).timestamp : null,
      newestBackup: backups.length > 0 ? 
        backups.reduce((newest, backup) => 
          new Date(backup.timestamp) > new Date(newest.timestamp) ? backup : newest
        ).timestamp : null
    };
  }

  /**
   * Formata bytes em formato legível
   * @param {number} bytes - Número de bytes
   * @returns {string} - Formato legível
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Obtém tamanho de um arquivo
   * @param {string} filePath - Caminho do arquivo
   * @returns {Promise<number>} - Tamanho em bytes
   */
  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      return 0;
    }
  }
}

export default BackupManager;