import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropDirective } from '../../directives/drag-drop.directive';
import { TerminalLogService } from '../../services/terminal-log.service';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [CommonModule, DragDropDirective],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.scss'
})
export class ImageInputComponent {
  private terminalLog = inject(TerminalLogService);

  fileSelected = output<File>();

  protected selectedFileName = '';
  protected selectedFileSize = '';
  protected selectedFileType = '';
  protected error = '';

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onFileDrop(file: File) {
    this.handleFile(file);
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  private handleFile(file: File) {
    this.error = '';
    const fileSize = this.formatFileSize(file.size);
    const fileType = file.type.replace('image/', '').toUpperCase();

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.error = 'Please select an image file';
      this.terminalLog.error('INVALID FILE TYPE');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      this.error = 'File size must be less than 50MB';
      this.terminalLog.logFileTooLarge(file.name, fileSize);
      return;
    }

    this.selectedFileName = file.name;
    this.selectedFileSize = fileSize;
    this.selectedFileType = fileType;

    // Log successful mount
    this.terminalLog.logFileMount(file.name, fileSize, fileType);

    this.fileSelected.emit(file);
  }

  triggerFileInput() {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input?.click();
  }
}
