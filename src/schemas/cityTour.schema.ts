import type { ColumnType, GeneratedAlways } from "kysely";
import {
  minLength,
  object,
  picklist,
  pipe,
  string,
  type InferOutput,
} from "valibot";

export const createCityTourSchema = object(
  {
    city: pipe(
      string("Harus string"),
      picklist(["Makkah", "Madinah"], "Harus Makkah atau Madinah")
    ),
    name: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
    description: pipe(
      string("Harus string"),
      minLength(1, "Tidak boleh kosong")
    ),
  },
  "Harus object"
);
export type CreateCityTour = InferOutput<typeof createCityTourSchema>;

export type CityTourOutput = {
  id: number;
  city: "Makkah" | "Madinah";
  name: string;
  description: string;
};

export type CityTourTable = {
  id: GeneratedAlways<number>;
  city: "Makkah" | "Madinah";
  name: string;
  description: string;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
