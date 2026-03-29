import { Router } from "express";
import { workspaceControllers } from "./controllers";
import { upload } from "../../middlewares/multer";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { allowedRoles } from "../../middlewares/allowedMembers";

export const router = Router();

router.post('/create-workspace', upload.single("image"), verifyJWT, workspaceControllers.createWorkspace);

router.get('/workspace/:workspaceId', verifyJWT, workspaceControllers.getWorkspace);

router.get("/workspace/:workspaceId/members", verifyJWT, workspaceControllers.getAllWorkspaceMembers);

router.post('/create-project/:workspaceId', verifyJWT, allowedRoles(['ADMIN', 'MEMBER']), workspaceControllers.createProjectInsideWorkspace);

// GET    /workspace/:workspaceId              → get single workspace
// GET    /workspace/:workspaceId/members      → get all members of workspace
// DELETE /workspace/:workspaceId              → delete workspace (admin only)
// PATCH  /workspace/:workspaceId              → update name, slug, logo (admin only)