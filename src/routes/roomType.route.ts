import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import { findSchema } from "../schemas/common";
import { createRoomTypeSchema } from "../schemas/roomType.schema";
import roomTypeService from "../services/roomType.service";

const roomTypeRoute = new Hono()
  .basePath("/room-types")
  .post("", validate("json", createRoomTypeSchema), async (c) => {
    const input = c.req.valid("json");

    const [output, status] = await roomTypeService.create(input);

    return c.json(output, status);
  })
  .get("", async (c) => {
    const [output, status] = await roomTypeService.read();

    return c.json(output, status);
  })
  .get("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await roomTypeService.readOne(param.id);

    return c.json(output, status);
  })
  .put(
    "/:id",
    validate("param", findSchema),
    validate("json", createRoomTypeSchema),
    async (c) => {
      const param = c.req.valid("param");
      const input = c.req.valid("json");

      const [output, status] = await roomTypeService.update(param.id, input);

      return c.json(output, status);
    }
  )
  .delete("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await roomTypeService.delete(param.id);

    return c.json(output, status);
  });

export default roomTypeRoute;
