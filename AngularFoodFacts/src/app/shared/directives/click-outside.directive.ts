import {
  Directive,
  ElementRef,
  output,
  effect,
  inject,
  computed,
} from '@angular/core';
import { ClickOutsideService } from '../services/click-outside.service';

@Directive({
  selector: '[affClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective {
  readonly clickOutside = output<void>();
  readonly #elementRef = inject(ElementRef);
  readonly #clickOutsideService = inject(ClickOutsideService);

  readonly #clickedOutside = computed(() => {
    const target = this.#clickOutsideService.lastClickedElement();
    let result: boolean;
    if (!target) {
      result = false;
    } else {
      const clickedInside = this.#elementRef.nativeElement.contains(target);
      result = !clickedInside;
    }
    return result;
  });

  constructor() {
    effect(() => {
      if (this.#clickedOutside()) {
        this.clickOutside.emit();
      }
    });
  }
}
