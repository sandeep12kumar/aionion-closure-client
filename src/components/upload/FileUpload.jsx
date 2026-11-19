import { useEffect, useId, useRef, useState } from 'react';
import { formatBytes } from '../../utils/mask.js';
import { isImageFile } from '../../utils/validators.js';
import { CheckIcon, FileIcon, UploadIcon } from '../common/Icons.jsx';

/**
 * Drag & drop file picker. Empty -> dashed drop zone; selected -> file card
 * (image thumbnail or PDF icon, name, size) with extra `actions` (preview, crop...).
 */
export default function FileUpload({
  label, required, accept, formats, file, existingName, onSelect, error, hint, actions, className = '',
}) {
  const id = useId();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [thumb, setThumb] = useState('');

  useEffect(() => {
    if (!file || !isImageFile(file)) {
      setThumb('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setThumb(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const open = () => inputRef.current?.click();
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onSelect(dropped);
  };

  const hasFile = Boolean(file || existingName);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}

      {!hasFile ? (
        <button
          type="button"
          onClick={open}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-7 text-center transition
            ${dragging ? 'border-brand-blue bg-brand-mist' : error ? 'border-red-400 bg-red-50/40' : 'border-slate-300 bg-slate-50/60 hover:border-brand-blue/60 hover:bg-brand-mist/50'}`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-blue shadow-sm ring-1 ring-brand-blue/10">
            <UploadIcon className="h-6 w-6" />
          </span>
          <span className="text-sm font-semibold text-slate-800">
            Drag &amp; drop or <span className="text-brand-blue underline underline-offset-2">browse</span>
          </span>
          {formats && <span className="text-xs text-slate-500">{formats}</span>}
        </button>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-3 ${error ? 'border-red-400' : 'border-slate-200'}`}
        >
          <div className="flex h-14 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[repeating-conic-gradient(#f1f5f9_0%_25%,#fff_0%_50%)] bg-[length:12px_12px] ring-1 ring-slate-200">
            {thumb ? <img src={thumb} alt="" className="max-h-full max-w-full object-contain" /> : <FileIcon className="h-7 w-7 text-brand-coral" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900" title={file?.name || existingName}>{file?.name || existingName}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-600">
              <CheckIcon className="h-3.5 w-3.5" />
              {file ? `Ready to upload · ${formatBytes(file.size)}` : 'Uploaded earlier'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button type="button" onClick={open} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-blue hover:bg-brand-mist">
              Change
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const picked = e.target.files?.[0];
          if (picked) onSelect(picked);
          e.target.value = '';
        }}
      />
      {error ? <p className="field-error">{error}</p> : hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}
