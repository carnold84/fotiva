class AddPresetModal extends HTMLElement {
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

    .label {
      color: var(--text-color2);
      display: block;
      margin: 0 0 10px;
    }

    .inputs {
      display: flex;
      justify-content: center;
      margin: 0 0 20px;
      width: 100%;
    }

    .inputs p {
      align-items: center;
      color: var(--text-color2);
      display: flex;
      flex-shrink: 0;
      margin: 16px 15px 0;
    }
  `;
  template = `
    <modal-dialog id="modal" title="Add Preset" width="auto">
      <div class="message" id="message"></div>
      <form id="add-preset-form">
        <div class="inputs">
          <text-input
            default="My preset"
            id="preset-name"
            label="Preset name"
            name="preset-name"
          >
          </text-input>
        </div>
        <modal-dialog-footer>
          <ui-button id="cancel-btn">Cancel</ui-button>
          <ui-button
            id="create-preset-btn"
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
    this.elAddBtn = shadow.querySelector('#create-preset-btn');
    this.elMessage = shadow.querySelector('#message');
    this.elNameInput = shadow.querySelector('#preset-name');
  }

  open = () => {
    this.elAddBtn.addEventListener('click', this.onAddBtnClick);
    this.elCancelBtn.addEventListener('click', this.onCloseBtnClick);

    this.elModal.open();
  };

  close = () => {
    this.elAddBtn.removeEventListener('click', this.onAddBtnClick);
    this.elCancelBtn.removeEventListener('click', this.onCloseBtnClick);

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

    let name = this.elNameInput.value;

    if (!name) {
      this.elMessage.innerHTML = 'Please give your preset a name.';
      this.elMessage.classList.add('show');
    } else {
      const addPresetEvent = new CustomEvent('preset-added', {
        detail: {
          name,
        },
      });
      this.dispatchEvent(addPresetEvent);
    }
  };
}

customElements.define('add-preset-modal', AddPresetModal);
