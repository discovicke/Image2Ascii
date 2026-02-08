import { Component, inject, input, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsciiSettings } from '../../services/ascii.service';
import { TerminalLogService } from '../../services/terminal-log.service';

@Component({
  selector: 'app-ascii-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ascii-preview.component.html',
  styleUrl: './ascii-preview.component.scss'
})
export class AsciiPreviewComponent implements OnInit, OnDestroy {
  private terminalLog = inject(TerminalLogService);

  ascii = input.required<string>();
  isLoading = input<boolean>(false);
  settings = input<AsciiSettings>();

  protected copySuccess = false;
  protected animatedDots = signal('.');
  private dotInterval?: number;
  private readonly dotStates = ['.', '..', '...', '.', '..', '...'];

  ngOnInit() {
    let currentIndex = 0;
    this.dotInterval = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % this.dotStates.length;
      this.animatedDots.set(this.dotStates[currentIndex]);
    }, 400);
  }

  ngOnDestroy() {
    if (this.dotInterval) {
      clearInterval(this.dotInterval);
    }
  }

  copyToClipboard() {
    const text = this.ascii();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      this.copySuccess = true;
      this.terminalLog.logCopy();
      setTimeout(() => this.copySuccess = false, 2000);
    });
  }

  downloadAsText() {
    const text = this.ascii();
    if (!text) return;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ascii-art-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    this.terminalLog.logDownload();
  }
}
