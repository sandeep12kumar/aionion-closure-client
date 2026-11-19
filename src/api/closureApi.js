import axios from 'axios';

export const SESSION_EXPIRED_EVENT = 'acr:session-expired';

const http = axios.create({
  baseURL: '/api/closure',
  withCredentials: true,
  timeout: 60_000,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const url = error.config?.url || '';
    if (status === 401 && code === 'SESSION_EXPIRED' && !url.includes('/session')) {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);

/** Human-readable message from any API error. */
export const errorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!error?.response) return 'Unable to reach the server. Please check your connection.';
  return error.response.data?.message || fallback;
};

export const errorCode = (error) => error?.response?.data?.code;

const data = (promise) => promise.then((res) => res.data);

/** Content type for the S3 upload - from the browser, or the extension when the browser gives none. */
const EXT_TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', pdf: 'application/pdf' };
const contentTypeOf = (file) => file.type || EXT_TYPES[file.name.split('.').pop()?.toLowerCase()] || 'application/octet-stream';

export const closureApi = {
  meta: () => data(http.get('/meta')),

  // Step 1
  startRequest: (payload) => data(http.post('/request', payload)),
  resendOtp: (clientCode) => data(http.post('/resend-otp', { clientCode })),
  verifyOtp: (payload) => data(http.post('/verify-otp', payload)),

  // Session
  session: () => data(http.get('/session')),
  logout: () => data(http.post('/logout')),

  // Step 2
  clientInfo: () => data(http.get('/client-info')),
  setAccountType: (closureType) => data(http.post('/account-type', { closureType })),

  // Step 3 - each file goes browser -> S3 (presigned POST), then the step is saved with the S3 keys
  uploadDocument: async (kind, file, onProgress) => {
    const { data: form } = await data(http.post('/documents/upload-url', { kind, contentType: contentTypeOf(file) }));
    const body = new FormData();
    Object.entries(form.fields).forEach(([k, v]) => body.append(k, v));
    body.append('file', file); // must be the last field
    try {
      await axios.post(form.url, body, { timeout: 120_000, onUploadProgress: onProgress });
    } catch (err) {
      throw Object.assign(err, {
        response: { status: 400, data: { code: 'UPLOAD_FAILED', message: 'File upload failed. Please check your connection and try again.' } },
      });
    }
    return form.key;
  },
  saveDocuments: (payload) => data(http.post('/documents', payload)),

  // Step 4 - closure form (short-lived S3 link) + Setu Aadhaar eSign
  formPdfUrl: () => data(http.get('/form-pdf')).then((res) => res.data.url),
  startSetuEsign: (location) => data(http.post('/esign/setu/start', location || {})),
  completeSetuEsign: () => data(http.post('/esign/setu/complete')),
};
