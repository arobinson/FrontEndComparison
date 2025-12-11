import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './components/shared/framework-header';
import './pages/product-list';
import './pages/product-detail';

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
  private route: { page: string; params?: Record<string, string> } = { page: 'list' };

  connectedCallback() {
    super.connectedCallback();
    this.handleRoute();
    window.addEventListener('popstate', () => this.handleRoute());
    // Listen for navigate-to-detail events from product links
    this.addEventListener('navigate-to-detail', ((e: CustomEvent) => {
      this.navigate(`/detail/${e.detail}`);
    }) as EventListener);
  }

  private handleRoute() {
    const path = window.location.pathname;
    const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
    const relativePath = base ? path.replace(base, '') : path;

    if (relativePath.startsWith('/detail/')) {
      const code = relativePath.replace('/detail/', '');
      this.route = { page: 'detail', params: { code } };
    } else if (relativePath === '/list' || relativePath === '/' || relativePath === '') {
      this.route = { page: 'list' };
    } else {
      this.route = { page: 'list' };
    }
  }

  navigate(path: string) {
    const base = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';
    window.history.pushState({}, '', base + path);
    this.handleRoute();
  }

  render() {
    return html`
      <framework-header></framework-header>
      ${this.route.page === 'list'
        ? html`<product-list @navigate=${(e: CustomEvent) => this.navigate(e.detail)}></product-list>`
        : html`<product-detail
            .code=${this.route.params?.code || ''}
            @navigate=${(e: CustomEvent) => this.navigate(e.detail)}
          ></product-detail>`
      }
    `;
  }
}
