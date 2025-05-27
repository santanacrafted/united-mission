import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
import { httpsCallable } from '@angular/fire/functions';
import { Functions } from '@angular/fire/functions';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
  ],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  fb = inject(FormBuilder);
  translate = inject(TranslateService);
  functions = inject(Functions);
  contactForm: FormGroup;

  constructor(private snackbar: SnackbarService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    const sendContactEmail = httpsCallable(this.functions, 'sendContactEmail');
    sendContactEmail(this.contactForm.value)
      .then(() => {
        this.snackbar.openSnackBar('Message sent!', 'Close');
        this.contactForm.reset();
      })
      .catch((err) => {
        console.error('Firebase Error:', err);
        alert('Failed to send message.');
      });
  }
}
