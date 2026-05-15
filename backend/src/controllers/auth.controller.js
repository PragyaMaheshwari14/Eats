// const userModel = require("../models/user.model");
// const foodPartnerModel = require("../models/foodpartner.model");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// async function registerUser(req, res) {
//   const { fullName, email, password } = req.body;

//   const isUserAlreadyExist = await userModel.findOne({
//     email,
//   });

//   if (isUserAlreadyExist) {
//     return res.status(400).json({
//       message: "User already exists",
//     });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await userModel.create({
//     fullName,
//     email,
//     password: hashedPassword,
//   });

//   const token = jwt.sign(
//     {
//       id: user._id,
//     },
//     process.env.JWT_SECRET,
//   );
  
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none"
// });

//   res.status(201).json({
//     message: "User registered successfully",
//     user: {
//       _id: user._id,
//       email: user.email,
//       fullName: user.fullName,
//     },
//   });
// }

// async function loginUser(req, res) {
//   const { email, password } = req.body;

//   const user = await userModel.findOne({
//     email,
//   });

//   if (!user) {
//     return res.status(400).json({
//       message: "Invalid email or password",
//     });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     return res.status(400).json({
//       message: "Invalid email or password",
//     });
//   }

//   const token = jwt.sign({
//     id: user._id,
//   }, process.env.JWT_SECRET);

//  res.cookie("token", token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none"
// });

//   res.status(200).json({
//     message: "User logged in successfully",
//     user: {
//       _id: user._id,
//       email: user.email,
//       fullName: user.fullName,
//     },
//   });
// }

// async function logoutUser(req, res) {
//     res.clearCookie("token");
//     res.status(200).json({
//         message: "User logged out successfully",
//     })
// }

// async function registerFoodPartner(req, res) {

//     const {name, email, password, phone, address, contactName} = req.body;

//     const isAccountAlreadyExists = await foodPartnerModel.findOne({
//         email
//     })

//     if(isAccountAlreadyExists){
//         return res.status(400).json({
//             message: "Food partner account already exists"
//         })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const foodPartner = await foodPartnerModel.create({
//         name,
//         email,
//         password: hashedPassword,
//         phone,
//         address,
//         contactName
//     })

//     const token = jwt.sign({
//         id: foodPartner._id,    
//     }, process.env.JWT_SECRET)

//     res.cookie("token", token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none"
// });

//     res.status(201).json({
//         message: "Food partner registered successfully",
//         foodPartner: {
//             _id: foodPartner._id,
//             email: foodPartner.email,
//             name: foodPartner.name,
//             phone: foodPartner.phone,
//             address: foodPartner.address,
//             contactName: foodPartner.contactName
//         }
//     })
// }

// async function loginFoodPartner(req, res) {
    
//     const { email, password } = req.body;

//     const foodPartner = await foodPartnerModel.findOne({
//         email
//     });

//     if (!foodPartner) {
//         return res.status(400).json({
//             message: "Invalid email or password"
//         });
//     }

//     const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

//     if (!isPasswordValid) {
//         return res.status(400).json({
//             message: "Invalid email or password"
//         });
//     }

//     const token = jwt.sign({
//         id: foodPartner._id,
//     }, process.env.JWT_SECRET);

//     res.cookie("token", token, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "none"
// });

//     res.status(200).json({
//         message: "Food partner logged in successfully",
//         foodPartner: {
//             _id: foodPartner._id,
//             email: foodPartner.email,
//             name: foodPartner.name
//         }
//     });
// }

// function logoutFoodPartner(req, res) {
//     res.clearCookie("token");
//     res.status(200).json({
//         message: "Food partner logged out successfully",
//     })
// }

// module.exports = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   registerFoodPartner,
//   loginFoodPartner,
//   logoutFoodPartner
// };



const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email and password are required" });
    }

    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({ fullName, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

    res.status(200).json({
      message: "User logged in successfully",
      user: { _id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("logoutUser error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function registerFoodPartner(req, res) {
  try {
    const { name, email, password, phone, address, contactName } = req.body;

    if (!name || !email || !password || !phone || !address || !contactName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });

    if (isAccountAlreadyExists) {
      return res.status(400).json({ message: "Food partner account already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      name, email, password: hashedPassword, phone, address, contactName,
    });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

    res.status(201).json({
      message: "Food partner registered successfully",
      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        phone: foodPartner.phone,
        address: foodPartner.address,
        contactName: foodPartner.contactName,
      },
    });
  } catch (error) {
    console.error("registerFoodPartner error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

    res.status(200).json({
      message: "Food partner logged in successfully",
      foodPartner: { _id: foodPartner._id, email: foodPartner.email, name: foodPartner.name },
    });
  } catch (error) {
    console.error("loginFoodPartner error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

function logoutFoodPartner(req, res) {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Food partner logged out successfully" });
  } catch (error) {
    console.error("logoutFoodPartner error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};