import type { ColumnType, GeneratedAlways } from "kysely";
import { minLength, object, pipe, string, type InferOutput } from "valibot";

export const createMuthawifSchema = object(
  {
    name: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
    bio: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
  },
  "Harus object"
);
export type CreateMuthawif = InferOutput<typeof createMuthawifSchema>;

export type MuthawifOutput = {
  id: number;
  name: string;
  bio: string;
};

export type MuthawifTable = {
  id: GeneratedAlways<number>;
  name: string;
  bio: string;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
