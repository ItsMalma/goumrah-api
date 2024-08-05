import { Hono } from "hono";
import { validate } from "../middlewares/validate.middleware";
import { findSchema } from "../schemas/common";
import { createHotelSchema } from "../schemas/hotel.schema";
import hotelService from "../services/hotel.service";

const hotelRoute = new Hono()
  .basePath("/hotels")
  .post("", validate("json", createHotelSchema), async (c) => {
    const input = c.req.valid("json");

    const [output, status] = await hotelService.create(input);

    return c.json(output, status);
  })
  .get("", async (c) => {
    const [output, status] = await hotelService.read();

    return c.json(output, status);
  })
  .get("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await hotelService.readOne(param.id);

    return c.json(output, status);
  })
  .put(
    "/:id",
    validate("param", findSchema),
    validate("json", createHotelSchema),
    async (c) => {
      const param = c.req.valid("param");
      const input = c.req.valid("json");

      const [output, status] = await hotelService.update(param.id, input);

      return c.json(output, status);
    }
  )
  .delete("/:id", validate("param", findSchema), async (c) => {
    const param = c.req.valid("param");

    const [output, status] = await hotelService.delete(param.id);

    return c.json(output, status);
  });

export default hotelRoute;
