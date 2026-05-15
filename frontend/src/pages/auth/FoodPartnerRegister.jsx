import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const businessName = e.target.businessName.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const address = e.target.address.value;

    axios.post(`${import.meta.env.VITE_API_URL}/api/auth/food-partner/register`, {
      name: businessName, contactName, phone, email, password, address
    }, { withCredentials: true })
      .then(response => {
        console.log(response.data);
        navigate("/create-food");
      })
      .catch(error => {
        console.error("There was an error registering!", error);
      });
  };

  return (
    <div className="auth-page-wrapper">
      <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div className="auth-card" style={{ maxWidth: '100%' }}>
          <header>
            <h1 className="auth-title">Partner Sign Up</h1>
            <p className="auth-subtitle">Grow your business by sharing food videos with thousands of users.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="businessName">Business Name</label>
              <input id="businessName" name="businessName" placeholder="Tasty Bites" autoComplete="organization" />
            </div>
            <div className="two-col">
              <div className="field-group">
                <label htmlFor="contactName">Contact Name</label>
                <input id="contactName" name="contactName" placeholder="Jane Doe" autoComplete="name" />
              </div>
              <div className="field-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" placeholder="+91 98765 43210" autoComplete="tel" />
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
            </div>
            <div className="field-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="Create a strong password" autoComplete="new-password" />
            </div>
            <div className="field-group">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" placeholder="123 Market Street, Delhi" autoComplete="street-address" />
              <p className="small-note">Your full address helps customers find you.</p>
            </div>
            <button className="auth-submit" type="submit">Create Partner Account</button>
          </form>
        </div>

        <div className="auth-box-bottom">
          Already a partner? <Link to="/food-partner/login">Sign in</Link>
        </div>
        <div className="auth-box-bottom">
          Not a partner? <Link to="/user/register">Sign up as user</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;