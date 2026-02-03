import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropDirective } from '../../directives/drag-drop.directive';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [CommonModule, DragDropDirective],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.scss'
})
export class ImageInputComponent {
  fileSelected = output<File>();

  protected selectedFileName = '';
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

  private handleFile(file: File) {
    this.error = '';

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.error = 'Please select an image file';
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.error = 'File size must be less than 5MB';
      return;
    }

    this.selectedFileName = file.name;
    this.fileSelected.emit(file);
  }

  triggerFileInput() {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input?.click();
  }
}
