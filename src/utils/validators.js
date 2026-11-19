import { MAX_FILE_BYTES } from './constants.js';

export const isClientCode = (v) => /^[A-Z0-9]{3,20}$/.test(String(v || '').trim().toUpperCase());
export const isOtp = (v) => /^\d{6}$/.test(String(v || ''));
/** NSDL: "IN" + 14 digits.  CDSL: 16 digits. */
export const isNsdlDpId = (v) => /^IN\d{14}$/i.test(String(v || '').trim());
export const isCdslDpId = (v) => /^\d{16}$/.test(String(v || '').trim());
export const isDpName = (v) => /^[A-Za-z0-9 .,&()'\-/]{2,150}$/.test(String(v || '').trim());

const typeOf = (file) => {
  const name = file?.name?.toLowerCase() || '';
  if (file?.type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (['image/png', 'image/jpeg', 'image/jpg'].includes(file?.type) || /\.(png|jpe?g)$/.test(name)) return 'image';
  return null;
};

/** Returns an error message, or '' if valid. */
export const checkSignatureFile = (file) => {
  if (!file) return 'Please upload your signature.';
  if (!typeOf(file)) return 'Only PNG, JPG, JPEG or PDF files are allowed.';
  if (file.size > MAX_FILE_BYTES) return 'File must be 5 MB or smaller.';
  return '';
};

export const checkCmrFile = (file) => {
  if (!file) return 'Please upload the CMR document (PDF).';
  if (typeOf(file) !== 'pdf') return 'CMR must be a PDF file.';
  if (file.size > MAX_FILE_BYTES) return 'File must be 5 MB or smaller.';
  return '';
};

export const isImageFile = (file) => typeOf(file) === 'image';

export const digitsOnly = (v, max) => String(v || '').replace(/\D/g, '').slice(0, max);
