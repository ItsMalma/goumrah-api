import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import { createEmbarkationSchema } from "../schemas/embarkation.schema";
import embarkationService from "../services/embarkation.service";
import { findSchema } from "../schemas/common";

const embarkationRoute = new Hono()
  .basePath("/embarkations")
  .post("", validate("json", createEmbarkationSchema), async (c) => {
    const input = c.req.valid("json");

    const [output, status] = await embarkationService.create(input);

    return c.json(output, status);
  })
  .get("", async (c) => {
    const [output, status] = await embarkationService.read();

    return c.json(output, status);
  })
  .get("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await embarkationService.readOne(param.id);

    return c.json(output, status);
  })
  .put(
    "/:id",
    validate("param", findSchema),
    validate("json", createEmbarkationSchema),
    async (c) => {
      const param = c.req.valid("param");
      const input = c.req.valid("json");

      const [output, status] = await embarkationService.update(param.id, input);

      return c.json(output, status);
    }
  )
  .delete("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await embarkationService.delete(param.id);

    return c.json(output, status);
  });

export default embarkationRoute;
