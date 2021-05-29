export const createZip = async (images) => {
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    let count = 0;

    images.forEach((image) => {
      zip.file(image.name, image.blob);

      if (count === images.length - 1) {
        resolve(zip);
      }
      count++;
    });
  });
};

export const resizeImages = async ({ file, sizes }) => {
  return new Promise((resolve, reject) => {
    const images = [];
    let count = 0;

    const createImage = async ({ height, width }) => {
      const image = await resizeImage({ file, height, width });
      images.push(image);

      if (count === sizes.length - 1) {
        resolve(images);
      }
      count++;
    };

    sizes.forEach(({ height, width }) => {
      createImage({ height, width });
    });
  });
};

export const resizeImage = ({ file, height, width }) => {
  return new Promise((resolve, reject) => {
    let image;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let ext;
      let prop;
      const originalHeight = height;
      const originalWidth = width;
      let newHeight = originalHeight;
      let newWidth = originalWidth;

      if (height && width === undefined) {
        prop = height / img.height;
        newHeight = height;
        newWidth = img.width * prop;
      } else if (width && height === undefined) {
        prop = width / img.width;
        newHeight = img.height * prop;
        newWidth = width;
      }

      if (file.type === 'image/jpeg') {
        ext = 'jpg';
      } else if (file.type === 'image/png') {
        ext = 'png';
      }

      canvas.height = newHeight;
      canvas.width = newWidth;
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (val) => {
          image = {
            blob: val,
            ext,
            height: newHeight,
            originalHeight,
            originalWidth,
            src: canvas.toDataURL(),
            url: URL.createObjectURL(val),
            width: newWidth,
          };

          canvas = undefined;
          ctx = undefined;

          resolve(image);
        },
        file.type,
        0.8
      );
    };
  });
};
