class FileInput extends HTMLElement {
  style = `
    .file-input {
      cursor: pointer;
      display: flex;
      flex-direction: column;
    }

    .file-input .file-input-label {
      color: var(--file-input__label-color, #555555);
      font-size: 0.9rem;
      margin: 0 0 5px 3px;
    }

    .file-input .file-input-inner {
      align-items: center;
      display: flex;
    }

    .file-input .file-input-btn {
      align-items: center;
      background-color: var(--file-input__btn-bg-color, #eeeeee);
      border: 1px solid var(--file-input__btn-border-color, #eeeeee);
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      color: var(--file-input__btn-color, #222222);
      cursor: pointer;
      display: flex;
      flex-shrink: 0;
      font-size: 1rem;
      height: 34px;
      padding: 0 14px;
    }

    .file-input .file-input-input:focus ~ .file-input-btn {
      background-color: var(--file-input__btn-bg-color--focus, #eeeeee);
      border: 1px solid var(--file-input__btn-border-color--focus, #cccccc);
      outline: none;
    }

    .file-input .file-input-input ~ .file-input-btn:hover {
      background-color: var(--file-input__btn-bg-color--hover, #dddddd);
      border: 1px solid var(--file-input__btn-border-color--hover, #cccccc);
    }

    .file-input .file-input-input {
      opacity: 0;
      position: absolute;
      width: 0;
    }

    .file-input-name {
      align-items: center;
      background-color: var(--file-input__name-bg-color, #ffffff);
      border: 1px solid var(--file-input__name-border-color, #eeeeee);
      border-right: none;
      border-bottom-left-radius: 3px;
      border-top-left-radius: 3px;
      color: var(--file-input__name-color, #222222);
      display: flex;
      flex-grow: 1;
      font-size: 1rem;
      height: 34px;
      line-height: 0.8rem;
      margin: 0;
      overflow: hidden;
      padding: 0 10px;
      white-space: nowrap;
    }

    .file-input .file-input-input:focus ~ .name {
      border: 1px solid var(--file-input__name-border-color--focus), #cccccc);
      outline: none;
    }
  `;
  template = `
    <label class="file-input">
      <span class="file-input-label"></span>
      <div class="file-input-inner">
        <input class="file-input-input" type="file" />
        <p class="file-input-name">No file selected</p>
        <div class="file-input-btn">Select Image</div>
      </div>
    </label>
  `;
  elFileInput;
  elFileInputLabel;
  elFileInputName;

  static get observedAttributes() {
    return ['label'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);

    this.elFileInput = shadow.querySelector('.file-input-input');
    this.elFileInput.addEventListener('change', this.onChange);
    this.elFileInputLabel = shadow.querySelector('.file-input-label');
    this.elFileInputName = shadow.querySelector('.file-input-name');
  }

  onChange = () => {
    const files = this.elFileInput.files;
    let file = null;

    if (files.length > 0) {
      file = files[0];
      this.elFileInputName.innerHTML = file.name;
    }

    const selectEvent = new CustomEvent('select', {
      detail: {
        file,
      },
    });
    this.dispatchEvent(selectEvent);
  };

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'label') {
      this.updateLabel(newValue);
    }
  }

  updateLabel = (label) => {
    if (label) {
      this.elFileInputLabel.innerHTML = label;
    }
  };
}

customElements.define('file-input', FileInput);
