import { Button, CircularProgress, TextField } from '@mui/material';
import { useSnackbar } from '../../shared/components/snackbar';
import { login, sendResetEmail } from '../../shared/services/auth.service';
import { useState, type FormEvent } from 'react';
import { FirebaseError } from 'firebase/app';
import PasswordTextField from '../../shared/components/password-toggle';
import './admin-login.scss';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReseting, setIsResting] = useState(false);

  const snackbar = useSnackbar();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    if (!email || !password) return;

    setIsLoading(true);

    try {
      await login(email, password);
      snackbar.show('Logged In');

    } catch (err: unknown) {
      let message = 'Login Failed';

      if (err instanceof FirebaseError) {
        if (err.code === 'auth/invalid-credential')
          message = 'Invalid email or password';
      }

      snackbar.show(message, 'error');

    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetClick(): Promise<void> {
    if (!email) {
      return snackbar.show('Please provide your email address!', 'warning');
    }

    setIsResting(true);

    try {
      await sendResetEmail(email);
      snackbar.show(`An email with a reset link sent to: ${email}`, 'success', 5000);

    } catch (err: unknown) {
      snackbar.show('Fialed to send a reset link', 'error');

    } finally {
      setIsResting(false);
    }
  }

  return (
    <div className="overlay">
      <form
        id='auth_form'
        className='overlay-content-container'
        onSubmit={handleSubmit}
      >
        <p className='form-title'>Black Rose</p>

        <div className="inputs-container">
          <TextField
            id='email'
            name='email'
            label='email'
            size='small'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <PasswordTextField
            id='password'
            password={password}
            setPassword={setPassword}
          />
        </div>

        <div className="auth-buttons-container">
          <Button
            type='submit'
            className='auth-button'
            variant='contained'
            size='medium'
            disabled={!email || !password || isLoading || isReseting}
          >
            {isLoading ? <CircularProgress size={25} /> : 'login'}
          </Button>

          <Button
            type='button'
            className='auth-button'
            variant='outlined'
            size='medium'
            color='warning'
            onClick={handleResetClick}
            disabled={isReseting}
          >
            {isReseting ? <CircularProgress size={25} color='warning' /> : 'Reset Password'}
          </Button>
        </div>
      </form>
    </div>
  );
}