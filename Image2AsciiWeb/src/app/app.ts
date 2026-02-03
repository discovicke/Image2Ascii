import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsciiService } from './services/ascii-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Image2AsciiWeb');
  protected readonly asciiArt = signal('');
  protected selectedFile: File | null = null;
  protected width = 100;

  constructor(private asciiService: AsciiService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  convertImage() {
    if (this.selectedFile) {
      this.asciiService.convertImage(this.selectedFile, this.width)
        .subscribe(response => {
          this.asciiArt.set(response.ascii);
        });
    }
  }
}
