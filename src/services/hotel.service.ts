import { DatabaseError } from "pg";
import db from "../database";
import type {
  CreateHotel,
  HotelOutput,
  HotelTable,
} from "../schemas/hotel.schema";
import type { IServiceWithMapper, ResponsePayload } from "./common";
import type { StatusCode } from "hono/utils/http-status";
import { NoResultError, type Selectable } from "kysely";

const hotelService: IServiceWithMapper<CreateHotel, HotelOutput, HotelTable> = {
  async mapToInsert(input) {
    return {
      type: input.type,
      name: input.name,
      star: input.star,
      description: input.description,
      distance_from_kabbah_in_meter: input.distanceFromKabbahInMeter,
      map_link: input.mapLink,
      address: input.address,
      food_type: input.foodType,
      food_amount_per_day: input.foodAmountPerDay,
      review_link: input.reviewLink,
      created_at: new Date(),
      updated_at: new Date(),
    };
  },

  async mapToUpdate(input) {
    return {
      type: input.type,
      name: input.name,
      star: input.star,
      description: input.description,
      distance_from_kabbah_in_meter: input.distanceFromKabbahInMeter,
      map_link: input.mapLink,
      address: input.address,
      food_type: input.foodType,
      food_amount_per_day: input.foodAmountPerDay,
      review_link: input.reviewLink,
      updated_at: new Date(),
    };
  },

  async mapToOutput(table) {
    return {
      id: table.id,
      type: table.type,
      name: table.name,
      star: table.star,
      facilities: (
        await db
          .selectFrom("hotels_facilities")
          .selectAll()
          .where("hotel_id", "=", table.id)
          .execute()
      ).map((hotelFacility) => ({
        icon: hotelFacility.icon,
        name: hotelFacility.name,
      })),
      description: table.description,
      distanceFromKabbahInMeter: table.distance_from_kabbah_in_meter,
      mapLink: table.map_link,
      address: table.address,
      foodType: table.food_type,
      foodAmountPerDay: table.food_amount_per_day,
      foodMenu: (
        await db
          .selectFrom("hotels_food_menu")
          .selectAll()
          .where("hotel_id", "=", table.id)
          .execute()
      ).map((hotelFoodMenu) => ({
        amount: hotelFoodMenu.amount,
        name: hotelFoodMenu.name,
      })),
      reviewLink: table.review_link,
    };
  },

  async create(input) {
    return await db
      .transaction()
      .execute<[ResponsePayload<HotelOutput>, StatusCode]>(async (tx) => {
        let hotel: Selectable<HotelTable>;
        try {
          hotel = await tx
            .insertInto("hotels")
            .values(await this.mapToInsert(input))
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

        for (const index in input.facilities) {
          const facility = input.facilities[index];

          try {
            await tx
              .insertInto("hotels_facilities")
              .values({
                hotel_id: hotel.id,
                icon: facility.icon,
                name: facility.name,
              })
              .execute();
          } catch (err) {
            if (err instanceof DatabaseError && err.code === "23505") {
              return [
                {
                  data: null,
                  error: {
                    [`facilities.${index}.name`]: ["Sudah dipakai"],
                  },
                },
                409,
              ];
            }

            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah fasilitas hotel",
              },
              500,
            ];
          }
        }

        for (const index in input.foodMenu) {
          const foodMenu = input.foodMenu[index];

          try {
            await tx
              .insertInto("hotels_food_menu")
              .values({
                hotel_id: hotel.id,
                amount: foodMenu.amount,
                name: foodMenu.name,
              })
              .execute();
          } catch (err) {
            if (err instanceof DatabaseError && err.code === "23505") {
              return [
                {
                  data: null,
                  error: {
                    [`foodMenu.${index}.name`]: ["Sudah dipakai"],
                  },
                },
                409,
              ];
            }

            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika menambah menu makanan hotel",
              },
              500,
            ];
          }
        }

        return [{ data: await this.mapToOutput(hotel), error: null }, 201];
      });
  },

  async read() {
    try {
      const hotels = await db
        .selectFrom("hotels")
        .selectAll()
        .where("deleted_at", "is", null)
        .execute();

      const outputs = await Promise.all(
        hotels.map((hotel) => this.mapToOutput(hotel))
      );

      return [
        {
          data: outputs,
          error: null,
        },
        200,
      ];
    } catch (_) {
      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil hotel" },
        500,
      ];
    }
  },

  async readOne(id) {
    try {
      const hotel = await db
        .selectFrom("hotels")
        .selectAll()
        .where("id", "=", id)
        .where("deleted_at", "is", null)
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
        { data: null, error: "Terjadi kesalahan ketika mengambil hotel" },
        500,
      ];
    }
  },

  async update(id, input) {
    return await db
      .transaction()
      .execute<[ResponsePayload<HotelOutput>, StatusCode]>(async (tx) => {
        await tx
          .deleteFrom("hotels_facilities")
          .where("hotel_id", "=", id)
          .execute();
        await tx
          .deleteFrom("hotels_food_menu")
          .where("hotel_id", "=", id)
          .execute();

        let hotel: Selectable<HotelTable>;
        try {
          hotel = await tx
            .updateTable("hotels")
            .set(await this.mapToUpdate(input))
            .where("id", "=", id)
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
          } else if (err instanceof NoResultError) {
            return [
              {
                data: null,
                error: `Hotel dengan id ${id} tidak ditemukan`,
              },
              404,
            ];
          }

          return [
            { data: null, error: "Terjadi kesalahan ketika mengubah hotel" },
            500,
          ];
        }

        for (const index in input.facilities) {
          const facility = input.facilities[index];

          try {
            await tx
              .insertInto("hotels_facilities")
              .values({
                hotel_id: hotel.id,
                icon: facility.icon,
                name: facility.name,
              })
              .execute();
          } catch (err) {
            if (err instanceof DatabaseError && err.code === "23505") {
              return [
                {
                  data: null,
                  error: {
                    [`facilities.${index}.name`]: ["Sudah dipakai"],
                  },
                },
                409,
              ];
            }

            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika mengubah fasilitas hotel",
              },
              500,
            ];
          }
        }

        for (const index in input.foodMenu) {
          const foodMenu = input.foodMenu[index];

          try {
            await tx
              .insertInto("hotels_food_menu")
              .values({
                hotel_id: hotel.id,
                amount: foodMenu.amount,
                name: foodMenu.name,
              })
              .execute();
          } catch (err) {
            if (err instanceof DatabaseError && err.code === "23505") {
              return [
                {
                  data: null,
                  error: {
                    [`foodMenu.${index}.name`]: ["Sudah dipakai"],
                  },
                },
                409,
              ];
            }

            return [
              {
                data: null,
                error: "Terjadi kesalahan ketika mengubah menu makanan hotel",
              },
              500,
            ];
          }
        }

        return [{ data: await this.mapToOutput(hotel), error: null }, 200];
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

export default hotelService;
