export const createZip = async (images, imageName = "image") => {
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    let count = 0;

    images.forEach((image) => {
      image.canvas.toBlob((val) => {
        zip.file(
          `${imageName}-${Math.round(image.height)}h-${Math.round(
            image.width
          )}w.${image.ext}`,
          val
        );
        if (count === images.length - 1) {
          resolve(zip);
        }
        count++;
      });
    });
  });
};

export const resizeImages = ({ file, sizes }) => {
  return new Promise((resolve, reject) => {
    const images = [];
    let count = 0;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      sizes.forEach(({ width }) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let ext;
        let prop;
        let newHeight;
        let newWidth;

        if (width) {
          prop = width / img.width;
          newHeight = img.height * prop;
          newWidth = width;
        }

        if (file.type === "image/jpeg") {
          ext = "jpg";
        } else if (file.type === "image/png") {
          ext = "png";
        }

        canvas.height = newHeight;
        canvas.width = newWidth;
        ctx.drawImage(img, 0, 0, width, newHeight);
        canvas.toBlob((val) => {
          images.push({
            canvas,
            ext,
            height: newHeight,
            src: canvas.toDataURL(),
            url: URL.createObjectURL(val),
            width: newWidth,
          });

          if (count === sizes.length - 1) {
            resolve(images);
          }
          count++;
        });
      });
    };
  });
};

export const resizeImage = ({ file, height, width }) => {
  return new Promise((resolve, reject) => {
    let image;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let ext;
      let prop;
      let newHeight;
      let newWidth;

      if (width) {
        prop = width / img.width;
        newHeight = img.height * prop;
        newWidth = width;
      }

      if (file.type === "image/jpeg") {
        ext = "jpg";
      } else if (file.type === "image/png") {
        ext = "png";
      }

      canvas.height = newHeight;
      canvas.width = newWidth;
      ctx.drawImage(img, 0, 0, width, newHeight);
      canvas.toBlob((val) => {
        image = {
          canvas,
          ext,
          height: newHeight,
          src: canvas.toDataURL(),
          url: URL.createObjectURL(val),
          width: newWidth,
        };

        resolve(image);
      });
    };
  });
};
