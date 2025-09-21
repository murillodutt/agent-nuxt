/**
 * Utilitário de Timestamp - Agent OS
 * Autor: Murillo Dutt - Dutt eCommerce Website Design
 * Data: 21/09/2025 15:45:17 (America/Sao_Paulo)
 * 
 * Sistema de timestamp obrigatório conforme padrões Agent OS
 */

/**
 * Gera timestamp padronizado para Agent OS
 * Formato: DD/MM/AAAA HH:MM:SS (America/Sao_Paulo)
 */
export const getTimestamp = (): string => {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * Gera timestamp para logs do Agent OS
 * Formato: [DD/MM/AAAA HH:MM:SS] [AGENT-OS] [LEVEL] [CONTEXT] message
 */
export const getLogTimestamp = (level: string, context: string, message: string): string => {
  const timestamp = getTimestamp()
  return `[${timestamp}] [AGENT-OS] [${level}] [${context}] ${message}`
}

/**
 * Tipos de log suportados
 */
export type LogLevel = 'INFO' | 'SUCCESS' | 'ERROR' | 'WARNING' | 'PENDING'
export type LogContext = 'WORKFLOW' | 'SPEC' | 'CONTEXT' | 'TEMPLATE' | 'VALIDATION' | 'DOCS'

/**
 * Logger padronizado para Agent OS
 */
export const agentLogger = {
  info: (context: LogContext, message: string) => 
    console.log(getLogTimestamp('INFO', context, message)),
  
  success: (context: LogContext, message: string) => 
    console.log(getLogTimestamp('SUCCESS', context, message)),
  
  error: (context: LogContext, message: string) => 
    console.error(getLogTimestamp('ERROR', context, message)),
  
  warning: (context: LogContext, message: string) => 
    console.warn(getLogTimestamp('WARNING', context, message)),
  
  pending: (context: LogContext, message: string) => 
    console.log(getLogTimestamp('PENDING', context, message))
}

/**
 * Gera cabeçalho padronizado para documentação
 */
export const getDocHeader = (title: string, author: string = 'Dutt eCommerce Website Design'): string => {
  const timestamp = getTimestamp()
  return `# ${title}

**Data:** ${timestamp}  
**Autor:** ${author}  
**Versão Agent OS:** 2.1.0  
**Projeto:** Agent Nuxt - Nuxt 4.x + Nuxt UI v4

---`
}