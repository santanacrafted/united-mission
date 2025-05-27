import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PopupTemplateRegistryService {
  private templates = new Map<string, TemplateRef<any>>();
  private onClose = new Subject<null>();
  onTemplateClosed$ = this.onClose.asObservable();

  handleTemplateClosed() {
    this.onClose.next(null);
  }

  registerTemplate(name: string, template: TemplateRef<any>) {
    this.templates.set(name, template);
  }

  getTemplate(name: string): TemplateRef<any> | null {
    return this.templates.get(name) || null;
  }

  showTemplates() {
    console.log(this.templates);
  }

  clear() {
    this.templates.clear();
  }
}
