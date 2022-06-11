import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EscoService {
  private _baseUrl: string = 'https://ec.europa.eu/esco/api/search';
  //https://ec.europa.eu/esco/api/search?type=occupation&text=developer&language=en
  constructor(private http: HttpClient) {}

  getClasificaciones(
    type: string,
    text: string,
    lang: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this._baseUrl}?type=${type}&text=${text}&language=${lang}`
    );
  }
}
