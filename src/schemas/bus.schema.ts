import type { ColumnType, GeneratedAlways } from "kysely";
import { minLength, object, pipe, string, type InferOutput } from "valibot";

export const createBusSchema = object(
  {
    name: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
  },
  "Harus object"
);
export type CreateBusInput = InferOutput<typeof createBusSchema>;

export type BusOutput = {
  id: number;
  name: string;
};

export type BusTable = {
  id: GeneratedAlways<number>;
  name: string;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
