import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface AsciiSettings {
  width: number;
  brightness: number;
  gamma: number;
  invert: boolean;
}

export interface AsciiResponse {
  ascii: string;
}

@Injectable({ providedIn: 'root' })
export class AsciiService {
  private readonly apiUrl = 'https://localhost:7000/api/ascii';

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
    formData.append('invert', settings.invert.toString());

    return this.http.post<AsciiResponse>(this.apiUrl, formData).pipe(
      tap(response => this.currentAscii.set(response.ascii))
    );
  }
}
