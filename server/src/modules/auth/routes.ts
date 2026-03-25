import { Router } from "express";
import { authController } from "./controllers";
import { upload } from "../../middlewares/multer";
export const router = Router();

router.post("/register", upload.single("image"), authController.registerUser);

router.post("/resend-verification", authController.resendVerificationToken);

router.post("/verify-email", authController.verifyEmailOTP);


// router.get("")

// router.post("/login");

// router.get("/logout");


// router.post("/resend-verification");

// router.post("/forgot-password");

// router.post("/reset-password");

