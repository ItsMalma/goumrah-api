import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	FacilityInput,
	FacilityOutput,
	FacilityParam,
} from "../schemas/facility.schema";
import type { HotelParam } from "../schemas/hotel.schema";
import CRUDService from "./crud.service";

export default class FacilityService extends CRUDService<
	FacilityInput,
	FacilityOutput,
	FacilityParam
> {
	private constructor() {
		super();
	}

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

	async get(param: FacilityParam): Promise<FacilityOutput> {
		const facility = await db.facility.findUnique({
			where: param,
		});
		if (!facility)
			throw new HTTPException(404, {
				message: `Fasilitas dengan id ${param.id} tidak ditemukan`,
			});

		return facility;
	}

	async getFromHotel(param: HotelParam): Promise<FacilityOutput[]> {
		const facilities = await db.facility.findMany({
			where: {
				hotels: { some: param },
			},
		});

		return facilities;
	}

	async update(
		param: FacilityParam,
		input: FacilityInput,
	): Promise<FacilityOutput> {
		const facility = await db.facility.update({
			where: param,
			data: input,
		});
		if (!facility)
			throw new HTTPException(404, {
				message: `Fasilitas dengan id ${param.id} tidak ditemukan`,
			});

		return facility;
	}

	async delete(param: FacilityParam): Promise<FacilityOutput> {
		const facility = await db.facility.delete({
			where: param,
		});
		if (!facility)
			throw new HTTPException(404, {
				message: `Fasilitas dengan id ${param.id} tidak ditemukan`,
			});

		return facility;
	}

	private static _instance: FacilityService | null = null;
	static get instance(): FacilityService {
		if (!FacilityService._instance)
			FacilityService._instance = new FacilityService();
		return FacilityService._instance;
	}
}
