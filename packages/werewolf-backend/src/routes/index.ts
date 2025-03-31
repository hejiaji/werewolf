import * as Router from "koa-router";

import UseAuth from "../middleware/auth";
import { health } from "./health";
import gameRouter from "./gameRoutes";
import roomRouter from "./roomRoutes";

const router = new Router();

router
  .all("/health", health)
  .use("/room", roomRouter.routes(), roomRouter.allowedMethods())
  .use(
    "/game",
    UseAuth(),
    gameRouter.routes(),
    gameRouter.allowedMethods()
  );

export default router;
