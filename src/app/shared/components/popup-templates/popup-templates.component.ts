import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { PopupTemplateRegistryService } from '../../services/popup-template-registry.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popup-templates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './popup-templates.component.html',
})
export class PopupTemplatesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('confirm') confirm!: TemplateRef<any>;
  @ViewChild('addMinistry') addMinistry!: TemplateRef<any>;
  @ViewChild('info') info!: TemplateRef<any>;
  @ViewChild('addEventTemplate') addEventTemplate!: TemplateRef<any>;
  @ViewChild('prayerTemplate') prayerTemplate!: TemplateRef<any>;
  @ViewChild('serviceTemplate') serviceTemplate!: TemplateRef<any>;
  private subscription?: Subscription;
  isLoading: boolean = false;
  ministryName = '';
  name = '';
  newEvent = {
    title: '',
    description: '',
    location: '',
    file: null,
    category: '',
    date: '', // e.g., '2025-05-07'
    startTime: '', // e.g., '14:30'
    endTime: '',
  };
  prayer = {
    name: '',
    email: '',
    message: '',
  };

  constructor(private registry: PopupTemplateRegistryService) {}

  ngOnDestroy(): void {
    this.isLoading = false;
    this.subscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.subscription = this.registry.onTemplateClosed$.subscribe((msg) => {
      this.isLoading = false;
    });
    this.registry.registerTemplate('confirm', this.confirm);
    this.registry.registerTemplate('addMinistry', this.addMinistry);
    this.registry.registerTemplate('info', this.info);
    this.registry.registerTemplate('addEventTemplate', this.addEventTemplate);
    this.registry.registerTemplate('prayerTemplate', this.prayerTemplate);
    this.registry.registerTemplate('serviceTemplate', this.serviceTemplate);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.newEvent.file = file;
  }

  saveEvent() {
    console.log('Event data:', this.newEvent);
    // You can now emit, save to backend, or update your calendar
  }

  onSubmit() {
    console.log('Prayer Request Submitted:', this.prayer);
    // TODO: Handle submission (e.g., send to backend, show confirmation)
  }
}
