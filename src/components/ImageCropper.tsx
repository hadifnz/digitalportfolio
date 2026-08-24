import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

// A helper function to extract the cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<File | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // set canvas size to match the bounding box
  canvas.width = image.width;
  canvas.height = image.height;

  ctx.translate(image.width / 2, image.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement('canvas');
  const croppedCtx = croppedCanvas.getContext('2d');

  if (!croppedCtx) {
    return null;
  }

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      if (file) {
        resolve(new File([file], "cropped.png", { type: "image/png" }));
      } else {
        resolve(null);
      }
    }, 'image/png');
  });
}

export default function ImageCropper({ 
  imageSrc, 
  onCropComplete, 
  onCancel 
}: { 
  imageSrc: string, 
  onCropComplete: (file: File) => void,
  onCancel: () => void 
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(3/4); // default to portrait
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteInternal = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels as any);
      if (croppedImageFile) {
        onCropComplete(croppedImageFile);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop image.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8">
      <div className="relative w-full max-w-3xl h-[60vh] bg-gray-900 rounded-xl overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={setZoom}
        />
      </div>
      
      <div className="mt-8 flex flex-col items-center space-y-6 w-full max-w-3xl">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/50 text-sm mb-2">Select Crop Shape:</span>
          <div className="flex space-x-2">
            <button 
              onClick={() => setAspect(1)} 
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${aspect === 1 ? 'bg-brand-light-blue text-brand-blue' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              Square (Logo)
            </button>
            <button 
              onClick={() => setAspect(3/4)} 
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${aspect === 3/4 ? 'bg-brand-light-blue text-brand-blue' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              Portrait (Hero)
            </button>
            <button 
              onClick={() => setAspect(16/9)} 
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${aspect === 16/9 ? 'bg-brand-light-blue text-brand-blue' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              Landscape (Background)
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 w-full px-8 max-w-md">
          <span className="text-white">Zoom:</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div className="flex space-x-4 pt-4 border-t border-white/10 w-full justify-center">
          <button 
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCrop}
            className="px-6 py-2 rounded-lg bg-brand-light-blue text-brand-blue font-bold tracking-widest hover:bg-white transition-colors"
          >
            CONFIRM CROP
          </button>
        </div>
      </div>
    </div>
  );
}
