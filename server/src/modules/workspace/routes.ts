import { Router } from "express";
import { workspaceControllers } from "./controllers";
import { upload } from "../../middlewares/multer";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { allowedRoles } from "../../middlewares/allowedMembers";

export const router = Router();

router.post('/create-workspace', upload.single("image"), verifyJWT, workspaceControllers.createWorkspace);

router.get('/:workspaceId', verifyJWT, workspaceControllers.getWorkspace);

router.get("/:workspaceId/members", verifyJWT, workspaceControllers.getAllWorkspaceMembers);

router.patch("/:workspaceId", verifyJWT, allowedRoles(['ADMIN']), workspaceControllers.updateWorkspace);

router.delete("/:workspaceId", verifyJWT, allowedRoles(['ADMIN']), workspaceControllers.deleteWorkspace);

