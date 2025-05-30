import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PopupTemplateRegistryService } from '../../shared/services/popup-template-registry.service';
import { PopupService } from '../../shared/services/popup/popup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { httpsCallable } from 'firebase/functions';
import { Functions } from '@angular/fire/functions';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TranslateModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  prayerForm: FormGroup;
  logoUrl = '/assets/images/logo-white2.png';
  backgroundImg: string =
    '/assets/images/curvy-blue-wave-lines-background-presentation-backdrop.jpg';
  churchServices: { day: string; time: string; description: string }[] = [
    {
      day: 'HOME_PAGE_SERVICE_SQUEDULE_DAY_1',
      time: '8:00 PM – 9:00 PM',
      description: 'Midweek Bible study and prayer meeting.',
    },
    {
      day: 'HOME_PAGE_SERVICE_SQUEDULE_DAY_2',
      time: '8:00 PM – 9:00 PM',
      description: 'Midweek Bible study and prayer meeting.',
    },
    {
      day: 'HOME_PAGE_SERVICE_SQUEDULE_DAY_3',
      time: '8:00 PM – 9:00 PM',
      description: 'Midweek Bible study and prayer meeting.',
    },
    {
      day: 'HOME_PAGE_SERVICE_SQUEDULE_DAY_4',
      time: '9:00 AM – 12:00 PM',
      description: 'Midweek Bible study and prayer meeting.',
    },
  ];
  functions = inject(Functions);
  isLoading: boolean = false;

  constructor(
    private registry: PopupTemplateRegistryService,
    private popup: PopupService,
    private fb: FormBuilder,
    private snackbar: SnackbarService
  ) {
    this.prayerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  openServicePopup(service: {
    day: string;
    time: string;
    description: string;
  }) {
    const template = this.registry.getTemplate('serviceTemplate');
    if (template) {
      this.popup.open(template, {
        service: service,
        close: () => {
          this.popup.close();
        },
      });
    } else {
      console.error('Template not found.');
    }
  }

  openPrayerRequestPopup() {
    const template = this.registry.getTemplate('prayerTemplate');
    if (template) {
      this.popup.open(template, {
        prayerForm: this.prayerForm,
        isLoading: this.isLoading,
        close: () => {
          this.popup.close();
        },
        onSubmit: () => {
          if (this.prayerForm.invalid) return;
          this.isLoading = true;
          this.sendPrayerRequest();
        },
      });
    } else {
      console.error('Template not found.');
    }
  }

  sendPrayerRequest() {
    const sendContactEmail = httpsCallable(this.functions, 'sendContactEmail');
    sendContactEmail(this.prayerForm.value)
      .then(() => {
        this.prayerForm.reset();
        this.isLoading = false;
        this.popup.close();
        this.registry.handleTemplateClosed();
        this.snackbar.openSnackBar('Message sent!', 'Close');
      })
      .catch((err) => {
        console.error('Firebase Error:', err);
        alert('Failed to send message.');
      });
  }
}
