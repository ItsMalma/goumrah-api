import { DatabaseError } from "pg";
import db from "../database";
import type {
  CreateEmbarkation,
  EmbarkationOutput,
  EmbarkationTable,
} from "../schemas/embarkation.schema";
import { type IServiceWithMapper } from "./common";
import { NoResultError } from "kysely";

const embarkationService: IServiceWithMapper<
  CreateEmbarkation,
  EmbarkationOutput,
  EmbarkationTable
> = {
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
      const embarkation = await db
        .insertInto("embarkations")
        .values(await this.mapToInsert(input))
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(embarkation);

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
        { data: null, error: "Terjadi kesalahan ketika menambah embarkation" },
        500,
      ];
    }
  },

  async read() {
    try {
      const embarkations = await db
        .selectFrom("embarkations")
        .selectAll()
        .where("deleted_at", "is", null)
        .execute();

      const output = await Promise.all(
        embarkations.map((embarkation) => this.mapToOutput(embarkation))
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
        { data: null, error: "Terjadi kesalahan ketika mengambil embarkation" },
        500,
      ];
    }
  },

  async readOne(id) {
    try {
      const embarkation = await db
        .selectFrom("embarkations")
        .selectAll()
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(embarkation);

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
            error: `Embarkation dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil embarkation" },
        500,
      ];
    }
  },

  async update(id, input) {
    try {
      const embarkation = await db
        .updateTable("embarkations")
        .set(await this.mapToUpdate(input))
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(embarkation);

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
            error: `Embarkation dengan id ${id} tidak ditemukan`,
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
        { data: null, error: "Terjadi kesalahan ketika mengubah embarkation" },
        500,
      ];
    }
  },

  async delete(id) {
    try {
      const embarkation = await db
        .updateTable("embarkations")
        .set({ deleted_at: new Date() })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(embarkation);

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
            error: `Embarkation dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika menghapus embarkation" },
        500,
      ];
    }
  },
};

export default embarkationService;
