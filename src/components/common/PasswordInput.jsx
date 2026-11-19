import { useState } from 'react';
import Input from './Input.jsx';
import { EyeIcon, EyeOffIcon } from './Icons.jsx';

export default function PasswordInput(props) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      autoComplete="off"
      rightElement={(
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-brand-mist hover:text-brand-blue"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    />
  );
}
