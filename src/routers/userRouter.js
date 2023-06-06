import express from "express";
import {
  getEdit,
  remove,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  postEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController.js";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  uploadAvatarsMiddleware,
} from "../middlewares.js";

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(uploadAvatarsMiddleware.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/delete", remove);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;
