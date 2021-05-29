import { createZip, resizeImage, resizeImages } from './utils.js';
// import web components
import './AddImageModal.js';
import './components/FileInput.js';
import './components/ImageCard.js';
import './components/ModalDialog.js';
import './components/TextInput.js';
import './components/UIButton.js';

class App {
  state = {
    cards: [],
    responsiveImages: [],
    selectedFile: undefined,
  };

  init = () => {
    this.elAddImageModal = document.querySelector('#add-image-modal');

    this.elAddImageBtn = document.querySelector('#add-image-btn');
    this.elAddImageBtn.addEventListener('click', this.onAddImageBtnClick);

    this.elDownloadBtn = document.querySelector('#download-btn');
    this.elDownloadBtn.addEventListener('click', this.onDownloadBtnClick);

    this.elBody = document.querySelector('body');

    this.elImagePreview = document.querySelector('#preview-images');
    this.elImageTemplate = document.querySelector('#image-template');

    this.elMessage = document.querySelector('#message');

    this.elFileInput = document.querySelector('#file-input');
    this.elFileInput.addEventListener('select', this.onInputChange);

    this.elFileName = document.querySelector('#file-name');
    this.elFileName.addEventListener('change', this.onFileNameChange);
  };

  setError = (message) => {
    this.elMessage.innerHTML = message;
  };

  onInputChange = async (evt) => {
    const file = evt.detail.file;

    if (file) {
      this.state.selectedFile = file;
      const fileName = this.state.selectedFile.name;
      this.elFileName.value =
        fileName.substr(0, fileName.lastIndexOf('.')) || fileName;

      // enable adding a new size image as we have an image to size!
      this.elAddImageBtn.removeAttribute('disabled');

      if (this.state.responsiveImages.length > 0) {
        // remove existing files from dom
        this.elImagePreview.innerHTML = '';

        const sizes = this.state.responsiveImages.map(({ height, width }) => {
          return {
            height,
            width,
          };
        });

        this.state.responsiveImages = await resizeImages({
          file: this.state.selectedFile,
          sizes,
        });

        this.state.responsiveImages.forEach((image) => {
          image.name = this.createImageName(image);
          this.createImageCard({ image });
        });
      } else {
        this.elFileName.setAttribute('disabled', false);
      }
    }
  };

  createImageName = (image) => {
    return `${this.elFileName.value}-${Math.round(image.height)}x${Math.round(
      image.width
    )}.${image.ext}`;
  };

  onFileNameChange = (evt) => {
    this.state.cards.forEach((card) => {
      card.name = this.createImageName(card.image);
    });
    this.state.responsiveImages.forEach((image) => {
      image.name = this.createImageName(image);
    });
  };

  onDownloadBtnClick = async (evt) => {
    evt.preventDefault();

    if (this.state.responsiveImages) {
      const imageZip = await createZip(this.state.responsiveImages);

      let zipFile = await imageZip.generateAsync({ type: 'blob' });

      saveAs(zipFile, 'images.zip');
    } else {
      setError("There's no image!");
    }
  };

  onAddImageBtnClick = (evt) => {
    evt.preventDefault();

    this.openAddImageModal();
  };

  createImage = async ({ height, width }) => {
    const image = await resizeImage({
      file: this.state.selectedFile,
      height,
      width,
    });

    image.name = this.createImageName(image);

    this.state.responsiveImages.push(image);

    if (
      this.elDownloadBtn.hasAttribute('disabled') &&
      this.state.responsiveImages.length > 0
    ) {
      this.elDownloadBtn.removeAttribute('disabled');
    }

    this.createImageCard({ image });
  };

  onImageAdded = (evt) => {
    evt.preventDefault();

    this.createImage(evt.detail);

    this.elAddImageModal.close();
  };

  openAddImageModal = () => {
    this.elAddImageModal.addEventListener('image-added', this.onImageAdded);

    this.elAddImageModal.open();
  };

  createImageCard = ({ image }) => {
    const elImageCard = document.createElement('image-card');
    elImageCard.image = image;
    elImageCard.name = image.name;
    this.state.cards.push(elImageCard);
    this.elImagePreview.appendChild(elImageCard);
  };
}

export default App;
