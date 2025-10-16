import { LitElement, html, css } from 'lit';
import { store } from './store.js';

class ReduxProvider extends LitElement {
  static properties = {
    store: { type: Object }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.store = store;
  }

  connectedCallback() {
    super.connectedCallback();
    // Make store available globally
    window.__REDUX_STORE__ = this.store;
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('redux-provider', ReduxProvider);

