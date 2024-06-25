import type { DeepPartial, FindOneOptions } from "typeorm";
import Embarkation from "../entities/embarkation.entity";
import type {
	EmbarkationInput,
	EmbarkationOutput,
	EmbarkationParam,
} from "../schemas/embarkation.schema";
import CRUDService from "./crud.service";

export default class EmbarkationService extends CRUDService<
	Embarkation,
	EmbarkationInput,
	EmbarkationOutput,
	EmbarkationParam
> {
	private constructor() {
		super(Embarkation, "Embarkasi");
	}

	protected mapCreate(input: EmbarkationInput): DeepPartial<Embarkation> {
		return { name: input.name };
	}

	protected mapUpdate(old: Embarkation, input: EmbarkationInput): Embarkation {
		old.name = input.name;
		return old;
	}

	protected mapParam(param: EmbarkationParam): FindOneOptions<Embarkation> {
		return { where: { id: param.id } };
	}

	protected mapOutput(entity: Embarkation): EmbarkationOutput {
		return { id: entity.id, name: entity.name };
	}

	private static _instance: EmbarkationService | null = null;
	static get instance(): EmbarkationService {
		if (!EmbarkationService._instance)
			EmbarkationService._instance = new EmbarkationService();
		return EmbarkationService._instance;
	}
}
