import type { ColumnType, GeneratedAlways } from "kysely";
import type { EmbarkationOutput } from "./embarkation.schema";
import type { RoomTypeOutput } from "./roomType.schema";

export type BundleDetailOutput = {
  id: number;
  date: Date;
  embarkation: EmbarkationOutput;
  roomType: RoomTypeOutput;
  price: number;
  discount: number;
};

export type BundleDetailTable = {
  id: GeneratedAlways<number>;
  bundle_id: number;
  date: Date;
  embarkation_id: number;
  room_type_id: number;
  price: number;
  discount: number;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
