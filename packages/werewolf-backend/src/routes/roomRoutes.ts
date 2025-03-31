import * as Router from "koa-router";

import roomCreate from "../handlers/http/roomCreate";
import roomJoin from "../handlers/http/roomJoin";
import roomInit from "../handlers/http/roomInit";
import roomSeatUpdate from "../handlers/http/roomSeatUpdate";

const roomRouter = new Router();

roomRouter.post("room create", "/create", roomCreate);
roomRouter.post("room join", "/join", roomJoin);
roomRouter.post("room init", "/init", roomInit);
roomRouter.post("room change index", "/seat", roomSeatUpdate)

export default roomRouter;
