import type { ColumnType, GeneratedAlways } from "kysely";
import { minLength, object, pipe, string, type InferOutput } from "valibot";

export const createEmbarkationSchema = object(
  {
    name: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
  },
  "Harus object"
);
export type CreateEmbarkation = InferOutput<typeof createEmbarkationSchema>;

export type EmbarkationOutput = {
  id: number;
  name: string;
};

export type EmbarkationTable = {
  id: GeneratedAlways<number>;
  name: string;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
