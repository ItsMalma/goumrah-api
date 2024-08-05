import type { ColumnType, GeneratedAlways } from "kysely";
import {
  array,
  check,
  minLength,
  number,
  object,
  picklist,
  pipe,
  string,
  url,
  type InferOutput,
} from "valibot";

export const createHotelSchema = object(
  {
    type: pipe(
      string("Harus string"),
      picklist(["Makkah", "Madinah"], "Harus Makkah atau Madinah")
    ),
    name: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
    star: pipe(number("Harus number"), picklist([1, 2, 3, 4, 5], "Harus 1-5")),
    facilities: array(
      object(
        {
          icon: pipe(
            string("Harus string"),
            minLength(1, "Tidak boleh kosong")
          ),
          name: pipe(
            string("Harus string"),
            minLength(1, "Tidak boleh kosong")
          ),
        },
        "Harus object"
      ),
      "Harus array"
    ),
    description: pipe(
      string("Harus string"),
      minLength(1, "Tidak boleh kosong")
    ),
    distanceFromKabbahInMeter: pipe(
      number("Harus number"),
      check((input) => input >= 0, "Tidak boleh negatif")
    ),
    mapLink: pipe(
      string("Harus string"),
      minLength(1, "Tidak boleh kosong"),
      url("Harus URL")
    ),
    address: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
    foodType: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
    foodAmountPerDay: pipe(
      number("Harus number"),
      check((input) => input > 0, "Harus lebih dari 0")
    ),
    foodMenu: array(
      object({
        amount: pipe(
          number("Harus number"),
          check((input) => input > 0, "Harus lebih dari 0")
        ),
        name: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
      }),
      "Harus array"
    ),
    reviewLink: pipe(
      string("Harus string"),
      minLength(1, "Tidak boleh kosong"),
      url("Harus URL")
    ),
  },
  "Harus object"
);
export type CreateHotel = InferOutput<typeof createHotelSchema>;

export type HotelFacilityOutput = {
  icon: string;
  name: string;
};

export type HotelFoodMenuOutput = {
  amount: number;
  name: string;
};

export type HotelOutput = {
  id: number;
  type: "Makkah" | "Madinah";
  name: string;
  star: 1 | 2 | 3 | 4 | 5;
  facilities: HotelFacilityOutput[];
  description: string;
  distanceFromKabbahInMeter: number;
  mapLink: string;
  address: string;
  foodType: string;
  foodAmountPerDay: number;
  foodMenu: HotelFoodMenuOutput[];
  reviewLink: string;
};

export type HotelFacilityTable = {
  hotel_id: number;
  icon: string;
  name: string;
};

export type HotelFoodMenuTable = {
  hotel_id: number;
  amount: number;
  name: string;
};

export type HotelTable = {
  id: GeneratedAlways<number>;
  type: "Makkah" | "Madinah";
  name: string;
  star: 1 | 2 | 3 | 4 | 5;
  description: string;
  distance_from_kabbah_in_meter: number;
  map_link: string;
  address: string;
  food_type: string;
  food_amount_per_day: number;
  review_link: string;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
