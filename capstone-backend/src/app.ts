import { Env, Hono } from "hono";
import { cors } from "hono/cors";
import api from "./routes/v1/api.ts";

const app = new Hono<Env>();
app.use(
  "*",
  cors({ origin: "*" }),
);

// Routes
app.get("/", (c) => {
  return c.html("This api is up and running.");
});
app.route("/", api);

export default app;
