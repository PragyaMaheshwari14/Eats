import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';

const ChooseRegister = () => {
  return (
    <div className="auth-page-wrapper">
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Main card */}
        <div className="auth-card">
          <header>
            <h1 className="auth-title">FoodReels</h1>
            <p className="auth-subtitle">Sign up to see food videos from your favourite restaurants.</p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/user/register" className="auth-submit" style={{ textDecoration: 'none' }}>
              Sign up as User
            </Link>

            <div className="auth-divider">or</div>

            <Link
              to="/food-partner/register"
              className="auth-submit"
              style={{
                textDecoration: 'none',
                background: 'transparent',
                color: 'var(--color-accent)',
                border: '1.5px solid var(--color-accent)',
              }}
            >
              Join as Food Partner
            </Link>
          </div>
        </div>

        {/* Bottom box */}
        <div className="auth-box-bottom">
          Have an account? <Link to="/user/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegister;