import { Router } from "express";
import { projectControllers } from "./controllers";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { allowedRoles } from "../../middlewares/allowedMembers";


export const router = Router({ mergeParams: true });

router.post('/project/create-project', verifyJWT, allowedRoles(['ADMIN', 'MEMBER']), projectControllers.createProjectInsideWorkspace);

router.get('/project', verifyJWT, projectControllers.getAllProjects);

router.get('/project/:projectId', verifyJWT, projectControllers.getProject);

router.patch('/project/:projectId', verifyJWT, allowedRoles(['ADMIN', 'MEMBER']), projectControllers.updateProject);

router.delete("/project/:projectId", verifyJWT, allowedRoles(['ADMIN']));