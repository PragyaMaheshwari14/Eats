// import { useEffect, useMemo, useRef, useState } from 'react';
// import axios from 'axios';
// import '../../styles/create-food.css';
// import { useNavigate } from 'react-router-dom';

// const CreateFood = () => {
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [videoFile, setVideoFile] = useState(null);
//     const [videoURL, setVideoURL] = useState('');
//     const [fileError, setFileError] = useState('');
//     const fileInputRef = useRef(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         // eslint-disable-next-line react-hooks/set-state-in-effect
//         if (!videoFile) { setVideoURL(''); return; }
//         const url = URL.createObjectURL(videoFile);
//         setVideoURL(url);
//         return () => URL.revokeObjectURL(url);
//     }, [videoFile]);

//     const onFileChange = (e) => {
//         const file = e.target.files && e.target.files[0];
//         if (!file) { setVideoFile(null); setFileError(''); return; }
//         if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
//         setFileError('');
//         setVideoFile(file);
//     };

//     const onDrop = (e) => {
//         e.preventDefault(); e.stopPropagation();
//         const file = e.dataTransfer?.files?.[0];
//         if (!file) return;
//         if (!file.type.startsWith('video/')) { setFileError('Please drop a valid video file.'); return; }
//         setFileError('');
//         setVideoFile(file);
//     };

//     const onDragOver = (e) => { e.preventDefault(); };
//     const openFileDialog = () => fileInputRef.current?.click();

//     const onSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('description', description);
//         formData.append('video', videoFile);
//         const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/food`, formData, { withCredentials: true });
//         console.log(response.data);
//         navigate("/home");
//     };

//     const logoutFoodPartner = async () => {
//         try {
//             await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/food-partner/logout`, { withCredentials: true });
//             navigate("/");
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const isDisabled = useMemo(() => !name.trim() || !videoFile, [name, videoFile]);

//     return (
//         <>
//             <button className="logout-btn" onClick={logoutFoodPartner}>
//                 Log out
//             </button>

//             <div className="create-food-page">
//                 <div className="create-food-card">
//                     <header className="create-food-header">
//                         <h1 className="create-food-title">Create Food Post</h1>
//                         <p className="create-food-subtitle">Upload a short video, give it a name, and add a description.</p>
//                     </header>

//                     <form className="create-food-form" onSubmit={onSubmit}>

//                         <div className="field-group">
//                             <label htmlFor="foodVideo">Food Video</label>
//                             <input
//                                 id="foodVideo"
//                                 ref={fileInputRef}
//                                 className="file-input-hidden"
//                                 type="file"
//                                 accept="video/*"
//                                 onChange={onFileChange}
//                             />
//                             <div
//                                 className="file-dropzone"
//                                 role="button"
//                                 tabIndex={0}
//                                 onClick={openFileDialog}
//                                 onDrop={onDrop}
//                                 onDragOver={onDragOver}
//                                 onKeyDown={(e) => e.key === 'Enter' && openFileDialog()}
//                             >
//                                 <div className="file-dropzone-inner">
//                                     <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--color-accent)'}}>
//                                         <rect x="2" y="2" width="20" height="20" rx="3"/>
//                                         <path d="m10 8 6 4-6 4V8z"/>
//                                     </svg>
//                                     <strong>Tap to upload video</strong>
//                                     <div className="file-hint">MP4, WebM, MOV · drag & drop supported</div>
//                                 </div>
//                             </div>
//                             {fileError && <p className="error-text">{fileError}</p>}
//                         </div>

//                         {videoURL && (
//                             <div className="video-preview">
//                                 <video className="video-preview-el" src={videoURL} controls />
//                             </div>
//                         )}

//                         <div className="field-group">
//                             <label htmlFor="foodName">Name</label>
//                             <input
//                                 id="foodName"
//                                 type="text"
//                                 placeholder="e.g. Spicy Margherita"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 required
//                             />
//                         </div>

//                         <div className="field-group">
//                             <label htmlFor="foodDesc">Description</label>
//                             <textarea
//                                 id="foodDesc"
//                                 rows={4}
//                                 placeholder="Describe this dish…"
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                             />
//                         </div>

//                         <div className="form-actions">
//                             <button className="btn-primary" type="submit" disabled={isDisabled}>
//                                 Post Food
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default CreateFood;

// import { useEffect, useMemo, useRef, useState } from 'react';
// import axios from 'axios';
// import '../../styles/create-food.css';
// import { useNavigate } from 'react-router-dom';

// const CreateFood = () => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [videoFile, setVideoFile] = useState(null);
//   const [videoURL, setVideoURL] = useState('');
//   const [fileError, setFileError] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     if (!videoFile) { setVideoURL(''); return; }
//     const url = URL.createObjectURL(videoFile);
//     setVideoURL(url);
//     return () => URL.revokeObjectURL(url);
//   }, [videoFile]);

//   const onFileChange = (e) => {
//     const file = e.target.files && e.target.files[0];
//     if (!file) { setVideoFile(null); setFileError(''); return; }
//     if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
//     setFileError('');
//     setVideoFile(file);
//   };

//   const onDrop = (e) => {
//     e.preventDefault(); e.stopPropagation();
//     const file = e.dataTransfer?.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith('video/')) { setFileError('Please drop a valid video file.'); return; }
//     setFileError('');
//     setVideoFile(file);
//   };

//   const onDragOver = (e) => { e.preventDefault(); };
//   const openFileDialog = () => fileInputRef.current?.click();

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('name', name);
//       formData.append('description', description);
//       formData.append('video', videoFile);

//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/food`,
//         formData,
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );
//       navigate('/home');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Failed to post food. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logoutFoodPartner = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     navigate('/');
//   };

//   const isDisabled = useMemo(() => !name.trim() || !videoFile || loading, [name, videoFile, loading]);

//   return (
//     <>
//       <button className="logout-btn" onClick={logoutFoodPartner}>Log out</button>

//       <div className="create-food-page">
//         <div className="create-food-card">
//           <header className="create-food-header">
//             <h1 className="create-food-title">Create Food Post</h1>
//             <p className="create-food-subtitle">Upload a short video, give it a name, and add a description.</p>
//           </header>

//           {error && (
//             <div style={{
//               background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.4)',
//               borderRadius: 8, padding: '10px 14px', color: '#ff3b30',
//               fontSize: '.875rem', marginBottom: 12,
//             }}>{error}</div>
//           )}

//           <form className="create-food-form" onSubmit={onSubmit}>
//             <div className="field-group">
//               <label htmlFor="foodVideo">Food Video</label>
//               <input id="foodVideo" ref={fileInputRef} className="file-input-hidden"
//                 type="file" accept="video/*" onChange={onFileChange} />
//               <div className="file-dropzone" role="button" tabIndex={0}
//                 onClick={openFileDialog} onDrop={onDrop} onDragOver={onDragOver}
//                 onKeyDown={(e) => e.key === 'Enter' && openFileDialog()}>
//                 <div className="file-dropzone-inner">
//                   <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                     strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
//                     style={{ color: 'var(--color-accent)' }}>
//                     <rect x="2" y="2" width="20" height="20" rx="3"/>
//                     <path d="m10 8 6 4-6 4V8z"/>
//                   </svg>
//                   <strong>Tap to upload video</strong>
//                   <div className="file-hint">MP4, WebM, MOV · drag & drop supported</div>
//                 </div>
//               </div>
//               {fileError && <p className="error-text">{fileError}</p>}
//             </div>

//             {videoURL && (
//               <div className="video-preview">
//                 <video className="video-preview-el" src={videoURL} controls />
//               </div>
//             )}

//             <div className="field-group">
//               <label htmlFor="foodName">Name</label>
//               <input id="foodName" type="text" placeholder="e.g. Spicy Margherita"
//                 value={name} onChange={(e) => setName(e.target.value)} required />
//             </div>

//             <div className="field-group">
//               <label htmlFor="foodDesc">Description</label>
//               <textarea id="foodDesc" rows={4} placeholder="Describe this dish…"
//                 value={description} onChange={(e) => setDescription(e.target.value)} />
//             </div>

//             <div className="form-actions">
//               <button className="btn-primary" type="submit" disabled={isDisabled}>
//                 {loading ? 'Posting…' : 'Post Food'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateFood;


import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!videoFile) { setVideoURL(''); return; }
    const url = URL.createObjectURL(videoFile);
    setVideoURL(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const onFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) { setVideoFile(null); setFileError(''); return; }
    if (!file.type.startsWith('video/')) { setFileError('Please select a valid video file.'); return; }
    setFileError('');
    setVideoFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) { setFileError('Please drop a valid video file.'); return; }
    setFileError('');
    setVideoFile(file);
  };

  const onDragOver = (e) => { e.preventDefault(); };
  const openFileDialog = () => fileInputRef.current?.click();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('video', videoFile);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food`,
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Reset form and show success — don't redirect to /home (that's for users)
      setSuccess('Food posted successfully!');
      setName('');
      setDescription('');
      setVideoFile(null);
      setVideoURL('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to post food. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const logoutFoodPartner = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const isDisabled = useMemo(() => !name.trim() || !videoFile || loading, [name, videoFile, loading]);

  return (
    <>
      <button className="logout-btn" onClick={logoutFoodPartner}>Log out</button>

      <div className="create-food-page">
        <div className="create-food-card">
          <header className="create-food-header">
            <h1 className="create-food-title">Create Food Post</h1>
            <p className="create-food-subtitle">Upload a short video, give it a name, and add a description.</p>
          </header>

          {error && (
            <div style={{
              background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.4)',
              borderRadius: 8, padding: '10px 14px', color: '#ff3b30',
              fontSize: '.875rem', marginBottom: 12,
            }}>{error}</div>
          )}

          {success && (
            <div style={{
              background: 'rgba(52,199,89,0.1)', border: '1px solid rgba(52,199,89,0.4)',
              borderRadius: 8, padding: '10px 14px', color: '#34c759',
              fontSize: '.875rem', marginBottom: 12,
            }}>{success}</div>
          )}

          <form className="create-food-form" onSubmit={onSubmit}>
            <div className="field-group">
              <label htmlFor="foodVideo">Food Video</label>
              <input id="foodVideo" ref={fileInputRef} className="file-input-hidden"
                type="file" accept="video/*" onChange={onFileChange} />
              <div className="file-dropzone" role="button" tabIndex={0}
                onClick={openFileDialog} onDrop={onDrop} onDragOver={onDragOver}
                onKeyDown={(e) => e.key === 'Enter' && openFileDialog()}>
                <div className="file-dropzone-inner">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ color: 'var(--color-accent)' }}>
                    <rect x="2" y="2" width="20" height="20" rx="3"/>
                    <path d="m10 8 6 4-6 4V8z"/>
                  </svg>
                  <strong>Tap to upload video</strong>
                  <div className="file-hint">MP4, WebM, MOV · drag & drop supported</div>
                </div>
              </div>
              {fileError && <p className="error-text">{fileError}</p>}
            </div>

            {videoURL && (
              <div className="video-preview">
                <video className="video-preview-el" src={videoURL} controls />
              </div>
            )}

            <div className="field-group">
              <label htmlFor="foodName">Name</label>
              <input id="foodName" type="text" placeholder="e.g. Spicy Margherita"
                value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="field-group">
              <label htmlFor="foodDesc">Description</label>
              <textarea id="foodDesc" rows={4} placeholder="Describe this dish…"
                value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="form-actions">
              <button className="btn-primary" type="submit" disabled={isDisabled}>
                {loading ? 'Posting…' : 'Post Food'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateFood;