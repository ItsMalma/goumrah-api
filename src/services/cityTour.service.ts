import { DatabaseError } from "pg";
import db from "../database";
import { type IServiceWithMapper } from "./common";
import { NoResultError } from "kysely";
import type {
  CityTourOutput,
  CityTourTable,
  CreateCityTour,
} from "../schemas/cityTour.schema";

const cityTourService: IServiceWithMapper<
  CreateCityTour,
  CityTourOutput,
  CityTourTable
> = {
  async mapToInsert(input) {
    return {
      city: input.city,
      name: input.name,
      description: input.description,
      created_at: new Date(),
      updated_at: new Date(),
    };
  },

  async mapToUpdate(input) {
    return {
      city: input.city,
      name: input.name,
      description: input.description,
      updated_at: new Date(),
    };
  },

  async mapToOutput(table) {
    return {
      id: table.id,
      city: table.city,
      name: table.name,
      description: table.description,
    };
  },

  async create(input) {
    try {
      const cityTour = await db
        .insertInto("city_tours")
        .values(await this.mapToInsert(input))
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(cityTour);

      return [
        {
          data: output,
          error: null,
        },
        201,
      ];
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        return [
          {
            data: null,
            error: { name: ["Sudah dipakai"] },
          },
          409,
        ];
      }

      return [
        {
          data: null,
          error: "Terjadi kesalahan ketika menambah city tour",
        },
        500,
      ];
    }
  },

  async read() {
    try {
      const cityTours = await db
        .selectFrom("city_tours")
        .selectAll()
        .where("deleted_at", "is", null)
        .execute();

      const output = await Promise.all(
        cityTours.map((cityTour) => this.mapToOutput(cityTour))
      );

      return [
        {
          data: output,
          error: null,
        },
        200,
      ];
    } catch (_) {
      return [
        {
          data: null,
          error: "Terjadi kesalahan ketika mengambil city tour",
        },
        500,
      ];
    }
  },

  async readOne(id) {
    try {
      const cityTour = await db
        .selectFrom("city_tours")
        .selectAll()
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(cityTour);

      return [
        {
          data: output,
          error: null,
        },
        200,
      ];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          {
            data: null,
            error: `City tour dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        {
          data: null,
          error: "Terjadi kesalahan ketika mengambil city tour",
        },
        500,
      ];
    }
  },

  async update(id, input) {
    try {
      const cityTour = await db
        .updateTable("city_tours")
        .set(await this.mapToUpdate(input))
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(cityTour);

      return [
        {
          data: output,
          error: null,
        },
        200,
      ];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          {
            data: null,
            error: `City tour dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      } else if (err instanceof DatabaseError && err.code === "23505") {
        return [
          {
            data: null,
            error: { name: ["Sudah dipakai"] },
          },
          409,
        ];
      }

      return [
        {
          data: null,
          error: "Terjadi kesalahan ketika mengubah city tour",
        },
        500,
      ];
    }
  },

  async delete(id) {
    try {
      const cityTour = await db
        .updateTable("city_tours")
        .set({ deleted_at: new Date() })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(cityTour);

      return [
        {
          data: output,
          error: null,
        },
        200,
      ];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          {
            data: null,
            error: `City tour dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        {
          data: null,
          error: "Terjadi kesalahan ketika menghapus city tour",
        },
        500,
      ];
    }
  },
};

export default cityTourService;
