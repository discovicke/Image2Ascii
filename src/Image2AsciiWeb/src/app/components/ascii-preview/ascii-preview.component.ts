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

  frames = input.required<string[]>();
  isLoading = input<boolean>(false);
  settings = input<AsciiSettings>();

  protected currentFrameIndex = signal(0);
  protected copySuccess = false;
  protected animatedDots = signal('.');
  
  private dotInterval?: any;
  private animationInterval?: any;
  private readonly dotStates = ['.  ', '.. ', '...'];

  ngOnInit() {
    // Dot animation for loading
    this.dotInterval = window.setInterval(() => {
      const current = this.dotStates.indexOf(this.animatedDots());
      const nextIndex = (current + 1) % this.dotStates.length;
      this.animatedDots.set(this.dotStates[nextIndex]);
    }, 800);

    // ASCII Frame animation
    this.animationInterval = window.setInterval(() => {
      const currentFrames = this.frames();
      if (currentFrames && currentFrames.length > 1) {
        this.currentFrameIndex.set((this.currentFrameIndex() + 1) % currentFrames.length);
      } else {
        this.currentFrameIndex.set(0);
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.dotInterval) clearInterval(this.dotInterval);
    if (this.animationInterval) clearInterval(this.animationInterval);
  }

  getCurrentFrame(): string {
    const f = this.frames();
    if (!f || f.length === 0) return '';
    return f[this.currentFrameIndex()] || f[0];
  }

  copyToClipboard() {
    const text = this.getCurrentFrame();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      this.copySuccess = true;
      this.terminalLog.logCopy();
      setTimeout(() => this.copySuccess = false, 2000);
    });
  }

  downloadAsText() {
    const f = this.frames();
    if (!f || f.length === 0) return;

    // Download all frames for GIFs, or just the one for static images
    const text = f.join('\n\n--- FRAME BREAK ---\n\n');
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
