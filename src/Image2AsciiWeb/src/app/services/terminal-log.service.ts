import { Injectable, signal } from '@angular/core';

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'system';
}

@Injectable({ providedIn: 'root' })
export class TerminalLogService {
  private readonly maxEntries = 12;
  private logEntries = signal<LogEntry[]>([]);

  readonly logs = this.logEntries.asReadonly();

  constructor() {
    // Initial system messages
    this.system('SYSTEM INITIALIZED...');
    this.system('TERMINAL UI v0.9.beta LOADED');
    this.info('AWAITING USER INPUT');
  }

  private getTimestamp(): string {
    return new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private addEntry(message: string, type: LogEntry['type']) {
    const entry: LogEntry = {
      timestamp: this.getTimestamp(),
      message,
      type
    };

    this.logEntries.update(entries =>
      [...entries, entry].slice(-this.maxEntries)
    );
  }

  info(message: string) {
    this.addEntry(message, 'info');
  }

  success(message: string) {
    this.addEntry(message, 'success');
  }

  error(message: string) {
    this.addEntry(message, 'error');
  }

  warning(message: string) {
    this.addEntry(message, 'warning');
  }

  system(message: string) {
    this.addEntry(message, 'system');
  }

  // Convenience methods for common operations
  logFileMount(fileName: string, size: string, type: string) {
    this.info('MOUNTING FILE SYSTEM...');
    setTimeout(() => {
      this.info(`FILE LOADED: ${fileName}`);
      this.info(`SIZE: ${size} | TYPE: ${type}`);
      this.success('READY FOR CONVERSION');
    }, 100);
  }

  logFileTooLarge(fileName: string, size: string) {
    this.info('MOUNTING FILE SYSTEM...');
    setTimeout(() => {
      this.info(`FILE: ${fileName}`);
      this.info(`SIZE: ${size}`);
      this.error('ERROR: FILE EXCEEDS 5MB LIMIT');
      this.error('MOUNT ABORTED');
    }, 100);
  }

  logSettingsChange(setting: string, value: string | number) {
    this.info(`SET ${setting} = ${value}`);
  }

  logBatchStart(width: number, brightness: number, gamma: number) {
    this.info(`EXECUTING BATCH: W=${width}, B=${brightness}, G=${gamma}`);
    this.system('TRANSMITTING TO RENDER ENGINE...');
  }

  logBatchComplete(charCount: number) {
    this.success(`PROCESS COMPLETE. ${charCount} CHARS GENERATED.`);
  }

  logBatchError(error: string) {
    this.error(`RENDER FAILED: ${error}`);
  }

  logCopy() {
    this.success('OUTPUT COPIED TO CLIPBOARD');
  }

  logDownload() {
    this.success('FILE SAVED TO DISK');
  }

  // Random atmospheric messages
  spawnAtmosphericMessage() {
    const messages = [
      'MEMORY DEFRAG COMPLETE',
      'CACHE CLEARED',
      'SIGNAL STABLE',
      'BUFFER FLUSHED',
      'RENDER PIPELINE READY',
      'AWAITING INPUT STREAM...',
      'SYSTEM NOMINAL',
      'ALL SUBSYSTEMS ONLINE',
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    this.system(msg);
  }
}

