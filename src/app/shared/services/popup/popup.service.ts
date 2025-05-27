import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DynamicPopupComponent } from '../../components/dynamic-popup/dynamic-popup.component';
import { ImageViewerComponent } from '../../components/image-viewer/image-viewer.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  openImageViewer(images: string[], selectedImage: string): void {
    this.dialog.open(ImageViewerComponent, {
      data: {
        images,
        selectedImage,
      },
      panelClass: 'fullscreen-dialog',
      maxWidth: '100vw',
      width: '100vw',
      height: '100vh',
      autoFocus: false,
      restoreFocus: false,
      backdropClass: 'white-backdrop',
    });
  }

  open(template: TemplateRef<any>, data: any = {}): void {
    this.dialog.open(DynamicPopupComponent, {
      data: { template, context: data },
      maxWidth: '100vw',
    });
  }

  close(): void {
    this.dialog.closeAll();
  }
}
