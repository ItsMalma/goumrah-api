import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	FoodMenuInput,
	FoodMenuOutput,
	FoodMenuParam,
} from "../schemas/foodMenu.schema";
import CRUDService from "./crud.service";

export default class FoodMenuService extends CRUDService<
	FoodMenuInput,
	FoodMenuOutput,
	FoodMenuParam
> {
	private constructor() {
		super();
	}

	async create(input: FoodMenuInput): Promise<FoodMenuOutput> {
		const foodMenu = await db.foodMenu.create({
			data: input,
		});

		return foodMenu;
	}

	async getAll(): Promise<FoodMenuOutput[]> {
		const foodMenus = await db.foodMenu.findMany();

		return foodMenus;
	}

	async get(param: FoodMenuParam): Promise<FoodMenuOutput> {
		const foodMenu = await db.foodMenu.findUnique({
			where: param,
		});
		if (!foodMenu)
			throw new HTTPException(404, {
				message: `Menu makanan dengan id ${param.id} tidak ditemukan`,
			});

		return foodMenu;
	}

	async update(
		param: FoodMenuParam,
		input: FoodMenuInput,
	): Promise<FoodMenuOutput> {
		const foodMenu = await db.foodMenu.update({
			where: param,
			data: input,
		});
		if (!foodMenu)
			throw new HTTPException(404, {
				message: `Menu makanan dengan id ${param.id} tidak ditemukan`,
			});

		return foodMenu;
	}

	async delete(param: FoodMenuParam): Promise<FoodMenuOutput> {
		const foodMenu = await db.foodMenu.delete({
			where: param,
		});
		if (!foodMenu)
			throw new HTTPException(404, {
				message: `Menu makanan dengan id ${param.id} tidak ditemukan`,
			});

		return foodMenu;
	}

	private static _instance: FoodMenuService | null = null;
	static get instance(): FoodMenuService {
		if (!FoodMenuService._instance)
			FoodMenuService._instance = new FoodMenuService();
		return FoodMenuService._instance;
	}
}
