class PresetItem extends HTMLElement {
  style = `
    :host {
      background-color: var(--color2);
      border: 1px solid var(--color4);
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      opacity: 0;
      overflow: hidden;
      transform: scale(0.7);
      transition: opacity 300ms ease, transform 300ms ease;
      width: 100%;
    }

    :host(.show) {
      opacity: 1;
      transform: scale(1);
    }

    :host .content {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    :host .toggle-btn {
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      flex-grow: 1;
      height: 100%;
      justify-content: space-between;
      padding: 12px 24px 12px 12px;
      overflow: hidden;
      text-decoration: none;
    }

    :host .toggle-btn:hover {
      background-color: var(--color3);
    }

    :host .toggle-icon {
      background-color: transparent;
      border: none;
      color: var(--text-color3);
      margin: 0 12px 0 0;
    }

    :host .toggle-btn:hover .toggle-icon {
      color: var(--text-color2);
    }

    :host .toggle-icon.is-active {
      transform: rotate(180deg);
    }

    :host .text {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
    }
    
    :host .title {
      color: var(--text-color2);
      font-size: 1rem;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host .toggle-btn:hover .title {
      color: var(--text-color1);
    }
    
    :host .meta {
      color: var(--text-color2);
      font-size: 0.9rem;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host .toggle-btn:hover .meta {
      color: var(--text-color1);
    }

    :host .apply-btn {
      background-color: var(--color3);
      border: none;
      color: var(--text-color2);
      cursor: pointer;
      padding: 0 20px;
    }

    :host .apply-btn:hover {
      background-color: var(--color4);
      color: var(--text-color1);
    }

    :host .apply-btn:disabled {
      background-color: var(--color3);
      color: var(--text-color3);
      pointer-events: none;
    }
    
    :host .sizes-list {
      display: none;
      flex-direction: column;
      gap: 4px;
      list-style: none;
      margin: 0;
      padding: 12px 12px 12px 44px;
    }
    
    :host .sizes-list.show {
      display: flex;
    }
    
    :host .sizes-list li {
      color: var(--text-color2);
    }
    
    :host .sizes-list li span {
      color: var(--text-color1);
    }
  `;
  template = `
    <div class="content">
      <button class="toggle-btn">
        <div class="toggle-icon">
          <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentcolor">
            <path d="M6 15l6-6 6 6" stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
        <div class="text">
          <h4 class="title"></h4>
          <p class="meta"></p>
        </div>
      </button>
      <button class="apply-btn">Apply</button>
    </div>
    <ul class="sizes-list"></ul>
  `;
  elTitle;
  internalPreset;
  timeoutId;

  static get observedAttributes() {
    return ['disabled'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);

    this.elToggleBtn = shadow.querySelector('.toggle-btn');
    this.elToggleIcon = shadow.querySelector('.toggle-icon');
    this.elTitle = shadow.querySelector('.title');
    this.elMeta = shadow.querySelector('.meta');
    this.elApplyBtn = shadow.querySelector('.apply-btn');
    this.elSizesList = shadow.querySelector('.sizes-list');

    this.elToggleBtn.addEventListener('click', this.onToggleClick);
    this.elApplyBtn.addEventListener('click', this.onApplyClick);
  }

  onToggleClick = () => {
    if (this.elSizesList.classList.contains('show')) {
      this.elSizesList.classList.remove('show');
      this.elToggleIcon.classList.remove('is-active');
    } else {
      this.elSizesList.classList.add('show');
      this.elToggleIcon.classList.add('is-active');
    }
  };

  onApplyClick = () => {
    const event = new CustomEvent('apply', {
      detail: {
        preset: this.internalPreset,
      },
    });
    this.dispatchEvent(event);
  };

  set preset(preset) {
    this.internalPreset = preset;
    this.elTitle.innerHTML = preset.name;
    const sizes = preset.sizes;

    this.elMeta.innerHTML =
      sizes.length === 1 ? '1 size' : `${sizes.length} sizes`;

    sizes.forEach((size, i) => {
      const elListItem = document.createElement('li');
      elListItem.innerHTML = `${i + 1}: ${
        size.width
          ? `<span>${size.width}</span> wide`
          : `<span>${size.height}</span> high`
      }`;
      this.elSizesList.appendChild(elListItem);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled') {
      if (newValue !== null) {
        this.elApplyBtn.setAttribute('disabled', newValue);
      } else {
        this.elApplyBtn.removeAttribute('disabled');
      }
    }
  }

  connectedCallback() {
    this.timeoutId = setTimeout(() => {
      this.classList.add('show');
    });
  }

  disconnectedCallback() {
    clearTimeout(timeoutId);
    this.elToggleBtn.removeEventListener('click', this.onToggleClick);
    this.elApplyBtn.removeEventListener('click', this.onApplyClick);
  }
}

customElements.define('preset-item', PresetItem);
