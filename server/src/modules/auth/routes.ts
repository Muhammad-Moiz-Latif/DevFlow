import { Router } from "express";

export const router = Router();

router.post("/register");

router.post("/login");

router.get("/logout");

router.post("/verify-email");

router.post("/resend-verification");

router.post("/forgot-password");

router.post("/reset-password");

