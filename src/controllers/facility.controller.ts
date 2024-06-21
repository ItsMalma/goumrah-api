import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import {
	facilityInputSchema,
	facilityParamSchema,
} from "../schemas/facility.schema";
import FacilityService from "../services/facility.service";

const facilityController = new Hono()
	.basePath("/facilities")
	.post("", validate("json", facilityInputSchema), async (c) => {
		const input = c.req.valid("json");

		const output = await FacilityService.instance.create(input);

		return c.json(output, 201);
	})
	.get("", async (c) => {
		const output = await FacilityService.instance.getAll();

		return c.json(output);
	})
	.get("/:id", validate("param", facilityParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await FacilityService.instance.getById(param, true);

		return c.json(output);
	})
	.put(
		"/:id",
		validate("param", facilityParamSchema),
		validate("json", facilityInputSchema),
		async (c) => {
			const param = c.req.valid("param");
			const input = c.req.valid("json");

			const output = await FacilityService.instance.update(param, input, true);

			return c.json(output);
		},
	)
	.delete("/:id", validate("param", facilityParamSchema), async (c) => {
		const param = c.req.valid("param");

		const output = await FacilityService.instance.delete(param, true);

		return c.json(output);
	});

export default facilityController;
