import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import { cropImageToFile } from '../../utils/cropImage.js';

/** Crop & Rotate modal for the signature image. Returns a new PNG File via onDone. */
export default function SignatureCropper({ open, file, onClose, onDone }) {
  const [src, setSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [areaPixels, setAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !file) return undefined;
    const url = URL.createObjectURL(file);
    setSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    return () => URL.revokeObjectURL(url);
  }, [open, file]);

  const onCropComplete = useCallback((_area, pixels) => setAreaPixels(pixels), []);

  const apply = async () => {
    if (!areaPixels) return;
    setSaving(true);
    try {
      onDone(await cropImageToFile(src, areaPixels, rotation, file.name));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Crop & Rotate Signature"
      size="lg"
      closeOnBackdrop={false}
      footer={(
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={apply} loading={saving}>Apply</Button>
        </>
      )}
    >
      <div className="relative h-72 w-full overflow-hidden rounded-lg bg-gray-800 sm:h-80">
        {src && (
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={3 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            restrictPosition={false}
            minZoom={0.5}
          />
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          Zoom
          <input type="range" min={0.5} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-2 w-full accent-brand-blue" />
        </label>
        <div>
          <span className="block text-sm font-medium text-gray-700">Rotate ({rotation}&deg;)</span>
          <div className="mt-1.5 flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setRotation((r) => (r - 90 + 360) % 360)} aria-label="Rotate left">-90&deg;</Button>
            <input type="range" min={0} max={359} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="w-full accent-brand-blue" />
            <Button size="sm" variant="outline" onClick={() => setRotation((r) => (r + 90) % 360)} aria-label="Rotate right">+90&deg;</Button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">Drag to position your signature inside the frame. Keep only the signature, with a little white space around it.</p>
    </Modal>
  );
}
