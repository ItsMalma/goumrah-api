import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import { findSchema } from "../schemas/common";
import { createBusSchema } from "../schemas/bus.schema";
import busService from "../services/bus.service";

const busRoute = new Hono()
  .basePath("/buses")
  .post("", validate("json", createBusSchema), async (c) => {
    const input = c.req.valid("json");

    const [output, status] = await busService.create(input);

    return c.json(output, status);
  })
  .get("", async (c) => {
    const [output, status] = await busService.read();

    return c.json(output, status);
  })
  .get("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await busService.readOne(param.id);

    return c.json(output, status);
  })
  .put(
    "/:id",
    validate("param", findSchema),
    validate("json", createBusSchema),
    async (c) => {
      const param = c.req.valid("param");
      const input = c.req.valid("json");

      const [output, status] = await busService.update(param.id, input);

      return c.json(output, status);
    }
  )
  .delete("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await busService.delete(param.id);

    return c.json(output, status);
  });

export default busRoute;
