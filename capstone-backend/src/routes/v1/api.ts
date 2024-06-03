import debug from "debug";
import login from "./login.ts";

import { Hono } from "hono";
import { logger } from "hono/logger";

const api = new Hono().basePath("/api/v1");
const Debug = debug("app:api");

api.use("/*", logger(Debug));
api.route("/", login);

export default api;
