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
    { key: 'Detailed', label: 'Detailed (Fine)', contrast: 'low', category: 'Soft / Smooth' },
    { key: 'Soft1', label: 'Soft (Smooth)', contrast: 'low', category: 'Soft / Smooth' },
    { key: 'Matrix', label: 'Matrix', contrast: 'low', category: 'Retro / digital' },
    { key: 'Cyberpunk', label: 'Cyberpunk', contrast: 'low', category: 'Retro / digital' },
    { key: 'LCD', label: 'LCD', contrast: 'low', category: 'Retro / digital' },
    { key: 'SoftDots', label: 'Dots', contrast: 'low', category: 'Minimal' },
    { key: 'Dither1', label: 'Dither 1', contrast: 'low', category: 'Dithering', warning: 'High-contrast images' },
    { key: 'Dither2', label: 'Dither (Ultra)', contrast: 'low', category: 'Dithering', warning: 'High contrast image' },
    { key: 'StarsAndSky', label: 'Stars', contrast: 'low', category: 'Experimental' },
    { key: 'Classic', label: 'Classic', contrast: 'medium', category: 'Soft / Smooth' },
    { key: 'Blocks', label: 'Blocks', contrast: 'medium', category: 'Blocky' },
    { key: 'Soft2Short', label: 'Soft (Balanced)', contrast: 'medium', category: 'Soft / Smooth' },
    { key: 'PrintFriendly', label: 'Print Friendly', contrast: 'medium', category: 'Print / symbols' },
    { key: 'Numbers', label: 'Numbers', contrast: 'medium', category: 'Print / symbols' },
    { key: 'Thin', label: 'Thin', contrast: 'medium', category: 'Minimal' },
    { key: 'Wave', label: 'Wave', contrast: 'medium', category: 'Experimental' },
    { key: 'Minimal', label: 'Minimal', contrast: 'high', category: 'Minimal' },
    { key: 'HighContrast1', label: 'High Contrast', contrast: 'high', category: 'High contrast' },
    { key: 'HighContrast3', label: 'High Contrast (Blocks)', contrast: 'high', category: 'High contrast' },
    { key: 'Emojiish', label: 'Emoji Blocks', contrast: 'high', category: 'Blocky' },
    { key: 'Minimal3', label: 'Minimal (Bold)', contrast: 'high', category: 'Minimal' },
  ];

  get groupedLibraries(): Array<{ label: string; libs: AsciiLibrary[] }> {
    const map = new Map<
      string,
      { libs: AsciiLibrary[]; contrasts: Set<AsciiLibrary['contrast']> }
    >();

    for (const lib of this.asciiLibraries) {
      const entry =
        map.get(lib.category) ??
        { libs: [], contrasts: new Set<AsciiLibrary['contrast']>() };

      entry.libs.push(lib);
      entry.contrasts.add(lib.contrast);
      map.set(lib.category, entry);
    }

    const result: Array<{ label: string; libs: AsciiLibrary[] }> = [];

    for (const [category, { libs, contrasts }] of map.entries()) {
      const contrastsArr = Array.from(contrasts);
      const label =
        contrastsArr.length === 1
          ? `${this.humanContrast(contrastsArr[0])} · ${category}`
          : category;

      result.push({ label, libs });
    }

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
  category: string;
  warning?: string;
};
