import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	airportInputSchema,
	airportParamSchema,
} from "../schemas/airport.schema";
import AirportService from "../services/airport.service";

const airportController = new Hono()
	.basePath("/airports")
	.post("", validate("json", airportInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await AirportService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await AirportService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", airportParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await AirportService.instance.get(param);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", airportParamSchema),
		validate("json", airportInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await AirportService.instance.update(param, input);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", airportParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await AirportService.instance.delete(param);

		return c.json(output);
	});

export default airportController;
