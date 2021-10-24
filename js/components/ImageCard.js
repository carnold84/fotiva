class ImageCard extends HTMLElement {
  style = `
    :host {
      overflow: hidden;
      position: relative;
    }
    
    .image-card {
      background-color: var(--color2);
      border: 1px solid var(--color4);
      border-radius: 3px;
      display: block;
      overflow: hidden;
      text-decoration: none;
    }
    
    .image-card .link {
      text-decoration: none;
    }
    
    .image-card .img {
      margin: 0;
      width: 100%;
    }
    
    .image-card .name, .image-card .size {
      color: var(--text-color1);
      font-size: 1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .image-card .name {
      color: var(--text-color1);
      font-size: 1rem;
      margin: 0 0 5px;
      padding: 8px 10px 0;
    }
    
    .image-card .size {
      color: var(--text-color2);
      font-size: 0.9rem;
      margin: 0;
      padding: 0 10px 10px;
    }

    .remove-btn {
      fill: #ffffff;
      position: absolute;
      right: 10px;
      top: 10px;
    }
  `;
  template = `
    <div class="image-card">
      <a class="link" target="_blank" rel="noopener noreferrer">
        <img class="img" crossorigin="anonymous" />
        <p class="name"></p>
        <p class="size"></p>
      </a>
      <ui-button class="remove-btn">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      </ui-button>
    </div>
  `;
  elImageCard;
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

    this.elImageCard = shadow.querySelector('.image-card');
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
    const removeEvent = new CustomEvent('remove', {
      detail: {
        imageCard: this,
      },
    });
    this.dispatchEvent(removeEvent);
  };

  set image(image) {
    this.img.onload = () => {
      this.elImg.src = this.img.src;
      this.elSize.innerHTML = `${this.img.height} x ${this.img.width}`;
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
