class UIButton extends HTMLElement {
  style = `
    :host {
      pointer-events: all;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    .ui-button {
      align-items: center;
      background-color: var(--color4);
      border: 1px solid var(--color4);
      border-radius: 3px;
      color: var(--text-color1);
      fill: var(--text-color1);
      cursor: pointer;
      display: flex;
      font-size: 1rem;
      justify-content: center;
      padding: 8px 14px;
      width: 100%;
    }
    
    :host([disabled]) .ui-button {
      color: var(--text-color3);
      fill: var(--text-color3);
    }
    
    .ui-button:focus, .ui-button:hover {
      background-color: var(--primary1);
      border: 1px solid var(--primary2);
      outline: none;
    }
    
    :host([primary]) .ui-button {
      background-color: var(--primary1);
      border: 1px solid var(--primary1);
    }
    
    :host([primary]) .ui-button:focus, :host([primary]) .ui-button:hover {
      background-color: var(--primary2);
      border: 1px solid var(--primary2);
    }
    
    :host([disabled][primary]) .ui-button {
      color: var(--text-color1);
      fill: var(--text-color1);
      opacity: 0.5;
    }
  `;
  template = `
    <button class="ui-button">
      <slot></slot>
    </button>
  `;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);
  }
}

customElements.define('ui-button', UIButton);
