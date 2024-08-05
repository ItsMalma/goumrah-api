import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import { findSchema } from "../schemas/common";
import { createCityTourSchema } from "../schemas/cityTour.schema";
import cityTourService from "../services/cityTour.service";

const cityTourRoute = new Hono()
  .basePath("/city-tours")
  .post("", validate("json", createCityTourSchema), async (c) => {
    const input = c.req.valid("json");

    const [output, status] = await cityTourService.create(input);

    return c.json(output, status);
  })
  .get("", async (c) => {
    const [output, status] = await cityTourService.read();

    return c.json(output, status);
  })
  .get("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await cityTourService.readOne(param.id);

    return c.json(output, status);
  })
  .put(
    "/:id",
    validate("param", findSchema),
    validate("json", createCityTourSchema),
    async (c) => {
      const param = c.req.valid("param");
      const input = c.req.valid("json");

      const [output, status] = await cityTourService.update(param.id, input);

      return c.json(output, status);
    }
  )
  .delete("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await cityTourService.delete(param.id);

    return c.json(output, status);
  });

export default cityTourRoute;
