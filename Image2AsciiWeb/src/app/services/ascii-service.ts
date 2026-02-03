import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsciiService {
  private apiUrl = 'http://localhost:5000/api/ascii';

  constructor(private http: HttpClient) { }

  convertImage(file: File, width: number): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', width.toString());

    return this.http.post(`${this.apiUrl}/convert`, formData);
  }
}
