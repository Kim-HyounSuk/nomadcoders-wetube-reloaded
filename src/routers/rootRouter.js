import express from "express";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userController.js";
import { home, search } from "../controllers/videoController.js";
import { publicOnlyMiddleware } from "../middlewares.js";
import userRouter from "./userRouter.js";
import videoRouter from "./videoRouter.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);
rootRouter.use("/user", userRouter);
rootRouter.use("/video", videoRouter);

export default rootRouter;
