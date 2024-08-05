import { DatabaseError } from "pg";
import db from "../database";
import { type IServiceWithMapper } from "./common";
import { NoResultError } from "kysely";
import type {
  CreateRoomTypeInput,
  RoomTypeOutput,
  RoomTypeTable,
} from "../schemas/roomType.schema";

const roomTypeService: IServiceWithMapper<
  CreateRoomTypeInput,
  RoomTypeOutput,
  RoomTypeTable
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
      const roomType = await db
        .insertInto("room_types")
        .values(await this.mapToInsert(input))
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(roomType);

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
        { data: null, error: "Terjadi kesalahan ketika menambah room type" },
        500,
      ];
    }
  },

  async read() {
    try {
      const roomTypes = await db
        .selectFrom("room_types")
        .selectAll()
        .where("deleted_at", "is", null)
        .execute();

      const output = await Promise.all(
        roomTypes.map((roomType) => this.mapToOutput(roomType))
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
        { data: null, error: "Terjadi kesalahan ketika mengambil room type" },
        500,
      ];
    }
  },

  async readOne(id) {
    try {
      const roomType = await db
        .selectFrom("room_types")
        .selectAll()
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(roomType);

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
            error: `Room type dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika mengambil room type" },
        500,
      ];
    }
  },

  async update(id, input) {
    try {
      const roomType = await db
        .updateTable("room_types")
        .set(await this.mapToUpdate(input))
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(roomType);

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
            error: `Room type dengan id ${id} tidak ditemukan`,
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
        { data: null, error: "Terjadi kesalahan ketika mengubah room type" },
        500,
      ];
    }
  },

  async delete(id) {
    try {
      const roomType = await db
        .updateTable("room_types")
        .set({ deleted_at: new Date() })
        .where("id", "=", id)
        .where("deleted_at", "is", null)
        .returningAll()
        .executeTakeFirstOrThrow();

      const output = await this.mapToOutput(roomType);

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
            error: `Room type dengan id ${id} tidak ditemukan`,
          },
          404,
        ];
      }

      return [
        { data: null, error: "Terjadi kesalahan ketika menghapus room type" },
        500,
      ];
    }
  },
};

export default roomTypeService;
