import { Router } from "express";
import { authController } from "./controllers";
import { upload } from "../../middlewares/multer";
export const router = Router();

// REGISTRATION ENDPOINTS
router.post("/register", upload.single("image"), authController.registerUser);

router.post("/resend-verification", authController.resendVerificationToken);

router.post("/verify-email", authController.verifyEmailOTP);


// LOGIN ENDPOINTS
router.post("/login", authController.loginUser);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);


// GENERAL ENDPOINTS
router.get("/refresh-access-token", authController.refreshAccessToken);

router.get("/logout", authController.handleLogout);




