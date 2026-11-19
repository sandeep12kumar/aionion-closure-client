import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { closureApi, errorCode, errorMessage } from '../api/closureApi.js';
import { useClosure } from '../context/ClosureContext.jsx';
import Button from '../components/common/Button.jsx';
import Checkbox from '../components/common/Checkbox.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import {
  ArrowLeftIcon, ArrowRightIcon, CropIcon, EyeIcon, PenIcon, SwapIcon,
} from '../components/common/Icons.jsx';
import FileUpload from '../components/upload/FileUpload.jsx';
import SignatureCropper from '../components/upload/SignatureCropper.jsx';
import FilePreviewModal from '../components/upload/FilePreviewModal.jsx';
import CmrInfoModal from '../components/closure/CmrInfoModal.jsx';
import DepositoryForm from '../components/closure/DepositoryForm.jsx';
import { STEP_PATHS } from '../utils/constants.js';
import {
  checkCmrFile, checkSignatureFile, isCdslDpId, isDpName, isImageFile, isNsdlDpId,
} from '../utils/validators.js';

const SERVER_FIELD_MAP = {
  SIGNATURE_REQUIRED: 'signature',
  INVALID_SIGNATURE_PDF: 'signature',
  CMR_REQUIRED: 'cmrFile',
  INVALID_CMR: 'cmrFile',
  INVALID_UPLOAD: 'signature',
  CMR_PASSWORD_REQUIRED: 'cmrPassword',
  CMR_PASSWORD_INCORRECT: 'cmrPassword',
  SAME_ACCOUNT: 'depository',
};

const initialTransfer = (target) => ({
  depository: target?.depository || '',
  cdslDpId: target?.depository === 'CDSL' ? target.dpId : '',
  nsdlDpId: target?.depository === 'NSDL' ? target.dpId : 'IN',
  dpName: target?.dpName || '',
  cmrFile: null,
  cmrPassword: '',
});

/** Step 3 of 4 - Signature upload; optional transfer details + CMR. */
export default function Step3Documents() {
  const navigate = useNavigate();
  const { session, setSession } = useClosure();

  const [showCmrInfo, setShowCmrInfo] = useState(true);
  const [signature, setSignature] = useState(null);
  const [transfer, setTransfer] = useState(Boolean(session?.transferSecurities));
  const [details, setDetails] = useState(() => initialTransfer(session?.target));
  const [errors, setErrors] = useState({});
  const [cropOpen, setCropOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const existingSignature = session?.hasSignature ? 'Signature already uploaded' : '';
  const existingCmr = session?.hasCmr ? 'CMR already uploaded' : '';

  const selectSignature = (file) => {
    const problem = checkSignatureFile(file);
    setErrors((e) => ({ ...e, signature: problem || undefined }));
    if (!problem) setSignature(file);
  };

  const updateDetails = (next) => {
    if (next.cmrFile && next.cmrFile !== details.cmrFile) {
      const problem = checkCmrFile(next.cmrFile);
      if (problem) {
        setErrors((e) => ({ ...e, cmrFile: problem }));
        return;
      }
    }
    // clear errors for edited fields
    const changed = Object.keys(next).filter((k) => next[k] !== details[k]);
    setErrors((e) => {
      const copy = { ...e };
      changed.forEach((k) => delete copy[k]);
      return copy;
    });
    setDetails(next);
  };

  const validate = () => {
    const e = {};
    if (!signature && !session?.hasSignature) e.signature = 'Please upload your signature.';
    if (transfer) {
      if (!details.depository) e.depository = 'Please select the Depository.';
      if (details.depository === 'CDSL' && !isCdslDpId(details.cdslDpId)) e.cdslDpId = 'CDSL DP ID must be exactly 16 digits.';
      if (details.depository === 'NSDL' && !isNsdlDpId(details.nsdlDpId)) e.nsdlDpId = 'Enter the 14 digits after IN.';
      if (!isDpName(details.dpName)) e.dpName = 'Please enter the Depository Participant Name.';
      if (!details.cmrFile && !session?.hasCmr) e.cmrFile = 'Please upload the CMR document (PDF).';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      toast.error('Please correct the highlighted fields.');
      return;
    }

    // 1. new files go straight to S3, 2. the step is saved with their keys (validated on the server)
    const uploads = [
      signature && { kind: 'signature', file: signature, field: 'signature' },
      transfer && details.cmrFile && { kind: 'cmr', file: details.cmrFile, field: 'cmrFile' },
    ].filter(Boolean);
    const totalBytes = uploads.reduce((sum, u) => sum + u.file.size, 0) || 1;
    let doneBytes = 0;

    setSubmitting(true);
    setProgress(0);
    let failedField = null;
    try {
      const keys = {};
      for (const u of uploads) {
        failedField = u.field;
        // eslint-disable-next-line no-await-in-loop
        keys[u.kind] = await closureApi.uploadDocument(u.kind, u.file,
          (e) => setProgress(Math.round(((doneBytes + (e.loaded || 0)) / totalBytes) * 100)));
        doneBytes += u.file.size;
      }
      failedField = null;

      const payload = { transferSecurities: transfer };
      if (keys.signature) Object.assign(payload, { signatureKey: keys.signature, signatureName: signature.name });
      if (transfer) {
        payload.depository = details.depository;
        if (details.depository === 'CDSL') payload.cdslDpId = details.cdslDpId;
        else payload.nsdlDpId = details.nsdlDpId;
        payload.dpName = details.dpName.trim();
        if (keys.cmr) Object.assign(payload, { cmrKey: keys.cmr, cmrName: details.cmrFile.name });
        if (details.cmrPassword) payload.cmrPassword = details.cmrPassword;
      }
      const res = await closureApi.saveDocuments(payload);
      setSession(res.data);
      toast.success('Documents uploaded successfully.');
      navigate(STEP_PATHS[4]);
    } catch (err) {
      const field = failedField || SERVER_FIELD_MAP[errorCode(err)] || err.response?.data?.details?.field;
      if (field) setErrors((e) => ({ ...e, [field]: errorMessage(err) }));
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const iconButton = 'rounded-lg p-2 text-slate-600 hover:bg-brand-mist hover:text-brand-blue';
  const signatureActions = useMemo(() => signature && (
    <>
      <button type="button" onClick={() => setPreview({ file: signature, title: 'Signature preview' })} className={iconButton} aria-label="Preview signature">
        <EyeIcon />
      </button>
      {isImageFile(signature) && (
        <button type="button" onClick={() => setCropOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-blue/30 px-3 py-1.5 text-sm font-semibold text-brand-blue hover:bg-brand-mist">
          <CropIcon className="h-4 w-4" /> Crop &amp; Rotate
        </button>
      )}
    </>
  ), [signature]);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader step={3} title="Upload Documents" subtitle={<>Fields marked with <span className="text-red-600">*</span> are mandatory.</>} />

      <form onSubmit={submit} noValidate className="animate-fade-up space-y-4">
        {/* Signature */}
        <section className="card p-4 sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-mist text-brand-blue"><PenIcon /></span>
              <div>
                <h2 className="section-title">Your Signature</h2>
                <p className="section-subtitle">Sign on plain white paper with a dark pen, then upload a clear photo or scan.</p>
              </div>
            </div>
            <p className="hidden select-none pr-1 text-right font-script text-5xl leading-tight text-brand-gradient sm:block sm:text-6xl" aria-hidden="true">Signature</p>
          </div>

          <FileUpload
            className="mt-4"
            label="Upload Signature (PNG, JPG, JPEG, or PDF - max 5MB)"
            required
            accept="image/png,image/jpeg,application/pdf,.png,.jpg,.jpeg,.pdf"
            formats="PNG, JPG, JPEG or PDF · max 5MB"
            file={signature}
            existingName={existingSignature}
            onSelect={selectSignature}
            error={errors.signature}
            actions={signatureActions}
          />
        </section>

        {/* Security balance transfer */}
        <section className="card p-4 sm:p-6">
          <div className={`rounded-2xl p-3.5 ring-1 transition ${transfer ? 'bg-brand-mist/70 ring-brand-blue/20' : 'bg-slate-50 ring-slate-200'}`}>
            <Checkbox
              checked={transfer}
              onChange={(v) => { setTransfer(v); setErrors({}); }}
              label="Transfer security balances to own account or another account as per details given below:"
              labelClassName="!text-sm font-bold leading-snug text-slate-900"
            />
            <p className="ml-9 mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
              <SwapIcon className="h-4 w-4" />
              Tick this only if you hold securities with us. Otherwise click Submit Signature.
            </p>
          </div>

          {transfer && (
            <div className="mt-4">
              <DepositoryForm
                value={details}
                errors={errors}
                onChange={updateDetails}
                existingCmrName={existingCmr}
                onPreviewCmr={() => setPreview({ file: details.cmrFile, title: 'CMR preview' })}
              />
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="card flex flex-col-reverse gap-3 p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <Button variant="outline" onClick={() => navigate(STEP_PATHS[2])} disabled={submitting}>
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </Button>
          <div className="flex flex-col gap-2 sm:items-end">
            <Button type="submit" size="lg" loading={submitting} className="sm:min-w-[220px]">
              Submit Signature
              {!submitting && <ArrowRightIcon className="h-5 w-5" />}
            </Button>
            {submitting && progress > 0 && progress < 100 && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 sm:w-[220px]">
                <div className="h-full bg-brand-gradient transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        </div>
      </form>

      <CmrInfoModal open={showCmrInfo} onClose={() => setShowCmrInfo(false)} />
      <SignatureCropper
        open={cropOpen}
        file={signature}
        onClose={() => setCropOpen(false)}
        onDone={(file) => { setSignature(file); setCropOpen(false); toast.success('Signature updated.'); }}
      />
      <FilePreviewModal open={Boolean(preview)} file={preview?.file} title={preview?.title} onClose={() => setPreview(null)} />
    </div>
  );
}

