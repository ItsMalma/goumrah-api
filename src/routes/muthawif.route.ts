import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import { findSchema } from "../schemas/common";
import { createMuthawifSchema } from "../schemas/muthawif.schema";
import muthawifService from "../services/muthawif.service";

const muthawifRoute = new Hono()
  .basePath("/muthawif")
  .post("", validate("json", createMuthawifSchema), async (c) => {
    const input = c.req.valid("json");

    const [output, status] = await muthawifService.create(input);

    return c.json(output, status);
  })
  .get("", async (c) => {
    const [output, status] = await muthawifService.read();

    return c.json(output, status);
  })
  .get("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await muthawifService.readOne(param.id);

    return c.json(output, status);
  })
  .put(
    "/:id",
    validate("param", findSchema),
    validate("json", createMuthawifSchema),
    async (c) => {
      const param = c.req.valid("param");
      const input = c.req.valid("json");

      const [output, status] = await muthawifService.update(param.id, input);

      return c.json(output, status);
    }
  )
  .delete("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await muthawifService.delete(param.id);

    return c.json(output, status);
  });

export default muthawifRoute;
