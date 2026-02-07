import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsciiSettings } from '../../services/ascii.service';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss'
})
export class SettingsPanelComponent {
  settings = input.required<AsciiSettings>();
  settingsChanged = output<AsciiSettings>();
  asciiLibraries: AsciiLibrary[] = [
    { key: 'Detailed', label: 'Detailed (Full Range)', contrast: 'low' },
    { key: 'Soft1', label: 'Soft (Smooth Tones)', contrast: 'low' },
    { key: 'Matrix', label: 'Matrix (Digital)', contrast: 'low' },
    { key: 'LCD', label: 'LCD (Segmented)', contrast: 'low' },
    { key: 'SoftDots', label: 'Dots (Stippled)', contrast: 'high' },
    { key: 'Dither1', label: 'Dither (Patterned)', contrast: 'low' },
    { key: 'Dither2', label: 'Dither (Ultra Dense)', contrast: 'low' },
    { key: 'StarsAndSky', label: 'Stars (Silhouette)', contrast: 'high' },

    { key: 'Classic', label: 'Classic (Standard)', contrast: 'medium' },
    { key: 'Soft2Short', label: 'Soft (Balanced)', contrast: 'medium' },
    { key: 'PrintFriendly', label: 'Print (Readable)', contrast: 'medium' },
    { key: 'Numbers', label: 'Numbers (Numeric)', contrast: 'medium' },
    { key: 'Thin', label: 'Thin (Line Art)', contrast: 'high' },

    { key: 'Minimal', label: 'Minimal (Sparse)', contrast: 'high' },
    { key: 'HighContrast1', label: 'High Contrast (Hard)', contrast: 'high' },
    { key: 'Minimal3', label: 'Minimal (Bold)', contrast: 'high' },
  ];

  get groupedLibraries(): Array<{ label: string; libs: AsciiLibrary[] }> {
    // Group all libraries by contrast (low / medium / high)
    const groups: Record<string, AsciiLibrary[]> = { low: [], medium: [], high: [] };

    for (const lib of this.asciiLibraries) {
      const c = lib.contrast ?? 'low';
      if (!groups[c]) groups[c] = [];
      groups[c].push(lib);
    }

    // Sort libs inside each contrast group by label for predictable ordering
    for (const k of Object.keys(groups)) {
      groups[k].sort((a, b) => a.label.localeCompare(b.label));
    }

    // Build ordered result: Low, Medium, High
    const result: Array<{ label: string; libs: AsciiLibrary[] }> = [];

    if (groups['low'].length) result.push({ label: this.humanContrast('low'), libs: groups['low'] });
    if (groups['medium'].length) result.push({ label: this.humanContrast('medium'), libs: groups['medium'] });
    if (groups['high'].length) result.push({ label: this.humanContrast('high'), libs: groups['high'] });

    return result;
  }

  private humanContrast(c: string) {
    if (c === 'high') return 'High contrast';
    if (c === 'medium') return 'Medium contrast';
    else return 'Low contrast';
  }

  onAsciiLibraryChange(value: string) {
    const newSettings = { ...this.settings(), asciiLibrary: value };
    this.emitChange({ asciiLibrary: newSettings.asciiLibrary});
  }
  onWidthChange(value: string) {
    this.emitChange({ width: parseInt(value) });
  }

  onBrightnessChange(value: string) {
    this.emitChange({ brightness: parseFloat(value) });
  }

  onGammaChange(value: string) {
    this.emitChange({ gamma: parseFloat(value) });
  }

  onInvertChange(value: boolean) {
    this.emitChange({ invert: value });
  }

  private emitChange(changes: Partial<AsciiSettings>) {
    this.settingsChanged.emit({
      ...this.settings(),
      ...changes
    });
  }
}

type AsciiLibrary = {
  key: string;
  label: string;
  contrast: 'low' | 'medium' | 'high';
  warning?: string;
};
