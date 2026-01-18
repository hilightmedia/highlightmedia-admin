// // utils/cropImage.ts
// export const getCroppedImg = (imageSrc: string, crop: any, zoom?: number, rotation = 0): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const image = new Image();
//     image.src = imageSrc;
//     image.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d')!;

//       const scale = image.width / image.naturalWidth;
//       const cropX = crop.x * scale;
//       const cropY = crop.y * scale;
//       const width = crop.width * scale;
//       const height = crop.height * scale;

//       canvas.width = width;
//       canvas.height = height;

//       ctx.drawImage(image, cropX, cropY, width, height, 0, 0, width, height);
//       resolve(canvas.toDataURL('image/jpeg'));
//     };
//     image.onerror = reject;
//   });
// };
// utils/cropImage.ts
export const getCroppedImg = (
  imageSrc: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<{ url: string; blob: Blob }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous"; // Optional: avoids CORS issues
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return reject(new Error("Could not get canvas context"));
      }

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        const url = URL.createObjectURL(blob);
        resolve({ url, blob });
      }, "image/jpeg");
    };

    image.onerror = () => reject(new Error("Failed to load image"));
  });
};
