import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import router from "./routes/routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
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

app.listen(PORT, () => {
  console.log(`Server is started on port ${PORT}`);
});
