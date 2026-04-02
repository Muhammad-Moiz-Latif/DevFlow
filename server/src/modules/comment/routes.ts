import { Router } from "express";
import { commentControllers } from "./controllers";
import { verifyJWT } from "../../middlewares/verifyJWT";

export const router = Router({
    mergeParams: true
});

router.post('/create-comment', verifyJWT, commentControllers.createComment);

router.get('/all-comments', verifyJWT, commentControllers.getAllComments);

router.patch('/comment/:commentId', verifyJWT, commentControllers.editComment);

router.delete('/comment/:commentId', verifyJWT, commentControllers.deleteComment);
