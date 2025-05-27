import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { SwiperComponent } from '../swiper/swiper.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-viewer',
  imports: [SwiperComponent, CommonModule],
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  animations: [
    trigger('fadeState', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ImageViewerComponent implements OnInit {
  currentIndex: number = 0;
  isMobile: boolean = false;
  touchStartX = 0;
  swipeOffset = 0;
  swipeThreshold = 50;
  isDragging = false;
  images: any;

  constructor(
    public dialogRef: MatDialogRef<ImageViewerComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { images: string[]; selectedImage: string }
  ) {
    this.currentIndex = this.data.images.indexOf(this.data.selectedImage);
  }
  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 1024;
    this.images = this.data.images;
    const index = this.images.indexOf(this.data.selectedImage);
    this.currentIndex = index >= 0 ? index : 0;

    // Set the initial offset to show that image
    this.swipeOffset = -this.currentIndex * window.innerWidth;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 1024;
  }

  get currentImage(): string {
    return this.data.images[this.currentIndex];
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.data.images.length;
  }

  prevImage(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.data.images.length) %
      this.data.images.length;
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.isDragging = true;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isDragging) return;
    const touchX = event.touches[0].clientX;
    const delta = touchX - this.touchStartX;

    // Move proportionally with the finger
    this.swipeOffset = -this.currentIndex * window.innerWidth + delta;
  }

  onTouchEnd(): void {
    this.isDragging = false;

    const deltaX = this.swipeOffset + this.currentIndex * window.innerWidth;

    if (Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX > 0 && this.currentIndex > 0) {
        this.currentIndex--;
      } else if (
        deltaX < 0 &&
        this.currentIndex < this.data.images.length - 1
      ) {
        this.currentIndex++;
      }
    }

    // Snap into place
    this.swipeOffset = -this.currentIndex * window.innerWidth;
  }
}
