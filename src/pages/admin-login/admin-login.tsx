import { Link } from 'react-router';
import './admin-login.scss';

export default function AdminLogin() {
  return (
    <div>
      <p>Admin login</p>
      {/* 
      This will be replaced later by a form for loggin in the admin
      All other componentes will be protected ons 
    */}
      <Link to={'/perfumes'}>
        Login
      </Link>
    </div>
  );
}