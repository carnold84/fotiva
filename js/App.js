import { createZip, resizeImages } from "./utils.js";

class App {
  elDownloadBtn;
  elImagePreview;
  elImageTemplate;
  elFileInput;
  elFileInputName;
  elFileName;
  elMessage;
  responsiveImages;

  init = () => {
    this.elDownloadBtn = document.querySelector("#download-btn");
    this.elDownloadBtn.addEventListener("click", this.onDownload);

    this.elImagePreview = document.querySelector(".preview-images");
    this.elImageTemplate = document.querySelector("#image-template");

    this.elMessage = document.querySelector("#message");

    this.elFileInput = document.querySelector("#file-input");
    this.elFileInput.addEventListener("select", this.onInputChange);

    this.elFileName = document.querySelector("#file-name");
  };

  setError = (message) => {
    this.elMessage.innerHTML = message;
  };

  onInputChange = async (evt) => {
    const file = evt.detail.file;

    if (file) {
      // remove existing files from dom
      this.elImagePreview.innerHTML = "";

      this.responsiveImages = await resizeImages({
        file,
        sizes: [{ width: 400 }, { width: 800 }, { width: 1200 }],
      });

      this.elFileName.value =
        file.name.substr(0, file.name.lastIndexOf(".")) || file.name;

      this.responsiveImages.forEach((image) => {
        const elImageCard = document.createElement("image-card");
        elImageCard.setAttribute("src", image.src);
        elImageCard.setAttribute("url", image.url);
        this.elImagePreview.appendChild(elImageCard);
      });
    }
  };

  onDownload = async (evt) => {
    evt.preventDefault();

    if (this.responsiveImages) {
      const imageZip = await createZip(
        this.responsiveImages,
        this.elFileName.value
      );

      let zipFile = await imageZip.generateAsync({ type: "blob" });

      saveAs(zipFile, "images.zip");
    } else {
      setError("There's no image!");
    }
  };
}

export default App;
