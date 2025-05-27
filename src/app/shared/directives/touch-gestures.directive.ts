import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appTouchGesture]',
  standalone: true
})
export class TouchGestureDirective {
  @Output() swipeleft = new EventEmitter<void>();
  @Output() swiperight = new EventEmitter<void>();

  private touchStartX = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    const deltaX = event.changedTouches[0].screenX - this.touchStartX;

    if (deltaX > 40) {
      this.swiperight.emit();
    } else if (deltaX < -40) {
      this.swipeleft.emit();
    }
  }
}
