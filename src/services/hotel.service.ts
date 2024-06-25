import { HTTPException } from "hono/http-exception";
import type { DeepPartial, FindOneOptions } from "typeorm";
import dataSource from "../data-source";
import FoodMenu from "../entities/foodMenu.entity";
import Hotel from "../entities/hotel.entity";
import HotelFood from "../entities/hotelFood.entity";
import type {
	HotelInput,
	HotelOutput,
	HotelParam,
} from "../schemas/hotel.schema";
import CRUDService from "./crud.service";
import FacilityService from "./facility.service";
import HotelFoodService from "./foodHotel.service";
import FoodMenuService from "./foodMenu.service";
import FoodTypeService from "./foodType.service";
import ImageService from "./image.service";

export default class HotelService extends CRUDService<
	Hotel,
	HotelInput,
	HotelOutput,
	HotelParam
> {
	private constructor(
		private imageService = ImageService.instance,
		private facilityService = FacilityService.instance,
		private foodTypeService = FoodTypeService.instance,
		private foodMenuRepository = dataSource.getRepository(FoodMenu),
		private foodMenuService = FoodMenuService.instance,
		private hotelFoodRepository = dataSource.getRepository(HotelFood),
		private hotelFoodService = HotelFoodService.instance,
	) {
		super(Hotel, "Hotel", {
			images: {},
			thumbnail: {},
			facilities: {},
			foodType: {},
			foods: {
				foodMenu: true,
			},
		});
	}

	protected async mapCreate(input: HotelInput): Promise<DeepPartial<Hotel>> {
		const thumbnail = await this.imageService.create({
			file: input.thumbnail,
			alt: `Thumbnail Hotel ${input.name}`,
		});

		const images = [];
		for (const inputImage of input["images[]"]) {
			const imageOutput = await this.imageService.create({
				file: inputImage,
				alt: `Gambar Hotel ${input.name}`,
			});

			images.push({
				id: imageOutput.id,
			});
		}

		const facilities = await this.facilityService.getMany(
			input.facilities.map((inputFacility) => ({ id: inputFacility })),
		);

		const foodType = await this.foodTypeService.get({
			id: input.foodType,
		});

		const foods: DeepPartial<HotelFood>[] = [];
		for (const inputFoodMenu of input.foodMenus) {
			const foodMenu = await this.foodMenuService.get({
				id: inputFoodMenu.id,
			});

			foods.push({
				foodMenu,
				amount: inputFoodMenu.amount,
			});
		}

		return {
			thumbnail,
			rating: input.rating,
			name: input.name,
			helpLink: input.helpLink,
			images,
			description: input.description,
			facilities,
			mapLink: input.mapLink,
			address: input.address,
			distance: input.distance,
			foodType: foodType,
			foods,
			reviewLink: input.reviewLink,
		};
	}

	protected async mapUpdate(
		old: Hotel,
		input: HotelInput,
	): Promise<DeepPartial<Hotel>> {
		const thumbnail = await this.imageService.create({
			file: input.thumbnail,
			alt: `Thumbnail Hotel ${input.name}`,
		});

		const images = [];
		for (const inputImage of input["images[]"]) {
			const imageOutput = await this.imageService.create({
				file: inputImage,
				alt: `Gambar Hotel ${input.name}`,
			});

			images.push({
				id: imageOutput.id,
			});
		}

		const facilities = await this.facilityService.getMany(
			input.facilities.map((inputFacility) => ({ id: inputFacility })),
		);

		const foodType = await this.foodTypeService.get({
			id: input.foodType,
		});

		const foods: DeepPartial<HotelFood>[] = [];
		for (const inputFoodMenu of input.foodMenus) {
			const foodMenu = await this.foodMenuService.get({
				id: inputFoodMenu.id,
			});

			foods.push({
				foodMenu,
				amount: inputFoodMenu.amount,
			});
		}

		const _new: DeepPartial<Hotel> = old;
		_new.id = old.id;
		_new.thumbnail = thumbnail;
		_new.rating = input.rating;
		_new.name = input.name;
		_new.helpLink = input.helpLink;
		_new.images = images;
		_new.description = input.description;
		_new.facilities = facilities;
		_new.mapLink = input.mapLink;
		_new.address = input.address;
		_new.distance = input.distance;
		_new.foodType = foodType;
		_new.foods = foods;
		_new.reviewLink = input.reviewLink;

		return _new;
	}

	public async update(
		param: HotelParam,
		input: HotelInput,
	): Promise<HotelOutput> {
		const output = await super.update(param, input);

		const oldHotelFoods = await this.hotelFoodRepository.find({
			where: { hotel: { id: output.id } },
		});
		for (const oldHotelFood of oldHotelFoods) {
			await this.hotelFoodService.delete({ id: oldHotelFood.id });
		}

		for (const newHotelFood of output.foodMenus) {
			const foodMenu = await this.foodMenuRepository.findOne({
				where: { name: newHotelFood.name },
			});
			if (!foodMenu) {
				throw new HTTPException(400, {
					message: "Menu Makanan tidak ditemukan",
				});
			}

			await this.hotelFoodService.create({
				hotel: output.id,
				foodMenu: foodMenu.id,
				amount: newHotelFood.amount,
			});
		}

		return output;
	}

	protected mapParam(param: HotelParam): FindOneOptions<Hotel> {
		return { where: { id: param.id } };
	}

	protected mapOutput(entity: Hotel): HotelOutput {
		console.log(entity);

		return {
			id: entity.id,
			thumbnail: entity.thumbnail.src,
			rating: entity.rating,
			name: entity.name,
			helpLink: entity.helpLink,
			images: entity.images.map((image) => image.src),
			description: entity.description,
			facilities: entity.facilities,
			mapLink: entity.mapLink,
			address: entity.address,
			distance: entity.distance,
			foodType: entity.foodType.name,
			foodAmount: entity.foodAmount,
			foodMenus: entity.foods.map((food) => ({
				name: food.foodMenu.name,
				amount: food.amount,
			})),
			reviewLink: entity.reviewLink,
		};
	}

	private static _instance: HotelService | null = null;
	static get instance(): HotelService {
		if (!HotelService._instance) HotelService._instance = new HotelService();
		return HotelService._instance;
	}
}
