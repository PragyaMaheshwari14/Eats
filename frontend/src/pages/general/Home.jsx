import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const Home = () => {
  const [videos,          setVideos]          = useState([])
  const [initialLikedIds, setInitialLikedIds] = useState(new Set())
  const [initialSavedIds, setInitialSavedIds] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    const headers = authHeaders()

    // Fetch videos, liked IDs, and saved IDs in parallel
    Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/food`,      headers),
      axios.get(`${import.meta.env.VITE_API_URL}/api/food/like`, headers),
      axios.get(`${import.meta.env.VITE_API_URL}/api/food/save`, headers),
    ])
      .then(([videosRes, likedRes, savedRes]) => {
        setVideos(videosRes.data.foodItems ?? [])

        // Pre-populate liked set
        const likedIds = likedRes.data.likedFoodIds ?? []
        setInitialLikedIds(new Set(likedIds))

        // Pre-populate saved set from savedFoods array
        const savedFoods = savedRes.data.savedFoods ?? []
        setInitialSavedIds(new Set(savedFoods.map(s => s.food?._id ?? s.food)))
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('role')
          navigate('/user/login')
        }
      })
  }, [navigate])

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
        setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: Math.max(0, v.likeCount - 1) } : v))
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
      setVideos(prev => prev.map(video => {
        if (video._id !== item._id) return video
        if (response.data.save) return { ...video, savesCount: (video.savesCount || 0) + 1 }
        return { ...video, savesCount: Math.max(0, (video.savesCount || 1) - 1) }
      }))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ReelFeed
      items={videos}
      onLike={likeVideo}
      onSave={saveVideo}
      initialLikedIds={initialLikedIds}
      initialSavedIds={initialSavedIds}
      emptyMessage="No videos available."
    />
  )
}

export default Home