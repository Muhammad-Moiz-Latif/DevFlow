import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { invitationControllers } from "./controllers";

export const router = Router();

router.get("/get-workspace-invitation", invitationControllers.getWorkspaceInvitation);

router.post("/accept", verifyJWT, invitationControllers.acceptWorkspaceInvitation);