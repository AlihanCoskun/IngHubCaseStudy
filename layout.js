import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './redux-provider.js';
import './localization.js';

class MyLayout extends LitElement {
  static properties = {
    currentLanguage: { type: String }
  };

  static styles = css`
  :host {
    display: block;
    height: 100vh;
  }
  
  header{
    background-color: #FFFFFF;
    color: black;
    padding: 0.5rem;
    flex-shrink: 0;
    display:flex;
    justify-content: space-between;
  }
  
  main {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    padding: 1em;
    overflow-y: auto;
    background-color: #f9f9f9;
    min-height: 0;
  }

  .add-employee-btn {
  color: #FE6C10;
  padding: 0.75rem 0.5rem;
  border: none;
  cursor: pointer;
  text-decoration: none;
 }

  .header-tools {
    display:flex;
    gap: 0.5rem;
    justify-content: space-evenly;
    align-items: center;
  }

  .header-item {
    display:flex;
    gap: 0.2rem;
    align-items: center;
  }

  .pointer {
      cursor: pointer
  }

`;


  constructor() {
    super();
    this.currentLanguage = 'en';
    this.unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.currentLanguage = window.localizationManager.getCurrentLanguage();
    this.unsubscribe = window.localizationManager.subscribe((language) => {
      this.currentLanguage = language;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('main');
    const router = new Router(outlet);
    router.setRoutes([
    { path: '/', component: 'employee-list' },
    { 
      path: '/user/new', 
      component: 'manage-employee',
      action: (context) => {
        const element = document.createElement('manage-employee');
        element.location = context.location;
        return element;
      }
    },
    { 
      path: '/user/:id', 
      component: 'manage-employee',
      action: (context) => {
        const element = document.createElement('manage-employee');
        element.location = context.location;
        return element;
      }
    },
    ]);

  }

  navigateToHome() {
   Router.go("/");
  }

  navigateToNew() {
   Router.go("/user/new");
  }

  toggleLanguage() {
    const newLanguage = window.localizationManager.toggleLanguage();
    this.currentLanguage = newLanguage;
  }

  render() {
    const flagIcon = this.currentLanguage === 'en' ? 'icons/turkish-flag.svg' : 'icons/uk-flag.svg';
    const flagAlt = this.currentLanguage === 'en' ? 'Turkish flag' : 'UK flag';
    
    return html`
      <redux-provider>
        <header>
          <img src="icons/ing-logo.svg" class="pointer" alt="company-logo" width="80px" height="64px" @click="${this.navigateToHome}">
          <div class="header-tools">
            <div class="header-item pointer" @click="${this.navigateToHome}">
              <img src="icons/users.svg" alt="employees" width="24px" height="24px">
              <span class="add-employee-btn">${window.localizationManager.translate('employees')}</span>
            </div>
            <div class="header-item pointer" @click="${this.navigateToNew}">
              <img src="icons/plus.svg" alt="add-icon" width="24px" height="24px">
              <span href="/user/new" class="add-employee-btn">${window.localizationManager.translate('addNew')}</span>
            </div>
            <div class="header-item pointer" @click="${this.toggleLanguage}">
              <img src="${flagIcon}" alt="${flagAlt}" width="32px" height="32px">
            </div>
          </div>
        </header>
        <main></main>
      </redux-provider>
    `;
  }
}

customElements.define('my-layout', MyLayout);
