import { Router } from "express";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { allowedRoles } from "../../middlewares/allowedMembers";
import { invitationControllers } from "./controllers";

export const router = Router({
    mergeParams: true
});

router.post("/", verifyJWT, allowedRoles(["ADMIN"]), invitationControllers.sendWorkspaceInvitation);

router.get("/", verifyJWT, allowedRoles(["ADMIN"]), invitationControllers.getWorkspaceInvitations);

router.delete("/:invitationId", verifyJWT, allowedRoles(["ADMIN"]), invitationControllers.cancelWorkspaceInvitation);