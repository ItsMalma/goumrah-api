import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	busInputSchema,
	busParamSchema,
	busThumbnailInputSchema,
} from "../schemas/bus.schema";
import BusService from "../services/bus.service";

const busController = new Hono()
	.basePath("/buss")
	.post("", validate("json", busInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await BusService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await BusService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", busParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await BusService.instance.get(param);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", busParamSchema),
		validate("json", busInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await BusService.instance.update(param, input);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", busParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await BusService.instance.delete(param);

		return c.json(output);
	})
	.put(
		"/:id/thumbnail",
		validate("param", busParamSchema),
		validate("form", busThumbnailInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("form");

			const output = await BusService.instance.updateThumbnail(param, input);

			return c.json(output);
		},
	)
	.delete("/:id/thumbnail", validate("param", busParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await BusService.instance.deleteThumbnail(param);

		return c.json(output);
	});

export default busController;
