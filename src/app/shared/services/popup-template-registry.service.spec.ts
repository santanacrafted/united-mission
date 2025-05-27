import { TestBed } from '@angular/core/testing';

import { PopupTemplateRegistryService } from './popup-template-registry.service';

describe('PopupTemplateRegistryService', () => {
  let service: PopupTemplateRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopupTemplateRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
