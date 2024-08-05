import type { ColumnType, GeneratedAlways } from "kysely";
import { minLength, object, pipe, string, type InferOutput } from "valibot";

export const createRoomTypeSchema = object(
  {
    name: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
  },
  "Harus object"
);
export type CreateRoomTypeInput = InferOutput<typeof createRoomTypeSchema>;

export type RoomTypeOutput = {
  id: number;
  name: string;
};

export type RoomTypeTable = {
  id: GeneratedAlways<number>;
  name: string;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
