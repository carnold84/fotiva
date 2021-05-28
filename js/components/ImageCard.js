class ImageCard extends HTMLElement {
  style = `
    :host {
      overflow: hidden;
    }
    
    .image-card {
      background-color: var(--color2);
      border: 1px solid var(--color4);
      border-radius: 3px;
      display: block;
      margin: 0 0 40px;
      overflow: hidden;
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
  `;
  template = `
    <a class="image-card" target="_blank" rel="noopener noreferrer">
      <img class="img" crossorigin="anonymous" />
      <p class="name"></p>
      <p class="size"></p>
    </a>
  `;
  elImageCard;
  elImg;
  elText;
  img;

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);

    this.elImageCard = shadow.querySelector('.image-card');
    this.elImg = shadow.querySelector('.img');
    this.elName = shadow.querySelector('.name');
    this.elSize = shadow.querySelector('.size');

    this.img = new Image();
    this.img.crossOrigin = 'anonymous';
  }

  set image(image) {
    this.img.onload = () => {
      this.elImg.src = this.img.src;
      this.elSize.innerHTML = `${this.img.height} x ${this.img.width}`;
    };
    this.img.src = image.src;
    this.elImageCard.setAttribute('href', image.url);
    this.imageData = image;
  }

  get image() {
    return this.imageData;
  }

  set name(name) {
    this.elName.innerHTML = name;
    this.elName.setAttribute('title', name);
  }
}

customElements.define('image-card', ImageCard);
