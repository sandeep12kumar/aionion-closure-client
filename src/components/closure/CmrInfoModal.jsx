import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';

/** Shown when Step 3 opens - explains the CMR / transfer tick box. */
export default function CmrInfoModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      tone="amber"
      title="Upload CMR (Client Master Report) for account transfer"
      footer={<Button variant="amber" onClick={onClose} autoFocus>Got it</Button>}
    >
      <p className="text-[15px] text-gray-700">If you have securities in your demat account with us.</p>
      <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
        <strong className="text-gray-900">Click on the tick below to upload the CMR</strong> (Client Master Report)
        to transfer your securities to another account.
      </p>
    </Modal>
  );
}
