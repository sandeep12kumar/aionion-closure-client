import { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import { isImageFile } from '../../utils/validators.js';

/** Quick look at a locally selected image / PDF before uploading. */
export default function FilePreviewModal({ open, file, onClose, title = 'Preview' }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!open || !file) return undefined;
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [open, file]);

  return (
    <Modal open={open} onClose={onClose} title={title} size="lg">
      {url && (isImageFile(file) ? (
        <div className="flex max-h-[60vh] items-center justify-center rounded-lg bg-[repeating-conic-gradient(#f3f4f6_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] p-4">
          <img src={url} alt="Selected file preview" className="max-h-[55vh] max-w-full object-contain" />
        </div>
      ) : (
        <iframe title="PDF preview" src={url} className="h-[60vh] w-full rounded-lg border" />
      ))}
    </Modal>
  );
}
