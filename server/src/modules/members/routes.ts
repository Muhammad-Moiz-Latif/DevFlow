import { allowedRoles } from "../../middlewares/allowedMembers";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { memberControllers } from "./controllers";
import { Router } from "express";

export const router = Router({
    mergeParams: true
});


// gets all members in current workspace
router.get("/", verifyJWT, memberControllers.getAllWorkspaceMembers);

router.delete('/:memberId', verifyJWT, allowedRoles(['ADMIN']), memberControllers.deleteWorkspaceMember);

router.patch('/:memberId/role', verifyJWT, allowedRoles(['ADMIN']), memberControllers.updateWorkspaceMember);
