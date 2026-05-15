// import { NavLink } from 'react-router-dom'
// import '../styles/bottom-nav.css'

// const HomeIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
//     <path d="M9 21V12h6v9"/>
//   </svg>
// )

// const BookmarkIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>
//   </svg>
// )

// const BottomNav = () => {
//   return (
//     <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
//       <div className="bottom-nav__inner">

//         <NavLink
//           to="/home"
//           end
//           className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
//         >
//           <span className="bottom-nav__icon" aria-hidden="true"><HomeIcon /></span>
//           <span className="bottom-nav__label">Home</span>
//         </NavLink>

//         <NavLink
//           to="/saved"
//           className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
//         >
//           <span className="bottom-nav__icon" aria-hidden="true"><BookmarkIcon /></span>
//           <span className="bottom-nav__label">Saved</span>
//         </NavLink>

//       </div>
//     </nav>
//   )
// }

// export default BottomNav


import { NavLink } from 'react-router-dom'
import '../styles/bottom-nav.css'

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
)

const BookmarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>
  </svg>
)

const LogoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const BottomNav = ({ onLogout }) => {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      <div className="bottom-nav__inner">

        <NavLink
          to="/home"
          end
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
        >
          <span className="bottom-nav__icon" aria-hidden="true"><HomeIcon /></span>
          <span className="bottom-nav__label">Home</span>
        </NavLink>

        <NavLink
          to="/saved"
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
        >
          <span className="bottom-nav__icon" aria-hidden="true"><BookmarkIcon /></span>
          <span className="bottom-nav__label">Saved</span>
        </NavLink>

        {/* Always visible logout tab — 3rd position like Instagram's profile tab */}
        <button
          onClick={onLogout}
          className="bottom-nav__item bottom-nav__logout"
          aria-label="Log out"
        >
          <span className="bottom-nav__icon" aria-hidden="true"><LogoutIcon /></span>
          <span className="bottom-nav__label">Log out</span>
        </button>

      </div>
    </nav>
  )
}

export default BottomNav