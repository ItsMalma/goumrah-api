import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	roomTypeInputSchema,
	roomTypeParamSchema,
} from "../schemas/roomType.schema";
import RoomTypeService from "../services/roomType.service";

const roomTypeController = new Hono()
	.basePath("/roomTypes")
	.post("", validate("json", roomTypeInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await RoomTypeService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await RoomTypeService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", roomTypeParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await RoomTypeService.instance.getById(param, true);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", roomTypeParamSchema),
		validate("json", roomTypeInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await RoomTypeService.instance.update(param, input, true);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", roomTypeParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await RoomTypeService.instance.delete(param, true);

		return c.json(output);
	});

export default roomTypeController;
