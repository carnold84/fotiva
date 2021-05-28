import { createZip, resizeImage, resizeImages } from './utils.js';
// import web components
import './AddImageModal.js';
import './components/FileInput.js';
import './components/ImageCard.js';
import './components/ModalDialog.js';
import './components/TextInput.js';
import './components/UIButton.js';

class App {
  cards = [];
  elAddImageBtn;
  elAddImageForm;
  elAddImageModal;
  elBody;
  elDownloadBtn;
  elImagePreview;
  elImageTemplate;
  elFileInput;
  elFileInputName;
  elFileName;
  elMessage;
  responsiveImages = [];
  selectedFile;

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
      this.selectedFile = file;

      // enable adding a new size image as we have an image to size!
      this.elAddImageBtn.removeAttribute('disabled');

      if (this.responsiveImages.length > 0) {
        // remove existing files from dom
        this.elImagePreview.innerHTML = '';

        const sizes = this.responsiveImages.map(({ height, width }) => {
          return {
            height,
            width,
          };
        });

        this.responsiveImages = await resizeImages({
          file: this.selectedFile,
          sizes,
        });

        this.responsiveImages.forEach((image) => {
          this.createImageCard({ image });
        });
      } else {
        const fileName = this.selectedFile.name;
        this.elFileName.value =
          fileName.substr(0, fileName.lastIndexOf('.')) || fileName;
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
    this.cards.forEach((card) => {
      card.name = this.createImageName(card.image);
    });
  };

  onDownloadBtnClick = async (evt) => {
    evt.preventDefault();

    if (this.responsiveImages) {
      const imageZip = await createZip(this.responsiveImages);

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

  createImages = async ({ height, width }) => {
    const image = await resizeImage({
      file: this.selectedFile,
      height,
      width,
    });

    image.name = `${this.elFileName.value}-${Math.round(
      image.height
    )}x${Math.round(image.width)}.${image.ext}`;

    this.responsiveImages.push(image);

    if (
      this.elDownloadBtn.hasAttribute('disabled') &&
      this.responsiveImages.length > 0
    ) {
      this.elDownloadBtn.removeAttribute('disabled');
    }

    this.createImageCard({ image });
  };

  onImageAdded = (evt) => {
    evt.preventDefault();

    this.createImages(evt.detail);

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
    this.cards.push(elImageCard);
    this.elImagePreview.appendChild(elImageCard);
  };
}

export default App;
