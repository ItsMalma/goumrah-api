import { DatabaseError } from "pg";
import db, { type Database } from "../database";
import type {
  CreateHotel,
  HotelOutput,
  HotelTable,
} from "../schemas/hotel.schema";
import type { IService, ResponsePayload } from "./common";
import type { StatusCode } from "hono/utils/http-status";
import { Kysely, NoResultError, Transaction, type Selectable } from "kysely";
import type {
  BundleFlightLegOutput,
  BundleFlightOutput,
  BundleLegTable,
  BundleOutput,
  BundleTable,
  CreateBundle,
} from "../schemas/bundle.schema";
import { average, duration } from "../utils";
import type { BundleDetailOutput } from "../schemas/bundleDetail.schema";
import type { EmbarkationTable } from "../schemas/embarkation.schema";
import type { RoomTypeTable } from "../schemas/roomType.schema";
import hotelService from "./hotel.service";
import type { AirlineTable } from "../schemas/airline.schema";
import type { CityTourOutput } from "../schemas/cityTour.schema";
import type { MuthawifOutput } from "../schemas/muthawif.schema";

async function map(
  db: Kysely<Database>,
  bundle: Selectable<BundleTable>
): Promise<[ResponsePayload<BundleOutput>, StatusCode]> {
  const reviews = (
    await db
      .selectFrom("bundle_reviews")
      .selectAll()
      .where("bundle_id", "=", bundle.id)
      .where("deleted_at", "is", null)
      .execute()
  ).map((review) => ({
    id: review.id,
    rating: review.rating,
  }));

  let detailsOutput: BundleDetailOutput[] = [];
  for (const detail of await db
    .selectFrom("bundle_details")
    .selectAll()
    .where("bundle_id", "=", bundle.id)
    .where("deleted_at", "is", null)
    .execute()) {
    let embarkation: Selectable<EmbarkationTable>;
    try {
      embarkation = await db
        .selectFrom("embarkations")
        .selectAll()
        .where("id", "=", detail.embarkation_id)
        .where("deleted_at", "is", null)
        .executeTakeFirstOrThrow();
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          {
            data: null,
            error: `Embarkation dengan id ${detail.embarkation_id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil embarkation" },
        500,
      ];
    }

    let roomType: Selectable<RoomTypeTable>;
    try {
      roomType = await db
        .selectFrom("room_types")
        .selectAll()
        .where("id", "=", detail.room_type_id)
        .where("deleted_at", "is", null)
        .executeTakeFirstOrThrow();
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          {
            data: null,
            error: `Room type dengan id ${detail.room_type_id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil room type" },
        500,
      ];
    }

    detailsOutput.push({
      id: detail.id,
      date: detail.date,
      embarkation: {
        id: embarkation.id,
        name: embarkation.name,
      },
      roomType: {
        id: roomType.id,
        name: roomType.name,
      },
      price: detail.price,
      discount: detail.discount,
    });
  }

  let makkahHotel: Selectable<HotelTable>;
  try {
    makkahHotel = await db
      .selectFrom("hotels")
      .selectAll()
      .where("id", "=", bundle.hotel_makkah_id)
      .where("type", "=", "Makkah")
      .where("deleted_at", "is", null)
      .executeTakeFirstOrThrow();
  } catch (err) {
    if (err instanceof NoResultError) {
      return [
        {
          data: null,
          error: `Hotel Makkah dengan id ${bundle.hotel_makkah_id} tidak ditemukan`,
        },
        404,
      ];
    }

    return [
      { data: null, error: "Terjadi kesalahan ketika mengambil hotel Makkah" },
      500,
    ];
  }

  let madinahHotel: Selectable<HotelTable>;
  try {
    madinahHotel = await db
      .selectFrom("hotels")
      .selectAll()
      .where("id", "=", bundle.hotel_madinah_id)
      .where("type", "=", "Madinah")
      .where("deleted_at", "is", null)
      .executeTakeFirstOrThrow();
  } catch (err) {
    if (err instanceof NoResultError) {
      return [
        {
          data: null,
          error: `Hotel Madinah dengan id ${bundle.hotel_madinah_id} tidak ditemukan`,
        },
        404,
      ];
    }

    return [
      { data: null, error: "Terjadi kesalahan ketika mengambil hotel Madinah" },
      500,
    ];
  }

  let airline: Selectable<AirlineTable>;
  try {
    airline = await db
      .selectFrom("airlines")
      .selectAll()
      .where("id", "=", bundle.airline_id)
      .where("deleted_at", "is", null)
      .executeTakeFirstOrThrow();
  } catch (err) {
    if (err instanceof NoResultError) {
      return [
        {
          data: null,
          error: `Airline dengan id ${bundle.airline_id} tidak ditemukan`,
        },
        404,
      ];
    }

    return [
      { data: null, error: "Terjadi kesalahan ketika mengambil airline" },
      500,
    ];
  }

  let legs: BundleFlightLegOutput[] = [];
  let leg: Selectable<BundleLegTable> | null = null;
  do {
    const prevLeg = leg;
    try {
      leg = await db
        .selectFrom("bundle_legs")
        .where("id", "=", leg ? leg.next_leg_id : bundle.departure_leg_id)
        .selectAll()
        .executeTakeFirstOrThrow();
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          {
            data: null,
            error: `Leg penerbangan dengan id ${
              leg ? leg.next_leg_id : bundle.departure_leg_id
            } tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        {
          data: null,
          error: "Terjadi kesalahan ketika mengambil leg penerbangan",
        },
        500,
      ];
    }
    legs.push({
      transit: prevLeg
        ? {
            time: prevLeg.landing_time,
            city: prevLeg.landing_city,
            airportCode: prevLeg.landing_airport_code,
            duration: duration(prevLeg.landing_time, leg.take_off_time),
          }
        : null,
      takeOff: {
        time: leg.take_off_time,
        city: leg.take_off_city,
        airport: leg.take_off_airport,
        airportCode: leg.take_off_airport_code,
        terminal: leg.take_off_terminal,
      },
      flightNumber: leg.flight_number,
      aircraft: leg.aircraft,
      baggage: leg.baggage,
      cabinBaggage: leg.cabin_baggage,
      seatLayout: leg.seat_layout,
      landing: {
        time: leg.landing_time,
        city: leg.landing_city,
        airport: leg.landing_airport,
        airportCode: leg.landing_airport_code,
        terminal: leg.landing_terminal,
      },
      duration: duration(leg.take_off_time, leg.landing_time),
    });
  } while (leg.next_leg_id);
  const departureFlight: BundleFlightOutput = {
    takeOff: legs[0].takeOff,
    landing: legs[legs.length - 1].landing,
    legs,
    duration: duration(
      legs[0].takeOff.time,
      legs[legs.length - 1].landing.time
    ),
  };

  legs = [];
  leg = null;
  do {
    const prevLeg = leg;
    try {
      leg = await db
        .selectFrom("bundle_legs")
        .where("id", "=", leg ? leg.next_leg_id : bundle.return_leg_id)
        .selectAll()
        .executeTakeFirstOrThrow();
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          {
            data: null,
            error: `Leg penerbangan dengan id ${
              leg ? leg.next_leg_id : bundle.return_leg_id
            } tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        {
          data: null,
          error: "Terjadi kesalahan ketika mengambil leg penerbangan",
        },
        500,
      ];
    }
    legs.push({
      transit: prevLeg
        ? {
            time: prevLeg.landing_time,
            city: prevLeg.landing_city,
            airportCode: prevLeg.landing_airport_code,
            duration: duration(prevLeg.landing_time, leg.take_off_time),
          }
        : null,
      takeOff: {
        time: leg.take_off_time,
        city: leg.take_off_city,
        airport: leg.take_off_airport,
        airportCode: leg.take_off_airport_code,
        terminal: leg.take_off_terminal,
      },
      flightNumber: leg.flight_number,
      aircraft: leg.aircraft,
      baggage: leg.baggage,
      cabinBaggage: leg.cabin_baggage,
      seatLayout: leg.seat_layout,
      landing: {
        time: leg.landing_time,
        city: leg.landing_city,
        airport: leg.landing_airport,
        airportCode: leg.landing_airport_code,
        terminal: leg.landing_terminal,
      },
      duration: duration(leg.take_off_time, leg.landing_time),
    });
  } while (leg.next_leg_id);
  const returnFlight: BundleFlightOutput = {
    takeOff: legs[0].takeOff,
    landing: legs[legs.length - 1].landing,
    legs,
    duration: duration(
      legs[0].takeOff.time,
      legs[legs.length - 1].landing.time
    ),
  };

  const cityTours = (
    await db
      .selectFrom("bundles_city_tours")
      .where("bundle_id", "=", bundle.id)
      .innerJoin("city_tours", "city_tours.id", "city_tour_id")
      .selectAll()
      .execute()
  ).map<CityTourOutput>((cityTour) => ({
    id: cityTour.city_tour_id,
    city: cityTour.city,
    name: cityTour.name,
    description: cityTour.description,
  }));

  const muthawif = (
    await db
      .selectFrom("bundles_muthawif")
      .where("bundle_id", "=", bundle.id)
      .innerJoin("muthawif", "muthawif.id", "muthawif_id")
      .selectAll()
      .execute()
  ).map<MuthawifOutput>((muthawif) => ({
    id: muthawif.muthawif_id,
    name: muthawif.name,
    bio: muthawif.bio,
  }));

  return [
    {
      data: {
        id: bundle.id,
        name: bundle.name,
        usedSeat: bundle.used_seat,
        maxSeat: bundle.max_seat,
        reviews,
        rating: average(reviews.map((review) => review.rating)),
        description: bundle.description,
        details: detailsOutput,
        hotelMakkah: {
          hotel: {
            ...(await hotelService.mapToOutput(makkahHotel)),
            type: "Makkah",
          },
          checkIn: bundle.hotel_makkah_check_in,
          duration: duration(
            bundle.hotel_makkah_check_in,
            bundle.hotel_makkah_check_out
          ),
          checkOut: bundle.hotel_makkah_check_out,
        },
        hotelMadinah: {
          hotel: {
            ...(await hotelService.mapToOutput(madinahHotel)),
            type: "Madinah",
          },
          checkIn: bundle.hotel_madinah_check_in,
          duration: duration(
            bundle.hotel_madinah_check_in,
            bundle.hotel_madinah_check_out
          ),
          checkOut: bundle.hotel_madinah_check_out,
        },
        airline: {
          id: airline.id,
          name: airline.name,
          star: airline.star,
        },
        departureFlight,
        returnFlight,
        cityTours,
        muthawif,
      },
      error: null,
    },
    200,
  ];
}

const bundleService: IService<CreateBundle, BundleOutput> = {
  async create(input) {
    return await db
      .transaction()
      .execute<[ResponsePayload<BundleOutput>, StatusCode]>(async (tx) => {
        let departureNext: Selectable<BundleLegTable> | null = null;
        for (let i = input.departureLegs.length - 1; i >= 0; i--) {
          const departureLeg = input.departureLegs[i];
          try {
            departureNext = await tx
              .insertInto("bundle_legs")
              .values({
                take_off_time: departureLeg.takeOff.time,
                take_off_city: departureLeg.takeOff.city,
                take_off_airport: departureLeg.takeOff.airport,
                take_off_airport_code: departureLeg.takeOff.airportCode,
                take_off_terminal: departureLeg.takeOff.terminal,
                flight_number: departureLeg.flightNumber,
                aircraft: departureLeg.aircraft,
                baggage: departureLeg.baggage,
                cabin_baggage: departureLeg.cabinBaggage,
                seat_layout: departureLeg.seatLayout,
                landing_time: departureLeg.landing.time,
                landing_city: departureLeg.landing.city,
                landing_airport: departureLeg.landing.airport,
                landing_airport_code: departureLeg.landing.airportCode,
                landing_terminal: departureLeg.landing.terminal,
                next_leg_id: departureNext ? departureNext.id : null,
              })
              .returningAll()
              .executeTakeFirstOrThrow();
          } catch (err) {
            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah leg keberangkatan",
              },
              500,
            ];
          }
        }

        let returnNext: Selectable<BundleLegTable> | null = null;
        for (let i = input.returnLegs.length - 1; i >= 0; i--) {
          const returnLeg = input.returnLegs[i];
          try {
            returnNext = await tx
              .insertInto("bundle_legs")
              .values({
                take_off_time: returnLeg.takeOff.time,
                take_off_city: returnLeg.takeOff.city,
                take_off_airport: returnLeg.takeOff.airport,
                take_off_airport_code: returnLeg.takeOff.airportCode,
                take_off_terminal: returnLeg.takeOff.terminal,
                flight_number: returnLeg.flightNumber,
                aircraft: returnLeg.aircraft,
                baggage: returnLeg.baggage,
                cabin_baggage: returnLeg.cabinBaggage,
                seat_layout: returnLeg.seatLayout,
                landing_time: returnLeg.landing.time,
                landing_city: returnLeg.landing.city,
                landing_airport: returnLeg.landing.airport,
                landing_airport_code: returnLeg.landing.airportCode,
                landing_terminal: returnLeg.landing.terminal,
                next_leg_id: returnNext ? returnNext.id : null,
              })
              .returningAll()
              .executeTakeFirstOrThrow();
          } catch (err) {
            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah leg keberangkatan",
              },
              500,
            ];
          }
        }

        let bundle: Selectable<BundleTable>;
        try {
          bundle = await tx
            .insertInto("bundles")
            .values({
              name: input.name,
              used_seat: input.usedSeat,
              max_seat: input.maxSeat,
              description: input.description,
              hotel_makkah_id: input.makkahHotel.hotel.id,
              hotel_makkah_check_in: input.makkahHotel.checkIn,
              hotel_makkah_check_out: input.makkahHotel.checkOut,
              hotel_madinah_id: input.madinahHotel.hotel.id,
              hotel_madinah_check_in: input.madinahHotel.checkIn,
              hotel_madinah_check_out: input.madinahHotel.checkOut,
              airline_id: input.airline.id,
              departure_leg_id: departureNext!.id,
              return_leg_id: returnNext!.id,
              created_at: new Date(),
              updated_at: new Date(),
            })
            .returningAll()
            .executeTakeFirstOrThrow();
        } catch (err) {
          if (err instanceof DatabaseError && err.code === "23505") {
            return [
              {
                data: null,
                error: {
                  name: ["Sudah dipakai"],
                },
              },
              409,
            ];
          }

          return [
            { data: null, error: "Terjadi kesalahan ketika menambah hotel" },
            500,
          ];
        }

        for (const index in input.cityTours) {
          const cityTour = input.cityTours[index];

          try {
            await tx
              .insertInto("bundles_city_tours")
              .values({
                bundle_id: bundle.id,
                city_tour_id: cityTour.id,
              })
              .execute();
          } catch (err) {
            if (err instanceof DatabaseError && err.code === "23505") {
              return [
                {
                  data: null,
                  error: {
                    [`cityTours.${index}`]: ["Sudah ada"],
                  },
                },
                409,
              ];
            }

            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah city tour bundle",
              },
              500,
            ];
          }
        }

        for (const index in input.muthawif) {
          const muthawif = input.muthawif[index];

          try {
            await tx
              .insertInto("bundles_muthawif")
              .values({
                bundle_id: bundle.id,
                muthawif_id: muthawif.id,
              })
              .execute();
          } catch (err) {
            if (err instanceof DatabaseError && err.code === "23505") {
              return [
                {
                  data: null,
                  error: {
                    [`muthawif.${index}`]: ["Sudah ada"],
                  },
                },
                409,
              ];
            }

            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah muthawif bundle",
              },
              500,
            ];
          }
        }

        const result = await map(tx, bundle);
        if (result[1] === 200) {
          result[1] = 201;
        }

        return result;
      });
  },

  async read() {
    try {
      const bundles = await db
        .selectFrom("bundles")
        .selectAll()
        .where("deleted_at", "is", null)
        .execute();

      const outputs: BundleOutput[] = [];
      for (const bundle of bundles) {
        const result = await map(db, bundle);
        if (result[1] !== 200) {
          return [{ data: null, error: result[0].error }, result[1]];
        }
        if (!result[0].data) continue;

        outputs.push(result[0].data);
      }

      return [
        {
          data: outputs,
          error: null,
        },
        200,
      ];
    } catch (_) {
      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil bundle" },
        500,
      ];
    }
  },

  async readOne(id) {
    try {
      const bundle = await db
        .selectFrom("bundles")
        .selectAll()
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirstOrThrow();

      return await map(db, bundle);
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          {
            data: null,
            error: `Bundle dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil bundle" },
        500,
      ];
    }
  },

  async update(id, input) {
    return await db
      .transaction()
      .execute<[ResponsePayload<BundleOutput>, StatusCode]>(async (tx) => {
        await tx
          .deleteFrom("bundles_city_tours")
          .where("bundle_id", "=", id)
          .execute();
        await tx
          .deleteFrom("bundles_muthawif")
          .where("muthawif_id", "=", id)
          .execute();

        try {
          const bundle = await db
            .selectFrom("bundles")
            .selectAll()
            .where("id", "=", id)
            .where("deleted_at", "is", null)
            .executeTakeFirstOrThrow();

          return await map(db, bundle);
        } catch (err) {
          if (err instanceof NoResultError) {
            return [
              {
                data: null,
                error: `Bundle dengan id ${id} tidak ditemukan`,
              },
              404,
            ];
          }

          return [
            { data: null, error: "Terjadi kesalahan ketika mengambil bundle" },
            500,
          ];
        }

        let departureNext: Selectable<BundleLegTable> | null = null;
        for (let i = input.departureLegs.length - 1; i >= 0; i--) {
          const departureLeg = input.departureLegs[i];
          try {
            departureNext = await tx
              .insertInto("bundle_legs")
              .values({
                take_off_time: departureLeg.takeOff.time,
                take_off_city: departureLeg.takeOff.city,
                take_off_airport: departureLeg.takeOff.airport,
                take_off_airport_code: departureLeg.takeOff.airportCode,
                take_off_terminal: departureLeg.takeOff.terminal,
                flight_number: departureLeg.flightNumber,
                aircraft: departureLeg.aircraft,
                baggage: departureLeg.baggage,
                cabin_baggage: departureLeg.cabinBaggage,
                seat_layout: departureLeg.seatLayout,
                landing_time: departureLeg.landing.time,
                landing_city: departureLeg.landing.city,
                landing_airport: departureLeg.landing.airport,
                landing_airport_code: departureLeg.landing.airportCode,
                landing_terminal: departureLeg.landing.terminal,
                next_leg_id: departureNext ? departureNext.id : null,
              })
              .returningAll()
              .executeTakeFirstOrThrow();
          } catch (err) {
            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah leg keberangkatan",
              },
              500,
            ];
          }
        }

        let returnNext: Selectable<BundleLegTable> | null = null;
        for (let i = input.returnLegs.length - 1; i >= 0; i--) {
          const returnLeg = input.returnLegs[i];
          try {
            returnNext = await tx
              .insertInto("bundle_legs")
              .values({
                take_off_time: returnLeg.takeOff.time,
                take_off_city: returnLeg.takeOff.city,
                take_off_airport: returnLeg.takeOff.airport,
                take_off_airport_code: returnLeg.takeOff.airportCode,
                take_off_terminal: returnLeg.takeOff.terminal,
                flight_number: returnLeg.flightNumber,
                aircraft: returnLeg.aircraft,
                baggage: returnLeg.baggage,
                cabin_baggage: returnLeg.cabinBaggage,
                seat_layout: returnLeg.seatLayout,
                landing_time: returnLeg.landing.time,
                landing_city: returnLeg.landing.city,
                landing_airport: returnLeg.landing.airport,
                landing_airport_code: returnLeg.landing.airportCode,
                landing_terminal: returnLeg.landing.terminal,
                next_leg_id: returnNext ? returnNext.id : null,
              })
              .returningAll()
              .executeTakeFirstOrThrow();
          } catch (err) {
            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah leg keberangkatan",
              },
              500,
            ];
          }
        }

        let bundle: Selectable<BundleTable>;
        try {
          bundle = await tx
            .insertInto("bundles")
            .values({
              name: input.name,
              used_seat: input.usedSeat,
              max_seat: input.maxSeat,
              description: input.description,
              hotel_makkah_id: input.makkahHotel.hotel.id,
              hotel_makkah_check_in: input.makkahHotel.checkIn,
              hotel_makkah_check_out: input.makkahHotel.checkOut,
              hotel_madinah_id: input.madinahHotel.hotel.id,
              hotel_madinah_check_in: input.madinahHotel.checkIn,
              hotel_madinah_check_out: input.madinahHotel.checkOut,
              airline_id: input.airline.id,
              departure_leg_id: departureNext!.id,
              return_leg_id: returnNext!.id,
              created_at: new Date(),
              updated_at: new Date(),
            })
            .returningAll()
            .executeTakeFirstOrThrow();
        } catch (err) {
          if (err instanceof DatabaseError && err.code === "23505") {
            return [
              {
                data: null,
                error: {
                  name: ["Sudah dipakai"],
                },
              },
              409,
            ];
          }

          return [
            { data: null, error: "Terjadi kesalahan ketika menambah hotel" },
            500,
          ];
        }

        for (const index in input.cityTours) {
          const cityTour = input.cityTours[index];

          try {
            await tx
              .insertInto("bundles_city_tours")
              .values({
                bundle_id: bundle.id,
                city_tour_id: cityTour.id,
              })
              .execute();
          } catch (err) {
            if (err instanceof DatabaseError && err.code === "23505") {
              return [
                {
                  data: null,
                  error: {
                    [`cityTours.${index}`]: ["Sudah ada"],
                  },
                },
                409,
              ];
            }

            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah city tour bundle",
              },
              500,
            ];
          }
        }

        for (const index in input.muthawif) {
          const muthawif = input.muthawif[index];

          try {
            await tx
              .insertInto("bundles_muthawif")
              .values({
                bundle_id: bundle.id,
                muthawif_id: muthawif.id,
              })
              .execute();
          } catch (err) {
            if (err instanceof DatabaseError && err.code === "23505") {
              return [
                {
                  data: null,
                  error: {
                    [`muthawif.${index}`]: ["Sudah ada"],
                  },
                },
                409,
              ];
            }

            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah muthawif bundle",
              },
              500,
            ];
          }
        }

        const result = await map(tx, bundle);
        if (result[1] === 200) {
          result[1] = 201;
        }

        return result;
      });
  },

  async delete(id) {
    try {
      const hotel = await db
        .updateTable("hotels")
        .set({ deleted_at: new Date() })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      return [
        {
          data: await this.mapToOutput(hotel),
          error: null,
        },
        200,
      ];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          {
            data: null,
            error: `Hotel dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika menghapus hotel" },
        500,
      ];
    }
  },
};

export default bundleService;
