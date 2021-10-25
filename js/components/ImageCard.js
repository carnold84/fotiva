class ImageCard extends HTMLElement {
  style = `
    :host {
      background-color: var(--color2);
      border: 1px solid var(--color4);
      border-radius: 3px;
      display: block;
      opacity: 0;
      overflow: hidden;
      text-decoration: none;
      transform: scale(0.7);
      transition: opacity 300ms ease, transform 300ms ease;
    }
    
    :host(.show) {
      opacity: 1;
      transform: scale(1);
    }
    
    :host .link {
      display: block;
      text-decoration: none;
    }
    
    :host .img {
      margin: 0;
      width: 100%;
    }
    
    :host .name, :host .size {
      color: var(--text-color1);
      font-size: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    :host .name {
      color: var(--text-color2);
      font-size: 0.9rem;
      margin: 0 0 5px;
      padding: 0 10px 10px;
    }
    
    :host .size {
      color: var(--text-color1);
      font-size: 1.1rem;
      margin: 0;
      padding: 8px 10px 0;
    }

    :host .remove-btn {
      fill: #ffffff;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  `;
  template = `
      <a class="link" target="_blank" rel="noopener noreferrer">
        <img class="img" crossorigin="anonymous" />
        <p class="size"></p>
        <p class="name"></p>
      </a>
      <ui-button class="remove-btn">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      </ui-button>
  `;
  elImg;
  elLink;
  elRemoveBtn;
  elText;
  img;
  index;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);

    this.elImg = shadow.querySelector('.img');
    this.elLink = shadow.querySelector('.link');
    this.elName = shadow.querySelector('.name');
    this.elRemoveBtn = shadow.querySelector('.remove-btn');
    this.elSize = shadow.querySelector('.size');

    this.img = new Image();
    this.img.crossOrigin = 'anonymous';
  }

  connectedCallback() {
    this.elRemoveBtn.addEventListener('click', this.onRemove);
  }

  disconnectedCallback() {
    this.elRemoveBtn.removeEventListener('click', this.onRemove);
  }

  onRemove = () => {
    const removeEvent = new CustomEvent('remove');
    this.dispatchEvent(removeEvent);
  };

  show() {
    console.log('show');
    this.offsetWidth;
    this.classList.add('show');
    console.log(this.offsetWidth);
  }

  hide(callback) {
    const onHidden = () => {
      this.removeEventListener('transitionend', onHidden);
      this.remove();
      callback();
    };

    this.addEventListener('transitionend', onHidden);
    this.classList.remove('show');
  }

  set image(image) {
    this.img.onload = () => {
      this.elImg.src = this.img.src;
      this.elSize.innerHTML = `${this.img.height}h x ${this.img.width}w`;
    };
    this.img.src = image.src;
    this.elLink.setAttribute('href', image.url);
    this.imageData = image;
  }

  get image() {
    return this.imageData;
  }

  set index(index) {
    this.index = index;
  }

  set name(name) {
    this.elName.innerHTML = name;
    this.elName.setAttribute('title', name);
  }
}

customElements.define('image-card', ImageCard);
