import { Button } from '@mui/material';
import { logout } from '../../services/auth.service';
import { useSnackbar } from '../snackbar';
import './header.scss';

export default function Header() {
  const snackbar = useSnackbar();

  async function handleClick(): Promise<void> {
    try {
      await logout();
      snackbar.show('Loged Out');

    } catch (err: unknown) {
      snackbar.show('Logout failed', 'error');
    }
  }

  return (
    <header>
      <div className='header-placeholder'>
        {/* Placeholder div */}
      </div>

      <h1>Black Rose</h1>

      <Button
        className='auth-button'
        variant='contained'
        color='error'
        onClick={handleClick}
      >
        logout
      </Button>
    </header>
  );
}