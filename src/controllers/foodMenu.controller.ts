import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	foodMenuInputSchema,
	foodMenuParamSchema,
} from "../schemas/foodMenu.schema";
import FoodMenuService from "../services/foodMenu.service";

const foodMenuController = new Hono()
	.basePath("/foodMenus")
	.post("", validate("json", foodMenuInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await FoodMenuService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await FoodMenuService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", foodMenuParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await FoodMenuService.instance.get(param);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", foodMenuParamSchema),
		validate("json", foodMenuInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await FoodMenuService.instance.update(param, input);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", foodMenuParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await FoodMenuService.instance.delete(param);

		return c.json(output);
	});

export default foodMenuController;
