import { useRef } from 'react';

/**
 * 6-box OTP input. Supports typing, backspace navigation, arrow keys and paste.
 */
export default function OtpInput({ value = '', onChange, length = 6, label, labelNote, error, disabled, autoFocus, idPrefix = 'otp' }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const focus = (i) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const setAt = (index, digit) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, length));
  };

  const handleChange = (index, raw) => {
    const clean = raw.replace(/\D/g, '');
    if (!clean) return setAt(index, '');
    if (clean.length > 1) {
      // paste / autofill into one box
      const merged = (digits.slice(0, index).join('') + clean).slice(0, length);
      onChange(merged);
      focus(merged.length);
      return undefined;
    }
    setAt(index, clean);
    if (index < length - 1) focus(index + 1);
    return undefined;
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault();
      setAt(index - 1, '');
      focus(index - 1);
    } else if (e.key === 'ArrowLeft') focus(index - 1);
    else if (e.key === 'ArrowRight') focus(index + 1);
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    focus(pasted.length);
  };

  return (
    <div>
      {label && (
        <label htmlFor={`${idPrefix}-0`} className="field-label">
          {label}
          {labelNote && <span className="ml-2 text-[11px] font-medium text-green-700">{labelNote}</span>}
        </label>
      )}
      <div className="flex gap-2 sm:gap-2.5" role="group" aria-label={label}>
        {digits.map((digit, i) => (
          <input
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            id={`${idPrefix}-${i}`}
            ref={(el) => { refs.current[i] = el; }}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={length}
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            aria-label={`${label || 'OTP'} digit ${i + 1}`}
            className={`h-12 w-full min-w-0 rounded-xl border-2 text-center text-lg font-bold text-brand-ink transition
              focus:border-brand-blue focus:outline-none focus:ring-4 focus:ring-brand-blue/10 disabled:bg-slate-50
              ${error ? 'border-red-400 bg-red-50/40' : digit ? 'border-brand-blue/50 bg-brand-mist/60' : 'border-slate-200 bg-white'}`}
          />
        ))}
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
