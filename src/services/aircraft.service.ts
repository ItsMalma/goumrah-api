import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	AircraftInput,
	AircraftOutput,
	AircraftParam,
} from "../schemas/aircraft.schema";
import CRUDService from "./crud.service";

export default class AircraftService extends CRUDService<
	AircraftInput,
	AircraftOutput,
	AircraftParam
> {
	private constructor() {
		super();
	}

	async create(input: AircraftInput): Promise<AircraftOutput> {
		const aircraft = await db.aircraft.create({
			data: input,
		});

		return aircraft;
	}

	async getAll(): Promise<AircraftOutput[]> {
		const aircrafts = await db.aircraft.findMany();

		return aircrafts;
	}

	async get(param: AircraftParam): Promise<AircraftOutput> {
		const aircraft = await db.aircraft.findUnique({
			where: param,
		});
		if (!aircraft)
			throw new HTTPException(404, {
				message: `Pesawat dengan id ${param.id} tidak ditemukan`,
			});

		return aircraft;
	}

	async update(
		param: AircraftParam,
		input: AircraftInput,
	): Promise<AircraftOutput> {
		const aircraft = await db.aircraft.update({
			where: param,
			data: input,
		});
		if (!aircraft)
			throw new HTTPException(404, {
				message: `Pesawat dengan id ${param.id} tidak ditemukan`,
			});

		return aircraft;
	}

	async delete(param: AircraftParam): Promise<AircraftOutput> {
		const aircraft = await db.aircraft.delete({
			where: param,
		});
		if (!aircraft)
			throw new HTTPException(404, {
				message: `Pesawat dengan id ${param.id} tidak ditemukan`,
			});

		return aircraft;
	}

	private static _instance: AircraftService | null = null;
	static get instance(): AircraftService {
		if (!AircraftService._instance)
			AircraftService._instance = new AircraftService();
		return AircraftService._instance;
	}
}
