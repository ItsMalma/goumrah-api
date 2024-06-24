import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	FoodTypeInput,
	FoodTypeOutput,
	FoodTypeParam,
} from "../schemas/foodType.schema";
import CRUDService from "./crud.service";

export default class FoodTypeService extends CRUDService<
	FoodTypeInput,
	FoodTypeOutput,
	FoodTypeParam
> {
	private constructor() {
		super();
	}

	async create(input: FoodTypeInput): Promise<FoodTypeOutput> {
		const foodType = await db.foodType.create({
			data: input,
		});

		return foodType;
	}

	async getAll(): Promise<FoodTypeOutput[]> {
		const foodTypes = await db.foodType.findMany();

		return foodTypes;
	}

	async get(param: FoodTypeParam): Promise<FoodTypeOutput> {
		const foodType = await db.foodType.findUnique({
			where: param,
		});
		if (!foodType)
			throw new HTTPException(404, {
				message: "Jenis makanan tidak ditemukan",
			});

		return foodType;
	}

	async update(
		param: FoodTypeParam,
		input: FoodTypeInput,
	): Promise<FoodTypeOutput> {
		const foodType = await db.foodType.update({
			where: param,
			data: input,
		});
		if (!foodType)
			throw new HTTPException(404, {
				message: "Jenis makanan tidak ditemukan",
			});

		return foodType;
	}

	async delete(param: FoodTypeParam): Promise<FoodTypeOutput> {
		const foodType = await db.foodType.delete({
			where: param,
		});
		if (!foodType)
			throw new HTTPException(404, {
				message: "Jenis makanan tidak ditemukan",
			});

		return foodType;
	}

	private static _instance: FoodTypeService | null = null;
	static get instance(): FoodTypeService {
		if (!FoodTypeService._instance)
			FoodTypeService._instance = new FoodTypeService();
		return FoodTypeService._instance;
	}
}
