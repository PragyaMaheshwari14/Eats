// import { useState, useEffect } from 'react'
// import '../../styles/profile.css'
// import { useParams, useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const BackArrow = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//     strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
//   </svg>
// )

// const Profile = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const [profile, setProfile] = useState(null)
//   const [videos, setVideos] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setLoading(true)
//     setError(null)

//     axios.get(`${import.meta.env.VITE_API_URL}/api/food-partner/${id}`, { withCredentials: true })
//       .then(response => {
//         console.log('Profile API response:', response.data)

//         // Handle all possible response shapes from the API
//         const data = response.data

//         // Try every common shape the backend might return
//         const partner =
//           data.foodPartner ??
//           data.partner ??
//           data.data ??
//           data

//         setProfile(partner)

//         // foodItems could be at different levels
//         const items =
//           partner?.foodItems ??
//           partner?.foods ??
//           partner?.videos ??
//           data.foodItems ??
//           data.foods ??
//           []

//         console.log('Videos found:', items)
//         setVideos(Array.isArray(items) ? items : [])
//       })
//       .catch(err => {
//         console.error('Profile fetch error:', err)
//         setError('Failed to load profile.')
//       })
//       .finally(() => setLoading(false))
//   }, [id])

//   // Pick the video URL from whichever field name the backend uses
//   const getVideoSrc = (v) =>
//     v.video ?? v.videoUrl ?? v.url ?? v.src ?? ''

//   return (
//     <main className="profile-page">

//       {/* ── Top bar ── */}
//       <div className="profile-topbar">
//         <button
//           className="profile-topbar-back"
//           onClick={() => navigate('/home')}
//           aria-label="Back to home"
//         >
//           <BackArrow />
//         </button>
//         <span className="profile-topbar-name">{profile?.name ?? ''}</span>
//       </div>

//       <div className="profile-inner">

//         {loading && (
//           <div style={{ color: 'var(--color-text-secondary)', padding: '40px 0', textAlign: 'center' }}>
//             Loading…
//           </div>
//         )}

//         {error && (
//           <div style={{ color: 'var(--color-danger)', padding: '40px 0', textAlign: 'center' }}>
//             {error}
//           </div>
//         )}

//         {!loading && !error && (
//           <>
//             {/* ── Avatar + stats ── */}
//             <div className="profile-header">
//               <img
//                 className="profile-avatar"
//                 src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&auto=format&fit=crop&q=80"
//                 alt={profile?.name ?? 'Partner'}
//               />
//               <div className="profile-info">
//                 <div className="profile-stats" role="list">
//                   <div className="profile-stat" role="listitem">
//                     <span className="profile-stat-value">{videos.length}</span>
//                     <span className="profile-stat-label">posts</span>
//                   </div>
//                   <div className="profile-stat" role="listitem">
//                     <span className="profile-stat-value">{profile?.totalMeals ?? 10}</span>
//                     <span className="profile-stat-label">meals</span>
//                   </div>
//                   <div className="profile-stat" role="listitem">
//                     <span className="profile-stat-value">{profile?.customersServed ?? 100}</span>
//                     <span className="profile-stat-label">customers</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ── Name + address ── */}
//             <div className="profile-bio">
//               <span className="profile-business">{profile?.name ?? '—'}</span>
//               <span className="profile-address">{profile?.address ?? ''}</span>
//             </div>

//             <hr className="profile-sep" />

//             {/* ── Video grid ── */}
//             {videos.length === 0 ? (
//               <div style={{
//                 color: 'var(--color-text-secondary)',
//                 textAlign: 'center',
//                 padding: '48px 0',
//                 fontSize: '.95rem'
//               }}>
//                 No posts yet.
//               </div>
//             ) : (
//               <section className="profile-grid" aria-label="Videos">
//                 {videos.map((v, i) => {
//                   const src = getVideoSrc(v)
//                   return (
//                     <div key={v._id ?? v.id ?? i} className="profile-grid-item">
//                       <video
//                         className="profile-grid-video"
//                         src={src}
//                         muted
//                         playsInline
//                         preload="metadata"
//                       />
//                     </div>
//                   )
//                 })}
//               </section>
//             )}
//           </>
//         )}

//       </div>
//     </main>
//   )
// }

// export default Profile


import { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BackArrow = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
  </svg>
)

const Profile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)

    axios.get(
      `${import.meta.env.VITE_API_URL}/api/food-partner/${id}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
      .then(response => {
        const data = response.data
        const partner = data.foodPartner ?? data.partner ?? data.data ?? data
        setProfile(partner)
        const items = partner?.foodItems ?? partner?.foods ?? partner?.videos ?? data.foodItems ?? data.foods ?? []
        setVideos(Array.isArray(items) ? items : [])
      })
      .catch(err => {
        console.error('Profile fetch error:', err)
        setError('Failed to load profile.')
      })
      .finally(() => setLoading(false))
  }, [id])

  const getVideoSrc = (v) => v.video ?? v.videoUrl ?? v.url ?? v.src ?? ''

  return (
    <main className="profile-page">
      <div className="profile-topbar">
        <button className="profile-topbar-back" onClick={() => navigate('/home')} aria-label="Back to home">
          <BackArrow />
        </button>
        <span className="profile-topbar-name">{profile?.name ?? ''}</span>
      </div>

      <div className="profile-inner">
        {loading && (
          <div style={{ color: 'var(--color-text-secondary)', padding: '40px 0', textAlign: 'center' }}>Loading…</div>
        )}
        {error && (
          <div style={{ color: 'var(--color-danger)', padding: '40px 0', textAlign: 'center' }}>{error}</div>
        )}
        {!loading && !error && (
          <>
            <div className="profile-header">
              <img className="profile-avatar"
                src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&auto=format&fit=crop&q=80"
                alt={profile?.name ?? 'Partner'} />
              <div className="profile-info">
                <div className="profile-stats" role="list">
                  <div className="profile-stat" role="listitem">
                    <span className="profile-stat-value">{videos.length}</span>
                    <span className="profile-stat-label">posts</span>
                  </div>
                  <div className="profile-stat" role="listitem">
                    <span className="profile-stat-value">{profile?.totalMeals ?? 10}</span>
                    <span className="profile-stat-label">meals</span>
                  </div>
                  <div className="profile-stat" role="listitem">
                    <span className="profile-stat-value">{profile?.customersServed ?? 100}</span>
                    <span className="profile-stat-label">customers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-bio">
              <span className="profile-business">{profile?.name ?? '—'}</span>
              <span className="profile-address">{profile?.address ?? ''}</span>
            </div>

            <hr className="profile-sep" />

            {videos.length === 0 ? (
              <div style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '48px 0', fontSize: '.95rem' }}>
                No posts yet.
              </div>
            ) : (
              <section className="profile-grid" aria-label="Videos">
                {videos.map((v, i) => (
                  <div key={v._id ?? v.id ?? i} className="profile-grid-item">
                    <video className="profile-grid-video" src={getVideoSrc(v)} muted playsInline preload="metadata" />
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default Profile