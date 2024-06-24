import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	RoomTypeInput,
	RoomTypeOutput,
	RoomTypeParam,
} from "../schemas/roomType.schema";
import CRUDService from "./crud.service";

export default class RoomTypeService extends CRUDService<
	RoomTypeInput,
	RoomTypeOutput,
	RoomTypeParam
> {
	private constructor() {
		super();
	}

	async create(input: RoomTypeInput): Promise<RoomTypeOutput> {
		const roomType = await db.roomType.create({
			data: input,
		});

		return roomType;
	}

	async getAll(): Promise<RoomTypeOutput[]> {
		const roomTypes = await db.roomType.findMany();

		return roomTypes;
	}

	async get(param: RoomTypeParam): Promise<RoomTypeOutput> {
		const roomType = await db.roomType.findUnique({
			where: param,
		});
		if (!roomType)
			throw new HTTPException(404, { message: "Jenis ruang tidak ditemukan" });

		return roomType;
	}

	async update(
		param: RoomTypeParam,
		input: RoomTypeInput,
	): Promise<RoomTypeOutput> {
		const roomType = await db.roomType.update({
			where: param,
			data: input,
		});
		if (!roomType)
			throw new HTTPException(404, { message: "Jenis ruang tidak ditemukan" });

		return roomType;
	}

	async delete(param: RoomTypeParam): Promise<RoomTypeOutput> {
		const roomType = await db.roomType.delete({
			where: param,
		});
		if (!roomType)
			throw new HTTPException(404, { message: "Jenis ruang tidak ditemukan" });

		return roomType;
	}

	private static _instance: RoomTypeService | null = null;
	static get instance(): RoomTypeService {
		if (!RoomTypeService._instance)
			RoomTypeService._instance = new RoomTypeService();
		return RoomTypeService._instance;
	}
}
