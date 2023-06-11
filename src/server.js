import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter.js";
import userRouter from "./routers/userRouter.js";
import videoRouter from "./routers/videoRouter.js";
import { localsMiddleware } from "./middlewares.js";
import apiRouter from "./routers/apiRouter.js";

const App = express();
const logger = morgan("dev");

App.set("view engine", "pug");
App.set("views", process.cwd() + "/src/views");
App.use(logger);
App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

App.use(function (req, res, next) {
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

App.use(localsMiddleware);
App.use("/uploads", express.static("uploads"));
App.use("/static", express.static("assets"));
App.use("/", rootRouter);
App.use("/users", userRouter);
App.use("/videos", videoRouter);
App.use("/api", apiRouter);

export default App;
