import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsciiService, AsciiSettings } from '../../services/ascii.service';
import { ImageInputComponent } from '../image-input/image-input.component';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import { AsciiPreviewComponent } from '../ascii-preview/ascii-preview.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageInputComponent, SettingsPanelComponent, AsciiPreviewComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent {
  protected selectedFile = signal<File | null>(null);
  protected settings = signal<AsciiSettings>({
    width: 100,
    brightness: 0,
    gamma: 1,
    invert: false
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
  }

  onFileSelected(file: File) {
    this.selectedFile.set(file);
    this.generateAscii(file, this.settings());
  }

  onSettingsChanged(settings: AsciiSettings) {
    this.settings.set(settings);
  }

  private generateAscii(file: File, settings: AsciiSettings) {
    this.isLoading.set(true);
    this.asciiService.generate(file, settings).subscribe({
      next: () => this.isLoading.set(false),
      error: (err) => {
        console.error('Failed to generate ASCII:', err);
        this.isLoading.set(false);
      }
    });
  }
}
