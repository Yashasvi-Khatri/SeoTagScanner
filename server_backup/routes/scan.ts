import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { scanUrl, getScanHistory } from "../controllers/scanController";

const router = Router();

router.get("/", requireAuth, scanUrl);
router.get("/history", requireAuth, getScanHistory);

export default router;
