import { createZip, resizeImage, resizeImages } from './utils.js';

class App {
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
        console.log(this.responsiveImages);
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

  onDownloadBtnClick = async (evt) => {
    evt.preventDefault();

    if (this.responsiveImages) {
      const imageZip = await createZip(
        this.responsiveImages,
        this.elFileName.value
      );

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
    console.log('onAddImageFormSubmit', evt);
    evt.preventDefault();

    this.createImages(evt.detail);

    this.elAddImageModal.close();
  };

  openAddImageModal = () => {
    console.log('openAddImageModal');

    this.elAddImageModal.addEventListener(
      AddImageModal.EVENTS.IMAGE_ADDED,
      this.onImageAdded
    );

    this.elAddImageModal.open();
  };

  createImageCard = ({ image }) => {
    const elImageCard = document.createElement('image-card');
    elImageCard.setAttribute('src', image.src);
    elImageCard.setAttribute('url', image.url);
    this.elImagePreview.appendChild(elImageCard);
  };
}

export default App;
