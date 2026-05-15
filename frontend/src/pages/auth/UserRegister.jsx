import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/user/register`, {
            fullName: firstName + " " + lastName,
            email,
            password
        }, { withCredentials: true });
        console.log(response.data);
        navigate("/home");
    };

    return (
        <div className="auth-page-wrapper">
            <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 12 }}>

                <div className="auth-card">
                    <header>
                        <h1 className="auth-title">FoodReels</h1>
                        <p className="auth-subtitle">Sign up to see food videos from restaurants near you.</p>
                    </header>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        <div className="two-col">
                            <div className="field-group">
                                <label htmlFor="firstName">First Name</label>
                                <input id="firstName" name="firstName" placeholder="Jane" autoComplete="given-name" />
                            </div>
                            <div className="field-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input id="lastName" name="lastName" placeholder="Doe" autoComplete="family-name" />
                            </div>
                        </div>
                        <div className="field-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                        </div>
                        <div className="field-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="new-password" />
                        </div>
                        <button className="auth-submit" type="submit">Sign Up</button>
                    </form>

                    <div className="auth-alt-action" style={{ fontSize: '.78rem', color: 'var(--color-text-secondary)' }}>
                        By signing up you agree to our Terms.
                    </div>
                </div>

                <div className="auth-box-bottom">
                    Have an account? <Link to="/user/login">Log in</Link>
                </div>

                <div className="auth-box-bottom">
                    Food partner? <Link to="/food-partner/register">Register your business</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;