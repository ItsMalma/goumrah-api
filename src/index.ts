import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import embarkationController from "./controllers/embarkation.controller";
import facilityController from "./controllers/facility.controller";
import foodMenuController from "./controllers/foodMenu.controller";
import foodTypeController from "./controllers/foodType.controller";
import hotelController from "./controllers/hotel.controller";
import roomTypeController from "./controllers/roomType.controller";
import { formatter } from "./middlewares/formatter.middleware";
import ErrorService from "./services/error.service";

const app = new Hono();
app.use(
	"/*",
	serveStatic({
		root: "static",
	}),
);
app.use(formatter);
app.use(cors());
app.onError(async (err, c) => {
	const [body, status, isJSON] = await ErrorService.instance.handle(err);
	if (isJSON) return c.json(body, status);
	return c.text(body, status);
});
app.route("/", embarkationController);
app.route("/", roomTypeController);
app.route("/", facilityController);
app.route("/", foodTypeController);
app.route("/", foodMenuController);
app.route("/", hotelController);

export default {
	port: Bun.env.PORT,
	fetch: app.fetch,
};
