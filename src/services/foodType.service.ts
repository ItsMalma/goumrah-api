import type { DeepPartial, FindOneOptions } from "typeorm";
import FoodType from "../entities/foodType.entity";
import type {
	FoodTypeInput,
	FoodTypeOutput,
	FoodTypeParam,
} from "../schemas/foodType.schema";
import CRUDService from "./crud.service";

export default class FoodTypeService extends CRUDService<
	FoodType,
	FoodTypeInput,
	FoodTypeOutput,
	FoodTypeParam
> {
	private constructor() {
		super(FoodType, "Jenis Makanan");
	}

	protected mapCreate(input: FoodTypeInput): DeepPartial<FoodType> {
		return { name: input.name };
	}

	protected mapUpdate(old: FoodType, input: FoodTypeInput): FoodType {
		old.name = input.name;
		return old;
	}

	protected mapParam(param: FoodTypeParam): FindOneOptions<FoodType> {
		return { where: { id: param.id } };
	}

	protected mapOutput(entity: FoodType): FoodTypeOutput {
		return { id: entity.id, name: entity.name };
	}

	private static _instance: FoodTypeService | null = null;
	static get instance(): FoodTypeService {
		if (!FoodTypeService._instance)
			FoodTypeService._instance = new FoodTypeService();
		return FoodTypeService._instance;
	}
}
