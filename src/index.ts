import { Hono } from "hono";
import { cors } from "hono/cors";
import embarkationController from "./controllers/embarkation.controller";
import { formatter } from "./middlewares/formatter.middleware";
import ErrorService from "./services/error.service";

const app = new Hono();
app.use(formatter);
app.use(cors());
app.onError(async (err, c) => {
	const [body, status, isJSON] = await ErrorService.instance.handle(err);
	if (isJSON) return c.json(body, status);
	return c.text(body, status);
});
app.route("/", embarkationController);

export default app;
