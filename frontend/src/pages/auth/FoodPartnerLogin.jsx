import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const FoodPartnerLogin = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/food-partner/login`, {
      email, password
    }, { withCredentials: true });
    console.log(response.data);
    navigate("/create-food");
  };

  return (
    <div className="auth-page-wrapper">
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div className="auth-card">
          <header>
            <h1 className="auth-title">Partner Login</h1>
            <p className="auth-subtitle">Access your dashboard and manage your food posts.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="email">Business Email</label>
              <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button className="auth-submit" type="submit">Sign In</button>
          </form>
        </div>

        <div className="auth-box-bottom">
          New partner? <Link to="/food-partner/register">Create a business account</Link>
        </div>

        <div className="auth-box-bottom">
          Not a partner? <Link to="/user/login">User login</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;