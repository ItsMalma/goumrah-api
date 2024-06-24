import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	embarkationInputSchema,
	embarkationParamSchema,
} from "../schemas/embarkation.schema";
import EmbarkationService from "../services/embarkation.service";

const embarkationController = new Hono()
	.basePath("/embarkations")
	.post("", validate("json", embarkationInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await EmbarkationService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await EmbarkationService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", embarkationParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await EmbarkationService.instance.get(param);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", embarkationParamSchema),
		validate("json", embarkationInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await EmbarkationService.instance.update(param, input);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", embarkationParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await EmbarkationService.instance.delete(param);

		return c.json(output);
	});

export default embarkationController;
