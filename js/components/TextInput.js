class TextInput extends HTMLElement {
  style = `
    :host {
      display: block;
      position: relative;
    }
    
    .text-input {
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }

    .text-input .text-input-label {
      color: var(--file-input__label-color, #555555);
      margin: 0 0 3px;
    }

    .text-input .text-input-input {
      align-items: center;
      background-color: var(--file-input__name-bg-color, #ffffff);
      border: 1px solid var(--file-input__name-border-color, #eeeeee);
      border-radius: 3px;
      color: var(--file-input__name-color, #222222);
      display: flex;
      flex-grow: 1;
      font-size: 1rem;
      height: 34px;
      line-height: 0.8rem;
      margin: 0;
      padding: 0 10px;
    }

    .text-input .text-input-input:disabled {
      pointer-events: none;
    }

    .text-input .text-input-input:hover {
      border: 1px solid var(--file-input__name-border-color--hover, #cccccc);
    }

    .text-input .text-input-input:focus {
      background-color: var(--file-input__btn-bg-color--focus, #eeeeee);
      border: 1px solid var(--file-input__btn-border-color--focus, #cccccc);
      color: var(--file-input__name-color--focus, #222222);
      outline: none;
    }
  `;
  template = `
    <label class="text-input">
      <span class="text-input-label"></span>
      <input class="text-input-input" type="text" />
    </label>
  `;
  elTextInput;
  elTextInputLabel;

  static get observedAttributes() {
    return ['default', 'disabled', 'label', 'name'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);

    this.elTextInput = shadow.querySelector('.text-input-input');
    this.elTextInputLabel = shadow.querySelector('.text-input-label');
  }

  get value() {
    return this.elTextInput.value;
  }

  set value(val) {
    this.elTextInput.value = val;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'default' && oldValue === null) {
      this.elTextInput.value = newValue;
    }

    if (name === 'label') {
      this.updateLabel(newValue);
    }

    if (name === 'name') {
      this.elTextInputLabel.setAttribute('for', name);
      this.elTextInput.setAttribute('id', name);
      this.elTextInput.setAttribute('name', name);
    }

    if (name === 'disabled') {
      if (newValue === 'true') {
        this.elTextInput.setAttribute('disabled', newValue);
      } else {
        this.elTextInput.removeAttribute('disabled');
      }
    }
  }

  updateLabel = (label) => {
    if (label) {
      this.elTextInputLabel.innerHTML = label;
    }
  };
}

customElements.define('text-input', TextInput);
