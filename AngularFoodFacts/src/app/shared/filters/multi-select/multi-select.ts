import {
  Component,
  input,
  output,
  signal,
  effect,
  ElementRef,
  inject,
  computed,
} from '@angular/core';
import { ClickOutsideService } from '../../services/click-outside.service';

@Component({
  selector: 'aff-multi-select',
  imports: [],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.css',
})
export class MultiSelect {
  readonly options = input.required<string[]>();
  readonly placeholder = input<string>('Select...');
  readonly resetTrigger = input<number>(0);
  readonly valueChange = output<string[]>();

  readonly selectedValues = signal<Set<string>>(new Set());
  readonly isOpen = signal(false);

  readonly #elementRef = inject(ElementRef);
  readonly #clickOutsideService = inject(ClickOutsideService);
  #lastClickWhenOpened: EventTarget | null = null;

  readonly #clickedOutside = computed(() => {
    const target = this.#clickOutsideService.lastClickedElement();
    let result: boolean;
    if (!target || !this.isOpen()) {
      result = false;
    } else if (target === this.#lastClickWhenOpened) {
      // Ignore the click that opened the dropdown
      result = false;
    } else {
      const clickedInside = this.#elementRef.nativeElement.contains(target);
      result = !clickedInside;
    }
    return result;
  });

  constructor() {
    effect(() => {
      this.resetTrigger();
      this.clear();
    });

    effect(() => {
      if (this.#clickedOutside()) {
        this.isOpen.set(false);
      }
    });
  }

  clear() {
    this.selectedValues.set(new Set());
  }

  toggleDropdown() {
    const willBeOpen = !this.isOpen();
    if (willBeOpen) {
      this.#lastClickWhenOpened =
        this.#clickOutsideService.lastClickedElement();
    }
    this.isOpen.set(willBeOpen);
  }

  toggleOption(option: string) {
    this.selectedValues.update((current) => {
      const newSet = new Set(current);
      if (newSet.has(option)) {
        newSet.delete(option);
      } else {
        newSet.add(option);
      }
      return newSet;
    });
    this.valueChange.emit(Array.from(this.selectedValues()));
  }

  isSelected(option: string): boolean {
    return this.selectedValues().has(option);
  }

  getDisplayText(): string {
    const count = this.selectedValues().size;
    let result: string;
    if (count === 0) {
      result = this.placeholder();
    } else if (count === 1) {
      result = Array.from(this.selectedValues())[0];
    } else {
      result = `${count} selected`;
    }
    return result;
  }
}
