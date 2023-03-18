import { createImage, createZip, resizeImage } from './utils.js';
// import web components
import './AddImageModal.js';
import './AddPresetModal.js';
import './components/FileInput.js';
import './components/ImageCard.js';
import './components/ModalDialog.js';
import './components/PresetItem.js';
import './components/TextInput.js';
import './components/UIButton.js';

class App {
  data = JSON.parse(localStorage.getItem('fotiva') ?? '{}');
  state = {
    presets: this.data.presets ?? [],
    images: [],
    selectedFile: undefined,
  };

  init = () => {
    this.elAddImageModal = document.querySelector('#add-image-modal');
    this.elAddPresetModal = document.querySelector('#add-preset-modal');

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

    this.elAddPresetBtn = document.querySelector('#add-preset-btn');
    this.elAddPresetBtn.addEventListener('click', this.onAddPresetBtnClick);

    this.elPresetsEmptyMessage = document.querySelector(
      '#presets-empty-message'
    );
    this.elPresetsList = document.querySelector('#presets-list');

    this.renderPresets();

    this.updateButtonState();
  };

  renderPresets = () => {
    this.elPresetsList.innerHTML = '';
    this.presetElements = [];

    if (this.state.presets?.length > 0) {
      for (const preset of this.state.presets) {
        const elListItem = document.createElement('li');
        const elPreset = document.createElement('preset-item');
        elPreset.preset = preset;
        elPreset.addEventListener('apply', this.onApplyPresetBtnClick);
        this.presetElements.push(elPreset);
        elListItem.appendChild(elPreset);
        this.elPresetsList.appendChild(elListItem);
      }
      this.elPresetsList.classList.add('show');
    } else {
      this.elPresetsEmptyMessage.classList.add('show');
    }
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

      if (this.state.images.length > 0) {
        // remove existing files from dom
        this.elImagePreview.innerHTML = '';

        for (const image of this.state.images) {
          const nextImage = await createImage({
            file: this.state.selectedFile,
            size: image.size,
          });
          nextImage.name = this.createImageName(nextImage);
          image.data = nextImage;
          image.el = this.createImageCard({ image: nextImage });
          this.elImagePreview.appendChild(image.el);
        }
      } else {
        this.elFileName.setAttribute('disabled', false);
      }

      if (this.state.selectedFile) {
        this.presetElements.forEach((elPreset) => {
          elPreset.removeAttribute('disabled');
        });
      } else {
        this.presetElements.forEach((elPreset) => {
          elPreset.setAttribute('disabled', true);
        });
      }
    }
  };

  createImageName = (image) => {
    return `${this.elFileName.value}-${Math.round(image.width)}x${Math.round(
      image.height
    )}.${image.ext}`;
  };

  onFileNameChange = (evt) => {
    this.state.images.forEach((image) => {
      const nextName = this.createImageName(image.data);
      image.el.name = nextName;
      image.data.name = nextName;
    });
  };

  onDownloadBtnClick = async (evt) => {
    evt.preventDefault();

    if (this.state.images) {
      const imagesData = this.state.images.map(({ data }) => {
        return data;
      });
      const imageZip = await createZip(imagesData);

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

  onAddPresetBtnClick = (evt) => {
    evt.preventDefault();

    this.openAddPresetModal();
  };

  onApplyPresetBtnClick = (evt) => {
    evt.preventDefault();

    evt.detail.preset.sizes.forEach(({ height, width }) => {
      this.createImage({ height, width });
    });

    console.log(evt);
  };

  createImage = async ({ height, width }) => {
    const image = await resizeImage({
      file: this.state.selectedFile,
      height,
      width,
    });

    image.name = this.createImageName(image);
    image.id = `image-${Date.now()}`;
    const elImageCard = this.createImageCard({
      image,
    });

    this.state.images.push({
      data: image,
      el: elImageCard,
      id: image.id,
      size: {
        height,
        width,
      },
    });

    this.elImagePreview.appendChild(elImageCard);
    this.updateButtonState();
  };

  updateButtonState = () => {
    if (this.state.images.length > 0) {
      this.elDownloadBtn.removeAttribute('disabled');
      this.elAddPresetBtn.removeAttribute('disabled');
    } else {
      this.elDownloadBtn.setAttribute('disabled', true);
      this.elAddPresetBtn.setAttribute('disabled', true);
    }
  };

  onImageAdded = (evt) => {
    evt.preventDefault();

    this.createImage(evt.detail);

    this.elAddImageModal.removeEventListener('image-added', this.onImageAdded);
    this.elAddImageModal.close();
  };

  onRemoveImage = (evt) => {
    evt.preventDefault();

    const imageCard = evt.target;
    imageCard.hide(() => {
      this.state.images = this.state.images.filter((image) => {
        return image.id !== imageCard.id;
      });

      this.updateButtonState();
    });
  };

  openAddImageModal = () => {
    this.elAddImageModal.addEventListener('image-added', this.onImageAdded);
    this.elAddImageModal.addEventListener('close', this.onAddImageModalClose);
    this.elAddImageModal.open();
  };

  openAddPresetModal = () => {
    this.elAddPresetModal.addEventListener('preset-added', this.onPresetAdded);
    this.elAddPresetModal.addEventListener('close', this.onAddPresetModalClose);
    this.elAddPresetModal.open();
  };

  onPresetAdded = (evt) => {
    evt.preventDefault();

    const nextPreset = {
      id: `preset-${Date.now()}`,
      name: evt.detail.name,
      sizes: this.state.images.map(({ size }) => {
        return size;
      }),
    };
    this.state.presets.push(nextPreset);
    localStorage.setItem(
      'fotiva',
      JSON.stringify({
        ...this.data,
        presets: this.state.presets,
      })
    );

    this.elAddPresetModal.removeEventListener(
      'preset-added',
      this.onImageAdded
    );
    this.elAddPresetModal.close();

    this.renderPresets();
  };

  createImageCard = ({ image }) => {
    const elImageCard = document.createElement('image-card');
    elImageCard.image = image;
    elImageCard.id = image.id;
    elImageCard.name = image.name;
    elImageCard.addEventListener('remove', this.onRemoveImage);
    elImageCard.show();

    return elImageCard;
  };
}

export default App;
