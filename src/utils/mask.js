export const maskPan = (pan) => {
  const v = String(pan || '').toUpperCase();
  return v.length === 10 ? `${v.slice(0, 5)}****${v.slice(-1)}` : v || '-';
};

export const formatBytes = (bytes) => {
  if (!bytes) return '0 KB';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
