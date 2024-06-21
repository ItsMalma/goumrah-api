import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	foodTypeInputSchema,
	foodTypeParamSchema,
} from "../schemas/foodType.schema";
import FoodTypeService from "../services/foodType.service";

const foodTypeController = new Hono()
	.basePath("/foodTypes")
	.post("", validate("json", foodTypeInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await FoodTypeService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await FoodTypeService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", foodTypeParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await FoodTypeService.instance.getById(param, true);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", foodTypeParamSchema),
		validate("json", foodTypeInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await FoodTypeService.instance.update(param, input, true);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", foodTypeParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await FoodTypeService.instance.delete(param, true);

		return c.json(output);
	});

export default foodTypeController;
