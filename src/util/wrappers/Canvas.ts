import Canvas from 'canvas';

export async function blur(image: string, blurSize = 4): Promise<Buffer> {
  const img = await Canvas.loadImage(image);
  const canvas = Canvas.createCanvas(img.height, img.width);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, 0, 0, canvas.width / blurSize, canvas.height / blurSize);

  ctx.imageSmoothingEnabled = true;

  ctx.drawImage(canvas, 0, 0, canvas.width / blurSize, canvas.height / blurSize, 0, 0, canvas.width + 5, canvas.height + 5);

  return canvas.toBuffer();
}

export async function invert(image: string): Promise<Buffer> {
  const img = await Canvas.loadImage(image);
  const canvas = Canvas.createCanvas(img.height, img.width);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255 - imgData.data[i];
    imgData.data[i + 1] = 255 - imgData.data[i + 1];
    imgData.data[i + 2] = 255 - imgData.data[i + 2];
    imgData.data[i + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);

  return canvas.toBuffer();
}

export async function pixel(image: string, pixelSize = 5): Promise<Buffer> {
  const img = await Canvas.loadImage(image);
  const canvas = Canvas.createCanvas(img.height, img.width);
  const ctx = canvas.getContext('2d');
  const pixel = pixelSize / 100;

  ctx.drawImage(img, 0, 0, canvas.width * pixel, canvas.height * pixel);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, canvas.width * pixel, canvas.height * pixel, 0, 0, canvas.width + 5, canvas.height + 5);

  return canvas.toBuffer();
}
