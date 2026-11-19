import Select from '../common/Select.jsx';
import Input from '../common/Input.jsx';
import PasswordInput from '../common/PasswordInput.jsx';
import FileUpload from '../upload/FileUpload.jsx';
import { BuildingIcon, EyeIcon, FileIcon } from '../common/Icons.jsx';
import { digitsOnly } from '../../utils/validators.js';

/**
 * Step 3 transfer section: Depository (NSDL / CDSL) + target DP ID + DP name + CMR upload.
 * Controlled component - parent owns `value` and `errors`.
 */
export default function DepositoryForm({ value, errors = {}, onChange, existingCmrName, onPreviewCmr }) {
  const set = (field) => (eventOrValue) => {
    const v = eventOrValue?.target ? eventOrValue.target.value : eventOrValue;
    onChange({ ...value, [field]: v });
  };

  return (
    <div className="animate-fade-up space-y-6">
      {/* Target depository */}
      <section className="rounded-2xl border border-slate-200 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-mist text-brand-blue"><BuildingIcon /></span>
          <div>
            <h3 className="section-title">Select Depository for Transfer</h3>
            <p className="section-subtitle">Please mention the DP ID where you want to transfer your shares.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Select
            label="Depository"
            required
            placeholder="--Select One --"
            options={['NSDL', 'CDSL']}
            value={value.depository}
            onChange={(e) => onChange({ ...value, depository: e.target.value })}
            error={errors.depository}
          />

          {value.depository === 'CDSL' && (
            <Input
              label="Enter CDSL DP ID (16 digits):"
              placeholder="Enter 16-digits number"
              inputMode="numeric"
              value={value.cdslDpId}
              onChange={(e) => set('cdslDpId')(digitsOnly(e.target.value, 16))}
              error={errors.cdslDpId}
              hint={value.cdslDpId ? `${value.cdslDpId.length}/16 digits` : undefined}
            />
          )}

          {value.depository === 'NSDL' && (
            <Input
              label="Enter NSDL DP ID (14 digits after IN):"
              inputMode="numeric"
              value={`IN${value.nsdlDpId.replace(/^IN/, '')}`}
              // "IN" is fixed - only the 14 digits after it can be typed
              onChange={(e) => set('nsdlDpId')(`IN${digitsOnly(e.target.value.toUpperCase().replace(/^IN/, ''), 14)}`)}
              error={errors.nsdlDpId}
              hint={value.nsdlDpId.length > 2 ? `${value.nsdlDpId.length - 2}/14 digits` : undefined}
            />
          )}

          <Input
            className="sm:col-span-2"
            label="Depository Participant Name:"
            placeholder="Enter DP Name"
            value={value.dpName}
            maxLength={150}
            onChange={set('dpName')}
            error={errors.dpName}
          />
        </div>
      </section>

      {/* CMR */}
      <section className="rounded-2xl border border-slate-200 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-rose-50 text-brand-coral"><FileIcon /></span>
          <div>
            <h3 className="section-title">CMR (Client Master Report) Upload</h3>
            <p className="section-subtitle">Digitally signed CMR from your other DP.</p>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <FileUpload
            label="Upload CMR Document (PDF only):"
            required
            accept="application/pdf,.pdf"
            formats="PDF only · max 5MB"
            file={value.cmrFile}
            existingName={existingCmrName}
            onSelect={set('cmrFile')}
            error={errors.cmrFile}
            actions={value.cmrFile && (
              <button type="button" onClick={onPreviewCmr} className="rounded-lg p-2 text-slate-600 hover:bg-brand-mist hover:text-brand-blue" aria-label="Preview CMR">
                <EyeIcon />
              </button>
            )}
          />
          <PasswordInput
            label="CMR Document Password (if protected):"
            placeholder="Enter Password"
            value={value.cmrPassword}
            onChange={set('cmrPassword')}
            error={errors.cmrPassword}
            maxLength={100}
          />
        </div>

        <div className="mt-5 space-y-1 rounded-xl bg-red-50 px-4 py-3 text-[13px] leading-snug text-red-700 ring-1 ring-red-100">
          <p>*If there are holdings in your account, provide CMR copy for account transfer</p>
          <p>*Your request for closure of Demat and/or Trading Account are subject to verifications.</p>
          <p>The request for account closure includes target Demat account details where the client intends to transfer the securities balance.</p>
        </div>
      </section>
    </div>
  );
}
