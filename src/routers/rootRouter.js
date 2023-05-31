import express from "express";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userController.js";
import { home, search } from "../controllers/videoController.js";
import userRouter from "./userRouter.js";
import videoRouter from "./videoRouter.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);
rootRouter.use("/user", userRouter);
rootRouter.use("/video", videoRouter);

export default rootRouter;
