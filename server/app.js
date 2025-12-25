import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectDB from "./config/mongodb.js";
import router from "./routes/routes.js";
import passport from "./config/passport.js";
import { checkOllamaStatus } from "./services/llamaService.js";

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
  })
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
  })
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

app.listen(PORT, async () => {
  console.log(`✓ Server is started on port ${PORT}`);

  // Check Ollama status on startup
  console.log(" Checking Ollama/LLaMA status...");
  const ollamaRunning = await checkOllamaStatus();

  if (ollamaRunning) {
    console.log("Ollama is running and ready");
  } else {
    console.log(
      "  Ollama is not running. AI suggestions will use fallback mode."
    );
    console.log("   To enable LLaMA: Install Ollama and run 'ollama serve'");
  }
});
