import { Button, CircularProgress, TextField } from '@mui/material';
import { useSnackbar } from '../../shared/components/snackbar';
import { login } from '../../shared/services/auth.service';
import { useState, type FormEvent } from 'react';
import { FirebaseError } from 'firebase/app';
import './admin-login.scss';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const snackbar = useSnackbar();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    setIsLoading(true);

    try {
      await login(email, password);
      snackbar.show('Loged In');

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
    try {
      // TODO
      console.log('reset password')
      snackbar.show('');

    } catch (err: unknown) {
      console.log(err)
      snackbar.show('', 'error');
    }
  }

  return (
    <div className="overlay">
      <form
        id='auth_form'
        className='overlay-content-container'
        onSubmit={handleSubmit}
      >
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

          <TextField
            id='password'
            name='password'
            label='password'
            size='small'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-buttons-container">
          <Button
            type='submit'
            className='auth-button'
            variant='contained'
            size='medium'
            disabled={!email || !password || isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : 'login'}
          </Button>

          <Button
            type='reset'
            className='auth-button'
            variant='contained'
            size='medium'
            color='warning'
            onClick={handleResetClick}
          >
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
}