import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectDB from "./config/mongodb.js";
import router from "./routes/routes.js";
import passport from "./config/passport.js";

dotenv.config();

const app = express();

// Session configuration (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration - Allow frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", router);

connectDB();

app.get("/", (req, res) => {
  res.send("server is started");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`✓ Server is started on port ${PORT}`);

  // Check Groq AI status
  if (process.env.GROQ_API_KEY) {
    console.log("✓ Groq AI is configured and ready");
  } else {
    console.log(
      "⚠️  No Groq API key found. AI suggestions will use keyword-based fallback.",
    );
    console.log("   Add GROQ_API_KEY to .env to enable AI-powered suggestions");
  }
});
