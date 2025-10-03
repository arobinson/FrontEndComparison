import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'aff-boolean-yesno',
  imports: [],
  templateUrl: './boolean-yesno.html',
  styleUrl: './boolean-yesno.css'
})
export class BooleanYesno {
  readonly value = input.required<boolean>();

  readonly displayText = computed(() => {
    return this.value() ? 'Yes' : 'No';
  });

  readonly cssClass = computed(() => {
    return this.value() ? 'yes' : 'no';
  });
}
