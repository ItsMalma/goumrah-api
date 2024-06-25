import { HTTPException } from "hono/http-exception";
import type { DeepPartial, FindOneOptions } from "typeorm";
import dataSource from "../data-source";
import FoodMenu from "../entities/foodMenu.entity";
import Hotel from "../entities/hotel.entity";
import HotelFood from "../entities/hotelFood.entity";
import type {
	HotelFoodInput,
	HotelFoodOutput,
	HotelFoodParam,
} from "../schemas/hotelFood.schema";
import CRUDService from "./crud.service";

export default class HotelFoodService extends CRUDService<
	HotelFood,
	HotelFoodInput,
	HotelFoodOutput,
	HotelFoodParam
> {
	private constructor(
		private hotelRepository = dataSource.getRepository(Hotel),
		private foodMenuRepository = dataSource.getRepository(FoodMenu),
	) {
		super(HotelFood, "Menu Hotel");
	}

	protected async mapCreate(
		input: HotelFoodInput,
	): Promise<DeepPartial<HotelFood>> {
		const hotel = await this.hotelRepository.findOne({
			where: { id: input.hotel },
		});
		if (!hotel)
			throw new HTTPException(404, {
				message: "Hotel tidak ditemukan",
			});

		const foodMenu = await this.foodMenuRepository.findOne({
			where: { id: input.foodMenu },
		});
		if (!foodMenu)
			throw new HTTPException(404, {
				message: "Menu makanan tidak ditemukan",
			});

		return { hotel, foodMenu, amount: input.amount };
	}

	protected async mapUpdate(
		old: HotelFood,
		input: HotelFoodInput,
	): Promise<HotelFood> {
		const hotel = await this.hotelRepository.findOne({
			where: { id: input.hotel },
		});
		if (!hotel)
			throw new HTTPException(404, {
				message: "Hotel tidak ditemukan",
			});

		const foodMenu = await this.foodMenuRepository.findOne({
			where: { id: input.foodMenu },
		});
		if (!foodMenu)
			throw new HTTPException(404, {
				message: "Menu makanan tidak ditemukan",
			});

		old.hotel = hotel;
		old.foodMenu = foodMenu;
		old.amount = input.amount;

		return old;
	}

	protected mapParam(param: HotelFoodParam): FindOneOptions<HotelFood> {
		return { where: { id: param.id } };
	}

	protected mapOutput(entity: HotelFood): HotelFoodOutput {
		return {
			id: entity.id,
			hotel: entity.hotel.id,
			foodMenu: {
				id: entity.foodMenu.id,
				name: entity.foodMenu.name,
			},
			amount: entity.amount,
		};
	}

	private static _instance: HotelFoodService | null = null;
	static get instance(): HotelFoodService {
		if (!HotelFoodService._instance)
			HotelFoodService._instance = new HotelFoodService();
		return HotelFoodService._instance;
	}
}
