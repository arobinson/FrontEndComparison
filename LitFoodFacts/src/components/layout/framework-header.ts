import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FRAMEWORKS, getFrameworkUrl } from 'shared-types';

const CURRENT_FRAMEWORK = 'lit';
const CURRENT_FRAMEWORK_NAME = FRAMEWORKS.find((f) => f.id === CURRENT_FRAMEWORK)?.name;

@customElement('framework-header')
export class FrameworkHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .framework-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      background: #1a1a2e;
      border-bottom: 1px solid #333;
    }

    .current-framework {
      font-size: 1.25rem;
      font-weight: 600;
      color: #fff;
    }

    .framework-nav {
      display: flex;
      gap: 0.5rem;
    }

    .framework-link {
      padding: 0.375rem 0.75rem;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      color: #ccc;
      background: transparent;
      border: 1px solid #444;
      transition: all 0.2s ease;
    }

    .framework-link:hover {
      color: #fff;
      border-color: var(--framework-color);
      background: color-mix(in srgb, var(--framework-color) 20%, transparent);
    }

    .framework-link.active {
      color: #fff;
      background: var(--framework-color);
      border-color: var(--framework-color);
      cursor: default;
      pointer-events: none;
    }
  `;

  /** Header links, resolved once from the URL the app was opened at */
  private readonly links = FRAMEWORKS.map((framework) => ({
    ...framework,
    url: getFrameworkUrl(CURRENT_FRAMEWORK, framework.id, window.location.pathname, window.location.port),
  }));

  render() {
    return html`
      <header class="framework-header">
        <span class="current-framework">${CURRENT_FRAMEWORK_NAME}</span>
        <nav class="framework-nav">
          ${this.links.map(framework => html`
            <a
              href=${framework.url}
              class="framework-link ${framework.id === CURRENT_FRAMEWORK ? 'active' : ''}"
              style="--framework-color: ${framework.color}"
            >
              ${framework.name}
            </a>
          `)}
        </nav>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'framework-header': FrameworkHeader;
  }
}
