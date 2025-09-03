import {
  Component,
  input,
  output,
  contentChildren,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'aff-button',
  imports: [],
  templateUrl: './aff-button.html',
  styleUrl: './aff-button.css',
})
export class AffButton {
  // #region Input Signals

  /**
   * Button type (button, submit, reset)
   */
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  /**
   * Whether the button is disabled
   */
  readonly disabled = input<boolean>(false);

  /**
   * Button variant for different styling
   */
  readonly variant = input<'primary' | 'secondary' | 'tertiary'>('secondary');

  /**
   * Button size
   */
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  // #endregion

  // #region Output Signals

  /**
   * Click event emitter
   */
  readonly clicked = output<MouseEvent>();

  // #endregion

  // #region Event Handlers

  /**
   * Handle button click events
   * @param event The mouse click event
   */
  onButtonClick(event: MouseEvent) {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }

  // #endregion
}