import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	EmbarkationInput,
	EmbarkationOutput,
	EmbarkationParam,
} from "../schemas/embarkation.schema";
import type CRUDService from "./crud.service";

export default class EmbarkationService
	implements CRUDService<EmbarkationInput, EmbarkationOutput, EmbarkationParam>
{
	private constructor() {}

	async create(input: EmbarkationInput): Promise<EmbarkationOutput> {
		const embarkation = await db.embarkation.create({
			data: input,
		});

		return embarkation;
	}

	async getAll(): Promise<{ name: string; id: number }[]> {
		const embarkations = await db.embarkation.findMany();

		return embarkations;
	}

	async getById(
		param: EmbarkationParam,
		throwIfNotFound?: boolean,
	): Promise<EmbarkationOutput | null> {
		const embarkation = await db.embarkation.findUnique({
			where: param,
		});
		if (!embarkation && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return embarkation;
	}

	async update(
		param: EmbarkationParam,
		input: EmbarkationInput,
		throwIfNotFound?: boolean,
	): Promise<{ name: string; id: number }> {
		const embarkation = await db.embarkation.update({
			where: param,
			data: input,
		});
		if (!embarkation && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return embarkation;
	}

	async delete(
		param: EmbarkationParam,
		throwIfNotFound?: boolean,
	): Promise<EmbarkationOutput> {
		const embarkation = await db.embarkation.delete({
			where: param,
		});
		if (!embarkation && throwIfNotFound)
			throw new HTTPException(404, { message: "Data tidak ditemukan" });

		return embarkation;
	}

	private static _instance: EmbarkationService | null = null;
	static get instance(): EmbarkationService {
		if (!EmbarkationService._instance)
			EmbarkationService._instance = new EmbarkationService();
		return EmbarkationService._instance;
	}
}
