import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	airlineImagesInputSchema,
	airlineInputSchema,
	airlineParamSchema,
	airlineThumbnailInputSchema,
} from "../schemas/airline.schema";
import AirlineService from "../services/airline.service";

const airlineController = new Hono()
	.basePath("/airlines")
	.post("", validate("json", airlineInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await AirlineService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await AirlineService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", airlineParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await AirlineService.instance.get(param);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", airlineParamSchema),
		validate("json", airlineInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await AirlineService.instance.update(param, input);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", airlineParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await AirlineService.instance.delete(param);

		return c.json(output);
	})
	.put(
		"/:id/thumbnail",
		validate("param", airlineParamSchema),
		validate("form", airlineThumbnailInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("form");

			const output = await AirlineService.instance.updateThumbnail(
				param,
				input,
			);

			return c.json(output);
		},
	)
	.delete(
		"/:id/thumbnail",
		validate("param", airlineParamSchema),
		async (c) => {
			const param = c.req.valid("param");

			const output = await AirlineService.instance.deleteThumbnail(param);

			return c.json(output);
		},
	)
	.put(
		"/:id/images",
		validate("param", airlineParamSchema),
		validate("form", airlineImagesInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("form");

			const output = await AirlineService.instance.updateImages(param, input);

			return c.json(output);
		},
	)
	.delete("/:id/images", validate("param", airlineParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await AirlineService.instance.deleteImages(param);

		return c.json(output);
	});

export default airlineController;
