import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsciiSettings } from '../../services/ascii.service';
import { TerminalLogService } from '../../services/terminal-log.service';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss'
})
export class SettingsPanelComponent {
  private terminalLog = inject(TerminalLogService);

  settings = input.required<AsciiSettings>();
  settingsChanged = output<AsciiSettings>();
  asciiLibraries: AsciiLibrary[] = [
    { key: 'Detailed', label: 'DETAILED_FULL_RANGE', contrast: 'low' },
    { key: 'Soft1', label: 'SOFT_SMOOTH_TONES', contrast: 'low' },
    { key: 'Matrix', label: 'MATRIX_DIGITAL', contrast: 'low' },
    { key: 'LCD', label: 'LCD_SEGMENTED', contrast: 'low' },
    { key: 'SoftDots', label: 'DOTS_STIPPLED', contrast: 'high' },
    { key: 'Dither1', label: 'DITHER_PATTERNED', contrast: 'low' },
    { key: 'Dither2', label: 'DITHER_ULTRA_DENSE', contrast: 'low' },
    { key: 'StarsAndSky', label: 'STARS_SILHOUETTE', contrast: 'high' },

    { key: 'Classic', label: 'CLASSIC_STANDARD', contrast: 'medium' },
    { key: 'Soft2Short', label: 'SOFT_BALANCED', contrast: 'medium' },
    { key: 'PrintFriendly', label: 'PRINT_READABLE', contrast: 'medium' },
    { key: 'Numbers', label: 'NUMBERS_NUMERIC', contrast: 'medium' },
    { key: 'Thin', label: 'THIN_LINE_ART', contrast: 'high' },

    { key: 'Minimal', label: 'MINIMAL_SPARSE', contrast: 'high' },
    { key: 'HighContrast1', label: 'HIGH_CONTRAST_HARD', contrast: 'high' },
    { key: 'Minimal3', label: 'MINIMAL_BOLD', contrast: 'high' },
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
    if (c === 'high') return 'HIGH_CONTRAST';
    if (c === 'medium') return 'MEDIUM_CONTRAST';
    else return 'LOW_CONTRAST';
  }

  onAsciiLibraryChange(value: string) {
    this.terminalLog.logSettingsChange('CHAR_SET', value);
    const newSettings = { ...this.settings(), asciiLibrary: value };
    this.emitChange({ asciiLibrary: newSettings.asciiLibrary});
  }
  onWidthChange(value: string) {
    this.terminalLog.logSettingsChange('GRID_WIDTH', value);
    this.emitChange({ width: parseInt(value) });
  }

  onBrightnessChange(value: string) {
    this.terminalLog.logSettingsChange('BRIGHTNESS', value);
    this.emitChange({ brightness: parseFloat(value) });
  }

  onGammaChange(value: string) {
    this.terminalLog.logSettingsChange('GAMMA', value);
    this.emitChange({ gamma: parseFloat(value) });
  }

  onInvertChange(value: boolean) {
    this.terminalLog.logSettingsChange('INVERT_LUMA', value ? 'ON' : 'OFF');
    this.emitChange({ invert: value });
  }

  onChromaticChange(value: boolean) {
    this.terminalLog.logSettingsChange('CHROMATIC', value ? 'ON' : 'OFF');
    this.emitChange({ chromatic: value });
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
