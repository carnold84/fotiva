export const createZip = async (images) => {
  return new Promise((resolve, reject) => {
    const zip = new JSZip();
    let count = 0;

    images.forEach((image) => {
      image.canvas.toBlob((val) => {
        zip.file(image.name, val);
        if (count === images.length - 1) {
          resolve(zip);
        }
        count++;
      });
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

    console.log(height, width);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let ext;
      let prop;
      let newHeight;
      let newWidth;

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
