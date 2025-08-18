import { Button } from '@mui/material';
import { logout } from '../../services/auth.service';
import { useSnackbar } from '../snackbar';
import './header.scss';

export default function Header() {
  const snackbar = useSnackbar();

  async function handleClick(): Promise<void> {
    try {
      await logout();
      snackbar.show('Logged Out');

    } catch (err: unknown) {
      snackbar.show('Logout failed', 'error');
    }
  }

  return (
    <header>
      <div className='header-placeholder'>
        {/* Placeholder div */}
      </div>

      <img className='header-logo' src='images/blackrose-logo.jpg' alt='Blackrose logo' />

      <Button
        className='auth-button'
        variant='outlined'
        color='error'
        onClick={handleClick}
      >
        logout
      </Button>
    </header>
  );
}