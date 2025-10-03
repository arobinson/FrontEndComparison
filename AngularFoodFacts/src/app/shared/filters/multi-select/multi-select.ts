import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'aff-multi-select',
  imports: [],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.css'
})
export class MultiSelect {
  readonly options = input.required<string[]>();
  readonly placeholder = input<string>('Select...');
  readonly valueChange = output<string[]>();

  readonly selectedValues = signal<Set<string>>(new Set());
  readonly isOpen = signal(false);

  toggleDropdown() {
    this.isOpen.update(val => !val);
  }

  toggleOption(option: string) {
    this.selectedValues.update(current => {
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
