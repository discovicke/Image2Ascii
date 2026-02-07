import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TerminalLogService } from './terminal-log.service';
import { environment } from '../../environments/environment';

export type ApiStatus = 'unknown' | 'connecting' | 'waking' | 'online' | 'offline';

@Injectable({ providedIn: 'root' })
export class ApiStatusService {
  private http = inject(HttpClient);
  private terminalLog = inject(TerminalLogService);

  private readonly healthEndpoint = `${environment.apiUrl}/health`;
  private readonly maxRetries = 45; // ~60 seconds max wait
  private readonly retryInterval = 2000; // 2 seconds between retries

  private statusSignal = signal<ApiStatus>('unknown');
  private retryCountSignal = signal(0);
  private wakingMessageIndex = signal(0);

  readonly status = this.statusSignal.asReadonly();
  readonly retryCount = this.retryCountSignal.asReadonly();

  private readonly wakingMessages = [
    'COLD START DETECTED...',
    'SPINNING UP RENDER ENGINE...',
    'INITIALIZING SUBSYSTEMS...',
    'LOADING ASCII MATRICES...',
    'CALIBRATING OUTPUT BUFFERS...',
    'ESTABLISHING SECURE LINK...',
    'WARMING UP PROCESSORS...',
    'ALLOCATING MEMORY BLOCKS...',
    'SYNCHRONIZING CLOCK CYCLES...',
    'PREPARING RENDER PIPELINE...',
  ];

  /**
   * Check API health and wake it up if sleeping
   */
  async checkHealth(): Promise<boolean> {
    this.statusSignal.set('connecting');
    this.retryCountSignal.set(0);
    this.wakingMessageIndex.set(0);

    this.terminalLog.system('ESTABLISHING CONNECTION TO RENDER ENGINE...');

    return this.attemptConnection();
  }

  private async attemptConnection(): Promise<boolean> {
    const startTime = Date.now();

    return new Promise((resolve) => {
      const attempt = () => {
        const currentRetry = this.retryCountSignal();

        if (currentRetry >= this.maxRetries) {
          this.statusSignal.set('offline');
          this.terminalLog.error('CONNECTION TIMEOUT: RENDER ENGINE UNREACHABLE');
          this.terminalLog.error('PLEASE TRY AGAIN LATER OR CHECK STATUS');
          resolve(false);
          return;
        }

        this.http.get(this.healthEndpoint, { responseType: 'text' }).subscribe({
          next: () => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            this.statusSignal.set('online');
            this.terminalLog.success(`RENDER ENGINE ONLINE [${elapsed}s]`);
            this.terminalLog.system('ALL SYSTEMS OPERATIONAL');
            resolve(true);
          },
          error: () => {
            // First failure - API is likely sleeping
            if (currentRetry === 0) {
              this.statusSignal.set('waking');
              this.terminalLog.warning('RENDER ENGINE SLEEPING (FREE TIER)');
              this.terminalLog.info('INITIATING WAKE SEQUENCE...');
            }

            // Show rotating "waking" messages for atmosphere
            if (currentRetry > 0 && currentRetry % 3 === 0) {
              const msgIndex = this.wakingMessageIndex();
              const message = this.wakingMessages[msgIndex % this.wakingMessages.length];
              this.terminalLog.system(message);
              this.wakingMessageIndex.update(i => i + 1);
            }

            // Retry
            this.retryCountSignal.update(c => c + 1);
            setTimeout(attempt, this.retryInterval);
          }
        });
      };

      attempt();
    });
  }

  /**
   * Quick ping to check if API is still alive
   */
  ping(): void {
    this.http.get(this.healthEndpoint, { responseType: 'text' }).subscribe({
      next: () => {
        if (this.statusSignal() !== 'online') {
          this.statusSignal.set('online');
        }
      },
      error: () => {
        if (this.statusSignal() === 'online') {
          this.statusSignal.set('offline');
          this.terminalLog.warning('CONNECTION LOST TO RENDER ENGINE');
        }
      }
    });
  }
}

