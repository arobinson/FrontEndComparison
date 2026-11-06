import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'aff-button',
  imports: [],
  templateUrl: './aff-button.html',
  // Styles are global (src/styles/aff-button.css): like React's Button.css, the
  // inner <button> must accept consumer classes (extraClass) styled by the consumer.
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

  /**
   * Extra class(es) appended to the inner button's class list
   */
  readonly extraClass = input<string>('');

  // #endregion

  // #region Computed Signals

  /**
   * Class list for the inner button: "aff-button variant-{v} size-{s}[ {extra}]"
   */
  protected readonly classes = computed(() => {
    const extra = this.extraClass();
    const base = `aff-button variant-${this.variant()} size-${this.size()}`;
    return extra ? `${base} ${extra}` : base;
  });

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
