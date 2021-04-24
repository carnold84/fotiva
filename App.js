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

    this.elFileInput = document.querySelector(".file-input input[type=file]");
    this.elFileInput.addEventListener("change", this.onInputChange);
    this.elFileInputName = document.querySelector(".file-input .name");

    this.elFileName = document.querySelector("#file-name");
  };

  setError = (message) => {
    this.elMessage.innerHTML = message;
  };

  onInputChange = async () => {
    console.log(this.elFileInput, this.elFileInput.files);
    if (this.elFileInput.files.length > 0) {
      // remove existing files from dom
      this.elImagePreview.innerHTML = "";

      const file = this.elFileInput.files[0];

      this.responsiveImages = await resizeImages({
        file,
        sizes: [{ width: 400 }, { width: 800 }, { width: 1200 }],
      });

      this.elFileInputName.innerHTML = file.name;
      this.elFileName.value =
        file.name.substr(0, file.name.lastIndexOf(".")) || file.name;

      this.responsiveImages.forEach((image) => {
        const elImage = this.elImageTemplate.content.cloneNode(true);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          elImage
            .querySelector(".preview-image")
            .setAttribute("href", image.url);
          elImage.querySelector(".img").src = img.src;
          elImage.querySelector(".text").innerHTML = `Width: ${img.width}`;
          this.elImagePreview.appendChild(elImage);
        };
        img.src = image.canvas.toDataURL();
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
