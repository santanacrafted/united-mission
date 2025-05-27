import { APP_INITIALIZER } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export function appInitializerFactory(
  translate: TranslateService
): () => Promise<any> {
  return () => {
    const defaultLang = 'en';
    translate.setDefaultLang(defaultLang);
    return translate.use(defaultLang).toPromise();
  };
}
