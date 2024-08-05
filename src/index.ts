import { Hono } from "hono";
import embarkationRoute from "./routes/embarkation.route";
import hotelRoute from "./routes/hotel.route";
import airlineRoute from "./routes/airline.route";
import busRoute from "./routes/bus.route";
import roomTypeRoute from "./routes/roomType.route";
import cityTourRoute from "./routes/cityTour.route";
import muthawifRoute from "./routes/muthawif.route";
import errorHandler from "./error-handler";
import { setDefaultOptions } from "date-fns";
import { id } from "date-fns/locale";

setDefaultOptions({
  locale: id,
});

const app = new Hono()
  .onError(errorHandler)
  .route("", embarkationRoute)
  .route("", hotelRoute)
  .route("", airlineRoute)
  .route("", busRoute)
  .route("", roomTypeRoute)
  .route("", cityTourRoute)
  .route("", muthawifRoute);

export default app;
