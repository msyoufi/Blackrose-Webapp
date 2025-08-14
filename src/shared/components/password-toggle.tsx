import { TextField } from "@mui/material";
import { useRef, useState } from "react";

export default function PasswordTextField({
  id,
  name,
  label,
  password,
  setPassword
}: {
  id: string,
  name?: string,
  label?: string,
  password: string,
  setPassword: (val: string) => any
}) {
  const [inputType, setInputtype] = useState<'password' | 'text'>('password');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick(): void {
    const input = inputRef.current;
    if (!input) return;

    const nextType = input.type === 'text' ? 'password' : 'text';

    input.type = nextType;
    setInputtype(nextType);
  }

  return (
    <div style={{ position: 'relative' }}>
      <TextField
        id={id}
        name={name ?? 'passowrd'}
        label={label ?? 'Password'}
        size='small'
        type={inputType}
        value={password}
        onChange={e => setPassword(e.target.value)}
        inputRef={inputRef}
        style={{ width: '100%' }}
        required
      />

      <button
        type="button"
        className="passowrd-toggel"
        onClick={handleClick}
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--gray)',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {inputType === 'text' ? 'Hide' : 'Show'}
      </button >
    </div>
  );
}