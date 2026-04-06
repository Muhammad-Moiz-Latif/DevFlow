import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { invitationControllers } from "./controllers";

export const router = Router();

router.post("/accept", verifyJWT, invitationControllers.acceptWorkspaceInvitation);