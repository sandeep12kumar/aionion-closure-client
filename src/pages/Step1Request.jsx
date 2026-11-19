import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { closureApi, errorCode, errorMessage } from '../api/closureApi.js';
import { useClosure } from '../context/ClosureContext.jsx';
import Input from '../components/common/Input.jsx';
import Select from '../components/common/Select.jsx';
import Button from '../components/common/Button.jsx';
import NoteBox from '../components/common/NoteBox.jsx';
import Stepper from '../components/common/Stepper.jsx';
import { ArrowRightIcon, LockIcon, MailIcon, PhoneIcon } from '../components/common/Icons.jsx';
import OtpInput from '../components/otp/OtpInput.jsx';
import ResendTimer from '../components/otp/ResendTimer.jsx';
import { FALLBACK_REASONS, STEP_PATHS, STEP1_NOTES } from '../utils/constants.js';
import { isClientCode, isOtp } from '../utils/validators.js';

/** Step 1 of 4 - Client code + reason -> SMS & Email OTP -> Client Login. */
export default function Step1Request() {
  const navigate = useNavigate();
  const { setSession } = useClosure();

  const [reasons, setReasons] = useState(FALLBACK_REASONS);
  const [clientCode, setClientCode] = useState('');
  const [reason, setReason] = useState('');
  const [otpStage, setOtpStage] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState(null);
  const [resendIn, setResendIn] = useState(0);
  const [resendKey, setResendKey] = useState(0);
  const [smsOtp, setSmsOtp] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    closureApi.meta().then((res) => res.data?.reasons?.length && setReasons(res.data.reasons)).catch(() => {});
  }, []);

  const submitRequest = async (e) => {
    e.preventDefault();
    const code = clientCode.trim().toUpperCase();
    if (!isClientCode(code)) {
      setErrors({ clientCode: code ? 'Please enter a valid Client Code.' : 'Please enter your Client Code.' });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await closureApi.startRequest({ clientCode: code, reason });
      setClientCode(code);
      setOtpSentTo(res.data.otpSentTo);
      setResendIn(res.data.resendIn);
      setResendKey((k) => k + 1);
      setSmsOtp('');
      setEmailOtp('');
      setOtpStage(true);
      toast.success(res.message);
    } catch (err) {
      const message = errorMessage(err);
      if (['CLIENT_NOT_FOUND', 'VALIDATION_ERROR'].includes(errorCode(err))) setErrors({ clientCode: message });
      else toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      const res = await closureApi.resendOtp(clientCode);
      setOtpSentTo(res.data.otpSentTo);
      setResendIn(res.data.resendIn);
      setResendKey((k) => k + 1);
      setSmsOtp('');
      setEmailOtp('');
      setErrors({});
      toast.success('A new OTP has been sent.');
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setResending(false);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!isOtp(smsOtp)) nextErrors.smsOtp = 'Please enter the 6-digit SMS OTP.';
    if (!isOtp(emailOtp)) nextErrors.emailOtp = 'Please enter the 6-digit Email OTP.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const res = await closureApi.verifyOtp({ clientCode, smsOtp, emailOtp });
      toast.success('Verified successfully.');
      setSession(res.data);
      navigate(STEP_PATHS[res.data.currentStep] || STEP_PATHS[2], { replace: true });
    } catch (err) {
      const details = err.response?.data?.details;
      if (errorCode(err) === 'OTP_INVALID' && details) {
        setErrors({
          smsOtp: details.sms ? undefined : 'Incorrect SMS OTP.',
          emailOtp: details.email ? undefined : 'Incorrect Email OTP.',
        });
      }
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const changeClientCode = () => {
    setOtpStage(false);
    setSmsOtp('');
    setEmailOtp('');
    setErrors({});
  };

  return (
    <div className="animate-fade-up">
      <div className="card overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-brand-blue via-brand-navy to-brand-coral" />
        <div className="px-5 pb-6 pt-5 sm:px-8 sm:pb-7 sm:pt-6">
          <Stepper step={1} />

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Account Closure Request</h1>
          <p className="mt-1 text-sm text-slate-500">
            {otpStage ? 'Enter the OTPs sent to your registered mobile number and email ID.' : 'Enter your Aionion client code to begin.'}
          </p>

          <form onSubmit={otpStage ? login : submitRequest} noValidate className="mt-5 space-y-4">
            <Input
              label="Client Code"
              placeholder="Enter Client Code"
              value={clientCode}
              onChange={(e) => setClientCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              maxLength={20}
              autoComplete="off"
              autoFocus
              disabled={otpStage}
              error={errors.clientCode}
              inputClassName="font-semibold tracking-wider"
            />

            <Select
              label="Reasons for Closing the Account (Optional)"
              placeholder="--Select Reason--"
              options={reasons}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={otpStage}
            />

            {otpStage && (
              <div className="animate-fade-up space-y-4">
                {otpSentTo && (
                  <div className="grid gap-2 rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-800 ring-1 ring-emerald-600/15 sm:grid-cols-2">
                    <span className="flex items-center gap-2"><PhoneIcon className="h-4 w-4" />SMS OTP sent to <strong>{otpSentTo.mobile}</strong></span>
                    <span className="flex items-center gap-2"><MailIcon className="h-4 w-4" />Email OTP sent to <strong className="truncate">{otpSentTo.email}</strong></span>
                  </div>
                )}
                <OtpInput
                  idPrefix="sms-otp"
                  label="Enter SMS OTP"
                  labelNote="(* OTP sent on your mobile number & email Id)"
                  value={smsOtp}
                  onChange={(v) => { setSmsOtp(v); setErrors((er) => ({ ...er, smsOtp: undefined })); }}
                  error={errors.smsOtp}
                  autoFocus
                />
                <OtpInput
                  idPrefix="email-otp"
                  label="Enter Email OTP"
                  value={emailOtp}
                  onChange={(v) => { setEmailOtp(v); setErrors((er) => ({ ...er, emailOtp: undefined })); }}
                  error={errors.emailOtp}
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <ResendTimer seconds={resendIn} resetKey={resendKey} onResend={resend} loading={resending} />
                  <button type="button" onClick={changeClientCode} className="text-sm font-semibold text-slate-500 hover:text-brand-blue">
                    Change client code
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} uppercase className="w-full">
              {otpStage ? 'Client Login' : 'Submit'}
              {!loading && <ArrowRightIcon className="h-5 w-5" />}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <LockIcon className="h-3.5 w-3.5" /> Secured with OTP verification
            </p>
          </form>
        </div>
      </div>

      <NoteBox items={STEP1_NOTES} className="mt-4" />
    </div>
  );
}
