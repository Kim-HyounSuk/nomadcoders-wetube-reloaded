import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";
import { localsMiddleware } from "./middlewares.js";

const App = express();
const logger = morgan("dev");

App.set("view engine", "pug");
App.set("views", process.cwd() + "/src/views");
App.use(logger);
App.use(express.urlencoded({ extended: true }));

App.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

App.use(localsMiddleware);
App.use("/uploads", express.static("uploads"));
App.use("/static", express.static("assets"));
App.use("/", rootRouter);
App.use("/users", userRouter);
App.use("/videos", videoRouter);

export default App;
