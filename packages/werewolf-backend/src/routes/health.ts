import { Middleware } from "koa";

export const health: Middleware = async (ctx) => {

  ctx.body = "pong";
};
