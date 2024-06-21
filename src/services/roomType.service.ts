import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	RoomTypeInput,
	RoomTypeOutput,
	RoomTypeParam,
} from "../schemas/roomType.schema";
import type CRUDService from "./crud.service";

export default class RoomTypeService
	implements CRUDService<RoomTypeInput, RoomTypeOutput, RoomTypeParam>
{
	private constructor() {}

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

	async getById(
		param: RoomTypeParam,
		throwIfNotFound?: boolean,
	): Promise<RoomTypeOutput | null> {
		const roomType = await db.roomType.findUnique({
			where: param,
		});
		if (!roomType && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return roomType;
	}

	async update(
		param: RoomTypeParam,
		input: RoomTypeInput,
		throwIfNotFound?: boolean,
	): Promise<RoomTypeOutput> {
		const roomType = await db.roomType.update({
			where: param,
			data: input,
		});
		if (!roomType && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return roomType;
	}

	async delete(
		param: RoomTypeParam,
		throwIfNotFound?: boolean,
	): Promise<RoomTypeOutput> {
		const roomType = await db.roomType.delete({
			where: param,
		});
		if (!roomType && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return roomType;
	}

	private static _instance: RoomTypeService | null = null;
	static get instance(): RoomTypeService {
		if (!RoomTypeService._instance)
			RoomTypeService._instance = new RoomTypeService();
		return RoomTypeService._instance;
	}
}
