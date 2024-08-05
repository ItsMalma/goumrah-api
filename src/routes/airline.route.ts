import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import { findSchema } from "../schemas/common";
import { createAirlineSchema } from "../schemas/airline.schema";
import airlineService from "../services/airline.service";

const airlineRoute = new Hono()
  .basePath("/airlines")
  .post("", validate("json", createAirlineSchema), async (c) => {
    const input = c.req.valid("json");

    const [output, status] = await airlineService.create(input);

    return c.json(output, status);
  })
  .get("", async (c) => {
    const [output, status] = await airlineService.read();

    return c.json(output, status);
  })
  .get("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await airlineService.readOne(param.id);

    return c.json(output, status);
  })
  .put(
    "/:id",
    validate("param", findSchema),
    validate("json", createAirlineSchema),
    async (c) => {
      const param = c.req.valid("param");
      const input = c.req.valid("json");

      const [output, status] = await airlineService.update(param.id, input);

      return c.json(output, status);
    }
  )
  .delete("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await airlineService.delete(param.id);

    return c.json(output, status);
  });

export default airlineRoute;
