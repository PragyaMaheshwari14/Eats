// const foodPartnerModel = require('../models/foodpartner.model');
// const userModel = require("../models/user.model");
// const jwt = require("jsonwebtoken");

// async function authFoodPartnerMiddleware(req, res, next) {

//     const token = req.cookies.token; 

//     if(!token) {
//        return res.status(401).json({
//             message: "Please login first"
//         })
//     }

//     try { 
       
//         const decoded =  jwt.verify(token, process.env.JWT_SECRET)

//         const foodPartner = await foodPartnerModel.findById(decoded.id);

//         req.foodPartner = foodPartner
        
//         next()

//     } catch (error) {

//         return res.status(401).json({
//             message: "Invalid token"
//         })
        
//     } 
// }

// async function authUserMiddleware(req, res, next){
    
//     const token = req.cookies.token;

//     if(!token) {
//         return res.status(401).json({
//             message: "Please login first"
//         })
//     }

//     try { 
       
//         const decoded =  jwt.verify(token, process.env.JWT_SECRET)

//         const user = await userModel.findById(decoded.id);

//         req.user = user
        
//         next()

//     } catch (error) {

//         return res.status(401).json({
//             message: "Invalid token"
//         })
        
//     } 
// }

// module.exports = {
//     authFoodPartnerMiddleware,
//     authUserMiddleware
// }



// const foodPartnerModel = require('../models/foodpartner.model');
// const userModel = require("../models/user.model");
// const jwt = require("jsonwebtoken");

// async function authFoodPartnerMiddleware(req, res, next) {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Please login first" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const foodPartner = await foodPartnerModel.findById(decoded.id);

//     // Guard: token valid but ID belongs to a user, not a food partner
//     if (!foodPartner) {
//       return res.status(401).json({ message: "Unauthorized: food partner account not found" });
//     }

//     req.foodPartner = foodPartner;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

// async function authUserMiddleware(req, res, next) {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ message: "Please login first" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await userModel.findById(decoded.id);

//     // Guard: token valid but ID belongs to a food partner, not a user
//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized: user account not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// }

// module.exports = {
//   authFoodPartnerMiddleware,
//   authUserMiddleware,
// };


const foodPartnerModel = require('../models/foodpartner.model');
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foodPartner = await foodPartnerModel.findById(decoded.id);

    // Guard: token valid but ID belongs to a user, not a food partner
    if (!foodPartner) {
      return res.status(401).json({ message: "Unauthorized: food partner account not found" });
    }

    req.foodPartner = foodPartner;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    // Guard: token valid but ID belongs to a food partner, not a user
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user account not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = {
  authFoodPartnerMiddleware,
  authUserMiddleware,
};