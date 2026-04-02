import { verifyJWT } from "../../middlewares/verifyJWT";
import { memberControllers } from "./controllers";
import { Router } from "express";

export const router = Router({
    mergeParams: true
});

router.get("/:workspaceId/members", verifyJWT, memberControllers.getAllWorkspaceMembers);
