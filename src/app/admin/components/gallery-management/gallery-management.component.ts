import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Functions } from '@angular/fire/functions';
import { Storage } from '@angular/fire/storage';
import {
  addImagesToAlbum,
  clearSelectedImages,
  createAlbum,
  deleteAlbum,
  deleteSelectedImages,
  loadEventGallery,
  loadGalleryEvents,
  selectAllImages,
  toggleSelectImage,
  updateAlbum,
} from '../../../state/gallery/gallery.actions';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of, take } from 'rxjs';
import { GalleryEvent } from '../../../components/gallery/gallery.model';
import {
  selectEventImages,
  selectGalleryEvents,
  selectGalleryLoading,
  selectSelectedImagesByAlbum,
} from '../../../state/gallery/gallery.selector';
import { PopupService } from '../../../shared/services/popup/popup.service';
import { GalleryService } from '../../../components/gallery/gallery.service';
import { PopupTemplateRegistryService } from '../../../shared/services/popup-template-registry.service';

@Component({
  selector: 'app-gallery-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gallery-management.component.html',
  styleUrl: './gallery-management.component.scss',
})
export class GalleryManagementComponent implements OnInit {
  showForm = false;
  @ViewChild('editAlbumTemplate') editAlbumTemplate!: TemplateRef<any>;
  @ViewChild('newAlbumTemplate') newAlbumTemplate!: TemplateRef<any>;

  albumForm: FormGroup;
  coverPhotoFile: File | null = null;
  imageFiles: File[] = [];
  functions = inject(Functions);
  storage = inject(Storage);
  events$?: Observable<GalleryEvent[]>;
  selectGalleryLoading$?: Observable<boolean>;
  images$: Observable<string[]> = of([]);
  selectedImages$: Observable<string[]> = of([]);
  galleryView: 'events-gallery' | 'event-images' = 'events-gallery';
  add: boolean = false;
  selectedAlbum: any = null;
  selectedAlbumImages: { name: string; downloadUrl: string }[] = [];
  selectAll = false;
  supportedLanguages = ['en', 'es'];
  activeLang = 'en';
  editAlbumForm!: FormGroup;

  form = {
    name: {} as Record<string, string>,
    description: {} as Record<string, string>,
  };

  previewUrl: string | null = null;
  newCoverImage: File | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private popupService: PopupService,
    private galleryService: GalleryService,
    private popup: PopupService,
    private registry: PopupTemplateRegistryService
  ) {
    this.albumForm = this.fb.group({
      albumName: ['', Validators.required],
      description: ['', Validators.required],
      albumNameEs: [''],
      descriptionEs: [''],
    });

    this.events$ = this.store.select(selectGalleryEvents);
    this.selectGalleryLoading$ = this.store.select(selectGalleryLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadGalleryEvents());
  }

  getLangControl(groupName: 'name' | 'description', lang: string): FormControl {
    return this.editAlbumForm.get([groupName, lang]) as FormControl;
  }

  onEditAlbum(event: GalleryEvent) {
    this.previewUrl = null;
    this.newCoverImage = null;
    this.activeLang = 'en';

    this.editAlbumForm = this.fb.group({
      name: this.fb.group({
        en: [event.name?.en || ''],
        es: [event.name?.es || ''],
      }),
      description: this.fb.group({
        en: [event.description?.en || ''],
        es: [event.description?.es || ''],
      }),
    });

    this.popup.open(this.editAlbumTemplate, {
      albumForm: this.albumForm,
      album: event,
      isLoading: true,
      close: () => {
        this.popup.close();
      },
      onSubmit: () => {
        if (this.albumForm.invalid) return;
      },
    });
  }

  openAddAlbumPopup() {
    this.popup.open(this.newAlbumTemplate, {
      albumForm: this.albumForm,
      close: () => {
        this.popup.close();
      },
    });
  }

  setActiveLang(lang: string) {
    this.activeLang = lang;
  }

  onCoverImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.newCoverImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpdateAlbum(albumId: string) {
    const formValue = this.editAlbumForm.value;
    this.store.dispatch(
      updateAlbum({
        albumId,
        updatedTitleEn: formValue.name.en,
        updatedTitleEs: formValue.name.es,
        updatedDescriptionEn: formValue.description.en,
        updatedDescriptionEs: formValue.description.es,
        newCoverPhotoFile: this.newCoverImage || undefined,
      })
    );
    this.popup.close();
  }

  onCoverPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.coverPhotoFile = input.files[0];
    }
  }

  onAlbumImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.imageFiles = Array.from(input.files);
    }
  }

  async onCreateAlbum() {
    if (this.albumForm.invalid || !this.coverPhotoFile) {
      console.error('Form invalid or cover photo not selected');
      return;
    }

    const { albumName, albumNameEs, description, descriptionEs } =
      this.albumForm.value;

    this.store.dispatch(
      createAlbum({
        albumName,
        albumNameEs,
        description,
        descriptionEs,
        coverPhotoFile: this.coverPhotoFile,
        selectedImages: this.imageFiles,
      })
    );

    this.popup.close();
  }

  onDeleteAlbum(albumId: string): void {
    this.store.dispatch(
      deleteAlbum({
        albumId,
      })
    );
  }

  openImage(selectedImageUrl: any, imagesArray: any) {
    this.popupService.openImageViewer(imagesArray, selectedImageUrl);
  }

  loadEventImages(event: GalleryEvent) {
    this.selectedAlbum = event;
    this.store.dispatch(loadEventGallery({ eventId: event.id }));
    this.galleryView = 'event-images';
    this.images$ = this.store.select(selectEventImages(event.id));
    this.selectedImages$ = this.store.select(
      selectSelectedImagesByAlbum(event.id)
    );
  }

  onToggleSelectImage(imageUrl: string) {
    this.store.dispatch(
      toggleSelectImage({ eventId: this.selectedAlbum.id, imageUrl })
    );
  }

  onSelectAll() {
    combineLatest([this.images$, this.selectedImages$])
      .pipe(take(1))
      .subscribe(([images, selected]) => {
        const eventId = this.selectedAlbum.id;
        const allSelected =
          images.length === selected.length &&
          images.every((img) => selected.includes(img));

        if (allSelected) {
          this.store.dispatch(clearSelectedImages({ eventId }));
        } else {
          this.store.dispatch(selectAllImages({ eventId, images }));
        }
      });
  }

  onAddMoreImages(event: Event) {
    const eventId = this.selectedAlbum.id;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.store.dispatch(
        addImagesToAlbum({
          eventId,
          files,
        })
      );
    }
  }

  onDeleteSelectedImages() {
    this.selectedImages$.pipe(take(1)).subscribe((imageUrls) => {
      if (imageUrls.length) {
        this.store.dispatch(
          deleteSelectedImages({
            eventId: this.selectedAlbum.id,
            imageUrls,
          })
        );
      }
    });
  }
}
