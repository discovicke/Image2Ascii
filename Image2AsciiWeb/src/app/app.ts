import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsciiService } from './services/ascii-service';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent, WorkspaceComponent],
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
