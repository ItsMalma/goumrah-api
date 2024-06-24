import type { Hotel } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	HotelInput,
	HotelOutput,
	HotelParam,
} from "../schemas/hotel.schema";
import CRUDService from "./crud.service";
import FacilityService from "./facility.service";
import FoodMenuHotelService from "./foodMenuHotel.service";
import FoodTypeService from "./foodType.service";
import ImageService from "./image.service";

export default class HotelService extends CRUDService<
	HotelInput,
	HotelOutput,
	HotelParam
> {
	private constructor(
		private imageService = ImageService.instance,
		private facilityService = FacilityService.instance,
		private foodTypeService = FoodTypeService.instance,
		private foodMenuHotelService = FoodMenuHotelService.instance,
	) {
		super();
	}

	async map(hotel: Hotel): Promise<HotelOutput> {
		const thumbnail = await this.imageService.get({ id: hotel.thumbnailId });
		const images = await this.imageService.getFromHotel(hotel);
		const facilities = await this.facilityService.getFromHotel(hotel);
		const foodType = await this.foodTypeService.get({ id: hotel.foodTypeId });
		const foodMenusHotel = await this.foodMenuHotelService.getFromHotel(hotel);

		return {
			id: hotel.id,
			thumbnail: thumbnail.src,
			rating: hotel.rating,
			name: hotel.name,
			helpLink: hotel.helpLink,
			images: images.map((image) => image.src),
			description: hotel.description,
			facilities,
			mapLink: hotel.mapLink,
			address: hotel.address,
			distance: hotel.distance,
			foodType: foodType.name,
			foodAmount: hotel.foodAmount,
			foodMenus: foodMenusHotel.map((foodMenuHotel) => ({
				amount: foodMenuHotel.amount,
				name: foodMenuHotel.foodMenu.name,
			})),
			reviewLink: hotel.reviewLink,
		};
	}

	async create(input: HotelInput): Promise<HotelOutput> {
		const thumbnail = await this.imageService.create({
			file: input.thumbnail,
			alt: `${input.name}'s thumbnail`,
		});

		const images = await this.imageService.createMany(
			input["images[]"].map((inputImage) => ({
				file: inputImage,
				alt: `Gambar Hotel ${input.name}`,
			})),
		);

		const facilities = await this.facilityService.getMany(
			input.facilities.map((facility) => ({ id: facility })),
		);

		const foodType = await this.foodTypeService.get({ id: input.foodType });

		const hotel = await db.hotel.create({
			data: {
				...{
					...input,
					"images[]": undefined,
				},
				thumbnail: { connect: thumbnail },
				images: { connect: images },
				facilities: { connect: facilities },
				foodType: { connect: foodType },
				foodMenus: {},
			},
		});

		await this.foodMenuHotelService.createMany(
			input.foodMenus.map((foodMenu) => ({
				hotel: hotel.id,
				foodMenu: foodMenu.id,
				amount: foodMenu.amount,
			})),
		);

		return await this.map(hotel);
	}

	async getAll(): Promise<HotelOutput[]> {
		const hotels = await db.hotel.findMany();

		return await Promise.all(hotels.map(this.map.bind(this)));
	}

	async get(param: HotelParam): Promise<HotelOutput> {
		const hotel = await db.hotel.findUnique({
			where: param,
		});
		if (!hotel)
			throw new HTTPException(404, { message: "Hotel tidak ditemukan" });

		return await this.map(hotel);
	}

	async update(
		param: HotelParam,
		input: HotelInput,
		throwIfNotFound?: boolean,
	): Promise<HotelOutput> {
		const thumbnail = await this.imageService.create({
			file: input.thumbnail,
			alt: `${input.name}'s thumbnail`,
		});

		const images = await this.imageService.createMany(
			input["images[]"].map((inputImage) => ({
				file: inputImage,
				alt: `Gambar Hotel ${input.name}`,
			})),
		);

		const facilities = await this.facilityService.getMany(
			input.facilities.map((facility) => ({ id: facility })),
		);

		const foodType = await this.foodTypeService.get({ id: input.foodType });

		const hotel = await db.hotel.update({
			where: param,
			data: {
				...{
					...input,
					"images[]": undefined,
				},
				thumbnail: { connect: thumbnail },
				images: { set: images },
				facilities: { set: facilities },
				foodType: { connect: foodType },
				foodMenus: { deleteMany: {} },
			},
		});
		if (!hotel && throwIfNotFound)
			throw new HTTPException(404, { message: "Hotel tidak ditemukan" });

		await this.foodMenuHotelService.createMany(
			input.foodMenus.map((foodMenu) => ({
				hotel: hotel.id,
				foodMenu: foodMenu.id,
				amount: foodMenu.amount,
			})),
		);

		return await this.map(hotel);
	}

	async delete(
		param: HotelParam,
		throwIfNotFound?: boolean,
	): Promise<HotelOutput> {
		const hotel = await db.$transaction(async (tx) => {
			await tx.foodMenuHotel.deleteMany({
				where: {
					hotelId: param.id,
				},
			});

			const hotel = await tx.hotel.delete({
				where: param,
			});
			if (!hotel && throwIfNotFound)
				throw new HTTPException(404, { message: "Hotel tidak ditemukan" });

			await tx.image.deleteMany({
				where: {
					hotels: {
						every: {
							id: param.id,
						},
					},
					hotelsThumbnail: {
						every: {
							id: param.id,
						},
					},
				},
			});

			return hotel;
		});

		return await this.map(hotel);
	}

	private static _instance: HotelService | null = null;
	static get instance(): HotelService {
		if (!HotelService._instance) HotelService._instance = new HotelService();
		return HotelService._instance;
	}
}
