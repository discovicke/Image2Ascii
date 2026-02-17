import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsciiService, AsciiSettings } from '../../services/ascii.service';
import { TerminalLogService } from '../../services/terminal-log.service';
import { ApiStatusService } from '../../services/api-status.service';
import { ImageInputComponent } from '../image-input/image-input.component';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import { AsciiPreviewComponent } from '../ascii-preview/ascii-preview.component';
import { TerminalLogComponent } from '../terminal-log/terminal-log.component';


@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageInputComponent, SettingsPanelComponent, AsciiPreviewComponent, TerminalLogComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent {
  private terminalLog = inject(TerminalLogService);
  private apiStatus = inject(ApiStatusService);

  protected selectedFile = signal<File | null>(null);
  protected settings = signal<AsciiSettings>({
    width: 100,
    brightness: 0,
    gamma: 1,
    invert: false,
    asciiLibrary: 'Classic',
    chromatic: false
  });
  protected isLoading = signal(false);

  constructor(protected asciiService: AsciiService) {
    // Auto-regenerate on settings change (debounced)
    toObservable(this.settings).pipe(
      debounceTime(500)
    ).subscribe(settings => {
      const file = this.selectedFile();
      if (file) {
        this.generateAscii(file, settings);
      }
    });

    // Spawn atmospheric messages periodically
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance
        this.terminalLog.spawnAtmosphericMessage();
      }
    }, 15000);
  }

  onFileSelected(file: File) {
    this.selectedFile.set(file);
    this.generateAscii(file, this.settings());
  }

  onSettingsChanged(settings: AsciiSettings) {
    this.settings.set(settings);
  }

  private generateAscii(file: File, settings: AsciiSettings) {
    const status = this.apiStatus.status();

    // Check if API is available
    if (status === 'waking' || status === 'connecting') {
      this.terminalLog.warning('RENDER ENGINE NOT READY - QUEUING REQUEST...');
      // Wait for API to be online, then retry
      const checkInterval = setInterval(() => {
        if (this.apiStatus.status() === 'online') {
          clearInterval(checkInterval);
          this.doGenerate(file, settings);
        }
      }, 1000);
      return;
    }

    if (status === 'offline') {
      this.terminalLog.error('RENDER ENGINE OFFLINE - CANNOT PROCESS');
      return;
    }

    this.doGenerate(file, settings);
  }

  private doGenerate(file: File, settings: AsciiSettings) {
    console.log('📤 Sending to API:', { file: file.name, settings });
    this.isLoading.set(true);

    this.terminalLog.logBatchStart(settings.width, settings.brightness, settings.gamma);

    this.asciiService.generate(file, settings).subscribe({
      next: (response) => {
        console.log('Got ASCII response, frames:', response.frames.length);
        this.isLoading.set(false);
        this.terminalLog.logBatchComplete(response.frames[0]?.length || 0);
      },
      error: (err: unknown) => {
        console.error('API Error:', err);
        this.isLoading.set(false);
        this.terminalLog.logBatchError('CONNECTION FAILED');
      }
    });
  }
}
