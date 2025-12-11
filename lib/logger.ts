/**
 * Custom Logger untuk DigiArchive
 * Mendukung berbagai level: info, warn, error, debug
 * Format log: [TIMESTAMP] [LEVEL] [CONTEXT] Message { metadata }
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMetadata {
  [key: string]: any;
}

class Logger {
  private context: string;

  constructor(context: string = 'App') {
    this.context = context;
  }

  private formatLog(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}${metadataStr}`;
  }

  /**
   * Log informasi umum (operasi berhasil, flow normal)
   */
  info(message: string, metadata?: LogMetadata): void {
    const log = this.formatLog('info', message, metadata);
    console.log('\x1b[36m%s\x1b[0m', log); // Cyan
    this.sendToLoki('info', message, metadata);
  }

  /**
   * Log peringatan (operasi mencurigakan, edge case)
   */
  warn(message: string, metadata?: LogMetadata): void {
    const log = this.formatLog('warn', message, metadata);
    console.warn('\x1b[33m%s\x1b[0m', log); // Yellow
    this.sendToLoki('warn', message, metadata);
  }

  /**
   * Log error (operasi gagal, exception)
   */
  error(message: string, error?: Error | any, metadata?: LogMetadata): void {
    const errorMeta = {
      ...metadata,
      error: error?.message || error,
      stack: error?.stack,
    };
    const log = this.formatLog('error', message, errorMeta);
    console.error('\x1b[31m%s\x1b[0m', log); // Red
    this.sendToLoki('error', message, errorMeta);
  }

  /**
   * Log debug (informasi teknis untuk troubleshooting)
   */
  debug(message: string, metadata?: LogMetadata): void {
    if (process.env.NODE_ENV === 'development') {
      const log = this.formatLog('debug', message, metadata);
      console.debug('\x1b[35m%s\x1b[0m', log); // Magenta
      this.sendToLoki('debug', message, metadata);
    }
  }

  /**
   * Kirim log ke Loki (jika configured)
   */
  private async sendToLoki(level: LogLevel, message: string, metadata?: LogMetadata): Promise<void> {
    try {
      const lokiUrl = process.env.LOKI_URL || 'http://localhost:3100';
      
      // Skip jika Loki tidak dikonfigurasi
      if (!lokiUrl) return;

      const logEntry = {
        streams: [
          {
            stream: {
              job: 'digiarchive',
              level: level,
              context: this.context,
            },
            values: [
              [
                `${Date.now()}000000`, // Nanosecond timestamp
                JSON.stringify({
                  message,
                  level,
                  context: this.context,
                  ...metadata,
                }),
              ],
            ],
          },
        ],
      };

      // Send to Loki (non-blocking)
      fetch(`${lokiUrl}/loki/api/v1/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      }).catch(() => {
        // Silent fail jika Loki tidak tersedia
      });
    } catch (err) {
      // Silent fail untuk logging errors
    }
  }
}

// Export singleton instances untuk berbagai context
export const authLogger = new Logger('Auth');
export const documentLogger = new Logger('Document');
export const apiLogger = new Logger('API');
export const dbLogger = new Logger('Database');
export const shareLogger = new Logger('Share');

export default Logger;
