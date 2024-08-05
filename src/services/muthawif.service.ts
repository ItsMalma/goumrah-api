import { DatabaseError } from "pg";
import db from "../database";
import { type IServiceWithMapper } from "./common";
import { NoResultError } from "kysely";
import type {
  CreateMuthawif,
  MuthawifOutput,
  MuthawifTable,
} from "../schemas/muthawif.schema";

const muthawifService: IServiceWithMapper<
  CreateMuthawif,
  MuthawifOutput,
  MuthawifTable
> = {
  async mapToInsert(input) {
    return {
      name: input.name,
      bio: input.bio,
      created_at: new Date(),
      updated_at: new Date(),
    };
  },

  async mapToUpdate(input) {
    return {
      name: input.name,
      bio: input.bio,
      updated_at: new Date(),
    };
  },

  async mapToOutput(table) {
    return {
      id: table.id,
      name: table.name,
      bio: table.bio,
    };
  },

  async create(input) {
    try {
      const muthawif = await db
        .insertInto("muthawif")
        .values(await this.mapToInsert(input))
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(muthawif);

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
          error: "Terjadi kesalahan ketika menambah muthawif",
        },
        500,
      ];
    }
  },

  async read() {
    try {
      const arrayOfMuthawif = await db
        .selectFrom("muthawif")
        .selectAll()
        .where("deleted_at", "is", null)
        .execute();

      const output = await Promise.all(
        arrayOfMuthawif.map((muthawif) => this.mapToOutput(muthawif))
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
          error: "Terjadi kesalahan ketika mengambil muthawif",
        },
        500,
      ];
    }
  },

  async readOne(id) {
    try {
      const muthawif = await db
        .selectFrom("muthawif")
        .selectAll()
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(muthawif);

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
            error: `Muthawif dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        {
          data: null,
          error: "Terjadi kesalahan ketika mengambil muthawif",
        },
        500,
      ];
    }
  },

  async update(id, input) {
    try {
      const muthawif = await db
        .updateTable("muthawif")
        .set(await this.mapToUpdate(input))
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(muthawif);

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
            error: `Muthawif dengan id ${id} tidak ditemukan`,
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
          error: "Terjadi kesalahan ketika mengubah muthawif",
        },
        500,
      ];
    }
  },

  async delete(id) {
    try {
      const muthawif = await db
        .updateTable("muthawif")
        .set({ deleted_at: new Date() })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(muthawif);

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
            error: `Muthawif dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        {
          data: null,
          error: "Terjadi kesalahan ketika menghapus muthawif",
        },
        500,
      ];
    }
  },
};

export default muthawifService;
