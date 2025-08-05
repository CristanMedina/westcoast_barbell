import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { getCompanyInfo, setCompanyInfo, updateCompanyInfo } from "../controllers/company.controller.js";

const router = express.Router();

router.get("/", authenticate, getCompanyInfo);
router.post("/", authenticate, isAdmin, setCompanyInfo);
router.put("/", authenticate, isAdmin, updateCompanyInfo);

export default router;
