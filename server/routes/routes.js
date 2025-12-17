import express from "express";
import auth_router from "./auth.routes.js";
import analysis_router from "./analysis.routes.js";

const router = express.Router();

router.use("/auth", auth_router);
router.use("/analysis", analysis_router);

export default router;
