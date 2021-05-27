class UIButton extends HTMLElement {
  style = `
    :host([disabled]) {
      pointer-events: none;
    }

    .ui-button {
      align-items: center;
      background-color: var(--color2);
      border: 1px solid var(--color2);
      border-radius: 3px;
      color: var(--text-color1);
      cursor: pointer;
      display: flex;
      font-size: 1rem;
      height: 34px;
      padding: 0 14px;
    }
    
    :host([disabled]) .ui-button {
      color: var(--text-color3);
    }
    
    .ui-button:focus, .ui-button:hover {
      background-color: var(--color3);
      border: 1px solid var(--color6);
      outline: none;
    }
    
    :host([primary]) .ui-button {
      background-color: var(--primary1);
      border: 1px solid var(--primary1);
    }
    
    :host([primary]) .ui-button:focus, :host([primary]) .ui-button:hover {
      background-color: var(--primary2);
      border: 1px solid var(--primary3);
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
