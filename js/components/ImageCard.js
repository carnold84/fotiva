class ImageCard extends HTMLElement {
  style = `
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
    
    .image-card .text {
      color: var(--text-color1);
      font-size: 1rem;
      margin: 0;
      padding: 8px 10px 10px;
    }
  `;
  template = `
    <a class="image-card" target="_blank" rel="noopener noreferrer">
      <img class="img" crossorigin="anonymous" />
      <p class="text"></p>
    </a>
  `;
  elImageCard;
  elImg;
  elText;
  img;

  static get observedAttributes() {
    return ["src", "url"];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.innerHTML = this.style;
    shadow.innerHTML = this.template;
    shadow.appendChild(style);

    this.elImageCard = shadow.querySelector(".image-card");
    this.elImg = shadow.querySelector(".img");
    this.elText = shadow.querySelector(".text");

    this.img = new Image();
    this.img.crossOrigin = "anonymous";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") {
      this.updateImg(newValue);
    }

    if (name === "url") {
      this.updateUrl(newValue);
    }
  }

  updateImg = (src) => {
    this.img.onload = () => {
      this.elImg.src = this.img.src;
      this.elText.innerHTML = `Width: ${this.img.width}`;
    };
    this.img.src = src;
  };

  updateUrl = (url) => {
    this.elImageCard.setAttribute("href", url);
  };
}

customElements.define("image-card", ImageCard);
