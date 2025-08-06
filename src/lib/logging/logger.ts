interface LogLevel {
  ERROR: 0
  WARN: 1
  INFO: 2
  DEBUG: 3
}

interface LogData {
  level: keyof LogLevel
  message: string
  metadata?: Record<string, unknown>
  timestamp: string
  environment: string
}

class StructuredLogger {
  private readonly logLevel: keyof LogLevel
  private readonly environment: string

  constructor() {
    this.environment = process.env.NODE_ENV || 'development'
    this.logLevel = (process.env.LOG_LEVEL as keyof LogLevel) || 'INFO'
  }

  private shouldLog(level: keyof LogLevel): boolean {
    const levels: LogLevel = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 }
    return levels[level] <= levels[this.logLevel]
  }

  private formatLog(level: keyof LogLevel, message: string, metadata?: Record<string, unknown>): LogData {
    return {
      level,
      message,
      metadata,
      timestamp: new Date().toISOString(),
      environment: this.environment
    }
  }

  private output(logData: LogData): void {
    if (this.environment === 'production') {
      // In production, send to external logging service
      // For now, using console as fallback
      console.log(JSON.stringify(logData))
    } else {
      // Development: Pretty print
      console.log(`[${logData.timestamp}] ${logData.level}: ${logData.message}`, logData.metadata || '')
    }
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    if (this.shouldLog('ERROR')) {
      this.output(this.formatLog('ERROR', message, metadata))
    }
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    if (this.shouldLog('WARN')) {
      this.output(this.formatLog('WARN', message, metadata))
    }
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    if (this.shouldLog('INFO')) {
      this.output(this.formatLog('INFO', message, metadata))
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    if (this.shouldLog('DEBUG')) {
      this.output(this.formatLog('DEBUG', message, metadata))
    }
  }
}

export const logger = new StructuredLogger()