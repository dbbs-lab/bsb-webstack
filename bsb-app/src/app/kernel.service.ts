import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JsonSchema } from './lib/json-schema';

@Injectable({
  providedIn: 'root',
})
export class KernelService {
  constructor(private readonly http: HttpClient) {}

  getSchema(config?: Record<string, any>): Observable<JsonSchema> {
    return this.http.post<JsonSchema>('http://localhost:5000/schema', config);
  }

  getDefaultConfig() {
    return this.http
      .get<Record<string, any>>('http://localhost:5000/default-config')
      .pipe(
        tap((config) => (config['connectivity'] = { hello: {}, world: {} }))
      );
  }
}
