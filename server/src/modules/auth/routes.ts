import { Router } from "express";
import { authController } from "./controllers";
import { upload } from "../../middlewares/multer";
export const router = Router();

router.post("/register", upload.single("image"), authController.registerUser);

router.post("/login");

router.get("/logout");

router.post("/verify-email");

router.post("/resend-verification");

router.post("/forgot-password");

router.post("/reset-password");

