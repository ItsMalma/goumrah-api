import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import { hotelInputSchema, hotelParamSchema } from "../schemas/hotel.schema";
import HotelService from "../services/hotel.service";

const hotelController = new Hono()
	.basePath("/hotels")
	.post("", validate("form", hotelInputSchema), async (c) => {
		const input = c.req.valid("form");

		const output = await HotelService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await HotelService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", hotelParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await HotelService.instance.get(param);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", hotelParamSchema),
		validate("form", hotelInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("form");

			const output = await HotelService.instance.update(param, input);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", hotelParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await HotelService.instance.delete(param);

		return c.json(output);
	});

export default hotelController;
