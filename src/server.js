import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";

const App = express();
const logger = morgan("dev");

App.set("view engine", "pug");
App.set("views", process.cwd() + "/src/views");
App.use(logger);
App.use(express.urlencoded({ extended: true }));
App.use("/", globalRouter);
App.use("/users", userRouter);
App.use("/videos", videoRouter);

export default App;
