import { DatabaseError } from "pg";
import db from "../database";
import type {
  AirlineOutput,
  AirlineTable,
  CreateAirlineInput,
} from "../schemas/airline.schema";
import type { IServiceWithMapper } from "./common";
import { NoResultError } from "kysely";

const airlineService: IServiceWithMapper<
  CreateAirlineInput,
  AirlineOutput,
  AirlineTable
> = {
  async mapToInsert(input) {
    return {
      name: input.name,
      star: input.star,
      created_at: new Date(),
      updated_at: new Date(),
    };
  },

  async mapToUpdate(input) {
    return {
      name: input.name,
      star: input.star,
      updated_at: new Date(),
    };
  },

  async mapToOutput(table) {
    return {
      id: table.id,
      name: table.name,
      star: table.star,
    };
  },

  async create(input) {
    try {
      const airline = await db
        .insertInto("airlines")
        .values(await this.mapToInsert(input))
        .returningAll()
        .executeTakeFirstOrThrow();

      return [
        {
          data: await this.mapToOutput(airline),
          error: null,
        },
        201,
      ];
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        return [{ data: null, error: { name: ["Sudah dipakai"] } }, 409];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika menambah airline" },
        500,
      ];
    }
  },

  async read() {
    try {
      const airlines = await db
        .selectFrom("airlines")
        .selectAll()
        .where("deleted_at", "is", null)
        .execute();

      return [
        {
          data: await Promise.all(airlines.map(this.mapToOutput)),
          error: null,
        },
        200,
      ];
    } catch (err) {
      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil airline" },
        500,
      ];
    }
  },

  async readOne(id) {
    try {
      const airline = await db
        .selectFrom("airlines")
        .selectAll()
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirstOrThrow();

      return [
        {
          data: await this.mapToOutput(airline),
          error: null,
        },
        200,
      ];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          { data: null, error: `Airline dengan id ${id} tidak ditemukan` },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil airline" },
        500,
      ];
    }
  },

  async update(id, input) {
    try {
      const airline = await db
        .updateTable("airlines")
        .set(await this.mapToUpdate(input))
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      return [
        {
          data: await this.mapToOutput(airline),
          error: null,
        },
        200,
      ];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          { data: null, error: `Airline dengan id ${id} tidak ditemukan` },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika mengubah airline" },
        500,
      ];
    }
  },

  async delete(id) {
    try {
      const airline = await db
        .updateTable("airlines")
        .set({ deleted_at: new Date() })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      return [{ data: await this.mapToOutput(airline), error: null }, 200];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          { data: null, error: `Airline dengan id ${id} tidak ditemukan` },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika menghapus airline" },
        500,
      ];
    }
  },
};

export default airlineService;
