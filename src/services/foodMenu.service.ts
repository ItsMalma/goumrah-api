import type { DeepPartial, FindOneOptions } from "typeorm";
import FoodMenu from "../entities/foodMenu.entity";
import type {
	FoodMenuInput,
	FoodMenuOutput,
	FoodMenuParam,
} from "../schemas/foodMenu.schema";
import CRUDService from "./crud.service";

export default class FoodMenuService extends CRUDService<
	FoodMenu,
	FoodMenuInput,
	FoodMenuOutput,
	FoodMenuParam
> {
	private constructor() {
		super(FoodMenu, "Menu Makanan");
	}

	protected mapCreate(input: FoodMenuInput): DeepPartial<FoodMenu> {
		return { name: input.name };
	}

	protected mapUpdate(old: FoodMenu, input: FoodMenuInput): FoodMenu {
		old.name = input.name;
		return old;
	}

	protected mapParam(param: FoodMenuParam): FindOneOptions<FoodMenu> {
		return { where: { id: param.id } };
	}

	protected mapOutput(entity: FoodMenu): FoodMenuOutput {
		return { id: entity.id, name: entity.name };
	}

	private static _instance: FoodMenuService | null = null;
	static get instance(): FoodMenuService {
		if (!FoodMenuService._instance)
			FoodMenuService._instance = new FoodMenuService();
		return FoodMenuService._instance;
	}
}
