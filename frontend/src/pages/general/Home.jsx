// import { useEffect, useState } from 'react'
// import axios from 'axios'
// import '../../styles/reels.css'
// import ReelFeed from '../../components/ReelFeed'

// const Home = () => {
//     const [videos, setVideos] = useState([])

//     useEffect(() => {
//         axios.get(`${import.meta.env.VITE_API_URL}/api/food`, { withCredentials: true })
//             .then(response => { setVideos(response.data.foodItems) })
//             .catch(() => {})
//     }, [])

//     async function likeVideo(item) {
//         const response = await axios.post(
//             `${import.meta.env.VITE_API_URL}/api/food/like`,
//             { foodId: item._id },
//             { withCredentials: true }
//         )
//         if (response.data.like) {
//             setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
//         } else {
//             setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
//         }
//     }

    

//     async function saveVideo(item) {

//     try {

//         const response = await axios.post(
//             `${import.meta.env.VITE_API_URL}/api/food/save`,
//             { foodId: item._id },
//             { withCredentials: true }
//         )

//         setVideos((prev) =>
//             prev.map((video) => {

//                 if (video._id !== item._id) {
//                     return video
//                 }

//                 // SAVE
//                 if (response.data.save) {

//                     return {
//                         ...video,
//                         savesCount: (video.savesCount || 0) + 1,
//                         isSaved: true
//                     }

//                 }

//                 // UNSAVE
//                 return {
//                     ...video,
//                     savesCount: Math.max(0, (video.savesCount || 1) - 1),
//                     isSaved: false
//                 }

//             })
//         )

//     } catch (error) {

//         console.log(error)

//     }
// }



//     return (
//         <ReelFeed
//             items={videos}
//             onLike={likeVideo}
//             onSave={saveVideo}
//             emptyMessage="No videos available."
//         />
//     )
// }

// export default Home



import { useEffect, useState } from 'react'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const Home = () => {
  const [videos, setVideos] = useState([])

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/food`, authHeaders())
      .then(response => { setVideos(response.data.foodItems) })
      .catch(() => {})
  }, [])

  async function likeVideo(item) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/like`,
        { foodId: item._id },
        authHeaders()
      )
      if (response.data.like) {
        setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
      } else {
        setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function saveVideo(item) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/save`,
        { foodId: item._id },
        authHeaders()
      )
      setVideos((prev) =>
        prev.map((video) => {
          if (video._id !== item._id) return video
          if (response.data.save) {
            return { ...video, savesCount: (video.savesCount || 0) + 1, isSaved: true }
          }
          return { ...video, savesCount: Math.max(0, (video.savesCount || 1) - 1), isSaved: false }
        })
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      emptyMessage="No videos available."
    />
  )
}

export default Home