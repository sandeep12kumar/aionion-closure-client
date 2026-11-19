/** Crops + rotates an image (from react-easy-crop output) and returns a PNG File. */

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

const toRadians = (deg) => (deg * Math.PI) / 180;

const rotatedSize = (width, height, rotation) => {
  const r = toRadians(rotation);
  return {
    width: Math.abs(Math.cos(r) * width) + Math.abs(Math.sin(r) * height),
    height: Math.abs(Math.sin(r) * width) + Math.abs(Math.cos(r) * height),
  };
};

export const cropImageToFile = async (imageSrc, pixelCrop, rotation = 0, fileName = 'signature.png') => {
  const image = await loadImage(imageSrc);
  const { width: bw, height: bh } = rotatedSize(image.width, image.height, rotation);

  // draw the whole rotated image
  const rotatedCanvas = document.createElement('canvas');
  rotatedCanvas.width = bw;
  rotatedCanvas.height = bh;
  const rctx = rotatedCanvas.getContext('2d');
  rctx.fillStyle = '#ffffff';
  rctx.fillRect(0, 0, bw, bh);
  rctx.translate(bw / 2, bh / 2);
  rctx.rotate(toRadians(rotation));
  rctx.drawImage(image, -image.width / 2, -image.height / 2);

  // cut the crop area out of it
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(pixelCrop.width);
  canvas.height = Math.round(pixelCrop.height);
  canvas.getContext('2d').drawImage(
    rotatedCanvas,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height,
  );

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const base = fileName.replace(/\.[^.]+$/, '');
  return new File([blob], `${base}.png`, { type: 'image/png' });
};
