import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import type { EmbarkationTable } from "./schemas/embarkation.schema";
import type {
  HotelFacilityTable,
  HotelFoodMenuTable,
  HotelTable,
} from "./schemas/hotel.schema";
import type { AirlineTable } from "./schemas/airline.schema";
import type { BusTable } from "./schemas/bus.schema";
import type { RoomTypeTable } from "./schemas/roomType.schema";
import type { CityTourTable } from "./schemas/cityTour.schema";
import type { MuthawifTable } from "./schemas/muthawif.schema";
import type {
  BundleCityTourTable,
  BundleLegTable,
  BundleMuthawifTable,
  BundleTable,
} from "./schemas/bundle.schema";
import type { BundleReviewTable } from "./schemas/bundleReview.schema";
import type { BundleDetailTable } from "./schemas/bundleDetail.schema";

export type Database = {
  embarkations: EmbarkationTable;
  hotels: HotelTable;
  hotels_facilities: HotelFacilityTable;
  hotels_food_menu: HotelFoodMenuTable;
  airlines: AirlineTable;
  buses: BusTable;
  room_types: RoomTypeTable;
  city_tours: CityTourTable;
  muthawif: MuthawifTable;
  bundles: BundleTable;
  bundle_reviews: BundleReviewTable;
  bundle_details: BundleDetailTable;
  bundle_legs: BundleLegTable;
  bundles_city_tours: BundleCityTourTable;
  bundles_muthawif: BundleMuthawifTable;
};

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    connectionString: `postgres://${Bun.env.PG_USER}:${Bun.env.PG_PASS}@${Bun.env.PG_HOST}:${Bun.env.PG_PORT}/${Bun.env.PG_DB}`,
    max: 10,
  }),
});

const db = new Kysely<Database>({ dialect, log: ["query", "error"] });

export default db;
