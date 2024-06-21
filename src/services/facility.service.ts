import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	FacilityInput,
	FacilityOutput,
	FacilityParam,
} from "../schemas/facility.schema";
import type CRUDService from "./crud.service";

export default class FacilityService
	implements CRUDService<FacilityInput, FacilityOutput, FacilityParam>
{
	private constructor() {}

	async create(input: FacilityInput): Promise<FacilityOutput> {
		const facility = await db.facility.create({
			data: input,
		});

		return facility;
	}

	async getAll(): Promise<FacilityOutput[]> {
		const facilities = await db.facility.findMany();

		return facilities;
	}

	async getById(
		param: FacilityParam,
		throwIfNotFound?: boolean,
	): Promise<FacilityOutput | null> {
		const facility = await db.facility.findUnique({
			where: param,
		});
		if (!facility && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return facility;
	}

	async update(
		param: FacilityParam,
		input: FacilityInput,
		throwIfNotFound?: boolean,
	): Promise<FacilityOutput> {
		const facility = await db.facility.update({
			where: param,
			data: input,
		});
		if (!facility && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return facility;
	}

	async delete(
		param: FacilityParam,
		throwIfNotFound?: boolean,
	): Promise<FacilityOutput> {
		const facility = await db.facility.delete({
			where: param,
		});
		if (!facility && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return facility;
	}

	private static _instance: FacilityService | null = null;
	static get instance(): FacilityService {
		if (!FacilityService._instance)
			FacilityService._instance = new FacilityService();
		return FacilityService._instance;
	}
}
