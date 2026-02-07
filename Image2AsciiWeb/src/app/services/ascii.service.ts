import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AsciiSettings {
  width: number;
  brightness: number;
  gamma: number;
  invert: boolean;
  asciiLibrary?: string;
  chromatic?: boolean;
}

export interface AsciiResponse {
  ascii: string;
}

@Injectable({ providedIn: 'root' })
export class AsciiService {
  private readonly apiUrl = 'http://localhost:5071/api/ascii';

  private currentImage = signal<File | null>(null);
  private currentAscii = signal<string>('');

  readonly image = this.currentImage.asReadonly();
  readonly ascii = this.currentAscii.asReadonly();

  constructor(private http: HttpClient) {}

  setImage(file: File) {
    this.currentImage.set(file);
  }

  generate(file: File, settings: AsciiSettings): Observable<AsciiResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', settings.width.toString());
    formData.append('brightness', settings.brightness.toString());
    formData.append('gamma', settings.gamma.toString());
    formData.append('asciiLibrary', settings.asciiLibrary || 'Classic');
    formData.append('invert', settings.invert.toString());

    console.log('🟦 [SERVICE] Original settings:', settings);
    console.log('🟦 [SERVICE] FormData values:', {
      width: settings.width.toString(),
      brightness: settings.brightness.toString(),
      gamma: settings.gamma.toString(),
      asciiLibrary: settings.asciiLibrary || 'Classic',
      invert: settings.invert.toString()
    });

    return this.http.post<AsciiResponse>(this.apiUrl, formData).pipe(
      tap(response => {
        console.log('🟦 [SERVICE] Response received, ascii length:', response.ascii.length);
        this.currentAscii.set(response.ascii);
      })
    );
  }
}
