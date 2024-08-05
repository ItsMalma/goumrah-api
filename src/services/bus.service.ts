import { DatabaseError } from "pg";
import db from "../database";
import type { IServiceWithMapper } from "./common";
import { NoResultError } from "kysely";
import type {
  BusOutput,
  BusTable,
  CreateBusInput,
} from "../schemas/bus.schema";

const busService: IServiceWithMapper<CreateBusInput, BusOutput, BusTable> = {
  async mapToInsert(input) {
    return {
      name: input.name,
      created_at: new Date(),
      updated_at: new Date(),
    };
  },

  async mapToUpdate(input) {
    return {
      name: input.name,
      updated_at: new Date(),
    };
  },

  async mapToOutput(table) {
    return {
      id: table.id,
      name: table.name,
    };
  },

  async create(input) {
    try {
      const bus = await db
        .insertInto("buses")
        .values(await this.mapToInsert(input))
        .returningAll()
        .executeTakeFirstOrThrow();

      return [
        {
          data: await this.mapToOutput(bus),
          error: null,
        },
        201,
      ];
    } catch (err) {
      if (err instanceof DatabaseError && err.code === "23505") {
        return [{ data: null, error: { name: ["Sudah dipakai"] } }, 409];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika menambah bus" },
        500,
      ];
    }
  },

  async read() {
    try {
      const buses = await db
        .selectFrom("buses")
        .selectAll()
        .where("deleted_at", "is", null)
        .execute();

      return [
        {
          data: await Promise.all(buses.map(this.mapToOutput)),
          error: null,
        },
        200,
      ];
    } catch (err) {
      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil bus" },
        500,
      ];
    }
  },

  async readOne(id) {
    try {
      const bus = await db
        .selectFrom("buses")
        .selectAll()
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirstOrThrow();

      return [
        {
          data: await this.mapToOutput(bus),
          error: null,
        },
        200,
      ];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          { data: null, error: `Bus dengan id ${id} tidak ditemukan` },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil bus" },
        500,
      ];
    }
  },

  async update(id, input) {
    try {
      const bus = await db
        .updateTable("buses")
        .set(await this.mapToUpdate(input))
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      return [
        {
          data: await this.mapToOutput(bus),
          error: null,
        },
        200,
      ];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          { data: null, error: `Bus dengan id ${id} tidak ditemukan` },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika mengubah bus" },
        500,
      ];
    }
  },

  async delete(id) {
    try {
      const bus = await db
        .updateTable("buses")
        .set({ deleted_at: new Date() })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      return [{ data: await this.mapToOutput(bus), error: null }, 200];
    } catch (err) {
      if (err instanceof NoResultError) {
        return [
          { data: null, error: `Bus dengan id ${id} tidak ditemukan` },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika menghapus bus" },
        500,
      ];
    }
  },
};

export default busService;
