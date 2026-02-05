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
  asciiLibraries = ['Classic', 'Detailed', 'Blocks', 'Minimal', 'Monochrome'];

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
