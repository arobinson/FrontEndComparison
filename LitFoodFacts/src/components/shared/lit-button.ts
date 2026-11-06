import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lit-button')
export class LitButton extends LitElement {
  // Button.css (verbatim from ReactFoodFacts Button.css) followed by the site-specific rules that the
  // app applies through the extra class (verbatim from React's ProductList.css, ProductDetail.css,
  // TruncatedText.css and MultiSelect.css). In React these are global stylesheets loaded after
  // Button.css; here they live in the same shadow root as the inner <button>, in the same order, so
  // selectors, specificity and source order are identical.
  static styles = css`
    /* The app's global reset (styles.css) does not reach into shadow roots. */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* The host generates no box: the inner <button> lays out as a direct child of the parent,
       as in the other apps (e.g. .select-toggle's width: 100%). */
    :host {
      display: contents;
    }

    .aff-button {
      border: 1px solid var(--border-color, #e0e0e0);
      border-radius: var(--border-radius, 4px);
      background: var(--surface-color, #fff);
      color: var(--text-primary, #333);
      cursor: pointer;
      font-family: inherit;
      font-weight: var(--font-weight-medium, 500);
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      line-height: 1;
    }

    .aff-button:focus {
      outline: 2px solid var(--focus-color, #007bff);
      outline-offset: 2px;
    }

    .aff-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Variants */
    .variant-primary {
      background: var(--primary-color, #007bff);
      color: var(--primary-text, #fff);
      border-color: var(--primary-color, #007bff);
    }

    .variant-primary:hover:not(:disabled) {
      background: var(--primary-hover, #0056b3);
      border-color: var(--primary-hover, #0056b3);
    }

    .variant-secondary {
      background: var(--surface-color, #fff);
      color: var(--text-primary, #333);
      border-color: var(--border-color, #e0e0e0);
    }

    .variant-secondary:hover:not(:disabled) {
      background: var(--hover-color, #f8f9fa);
      border-color: var(--primary-color, #007bff);
    }

    .variant-tertiary {
      background: transparent;
      color: var(--primary-color, #007bff);
      border: none;
    }

    .variant-tertiary:hover:not(:disabled) {
      background: var(--hover-color, #f8f9fa);
    }

    /* Sizes */
    .size-sm {
      padding: var(--spacing-xs, 4px) var(--spacing-sm, 8px);
      font-size: var(--font-size-sm, 14px);
      min-height: 28px;
    }

    .size-md {
      padding: var(--spacing-sm, 8px) var(--spacing-md, 12px);
      font-size: var(--font-size-base, 16px);
      min-height: 36px;
    }

    .size-lg {
      padding: var(--spacing-md, 12px) var(--spacing-lg, 16px);
      font-size: var(--font-size-lg, 18px);
      min-height: 44px;
    }

    /* ProductList.css */
    .reset-button {
      padding: 8px 16px;
      background-color: var(--color-primary, #0066cc);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    .reset-button:hover {
      background-color: var(--color-primary-dark, #004499);
    }

    .reset-button:active {
      transform: translateY(1px);
    }

    /* ProductDetail.css */
    .back-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
    }

    .back-button:hover {
      background: #0056b3;
    }

    .nav-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background 0.2s;
    }

    .nav-button:hover:not(:disabled) {
      background: #0056b3;
    }

    .nav-button:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }

    /* TruncatedText.css */
    .toggle-button {
      background: none;
      border: none;
      color: var(--color-primary, #0066cc);
      cursor: pointer;
      font-size: 12px;
      padding: 2px 6px;
      text-decoration: underline;
      white-space: nowrap;
    }

    .toggle-button:hover {
      color: var(--color-primary-dark, #004499);
    }

    .toggle-button:focus {
      outline: 2px solid var(--color-primary, #0066cc);
      outline-offset: 2px;
    }

    /* MultiSelect.css */
    .select-toggle {
      width: 100%;
      padding: 4px 8px;
      border: 1px solid var(--color-border, #ddd);
      border-radius: 4px;
      background: white;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .select-toggle:hover {
      border-color: var(--color-primary, #0066cc);
    }
  `;

  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) size: 'sm' | 'md' | 'lg' = 'md';
  @property({ type: String }) variant: 'primary' | 'secondary' | 'tertiary' = 'secondary';
  /** Extra class appended to the inner <button>'s class list. */
  @property({ type: String, attribute: 'extra-class' }) extraClass = '';
  /**
   * Id of a popover this button opens and closes, like the native popovertarget. The inner <button>
   * is in this element's shadow root, so the id is resolved where this element lives and set as
   * the button's popoverTargetElement (an id reference cannot cross shadow roots).
   */
  @property({ type: String }) popovertarget?: string;

  private popoverTargetElement(): Element | null {
    return this.popovertarget ? (this.getRootNode() as Document | ShadowRoot).getElementById(this.popovertarget) : null;
  }

  private handleClick() {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('button-click'));
    }
  }

  render() {
    return html`<button class="aff-button variant-${this.variant} size-${this.size}${this.extraClass ? ` ${this.extraClass}` : ''}" type="button" ?disabled=${this.disabled} .popoverTargetElement=${this.popoverTargetElement()} @click=${this.handleClick}><slot></slot></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-button': LitButton;
  }
}
