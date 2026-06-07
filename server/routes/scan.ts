import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { scanUrl, getScanHistory } from "../controllers/scanController";
import { deleteScan, clearAllScans } from "../models/scanModel.js";

const router = Router();

router.get("/", requireAuth, scanUrl);
router.get("/history", requireAuth, getScanHistory);
router.delete("/delete", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { scanId } = req.body;
    const userId = req.userId!;
    await deleteScan(scanId, userId);
    res.json({ message: "Scan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete scan" });
  }
});
router.delete("/clear-all", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    await clearAllScans(userId);
    res.json({ message: "All scans cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear scans" });
  }
});

export default router;
