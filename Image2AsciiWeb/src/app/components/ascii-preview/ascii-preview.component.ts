import { Component, inject, input } from '@angular/core';
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
export class AsciiPreviewComponent {
  ascii = input.required<string>();
  isLoading = input<boolean>(false);
  settings = input<AsciiSettings>();

  protected copySuccess = false;

  copyToClipboard() {
    const text = this.ascii();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      this.copySuccess = true;
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
  }
}
