import { HTTPException } from "hono/http-exception";
	import db from "../db";
	import type {
		FoodMenuInput,
		FoodMenuOutput,
		FoodMenuParam,
	} from "../schemas/foodMenu.schema";
	import type CRUDService from "./crud.service";
	
	export default class FoodMenuService
		implements CRUDService<FoodMenuInput, FoodMenuOutput, FoodMenuParam>
	{
		private constructor() {}
	
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
	
		async getById(
			param: FoodMenuParam,
			throwIfNotFound?: boolean,
		): Promise<FoodMenuOutput | null> {
			const foodMenu = await db.foodMenu.findUnique({
				where: param,
			});
			if (!foodMenu && throwIfNotFound)
				throw new HTTPException(404, { message: "Data tidak ditemukan" });
	
			return foodMenu;
		}
	
		async update(
			param: FoodMenuParam,
			input: FoodMenuInput,
			throwIfNotFound?: boolean,
		): Promise<FoodMenuOutput> {
			const foodMenu = await db.foodMenu.update({
				where: param,
				data: input,
			});
			if (!foodMenu && throwIfNotFound)
				throw new HTTPException(404, { message: "Data tidak ditemukan" });
	
			return foodMenu;
		}
	
		async delete(
			param: FoodMenuParam,
			throwIfNotFound?: boolean,
		): Promise<FoodMenuOutput> {
			const foodMenu = await db.foodMenu.delete({
				where: param,
			});
			if (!foodMenu && throwIfNotFound)
				throw new HTTPException(404, { message: "Data tidak ditemukan" });
	
			return foodMenu;
		}
	
		private static _instance: FoodMenuService | null = null;
		static get instance(): FoodMenuService {
			if (!FoodMenuService._instance)
				FoodMenuService._instance = new FoodMenuService();
			return FoodMenuService._instance;
		}
	}