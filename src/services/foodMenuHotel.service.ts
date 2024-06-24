import type { FoodMenuHotel } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	FoodMenuHotelInput,
	FoodMenuHotelOutput,
	FoodMenuHotelParam,
} from "../schemas/foodMenuHotel.schema";
import type { HotelParam } from "../schemas/hotel.schema";
import CRUDService from "./crud.service";
import FoodMenuService from "./foodMenu.service";

export default class FoodMenuHotelService extends CRUDService<
	FoodMenuHotelInput,
	FoodMenuHotelOutput,
	FoodMenuHotelParam
> {
	private constructor(private foodMenuService = FoodMenuService.instance) {
		super();
	}

	async map(foodMenuHotel: FoodMenuHotel): Promise<FoodMenuHotelOutput> {
		const foodMenu = await this.foodMenuService.get({
			id: foodMenuHotel.foodMenuId,
		});

		return {
			id: foodMenuHotel.id,
			hotel: foodMenuHotel.hotelId,
			foodMenu: foodMenu,
			amount: foodMenuHotel.amount,
		};
	}

	async create(input: FoodMenuHotelInput): Promise<FoodMenuHotelOutput> {
		const hotel = await db.hotel.findFirst({ where: { id: input.hotel } });
		if (!hotel)
			throw new HTTPException(404, { message: "Hotel tidak ditemukan" });

		await this.foodMenuService.get({ id: input.foodMenu });

		const foodMenuHotel = await db.foodMenuHotel.create({
			data: {
				hotelId: input.hotel,
				foodMenuId: input.foodMenu,
				amount: input.amount,
			},
		});

		return await this.map(foodMenuHotel);
	}

	async getAll(): Promise<FoodMenuHotelOutput[]> {
		const foodMenusHotel = await db.foodMenuHotel.findMany();

		return await Promise.all(foodMenusHotel.map(this.map.bind(this)));
	}

	async get(param: FoodMenuHotelParam): Promise<FoodMenuHotelOutput> {
		const foodMenuHotel = await db.foodMenuHotel.findUnique({
			where: param,
		});
		if (!foodMenuHotel)
			throw new HTTPException(404, { message: "Menu hotel tidak ditemukan" });

		return this.map(foodMenuHotel);
	}

	async getFromHotel(param: HotelParam): Promise<FoodMenuHotelOutput[]> {
		const foodMenusHotel = await db.foodMenuHotel.findMany({
			where: {
				hotelId: param.id,
			},
		});

		return await Promise.all(foodMenusHotel.map(this.map.bind(this)));
	}

	async update(
		param: FoodMenuHotelParam,
		input: FoodMenuHotelInput,
	): Promise<FoodMenuHotelOutput> {
		const hotel = await db.hotel.findFirst({ where: { id: input.hotel } });
		if (!hotel)
			throw new HTTPException(404, { message: "Hotel tidak ditemukan" });

		await this.foodMenuService.get({ id: input.foodMenu });

		const foodMenuHotel = await db.foodMenuHotel.update({
			where: param,
			data: {
				hotelId: input.hotel,
				foodMenuId: input.foodMenu,
				amount: input.amount,
			},
		});
		if (!foodMenuHotel)
			throw new HTTPException(404, { message: "Menu hotel tidak ditemukan" });

		return await this.map(foodMenuHotel);
	}

	async delete(param: FoodMenuHotelParam): Promise<FoodMenuHotelOutput> {
		const foodMenuHotel = await db.foodMenuHotel.delete({
			where: param,
		});
		if (!foodMenuHotel)
			throw new HTTPException(404, { message: "Menu hotel tidak ditemukan" });

		return await this.map(foodMenuHotel);
	}

	private static _instance: FoodMenuHotelService | null = null;
	static get instance(): FoodMenuHotelService {
		if (!FoodMenuHotelService._instance)
			FoodMenuHotelService._instance = new FoodMenuHotelService();
		return FoodMenuHotelService._instance;
	}
}
