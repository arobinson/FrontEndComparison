import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/layout/framework-header';
import './pages/product-list';
import './pages/product-detail';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

@customElement('lit-app')
export class LitApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100vh;
      overflow: hidden;
    }
  `;

  @state()
  private route: { page: 'list'; search: string } | { page: 'detail'; code: string } = { page: 'list', search: '' };

  private readonly onPopState = () => this.handleRoute();

  connectedCallback() {
    super.connectedCallback();
    this.handleRoute();
    // Browser back/forward (hand-rolled router)
    window.addEventListener('popstate', this.onPopState);
    // Product links in the table ask for client-side navigation
    this.addEventListener('navigate-to-detail', ((e: CustomEvent<string>) => {
      this.navigate(`/detail/${e.detail}`);
    }) as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this.onPopState);
  }

  private handleRoute() {
    const path = window.location.pathname;
    const relativePath = BASE ? path.replace(BASE, '') : path;
    // Anything that is not a detail URL shows the list
    this.route = relativePath.startsWith('/detail/')
      ? { page: 'detail', code: relativePath.replace('/detail/', '') }
      : { page: 'list', search: window.location.search };
  }

  navigate(path: string, { replace = false } = {}) {
    if (replace) {
      window.history.replaceState({}, '', BASE + path);
    } else {
      window.history.pushState({}, '', BASE + path);
    }
    this.handleRoute();
  }

  render() {
    return html`
      <framework-header></framework-header>
      ${this.route.page === 'list'
        ? // The list's own navigations (page, page size, filters) replace its history entry
          html`<product-list
            .search=${this.route.search}
            @navigate=${(e: CustomEvent<string>) => this.navigate(e.detail, { replace: true })}
          ></product-list>`
        : html`<product-detail
            .code=${this.route.code}
            @navigate=${(e: CustomEvent<string>) => this.navigate(e.detail)}
          ></product-detail>`
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-app': LitApp;
  }
}
