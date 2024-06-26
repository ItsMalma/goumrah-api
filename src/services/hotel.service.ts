import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	HotelImagesInput,
	HotelInput,
	HotelOutput,
	HotelParam,
	HotelThumbnailInput,
} from "../schemas/hotel.schema";
import type { ImageOutput } from "../schemas/image.schema";
import CRUDService from "./crud.service";
import ImageService from "./image.service";

export default class HotelService extends CRUDService<
	HotelInput,
	HotelOutput,
	HotelParam
> {
	private constructor(
		private readonly imageService: ImageService = ImageService.instance,
	) {
		super();
	}

	async create(input: HotelInput): Promise<HotelOutput> {
		const facilities = await Promise.all(
			input.facilities.map(async (facilityId) => {
				const facility = await db.facility.findFirst({
					where: { id: facilityId },
				});
				if (!facility)
					throw new HTTPException(404, {
						message: `Fasilitas dengan id ${facilityId} tidak ditemukan`,
					});
				return facility;
			}),
		);

		const foodType = await db.foodType.findFirst({
			where: { id: input.foodType },
		});
		if (!foodType)
			throw new HTTPException(404, {
				message: `Tipe makanan dengan id ${input.foodType} tidak ditemukan`,
			});

		await Promise.all(
			input.foodMenus.map(async (foodMenu) => {
				const food = await db.foodMenu.findFirst({
					where: { id: foodMenu.id },
				});
				if (!food)
					throw new HTTPException(404, {
						message: `Menu makanan dengan id ${foodMenu.id} tidak ditemukan`,
					});
				return food;
			}),
		);

		const hotel = await db.hotel.create({
			data: {
				rating: input.rating,
				name: input.name,
				helpLink: input.helpLink,
				description: input.description,
				facilities: {
					connect: facilities,
				},
				mapLink: input.mapLink,
				address: input.address,
				distance: input.distance,
				foodType: { connect: foodType },
				foodMenus: {
					createMany: {
						data: input.foodMenus.map((foodMenu) => ({
							foodMenuId: foodMenu.id,
							amount: foodMenu.amount,
						})),
					},
				},
				reviewLink: input.reviewLink,
			},
			include: {
				facilities: true,
				foodType: true,
				foodMenus: { include: { foodMenu: true } },
			},
		});

		return {
			id: hotel.id,
			thumbnail: null,
			rating: hotel.rating,
			name: hotel.name,
			helpLink: hotel.helpLink,
			images: [],
			description: hotel.description,
			facilities: hotel.facilities.map((facility) => ({
				id: facility.id,
				name: facility.name,
				icon: facility.icon,
			})),
			mapLink: hotel.mapLink,
			address: hotel.address,
			distance: hotel.distance,
			foodType: {
				id: hotel.foodType.id,
				name: hotel.foodType.name,
			},
			foodAmount: hotel.foodMenus.reduce((prev, curr) => prev + curr.amount, 0),
			foodMenus: hotel.foodMenus.map((foodMenu) => ({
				foodMenu: {
					id: foodMenu.foodMenu.id,
					name: foodMenu.foodMenu.name,
				},
				amount: foodMenu.amount,
			})),
			reviewLink: hotel.reviewLink,
		};
	}

	async getAll(): Promise<HotelOutput[]> {
		const hotels = await db.hotel.findMany({
			include: {
				thumbnail: true,
				images: true,
				facilities: true,
				foodType: true,
				foodMenus: { include: { foodMenu: true } },
			},
		});

		return hotels.map((hotel) => ({
			id: hotel.id,
			thumbnail: hotel.thumbnail
				? {
						id: hotel.thumbnail.id,
						src: hotel.thumbnail.src,
						alt: hotel.thumbnail.alt,
					}
				: null,
			rating: hotel.rating,
			name: hotel.name,
			helpLink: hotel.helpLink,
			images: hotel.images.map((image) => ({
				id: image.id,
				src: image.src,
				alt: image.alt,
			})),
			description: hotel.description,
			facilities: hotel.facilities.map((facility) => ({
				id: facility.id,
				name: facility.name,
				icon: facility.icon,
			})),
			mapLink: hotel.mapLink,
			address: hotel.address,
			distance: hotel.distance,
			foodType: {
				id: hotel.foodType.id,
				name: hotel.foodType.name,
			},
			foodAmount: hotel.foodMenus.reduce((prev, curr) => prev + curr.amount, 0),
			foodMenus: hotel.foodMenus.map((foodMenu) => ({
				foodMenu: {
					id: foodMenu.foodMenu.id,
					name: foodMenu.foodMenu.name,
				},
				amount: foodMenu.amount,
			})),
			reviewLink: hotel.reviewLink,
		}));
	}

	async get(param: HotelParam): Promise<HotelOutput> {
		const hotel = await db.hotel.findUnique({
			where: param,
			include: {
				thumbnail: true,
				images: true,
				facilities: true,
				foodType: true,
				foodMenus: { include: { foodMenu: true } },
			},
		});
		if (!hotel)
			throw new HTTPException(404, {
				message: `Hotel dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: hotel.id,
			thumbnail: hotel.thumbnail
				? {
						id: hotel.thumbnail.id,
						src: hotel.thumbnail.src,
						alt: hotel.thumbnail.alt,
					}
				: null,
			rating: hotel.rating,
			name: hotel.name,
			helpLink: hotel.helpLink,
			images: hotel.images.map((image) => ({
				id: image.id,
				src: image.src,
				alt: image.alt,
			})),
			description: hotel.description,
			facilities: hotel.facilities.map((facility) => ({
				id: facility.id,
				name: facility.name,
				icon: facility.icon,
			})),
			mapLink: hotel.mapLink,
			address: hotel.address,
			distance: hotel.distance,
			foodType: {
				id: hotel.foodType.id,
				name: hotel.foodType.name,
			},
			foodAmount: hotel.foodMenus.reduce((prev, curr) => prev + curr.amount, 0),
			foodMenus: hotel.foodMenus.map((foodMenu) => ({
				foodMenu: {
					id: foodMenu.foodMenu.id,
					name: foodMenu.foodMenu.name,
				},
				amount: foodMenu.amount,
			})),
			reviewLink: hotel.reviewLink,
		};
	}

	async update(param: HotelParam, input: HotelInput): Promise<HotelOutput> {
		const hotel = await db.hotel.update({
			data: {
				rating: input.rating,
				name: input.name,
				helpLink: input.helpLink,
				description: input.description,
				facilities: {
					set: input.facilities.map((facility) => ({ id: facility })),
				},
				mapLink: input.mapLink,
				address: input.address,
				distance: input.distance,
				foodType: { connect: { id: input.foodType } },
				foodMenus: {
					deleteMany: {},
					createMany: {
						data: input.foodMenus.map((foodMenu) => ({
							foodMenuId: foodMenu.id,
							amount: foodMenu.amount,
						})),
					},
				},
				reviewLink: input.reviewLink,
			},
			where: {
				id: param.id,
			},
			include: {
				thumbnail: true,
				images: true,
				facilities: true,
				foodType: true,
				foodMenus: { include: { foodMenu: true } },
			},
		});

		if (!hotel)
			throw new HTTPException(404, { message: "Hotel tidak ditemukan" });

		return {
			id: hotel.id,
			thumbnail: hotel.thumbnail
				? {
						id: hotel.thumbnail.id,
						src: hotel.thumbnail.src,
						alt: hotel.thumbnail.alt,
					}
				: null,
			rating: hotel.rating,
			name: hotel.name,
			helpLink: hotel.helpLink,
			images: hotel.images.map((image) => ({
				id: image.id,
				src: image.src,
				alt: image.alt,
			})),
			description: hotel.description,
			facilities: hotel.facilities.map((facility) => ({
				id: facility.id,
				name: facility.name,
				icon: facility.icon,
			})),
			mapLink: hotel.mapLink,
			address: hotel.address,
			distance: hotel.distance,
			foodType: {
				id: hotel.foodType.id,
				name: hotel.foodType.name,
			},
			foodAmount: hotel.foodMenus.reduce((prev, curr) => prev + curr.amount, 0),
			foodMenus: hotel.foodMenus.map((foodMenu) => ({
				foodMenu: {
					id: foodMenu.foodMenu.id,
					name: foodMenu.foodMenu.name,
				},
				amount: foodMenu.amount,
			})),
			reviewLink: hotel.reviewLink,
		};
	}

	async delete(param: HotelParam): Promise<HotelOutput> {
		const hotel = await db.hotel.delete({
			where: { id: param.id },
			include: {
				thumbnail: true,
				images: true,
				facilities: true,
				foodType: true,
				foodMenus: { include: { foodMenu: true } },
			},
		});
		if (!hotel)
			throw new HTTPException(404, {
				message: `Hotel dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: hotel.id,
			thumbnail: hotel.thumbnail
				? {
						id: hotel.thumbnail.id,
						src: hotel.thumbnail.src,
						alt: hotel.thumbnail.alt,
					}
				: null,
			rating: hotel.rating,
			name: hotel.name,
			helpLink: hotel.helpLink,
			images: hotel.images.map((image) => ({
				id: image.id,
				src: image.src,
				alt: image.alt,
			})),
			description: hotel.description,
			facilities: hotel.facilities.map((facility) => ({
				id: facility.id,
				name: facility.name,
				icon: facility.icon,
			})),
			mapLink: hotel.mapLink,
			address: hotel.address,
			distance: hotel.distance,
			foodType: {
				id: hotel.foodType.id,
				name: hotel.foodType.name,
			},
			foodAmount: hotel.foodMenus.reduce((prev, curr) => prev + curr.amount, 0),
			foodMenus: hotel.foodMenus.map((foodMenu) => ({
				foodMenu: {
					id: foodMenu.foodMenu.id,
					name: foodMenu.foodMenu.name,
				},
				amount: foodMenu.amount,
			})),
			reviewLink: hotel.reviewLink,
		};
	}

	async updateThumbnail(
		param: HotelParam,
		input: HotelThumbnailInput,
	): Promise<ImageOutput> {
		let hotel = await db.hotel.findFirst({
			where: { id: param.id },
			include: { thumbnail: true },
		});
		if (!hotel) {
			throw new HTTPException(404, {
				message: `Hotel dengan id ${param.id} tidak ditemukan`,
			});
		}

		if (hotel.thumbnail) {
			await this.imageService.update(hotel.thumbnail.src, input.thumbnail);
		} else {
			const imageFileName = await this.imageService.write(input.thumbnail);
			hotel = await db.hotel.update({
				data: {
					thumbnail: {
						create: {
							src: imageFileName,
							alt: `Thumbnail hotel ${hotel.name}`,
						},
					},
				},
				where: { id: param.id },
				include: { thumbnail: true },
			});
		}

		if (!hotel.thumbnail) {
			throw new HTTPException(500, {
				message: "Terjadi keasalahan saat mengunggah gambar",
			});
		}

		return {
			id: hotel.thumbnail.id,
			src: hotel.thumbnail.src,
			alt: hotel.thumbnail.alt,
		};
	}

	async deleteThumbnail(param: HotelParam): Promise<ImageOutput> {
		const hotel = await db.hotel.findFirst({
			where: { id: param.id },
			include: { thumbnail: true },
		});
		if (!hotel) {
			throw new HTTPException(404, {
				message: `Hotel dengan id ${param.id} tidak ditemukan`,
			});
		}
		if (!hotel.thumbnail) {
			throw new HTTPException(404, {
				message: `Hotel dengan id ${param.id} tidak memiliki thumbnail`,
			});
		}

		await this.imageService.remove(hotel.thumbnail.src);
		await db.hotel.update({
			data: {
				thumbnail: { delete: {} },
			},
			where: { id: param.id },
		});

		return {
			id: hotel.thumbnail.id,
			src: hotel.thumbnail.src,
			alt: hotel.thumbnail.alt,
		};
	}

	async updateImages(
		param: HotelParam,
		input: HotelImagesInput,
	): Promise<ImageOutput[]> {
		let hotel = await db.hotel.findFirst({
			where: { id: param.id },
			include: { images: true },
		});
		if (!hotel) {
			throw new HTTPException(404, {
				message: `Hotel dengan id ${param.id} tidak ditemukan`,
			});
		}

		for (const oldImage of hotel.images) {
			await this.imageService.remove(oldImage.src);
		}

		const images = [];
		for (const image of input["images[]"]) {
			const imageFileName = await this.imageService.write(image);
			images.push({
				src: imageFileName,
				alt: `Gambar hotel ${hotel.name}`,
			});
		}

		hotel = await db.hotel.update({
			data: {
				images: {
					deleteMany: {},
					create: images,
				},
			},
			where: { id: param.id },
			include: { images: true },
		});

		return hotel.images.map((image) => ({
			id: image.id,
			src: `/${image.src}`,
			alt: image.alt,
		}));
	}

	async deleteImages(param: HotelParam): Promise<ImageOutput[]> {
		const hotel = await db.hotel.findFirst({
			where: { id: param.id },
			include: { images: true },
		});
		if (!hotel) {
			throw new HTTPException(404, {
				message: `Hotel dengan id ${param.id} tidak ditemukan`,
			});
		}

		for (const image of hotel.images) {
			await this.imageService.remove(image.src);
		}
		await db.hotel.update({
			data: {
				images: { deleteMany: {} },
			},
			where: { id: param.id },
		});

		return hotel.images.map((image) => ({
			id: image.id,
			src: `/${image.src}`,
			alt: image.alt,
		}));
	}

	private static _instance: HotelService | null = null;
	static get instance(): HotelService {
		if (!HotelService._instance) HotelService._instance = new HotelService();
		return HotelService._instance;
	}
}
