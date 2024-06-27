import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	aircraftInputSchema,
	aircraftParamSchema,
} from "../schemas/aircraft.schema";
import AircraftService from "../services/aircraft.service";

const aircraftController = new Hono()
	.basePath("/aircrafts")
	.post("", validate("json", aircraftInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await AircraftService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await AircraftService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", aircraftParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await AircraftService.instance.get(param);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", aircraftParamSchema),
		validate("json", aircraftInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await AircraftService.instance.update(param, input);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", aircraftParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await AircraftService.instance.delete(param);

		return c.json(output);
	});

export default aircraftController;
