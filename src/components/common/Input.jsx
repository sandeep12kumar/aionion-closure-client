import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  { label, required, error, hint, labelNote, rightElement, className = '', inputClassName = '', id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id || autoId;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
          {labelNote && <span className="ml-2 text-[11px] font-medium text-green-700">{labelNote}</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`field-input ${error ? 'field-input-error' : ''} ${rightElement ? 'pr-11' : ''} ${inputClassName}`}
          {...props}
        />
        {rightElement && <div className="absolute inset-y-0 right-0 flex items-center pr-2">{rightElement}</div>}
      </div>
      {error ? <p id={`${inputId}-error`} className="field-error">{error}</p> : hint && <p className="field-hint">{hint}</p>}
    </div>
  );
});

export default Input;
