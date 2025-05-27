import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { GalleryEvent } from './gallery.model';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InfoCardComponent } from '../../shared/components/info-card/info-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  loadEventGallery,
  loadGalleryEvents,
} from '../../state/gallery/gallery.actions';
import { Store } from '@ngrx/store';
import {
  selectEventImages,
  selectGalleryEvents,
  selectGalleryLoading,
} from '../../state/gallery/gallery.selector';
import { PopupService } from '../../shared/services/popup/popup.service';
@Component({
  selector: 'app-gallery',
  imports: [CommonModule, InfoCardComponent, TranslateModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  eventGalleries: {
    eventId: string;
    title: { es: string; en: string };
    description: { es: string; en: string };
    coverImage: string;
    images: string[];
  }[] = [];
  @Input() eventId: string = 'kenya-2024'; // Set this to 'kenya-2024'
  lang: 'en' | 'es' = 'en';
  galleryView: 'events-gallery' | 'event-images' = 'events-gallery';
  selectedEvent?: GalleryEvent;
  events$?: Observable<GalleryEvent[]>;
  selectGalleryLoading$?: Observable<boolean>;

  images$: Observable<string[]> = of([]);

  constructor(
    private translateService: TranslateService,
    private store: Store,
    private popupService: PopupService
  ) {
    this.events$ = this.store.select(selectGalleryEvents);
    this.selectGalleryLoading$ = this.store.select(selectGalleryLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadGalleryEvents());
    this.lang = (this.translateService.currentLang ||
      this.translateService.getDefaultLang()) as 'en' | 'es';

    this.translateService.onLangChange.subscribe(
      (event: { lang: 'en' | 'es' }) => {
        this.lang = event.lang;
      }
    );
  }

  openImage(selectedImageUrl: any, imagesArray: any) {
    this.popupService.openImageViewer(imagesArray, selectedImageUrl);
  }

  loadEventImages(event: GalleryEvent) {
    this.selectedEvent = event;
    this.store.dispatch(loadEventGallery({ eventId: event.id }));
    this.galleryView = 'event-images';
    this.images$ = this.store.select(selectEventImages(event.id));
  }
}
