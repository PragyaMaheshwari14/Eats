// import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// import UserRegister from '../pages/auth/UserRegister';
// import ChooseRegister from '../pages/auth/ChooseRegister';
// import UserLogin from '../pages/auth/UserLogin';

// import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
// import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';

// import Home from '../pages/general/Home';
// import Saved from '../pages/general/Saved';

// import BottomNav from '../components/BottomNav';

// import CreateFood from '../pages/food-partner/CreateFood';
// import Profile from '../pages/food-partner/Profile';

// /*
//   UserLayout owns the logout logic.
//   BottomNav always gets onLogout — works on /home AND /saved.
// */
// const UserLayout = ({ children }) => {
//     const navigate = useNavigate();

//     async function logoutUser() {
//         try {
//             await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user/logout`, { withCredentials: true });
//             navigate('/');
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     return (
//         <>
//             {children}
//             <BottomNav onLogout={logoutUser} />
//         </>
//     );
// };

// const AppRoutes = () => {
//     return (
//         <Router>
//             <Routes>

//                 <Route path="/" element={<ChooseRegister />} />

//                 <Route path="/user/register" element={<UserRegister />} />
//                 <Route path="/user/login" element={<UserLogin />} />

//                 <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
//                 <Route path="/food-partner/login" element={<FoodPartnerLogin />} />

//                 <Route path="/home" element={
//                     <UserLayout><Home /></UserLayout>
//                 } />

//                 <Route path="/saved" element={
//                     <UserLayout><Saved /></UserLayout>
//                 } />

//                 <Route path="/create-food" element={<CreateFood />} />

//                 <Route path="/food-partner/:id" element={<Profile />} />

//             </Routes>
//         </Router>
//     );
// };

// export default AppRoutes;


import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';

const UserLayout = ({ children }) => {
  const navigate = useNavigate();

  function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  }

  return (
    <>
      {children}
      <BottomNav onLogout={logoutUser} />
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChooseRegister />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/home" element={<UserLayout><Home /></UserLayout>} />
        <Route path="/saved" element={<UserLayout><Saved /></UserLayout>} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/food-partner/:id" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;