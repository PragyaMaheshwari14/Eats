// import '../../styles/auth-shared.css';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// const UserLogin = () => {
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const email = e.target.email.value;
//     const password = e.target.password.value;
//     const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/user/login`, {
//       email, password
//     }, { withCredentials: true });
//     console.log(response.data);
//     navigate("/home");
//   };

//   return (
//     <div className="auth-page-wrapper">
//       <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>

//         <div className="auth-card">
//           <header>
//             <h1 className="auth-title">FoodReels</h1>
//             <p className="auth-subtitle">Sign in to continue your food journey.</p>
//           </header>

//           <form className="auth-form" onSubmit={handleSubmit} noValidate>
//             <div className="field-group">
//               <label htmlFor="email">Email</label>
//               <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
//             </div>
//             <div className="field-group">
//               <label htmlFor="password">Password</label>
//               <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
//             </div>
//             <button className="auth-submit" type="submit">Log In</button>
//           </form>

//           <div className="auth-divider">or</div>

//           <div className="auth-alt-action">
//             <Link to="/food-partner/login" style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
//               Log in as Food Partner
//             </Link>
//           </div>
//         </div>

//         <div className="auth-box-bottom">
//           Don't have an account? <Link to="/user/register">Sign up</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserLogin;

import { useState } from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { email, password } = form;
    if (!email || !password) { setError('Email and password are required.'); return; }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/user/login`,
        { email, password }
      );
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', 'user');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="auth-card">
          <header>
            <h1 className="auth-title">FoodReels</h1>
            <p className="auth-subtitle">Sign in to continue your food journey.</p>
          </header>

          {error && (
            <div style={{
              background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.4)',
              borderRadius: 8, padding: '10px 14px', color: '#ff3b30',
              fontSize: '.875rem', marginBottom: 4,
            }}>{error}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@example.com"
                autoComplete="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="••••••••"
                autoComplete="current-password" value={form.password} onChange={handleChange} />
            </div>
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Log In'}
            </button>
          </form>

          <div className="auth-divider">or</div>
          <div className="auth-alt-action">
            <Link to="/food-partner/login" style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
              Log in as Food Partner
            </Link>
          </div>
        </div>
        <div className="auth-box-bottom">
          Don't have an account? <Link to="/user/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;