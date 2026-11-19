import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Accessible modal. `tone="amber"` gives the cream/yellow header used by the CMR popup.
 */
export default function Modal({ open, onClose, title, children, footer, tone = 'default', size = 'md', closeOnBackdrop = true }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' };
  const header = tone === 'amber' ? 'bg-amber-100 border-b border-amber-200' : 'border-b border-gray-100';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]" onClick={closeOnBackdrop ? onClose : undefined} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}
        className={`relative w-full ${widths[size]} animate-fade-up overflow-hidden rounded-xl bg-white shadow-2xl`}>
        {title && (
          <div className={`flex items-start justify-between gap-4 px-5 py-4 ${header}`}>
            <h2 className="text-lg font-semibold leading-snug text-gray-900 sm:text-xl">{title}</h2>
            {onClose && (
              <button type="button" onClick={onClose} className="-mr-1 rounded-md p-1 text-gray-500 hover:bg-black/5 hover:text-gray-800" aria-label="Close">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
            )}
          </div>
        )}
        <div className="px-5 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
