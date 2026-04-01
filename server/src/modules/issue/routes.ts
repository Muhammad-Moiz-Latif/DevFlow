import { Router } from "express";
import { IssueControllers } from "./controllers";
import { verifyJWT } from "../../middlewares/verifyJWT";
import { allowedRoles } from "../../middlewares/allowedMembers";

export const router = Router({
    mergeParams: true
});


router.post("/create-issue", verifyJWT, allowedRoles(['ADMIN', 'MEMBER']), IssueControllers.createIssue);

router.get('/all-issues', verifyJWT, IssueControllers.getAllIssues);

router.get('/issue/:issueId', verifyJWT, IssueControllers.getIssue);

router.patch('/issue/:issueId', verifyJWT, allowedRoles(['ADMIN', 'MEMBER']), IssueControllers.updateIssue);

router.delete('/issue/:issueId', verifyJWT, allowedRoles(['ADMIN']), IssueControllers.deleteIssue);

router.get('/my-issues', verifyJWT, IssueControllers.myIssues);

