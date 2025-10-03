import { Injectable, NgZone, signal, inject, DestroyRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClickOutsideService {
  readonly #ngZone = inject(NgZone);
  readonly lastClickedElement = signal<EventTarget | null>(null);
  readonly #boundHandleClick = this.#handleClick.bind(this);

  constructor() {
    this.#ngZone.runOutsideAngular(() => {
      document.addEventListener('click', this.#boundHandleClick, {
        capture: true,
      });
    });

    inject(DestroyRef).onDestroy(() => {
      document.removeEventListener('click', this.#boundHandleClick, {
        capture: true,
      });
    });
  }

  #handleClick(event: MouseEvent): void {
    this.#ngZone.run(() => {
      this.lastClickedElement.set(event.target);
    });
  }
}
