import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { loadMinistries } from '../../state/ministries/ministries.actions';
import {
  selectMinistries,
  selectMinistriesLoading,
} from '../../state/ministries/ministries.selector';

import { Ministries } from './ministries.model';
import { InfoCardComponent } from '../../shared/components/info-card/info-card.component';

@Component({
  selector: 'app-ministries',
  standalone: true,
  imports: [
    CommonModule,
    InfoCardComponent,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './ministries.component.html',
  styleUrl: './ministries.component.scss',
})
export class MinistriesComponent implements OnInit {
  ministries$ = this.store.select(selectMinistries);
  ministriesLoading$ = this.store.select(selectMinistriesLoading);
  selectedMinistry?: Ministries;
  lang: 'en' | 'es' = 'en';
  interestForm!: FormGroup;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.lang = (this.translateService.currentLang ||
      this.translateService.getDefaultLang()) as 'en' | 'es';

    this.translateService.onLangChange.subscribe(
      (event: { lang: 'en' | 'es' }) => (this.lang = event.lang)
    );

    this.store.dispatch(loadMinistries());

    this.interestForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      message: [''],
    });

    // ✅ Read query param and select the correct ministry
    this.route.queryParams.subscribe((params) => {
      const ministryParam = params['id'];

      if (ministryParam) {
        this.ministries$.subscribe((ministries) => {
          const match = ministries.find((m) => m.id === ministryParam);
          if (match) this.selectedMinistry = match;
        });
      }
    });
  }

  onSelectedMinistry(ministry: Ministries) {
    this.selectedMinistry = ministry;
  }

  onBackToMinistries() {
    this.selectedMinistry = undefined;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  submitInterest() {
    if (this.interestForm.valid) {
      const formData = this.interestForm.value;
      console.log('Form submitted:', formData);
      // TODO: Send to backend/Firebase
      this.interestForm.reset();
    } else {
      this.interestForm.markAllAsTouched();
    }
  }
}
