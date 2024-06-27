import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	AirportInput,
	AirportOutput,
	AirportParam,
} from "../schemas/airport.schema";
import CRUDService from "./crud.service";

export default class AirportService extends CRUDService<
	AirportInput,
	AirportOutput,
	AirportParam
> {
	private constructor() {
		super();
	}

	async create(input: AirportInput): Promise<AirportOutput> {
		const airport = await db.airport.create({
			data: input,
		});

		return airport;
	}

	async getAll(): Promise<AirportOutput[]> {
		const airports = await db.airport.findMany();

		return airports;
	}

	async get(param: AirportParam): Promise<AirportOutput> {
		const airport = await db.airport.findUnique({
			where: param,
		});
		if (!airport)
			throw new HTTPException(404, {
				message: `Bandara dengan id ${param.id} tidak ditemukan`,
			});

		return airport;
	}

	async update(
		param: AirportParam,
		input: AirportInput,
	): Promise<AirportOutput> {
		const airport = await db.airport.update({
			where: param,
			data: input,
		});
		if (!airport)
			throw new HTTPException(404, {
				message: `Bandara dengan id ${param.id} tidak ditemukan`,
			});

		return airport;
	}

	async delete(param: AirportParam): Promise<AirportOutput> {
		const airport = await db.airport.delete({
			where: param,
		});
		if (!airport)
			throw new HTTPException(404, {
				message: `Bandara dengan id ${param.id} tidak ditemukan`,
			});

		return airport;
	}

	private static _instance: AirportService | null = null;
	static get instance(): AirportService {
		if (!AirportService._instance)
			AirportService._instance = new AirportService();
		return AirportService._instance;
	}
}
