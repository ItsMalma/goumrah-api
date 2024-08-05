import type { ColumnType, GeneratedAlways } from "kysely";
import {
  minLength,
  number,
  object,
  picklist,
  pipe,
  string,
  type InferOutput,
} from "valibot";

export const createAirlineSchema = object(
  {
    name: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
    star: pipe(number("Harus number"), picklist([1, 2, 3, 4, 5], "Harus 1-5")),
  },
  "Harus object"
);
export type CreateAirlineInput = InferOutput<typeof createAirlineSchema>;

export type AirlineOutput = {
  id: number;
  name: string;
  star: 1 | 2 | 3 | 4 | 5;
};

export type AirlineTable = {
  id: GeneratedAlways<number>;
  name: string;
  star: 1 | 2 | 3 | 4 | 5;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
