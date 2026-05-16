// const express = require('express');
// const cookieParser = require("cookie-parser");
// const authRoutes = require('./routes/auth.routes');
// const foodRoutes = require("./routes/food.routes");
// const foodPartnerRoutes = require("./routes/food-partner.routes");
// const cors = require("cors");

// const app = express();

// app.use(cookieParser());

// app.use(express.json());

// app.use(cors({
//     origin: [
//         "http://localhost:5173",
//         "https://eats-frontend-rho.vercel.app"
//     ],
//     credentials: true
// }));

// app.get("/", (req, res)=> {
//     res.send("API Running");
// })

// app.use('/api/auth', authRoutes);
// app.use('/api/food', foodRoutes);
// app.use("/api/food-partner", foodPartnerRoutes);

// module.exports = app;

const express = require('express');
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require("./routes/food.routes");
const foodPartnerRoutes = require("./routes/food-partner.routes");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://eats-frontend-rho.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],
};

// Handle preflight OPTIONS requests for ALL routes — must be before other middleware
app.options("*", cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use("/api/food-partner", foodPartnerRoutes);

module.exports = app;