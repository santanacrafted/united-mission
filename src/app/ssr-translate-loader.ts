import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject, Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SsrTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient, private platformId: Object) {}

  getTranslation(lang: string): Observable<any> {
    const isServer = isPlatformServer(this.platformId);

    if (isServer) {
      // Only require fs and path in the Node environment
      const fs = eval('require')('fs');
      const path = eval('require')('path');

      const filePath = path.join(
        process.cwd(),
        'dist/browser/assets/i18n',
        `${lang}.json`
      );

      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return of(JSON.parse(content));
      } else {
        console.warn(`[i18n] Missing translation file: ${filePath}`);
        return of({});
      }
    } else {
      return this.http.get(`/assets/i18n/${lang}.json`);
    }
  }
}
