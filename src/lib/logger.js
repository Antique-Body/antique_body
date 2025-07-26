/**
 * Centralized logging service for the application
 * Supports different log levels and external service integration
 */

class Logger {
  constructor() {
    this.isProduction = process.env.NODE_ENV === "production";
    this.logLevel = process.env.LOG_LEVEL || "warn";
    this.externalServiceUrl = process.env.LOGGING_SERVICE_URL;

    // Log levels in order of priority
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
  }

  /**
   * Check if a log level should be output
   */
  shouldLog(level) {
    return this.logLevels[level] <= this.logLevels[this.logLevel];
  }

  /**
   * Format log message with metadata
   */
  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      context: {
        ...context,
        environment: this.isProduction ? "production" : "development",
        userAgent:
          typeof window !== "undefined"
            ? window.navigator?.userAgent
            : "server",
        url: typeof window !== "undefined" ? window.location?.href : "server",
      },
    };

    return logData;
  }

  /**
   * Send log to external service (if configured)
   */
  async sendToExternalService(logData) {
    if (!this.externalServiceUrl || !this.isProduction) {
      return;
    }

    try {
      await fetch(this.externalServiceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      });
    } catch (error) {
      // Fallback to console if external service fails
      console.error("Failed to send log to external service:", error);
    }
  }

  /**
   * Log error messages
   */
  error(message, context = {}) {
    if (!this.shouldLog("error")) return;

    const logData = this.formatMessage("error", message, context);

    // Console output
    console.error(`[ERROR] ${message}`, context);

    // Send to external service
    this.sendToExternalService(logData);
  }

  /**
   * Log warning messages
   */
  warn(message, context = {}) {
    if (!this.shouldLog("warn")) return;

    const logData = this.formatMessage("warn", message, context);

    // Console output
    console.warn(`[WARN] ${message}`, context);

    // Send to external service
    this.sendToExternalService(logData);
  }

  /**
   * Log info messages
   */
  info(message, context = {}) {
    if (!this.shouldLog("info")) return;

    const logData = this.formatMessage("info", message, context);

    // Console output
    console.warn(`[INFO] ${message}`, context);

    // Send to external service
    this.sendToExternalService(logData);
  }

  /**
   * Log debug messages
   */
  debug(message, context = {}) {
    if (!this.shouldLog("debug")) return;

    const logData = this.formatMessage("debug", message, context);

    // Console output
    console.debug(`[DEBUG] ${message}`, context);

    // Send to external service
    this.sendToExternalService(logData);
  }

  /**
   * Log API fallback events specifically
   */
  logApiFallback(apiName, originalError, fallbackUsed = true, context = {}) {
    const message = `API fallback used for ${apiName}`;
    const fallbackContext = {
      ...context,
      apiName,
      originalError: originalError?.message || String(originalError),
      fallbackUsed,
      eventType: "api_fallback",
    };

    this.warn(message, fallbackContext);
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation, duration, context = {}) {
    const message = `Performance: ${operation} took ${duration}ms`;
    const perfContext = {
      ...context,
      operation,
      duration,
      eventType: "performance",
    };

    this.info(message, perfContext);
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;
