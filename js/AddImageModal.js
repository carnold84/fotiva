class AddImageModal extends HTMLElement {
  style = `
    .message {
      background-color: #6d410c;
      border: 1px solid #845011;
      color: #d4c3ae;
      display: none;
      margin: 0 0 20px;
      padding: 10px 14px;
    }

    .message.show {
      display: block;
    }
  `;
  template = `
    <modal-dialog id="modal" title="Add Image">
      <div class="message" id="message"></div>
      <form id="add-image-form">
        <text-input
          default="auto"
          id="image-height"
          label="Height"
          name="height"
          style="margin: 0 0 20px"
        >
        </text-input>
        <text-input
          default="600"
          id="image-width"
          label="Width"
          name="width"
          style="margin: 0 0 20px"
        >
        </text-input>
        <modal-dialog-footer>
          <ui-button id="cancel-btn">Cancel</ui-button>
          <ui-button
            id="create-image-btn"
            primary
            style="margin: 0 0 0 10px"
          >
            Create
          </ui-button>
        </modal-dialog-footer>
      </form>
    </modal-dialog>
  `;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);

    this.elModal = shadow.querySelector('#modal');
    this.elCancelBtn = shadow.querySelector('#cancel-btn');
    this.elAddBtn = shadow.querySelector('#create-image-btn');
    this.elMessage = shadow.querySelector('#message');
    this.elHeightInput = shadow.querySelector('[name=height]');
    this.elWidthInput = shadow.querySelector('[name=width]');
  }

  onHeightInputBlur = (evt) => {
    if (this.elHeightInput.value === '') {
      this.elHeightInput.value = 'auto';
    }
  };

  onWidthInputBlur = (evt) => {
    if (this.elWidthInput.value === '') {
      this.elWidthInput.value = 'auto';
    }
  };

  open = () => {
    this.elAddBtn.addEventListener('click', this.onAddBtnClick);
    this.elCancelBtn.addEventListener('click', this.onCloseBtnClick);
    this.elHeightInput.addEventListener('blur', this.onHeightInputBlur);
    this.elWidthInput.addEventListener('blur', this.onWidthInputBlur);

    this.elModal.open();
  };

  close = () => {
    this.elAddBtn.removeEventListener('click', this.onAddBtnClick);
    this.elCancelBtn.removeEventListener('click', this.onCloseBtnClick);
    this.elHeightInput.removeEventListener('blur', this.onHeightInputBlur);
    this.elWidthInput.removeEventListener('blur', this.onWidthInputBlur);

    this.elModal.close();

    this.elMessage.innerHTML = '';
    this.elMessage.classList.remove('show');
  };

  onCloseBtnClick = (evt) => {
    evt.preventDefault();

    this.close();
  };

  onAddBtnClick = (evt) => {
    evt.preventDefault();

    let height = this.elHeightInput.value;
    let width = this.elWidthInput.value;

    if (isNaN(height) && isNaN(width)) {
      this.elMessage.innerHTML = 'One of height or width must be a number!';
      this.elMessage.classList.add('show');
    } else {
      const addImageEvent = new CustomEvent('image-added', {
        detail: {
          height: height || undefined,
          width: width || undefined,
        },
      });
      this.dispatchEvent(addImageEvent);
    }
  };
}

customElements.define('add-image-modal', AddImageModal);
