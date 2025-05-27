import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideItems } from '../../shared/components/swiper/swiper.component';
import { VideoEmbedComponent } from '../../shared/components/video-embed/video-embed.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperComponent } from '../../shared/components/swiper/swiper.component';
import { VideoCheckerComponent } from '../../shared/components/video-checker/video-checker.component';
import { PopupTemplateRegistryService } from '../../shared/services/popup-template-registry.service';
import { PopupService } from '../../shared/services/popup/popup.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { httpsCallable } from 'firebase/functions';
import { Functions } from '@angular/fire/functions';
import { SnackbarService } from '../../shared/services/snackbar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    VideoEmbedComponent,
    ButtonComponent,
    TranslateModule,
    SwiperComponent,
    VideoCheckerComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  prayerForm: FormGroup;
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
  imageSliderArr: SlideItems[] = [
    {
      title: {
        es: 'Bienvenido a Nuestra Iglesia',
        en: 'Welcome to Our Church',
      },
      description: {
        es: 'Un lugar para pertenecer, crecer y experimentar el amor de Dios.',
        en: 'A place to belong, grow, and experience God’s love.',
      },
      coverImage:
        'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      captionPosition: 'center',
      titleFontClasses: 'text-5xl sm:text-6xl font-semibold',
      descriptionFontClasses: 'text-xl text-gray-200 mt-2',
      slideOpacity: '0.5',
      badge: '',
    },
    {
      title: {
        es: 'Únete a Nuestro Estudio Bíblico',
        en: 'Join Our Bible Study',
      },
      description: {
        es: 'Crece en la fe, haz preguntas y descubre la Palabra de Dios junto a otros.',
        en: 'Grow in faith, ask questions, and discover God’s Word together.',
      },
      coverImage:
        'https://images.pexels.com/photos/1750566/pexels-photo-1750566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      captionPosition: 'center',
      textAlignment: 'text-center',
      titleFontClasses: 'text-5xl sm:text-6xl font-semibold',
      descriptionFontClasses: 'text-xl text-gray-200 mt-2',
      slideOpacity: '0.5',
      badge: '',
    },
    {
      title: {
        es: 'Una Mano Amiga, Un Corazón Esperanzado',
        en: 'A Helping Hand, A Hopeful Heart',
      },
      description: {
        es: 'Juntos llevamos esperanza a través de la compasión y el cuidado.',
        en: 'Together, we bring hope through compassion and care.',
      },
      coverImage:
        'https://images.pexels.com/photos/6646926/pexels-photo-6646926.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      captionPosition: 'center',
      textAlignment: 'text-center',
      titleFontClasses: 'text-5xl sm:text-6xl font-semibold',
      descriptionFontClasses: 'text-xl text-gray-200 mt-2',
      slideOpacity: '0.3',
      badge: '',
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
