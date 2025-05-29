import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RuntimeConfigService {
  get googleApiKey(): string {
    return (window as any)['__env']?.GOOGLE_API_KEY || '';
  }
}
