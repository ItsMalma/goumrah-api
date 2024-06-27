import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	muthowifInputSchema,
	muthowifParamSchema,
	muthowifThumbnailInputSchema,
} from "../schemas/muthowif.schema";
import MuthowifService from "../services/muthowif.service";

const muthowifController = new Hono()
	.basePath("/muthowif")
	.post("", validate("json", muthowifInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await MuthowifService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await MuthowifService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", muthowifParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await MuthowifService.instance.get(param);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", muthowifParamSchema),
		validate("json", muthowifInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await MuthowifService.instance.update(param, input);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", muthowifParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await MuthowifService.instance.delete(param);

		return c.json(output);
	})
	.put(
		"/:id/thumbnail",
		validate("param", muthowifParamSchema),
		validate("form", muthowifThumbnailInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("form");

			const output = await MuthowifService.instance.updateThumbnail(
				param,
				input,
			);

			return c.json(output);
		},
	)
	.delete(
		"/:id/thumbnail",
		validate("param", muthowifParamSchema),
		async (c) => {
			const param = c.req.valid("param");

			const output = await MuthowifService.instance.deleteThumbnail(param);

			return c.json(output);
		},
	);

export default muthowifController;
