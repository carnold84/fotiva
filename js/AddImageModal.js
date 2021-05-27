class AddImageModal extends HTMLElement {
  static EVENTS = {
    IMAGE_ADDED: 'image-added',
  };

  style = ``;
  template = `
    <modal-dialog id="modal" title="Add Image">
      <div id="message"></div>
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
  }

  close = () => {
    this.elCancelBtn.removeEventListener('click', this.onCloseBtnClick);
    this.elAddBtn.removeEventListener('click', this.onAddBtnClick);

    this.elModal.close();

    this.elMessage.innerHTML = '';
  };

  onCloseBtnClick = (evt) => {
    evt.preventDefault();

    this.close();
  };

  open = () => {
    this.elCancelBtn.addEventListener('click', this.onCloseBtnClick);
    this.elAddBtn.addEventListener('click', this.onAddBtnClick);
    this.elModal.open();
  };

  onAddBtnClick = (evt) => {
    evt.preventDefault();

    let height = this.elModal.querySelector('[name=height]').value;
    let width = this.elModal.querySelector('[name=width]').value;

    console.log(height, width);

    if (isNaN(height) && isNaN(width)) {
      this.elMessage.innerHTML = 'One of height or width must be a number!';
    } else {
      const addImageEvent = new CustomEvent(this.EVENTS.IMAGE_ADDED, {
        detail: {
          height: height || undefined,
          width: width || undefined,
        },
      });
      this.dispatchEvent(addImageEvent);
    }
  };

  get EVENTS() {
    return AddImageModal.EVENTS;
  }
}

customElements.define('add-image-modal', AddImageModal);
