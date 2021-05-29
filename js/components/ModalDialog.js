class ModalDialog extends HTMLElement {
  el;
  elBody;
  elCancelBtn;
  elTitle;

  style = `
    .modal-dialog {
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      height: 100%;
      justify-content: center;
      left: 0;
      opacity: 0;
      position: fixed;
      top: 0;
      transform: opacity;
      transition: opacity 500ms ease;
      width: 100%;
    }
    
    :host(.open) .modal-dialog {
      display: flex;
    }
    
    :host(.show) .modal-dialog {
      opacity: 1;
    }
    
    .modal-dialog .modal-container {
      background-color: var(--color1);
      border-radius: 3px;
      max-width: 400px;
      transform: scale(0.2);
      transition: transform 500ms ease;
      width: 100%;
    }
    
    :host(.show) .modal-container {
      transform: scale(1);
    }
    
    .modal-dialog .modal-header {
      padding: 25px 30px 0;
    }
    
    .modal-dialog .modal-title {
      color: var(--text-color1);
      font-size: 1.4rem;
    }
    
    .modal-dialog .modal-content {
      padding: 15px 30px 30px;
    }
  `;
  template = `
    <div class="modal-dialog">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title"></div>
        </div>
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  `;

  static get observedAttributes() {
    return ['max-width', 'width'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);

    this.elBody = document.querySelector('body');
    this.el = shadow.querySelector('.modal-dialog');
    this.elContainer = shadow.querySelector('.modal-container');
    this.elTitle = shadow.querySelector('.modal-title');

    this.elTitle.innerHTML = this.getAttribute('title');
  }

  close = () => {
    this.elBody.classList.remove('has-modal');
    this.el.addEventListener('transitionend', this.onCloseEnd);
    this.classList.remove('show');
  };

  onCloseEnd = () => {
    this.el.removeEventListener('transitionend', this.onCloseEnd);
    this.classList.remove('open');
  };

  open = () => {
    this.elBody.classList.add('has-modal');
    this.classList.add('open');

    setTimeout(() => {
      this.classList.add('show');
    }, 100);
  };

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'max-width') {
      this.elContainer.style.maxWidth = newValue;
    }

    if (name === 'width') {
      this.elContainer.style.width = newValue;
    }
  }
}

customElements.define('modal-dialog', ModalDialog);

class ModalDialogFooter extends HTMLElement {
  style = `
    .modal-dialog-footer {
      display: flex;
      justify-content: flex-end;
    }
    
    .modal-dialog-footer > * {
      margin: 0 0 0 10px;
    }
  `;
  template = `
    <div class="modal-dialog-footer">
      <slot></slot>
    </div>
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

customElements.define('modal-dialog-footer', ModalDialogFooter);
