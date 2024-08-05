import { compareAsc, isMatch, parse } from "date-fns";
import { NoResultError, type ColumnType, type GeneratedAlways } from "kysely";
import {
  array,
  arrayAsync,
  check,
  minLength,
  nonNullishAsync,
  number,
  object,
  objectAsync,
  pipe,
  pipeAsync,
  rawTransformAsync,
  string,
  transform,
  type InferOutput,
} from "valibot";
import type { HotelOutput } from "./hotel.schema";
import type { AirlineOutput } from "./airline.schema";
import type { CityTourOutput } from "./cityTour.schema";
import type { MuthawifOutput } from "./muthawif.schema";
import type { BundleDetailOutput } from "./bundleDetail.schema";
import db from "../database";
import type { BundleReviewOutput } from "./bundleReview.schema";

export const createBundleSchema = objectAsync(
  {
    name: pipe(string("Harus string"), minLength(1, "Tidak boleh kosong")),
    usedSeat: pipe(
      number("Harus number"),
      check((input) => input >= 0, "Tidak boleh negatif")
    ),
    maxSeat: pipe(
      number("Harus number"),
      check((input) => input > 0, "Harus lebih dari 0")
    ),
    description: pipe(
      string("Harus string"),
      minLength(1, "Tidak boleh kosong")
    ),
    makkahHotel: nonNullishAsync(
      pipeAsync(
        object(
          {
            id: pipe(
              number("Harus number"),
              check((input) => input > 0, "Harus lebih dari 0")
            ),
            checkIn: pipe(
              string("Harus string"),
              check(
                (input) => isMatch(input, "dd/MM/yyyy HH:mm"),
                "Format salah"
              ),
              transform((input) => parse(input, "dd/MM/yyyy HH:mm", new Date()))
            ),
            checkOut: pipe(
              string("Harus string"),
              check(
                (input) => isMatch(input, "dd/MM/yyyy HH:mm"),
                "Format salah"
              ),
              transform((input) => parse(input, "dd/MM/yyyy HH:mm", new Date()))
            ),
          },
          "Harus object"
        ),
        check(
          ({ checkIn, checkOut }) => compareAsc(checkIn, checkOut) < 0,
          "Check-in harus sebelum check-out"
        ),
        rawTransformAsync(async ({ dataset: { value }, addIssue }) => {
          try {
            const hotel = await db
              .selectFrom("hotels")
              .selectAll()
              .where("id", "=", value.id)
              .where("deleted_at", "is", null)
              .executeTakeFirstOrThrow();

            if (hotel.type !== "Makkah") {
              addIssue({
                message: "Hotel bukan hotel di Makkah",
                path: [
                  {
                    type: "object",
                    origin: "value",
                    input: value,
                    key: "id",
                    value: value.id,
                  },
                ],
              });
            } else {
              return {
                hotel,
                checkIn: value.checkIn,
                checkOut: value.checkOut,
              };
            }
          } catch (err) {
            if (err instanceof NoResultError) {
              addIssue({
                message: "Hotel tidak ditemukan",
                path: [
                  {
                    type: "object",
                    origin: "value",
                    input: value,
                    key: "id",
                    value: value.id,
                  },
                ],
              });
            }
          }
        })
      ),
      "Terjadi kesalahan ketika mengambil hotel"
    ),
    madinahHotel: nonNullishAsync(
      pipeAsync(
        object(
          {
            id: pipe(
              number("Harus number"),
              check((input) => input > 0, "Harus lebih dari 0")
            ),
            checkIn: pipe(
              string("Harus string"),
              check(
                (input) => isMatch(input, "dd/MM/yyyy HH:mm"),
                "Format salah"
              ),
              transform((input) => parse(input, "dd/MM/yyyy HH:mm", new Date()))
            ),
            checkOut: pipe(
              string("Harus string"),
              check(
                (input) => isMatch(input, "dd/MM/yyyy HH:mm"),
                "Format salah"
              ),
              transform((input) => parse(input, "dd/MM/yyyy HH:mm", new Date()))
            ),
          },
          "Harus object"
        ),
        check(
          ({ checkIn, checkOut }) => compareAsc(checkIn, checkOut) < 0,
          "Check-in harus sebelum check-out"
        ),
        rawTransformAsync(async ({ dataset: { value }, addIssue }) => {
          try {
            const hotel = await db
              .selectFrom("hotels")
              .selectAll()
              .where("id", "=", value.id)
              .where("deleted_at", "is", null)
              .executeTakeFirstOrThrow();

            if (hotel.type !== "Madinah") {
              addIssue({
                message: "Hotel bukan hotel di Madinah",
                path: [
                  {
                    type: "object",
                    origin: "value",
                    input: value,
                    key: "id",
                    value: value.id,
                  },
                ],
              });
            } else {
              return {
                hotel,
                checkIn: value.checkIn,
                checkOut: value.checkOut,
              };
            }
          } catch (err) {
            if (err instanceof NoResultError) {
              addIssue({
                message: `Hotel dengan id ${value.id} tidak ditemukan`,
                path: [
                  {
                    type: "object",
                    origin: "value",
                    input: value,
                    key: "id",
                    value: value.id,
                  },
                ],
              });
            }
          }
        })
      ),
      "Terjadi kesalahan ketika mengambil hotel"
    ),
    airline: nonNullishAsync(
      pipeAsync(
        number("Harus number"),
        check((input) => input > 0, "Harus lebih dari 0"),
        rawTransformAsync(async ({ dataset: { value }, addIssue }) => {
          try {
            return await db
              .selectFrom("airlines")
              .selectAll()
              .where("id", "=", value)
              .where("deleted_at", "is", null)
              .executeTakeFirstOrThrow();
          } catch (err) {
            if (err instanceof NoResultError) {
              addIssue({
                message: `Airline dengan id ${value} tidak ditemukan`,
              });
            }
          }
        })
      ),
      "Terjadi kesalahan ketika mengambil airline"
    ),
    departureLegs: pipe(
      array(
        object(
          {
            takeOff: object({
              time: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong"),
                check(
                  (input) => isMatch(input, "dd/MM/yyyy HH:mm"),
                  "Format salah"
                ),
                transform((input) =>
                  parse(input, "dd/MM/yyyy HH:mm", new Date())
                )
              ),
              city: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              airport: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              airportCode: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              terminal: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
            }),
            flightNumber: pipe(
              string("Harus string"),
              minLength(1, "Tidak boleh kosong")
            ),
            aircraft: pipe(
              string("Harus string"),
              minLength(1, "Tidak boleh kosong")
            ),
            baggage: pipe(
              number("Harus number"),
              check((input) => input >= 0, "Tidak boleh negatif")
            ),
            cabinBaggage: pipe(
              number("Harus number"),
              check((input) => input >= 0, "Tidak boleh negatif")
            ),
            seatLayout: pipe(
              string("Harus string"),
              minLength(1, "Tidak boleh kosong")
            ),
            landing: object({
              time: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong"),
                check(
                  (input) => isMatch(input, "dd/MM/yyyy HH:mm"),
                  "Format salah"
                ),
                transform((input) =>
                  parse(input, "dd/MM/yyyy HH:mm", new Date())
                )
              ),
              city: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              airport: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              airportCode: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              terminal: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
            }),
          },
          "Harus object"
        ),
        "Harus array"
      ),
      minLength(1, "Tidak boleh kosong")
    ),
    returnLegs: pipe(
      array(
        object(
          {
            takeOff: object({
              time: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong"),
                check(
                  (input) => isMatch(input, "dd/MM/yyyy HH:mm"),
                  "Format salah"
                ),
                transform((input) =>
                  parse(input, "dd/MM/yyyy HH:mm", new Date())
                )
              ),
              city: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              airport: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              airportCode: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              terminal: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
            }),
            flightNumber: pipe(
              string("Harus string"),
              minLength(1, "Tidak boleh kosong")
            ),
            aircraft: pipe(
              string("Harus string"),
              minLength(1, "Tidak boleh kosong")
            ),
            baggage: pipe(
              number("Harus number"),
              check((input) => input >= 0, "Tidak boleh negatif")
            ),
            cabinBaggage: pipe(
              number("Harus number"),
              check((input) => input >= 0, "Tidak boleh negatif")
            ),
            seatLayout: pipe(
              string("Harus string"),
              minLength(1, "Tidak boleh kosong")
            ),
            landing: object({
              time: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong"),
                check(
                  (input) => isMatch(input, "dd/MM/yyyy HH:mm"),
                  "Format salah"
                ),
                transform((input) =>
                  parse(input, "dd/MM/yyyy HH:mm", new Date())
                )
              ),
              city: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              airport: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              airportCode: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
              terminal: pipe(
                string("Harus string"),
                minLength(1, "Tidak boleh kosong")
              ),
            }),
          },
          "Harus object"
        ),
        "Harus array"
      ),
      minLength(1, "Tidak boleh kosong")
    ),
    cityTours: arrayAsync(
      nonNullishAsync(
        pipeAsync(
          number("Harus number"),
          check((input) => input > 0, "Harus lebih dari 0"),
          rawTransformAsync(async ({ dataset: { value }, addIssue }) => {
            try {
              return await db
                .selectFrom("city_tours")
                .selectAll()
                .where("id", "=", value)
                .where("deleted_at", "is", null)
                .executeTakeFirstOrThrow();
            } catch (err) {
              if (err instanceof NoResultError) {
                addIssue({
                  message: `City tour dengan id ${value} tidak ditemukan`,
                });
              }
            }
          })
        ),
        "Terjadi kesalahan ketika mengambil city tour"
      ),
      "Harus array"
    ),
    muthawif: arrayAsync(
      nonNullishAsync(
        pipeAsync(
          number("Harus number"),
          check((input) => input > 0, "Harus lebih dari 0"),
          rawTransformAsync(async ({ dataset: { value }, addIssue }) => {
            try {
              return await db
                .selectFrom("muthawif")
                .selectAll()
                .where("id", "=", value)
                .where("deleted_at", "is", null)
                .executeTakeFirstOrThrow();
            } catch (err) {
              if (err instanceof NoResultError) {
                addIssue({
                  message: `Muthawif dengan id ${value} tidak ditemukan`,
                });
              }
            }
          })
        ),
        "Terjadi kesalahan ketika mengambil muthawif"
      ),
      "Harus array"
    ),
  },
  "Harus object"
);
export type CreateBundle = InferOutput<typeof createBundleSchema>;

export type BundleHotelOutput<Type extends HotelOutput["type"]> = {
  hotel: HotelOutput & { type: Type };
  checkIn: Date;
  duration: string;
  checkOut: Date;
};

export type BundleFlightTransitOutput = {
  time: Date;
  city: string;
  airportCode: string;
  duration: string;
};

export type BundleFlightEventOutput = {
  time: Date;
  city: string;
  airport: string;
  airportCode: string;
  terminal: string;
};

export type BundleFlightLegOutput = {
  transit: BundleFlightTransitOutput | null;
  takeOff: BundleFlightEventOutput;
  flightNumber: string;
  aircraft: string;
  baggage: number;
  cabinBaggage: number;
  seatLayout: string;
  landing: BundleFlightEventOutput;
  duration: string;
};

export type BundleFlightEventSummaryOutput = {
  time: Date;
  airportCode: string;
};

export type BundleFlightOutput = {
  takeOff: BundleFlightEventSummaryOutput;
  landing: BundleFlightEventSummaryOutput;
  duration: string;
  legs: BundleFlightLegOutput[];
};

export type BundleOutput = {
  id: number;
  name: string;
  usedSeat: number;
  maxSeat: number;
  reviews: BundleReviewOutput[];
  rating: number;
  description: string;
  details: BundleDetailOutput[];
  hotelMakkah: BundleHotelOutput<"Makkah">;
  hotelMadinah: BundleHotelOutput<"Madinah">;
  airline: AirlineOutput;
  departureFlight: BundleFlightOutput;
  returnFlight: BundleFlightOutput;
  cityTours: CityTourOutput[];
  muthawif: MuthawifOutput[];
};

export type BundleLegTable = {
  id: GeneratedAlways<number>;
  take_off_time: Date;
  take_off_city: string;
  take_off_airport: string;
  take_off_airport_code: string;
  take_off_terminal: string;
  flight_number: string;
  aircraft: string;
  baggage: number;
  cabin_baggage: number;
  seat_layout: string;
  landing_time: Date;
  landing_city: string;
  landing_airport: string;
  landing_airport_code: string;
  landing_terminal: string;
  next_leg_id: number | null;
};

export type BundleCityTourTable = {
  bundle_id: number;
  city_tour_id: number;
};

export type BundleMuthawifTable = {
  bundle_id: number;
  muthawif_id: number;
};

export type BundleTable = {
  id: GeneratedAlways<number>;
  name: string;
  used_seat: number;
  max_seat: number;
  description: string;
  hotel_makkah_id: number;
  hotel_makkah_check_in: Date;
  hotel_makkah_check_out: Date;
  hotel_madinah_id: number;
  hotel_madinah_check_in: Date;
  hotel_madinah_check_out: Date;
  airline_id: number;
  departure_leg_id: number;
  return_leg_id: number;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
