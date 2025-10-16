import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import './redux-provider.js';

class MyLayout extends LitElement {
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
  padding: 0.75rem 1.5rem;
  border: none;
  cursor: pointer;
  text-decoration: none;
 }
`;


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

  render() {
    return html`
      <redux-provider>
        <header>
          <p>My App Header</p>
           <a href="/user/new" class="add-employee-btn">Add New Employee</a>
        </header>
        <main></main>
      </redux-provider>
    `;
  }
}

customElements.define('my-layout', MyLayout);
