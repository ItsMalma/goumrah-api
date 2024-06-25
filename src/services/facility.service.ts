import type { DeepPartial, FindOneOptions } from "typeorm";
import Facility from "../entities/facility.entity";
import type {
	FacilityInput,
	FacilityOutput,
	FacilityParam,
} from "../schemas/facility.schema";
import CRUDService from "./crud.service";

export default class FacilityService extends CRUDService<
	Facility,
	FacilityInput,
	FacilityOutput,
	FacilityParam
> {
	private constructor() {
		super(Facility, "Fasilitas");
	}

	protected mapCreate(input: FacilityInput): DeepPartial<Facility> {
		return { name: input.name, icon: input.icon };
	}

	protected mapUpdate(old: Facility, input: FacilityInput): Facility {
		old.name = input.name;
		old.icon = input.icon;
		return old;
	}

	protected mapParam(param: FacilityParam): FindOneOptions<Facility> {
		return { where: { id: param.id } };
	}

	protected mapOutput(entity: Facility): FacilityOutput {
		return { id: entity.id, name: entity.name, icon: entity.icon };
	}

	private static _instance: FacilityService | null = null;
	static get instance(): FacilityService {
		if (!FacilityService._instance)
			FacilityService._instance = new FacilityService();
		return FacilityService._instance;
	}
}
