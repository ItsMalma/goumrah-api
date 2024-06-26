import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	EmbarkationInput,
	EmbarkationOutput,
	EmbarkationParam,
} from "../schemas/embarkation.schema";
import CRUDService from "./crud.service";

export default class EmbarkationService extends CRUDService<
	EmbarkationInput,
	EmbarkationOutput,
	EmbarkationParam
> {
	private constructor() {
		super();
	}

	async create(input: EmbarkationInput): Promise<EmbarkationOutput> {
		const embarkation = await db.embarkation.create({
			data: input,
		});

		return embarkation;
	}

	async getAll(): Promise<EmbarkationOutput[]> {
		const embarkations = await db.embarkation.findMany();

		return embarkations;
	}

	async get(param: EmbarkationParam): Promise<EmbarkationOutput> {
		const embarkation = await db.embarkation.findUnique({
			where: param,
		});
		if (!embarkation)
			throw new HTTPException(404, {
				message: `Embarkasi dengan id ${param.id} tidak ditemukan`,
			});

		return embarkation;
	}

	async update(
		param: EmbarkationParam,
		input: EmbarkationInput,
	): Promise<EmbarkationOutput> {
		const embarkation = await db.embarkation.update({
			where: param,
			data: input,
		});
		if (!embarkation)
			throw new HTTPException(404, {
				message: `Embarkasi dengan id ${param.id} tidak ditemukan`,
			});

		return embarkation;
	}

	async delete(param: EmbarkationParam): Promise<EmbarkationOutput> {
		const embarkation = await db.embarkation.delete({
			where: param,
		});
		if (!embarkation)
			throw new HTTPException(404, {
				message: `Embarkasi dengan id ${param.id} tidak ditemukan`,
			});

		return embarkation;
	}

	private static _instance: EmbarkationService | null = null;
	static get instance(): EmbarkationService {
		if (!EmbarkationService._instance)
			EmbarkationService._instance = new EmbarkationService();
		return EmbarkationService._instance;
	}
}
