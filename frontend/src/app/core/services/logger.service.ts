import { Injectable } from '@angular/core';

/**
 * Thin injectable wrapper around structured logging.
 * Swap the implementation for a remote provider (e.g. Sentry, Datadog)
 * without touching call sites.
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  error(context: string, error: unknown): void {
    console.error(`[${context}]`, error);
  }

  warn(context: string, message: string): void {
    console.warn(`[${context}] ${message}`);
  }
}
