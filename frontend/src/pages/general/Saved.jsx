// import { useEffect, useState } from "react";
// import "../../styles/reels.css";
// import axios from "axios";
// import ReelFeed from "../../components/ReelFeed";

// const Saved = () => {
//   const [videos, setVideos] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/api/food/save`, { withCredentials: true })
//       .then((response) => {
//         const savedFoods = response.data.savedFoods.map((item) => ({
//           _id: item.food._id,
//           video: item.food.video,
//           description: item.food.description,
//           likeCount: item.food.likeCount,
//           savesCount: item.food.savesCount,
//           commentsCount: item.food.commentsCount,
//           foodPartner: item.food.foodPartner,
//         }));
//         setVideos(savedFoods);
//       });
//   }, []);

//   const removeSaved = async (item) => {
//     try {

//         await axios.post(
//             `${import.meta.env.VITE_API_URL}/api/food/save`,
//             { foodId: item._id },
//             { withCredentials: true }
//         )

//         // remove video from saved page instantly
//         setVideos((prev) =>
//             prev.filter((v) => v._id !== item._id)
//         )

//     } catch (error) {
//         console.log(error)
//     }
// }

//   return (
//     <ReelFeed
//       items={videos}
//       onSave={removeSaved}
//       emptyMessage="No saved videos yet."
//     />
//   );
// };

// export default Saved;


import { useEffect, useState } from "react";
import "../../styles/reels.css";
import axios from "axios";
import ReelFeed from "../../components/ReelFeed";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

const Saved = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/food/save`, authHeaders())
      .then((response) => {
        const savedFoods = response.data.savedFoods.map((item) => ({
          _id: item.food._id,
          video: item.food.video,
          description: item.food.description,
          likeCount: item.food.likeCount,
          savesCount: item.food.savesCount,
          commentsCount: item.food.commentsCount,
          foodPartner: item.food.foodPartner,
        }));
        setVideos(savedFoods);
      })
      .catch(console.log);
  }, []);

  const removeSaved = async (item) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/food/save`,
        { foodId: item._id },
        authHeaders()
      )
      setVideos((prev) => prev.filter((v) => v._id !== item._id))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ReelFeed
      items={videos}
      onSave={removeSaved}
      emptyMessage="No saved videos yet."
    />
  );
};

export default Saved;