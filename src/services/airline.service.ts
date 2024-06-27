import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	AirlineImagesInput,
	AirlineInput,
	AirlineOutput,
	AirlineParam,
	AirlineThumbnailInput,
} from "../schemas/airline.schema";
import type { ImageOutput } from "../schemas/image.schema";
import CRUDService from "./crud.service";
import ImageService from "./image.service";

export default class AirlineService extends CRUDService<
	AirlineInput,
	AirlineOutput,
	AirlineParam
> {
	private constructor(
		private readonly imageService: ImageService = ImageService.instance,
	) {
		super();
	}

	async create(input: AirlineInput): Promise<AirlineOutput> {
		const airline = await db.airline.create({
			data: {
				rating: input.rating,
				name: input.name,
				helpLink: input.helpLink,
			},
			include: {},
		});

		return {
			id: airline.id,
			thumbnail: null,
			rating: airline.rating,
			name: airline.name,
			helpLink: airline.helpLink,
			images: [],
		};
	}

	async getAll(): Promise<AirlineOutput[]> {
		const airlines = await db.airline.findMany({
			include: {
				thumbnail: true,
				images: true,
			},
		});

		return airlines.map((airline) => ({
			id: airline.id,
			thumbnail: airline.thumbnail
				? {
						id: airline.thumbnail.id,
						src: airline.thumbnail.src,
						alt: airline.thumbnail.alt,
					}
				: null,
			rating: airline.rating,
			name: airline.name,
			helpLink: airline.helpLink,
			images: airline.images.map((image) => ({
				id: image.id,
				src: image.src,
				alt: image.alt,
			})),
		}));
	}

	async get(param: AirlineParam): Promise<AirlineOutput> {
		const airline = await db.airline.findUnique({
			where: param,
			include: {
				thumbnail: true,
				images: true,
			},
		});
		if (!airline)
			throw new HTTPException(404, {
				message: `Maskapai penerbangan dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: airline.id,
			thumbnail: airline.thumbnail
				? {
						id: airline.thumbnail.id,
						src: airline.thumbnail.src,
						alt: airline.thumbnail.alt,
					}
				: null,
			rating: airline.rating,
			name: airline.name,
			helpLink: airline.helpLink,
			images: airline.images.map((image) => ({
				id: image.id,
				src: image.src,
				alt: image.alt,
			})),
		};
	}

	async update(
		param: AirlineParam,
		input: AirlineInput,
	): Promise<AirlineOutput> {
		const airline = await db.airline.update({
			data: {
				rating: input.rating,
				name: input.name,
				helpLink: input.helpLink,
			},
			where: {
				id: param.id,
			},
			include: {
				thumbnail: true,
				images: true,
			},
		});

		if (!airline)
			throw new HTTPException(404, {
				message: `Maskapai penerbangan dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: airline.id,
			thumbnail: airline.thumbnail
				? {
						id: airline.thumbnail.id,
						src: airline.thumbnail.src,
						alt: airline.thumbnail.alt,
					}
				: null,
			rating: airline.rating,
			name: airline.name,
			helpLink: airline.helpLink,
			images: airline.images.map((image) => ({
				id: image.id,
				src: image.src,
				alt: image.alt,
			})),
		};
	}

	async delete(param: AirlineParam): Promise<AirlineOutput> {
		const airline = await db.airline.delete({
			where: { id: param.id },
			include: {
				thumbnail: true,
				images: true,
			},
		});
		if (!airline)
			throw new HTTPException(404, {
				message: `Maskapai penerbangan dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: airline.id,
			thumbnail: airline.thumbnail
				? {
						id: airline.thumbnail.id,
						src: airline.thumbnail.src,
						alt: airline.thumbnail.alt,
					}
				: null,
			rating: airline.rating,
			name: airline.name,
			helpLink: airline.helpLink,
			images: airline.images.map((image) => ({
				id: image.id,
				src: image.src,
				alt: image.alt,
			})),
		};
	}

	async updateThumbnail(
		param: AirlineParam,
		input: AirlineThumbnailInput,
	): Promise<ImageOutput> {
		let airline = await db.airline.findFirst({
			where: { id: param.id },
			include: { thumbnail: true },
		});
		if (!airline) {
			throw new HTTPException(404, {
				message: `Maskapai penerbangan dengan id ${param.id} tidak ditemukan`,
			});
		}

		if (airline.thumbnail) {
			await this.imageService.update(airline.thumbnail.src, input.thumbnail);
		} else {
			const imageFileName = await this.imageService.write(input.thumbnail);
			airline = await db.airline.update({
				data: {
					thumbnail: {
						create: {
							src: imageFileName,
							alt: `Thumbnail maskapai penerbangan ${airline.name}`,
						},
					},
				},
				where: { id: param.id },
				include: { thumbnail: true },
			});
		}

		if (!airline.thumbnail) {
			throw new HTTPException(500, {
				message: "Terjadi keasalahan saat mengunggah gambar",
			});
		}

		return {
			id: airline.thumbnail.id,
			src: airline.thumbnail.src,
			alt: airline.thumbnail.alt,
		};
	}

	async deleteThumbnail(param: AirlineParam): Promise<ImageOutput> {
		const airline = await db.airline.findFirst({
			where: { id: param.id },
			include: { thumbnail: true },
		});
		if (!airline) {
			throw new HTTPException(404, {
				message: `Maskapai penerbangan dengan id ${param.id} tidak ditemukan`,
			});
		}
		if (!airline.thumbnail) {
			throw new HTTPException(404, {
				message: `Maskapai penerbangan dengan id ${param.id} tidak memiliki thumbnail`,
			});
		}

		await this.imageService.remove(airline.thumbnail.src);
		await db.airline.update({
			data: {
				thumbnail: { delete: {} },
			},
			where: { id: param.id },
		});

		return {
			id: airline.thumbnail.id,
			src: airline.thumbnail.src,
			alt: airline.thumbnail.alt,
		};
	}

	async updateImages(
		param: AirlineParam,
		input: AirlineImagesInput,
	): Promise<ImageOutput[]> {
		let airline = await db.airline.findFirst({
			where: { id: param.id },
			include: { images: true },
		});
		if (!airline) {
			throw new HTTPException(404, {
				message: `Maskapai penerbangan dengan id ${param.id} tidak ditemukan`,
			});
		}

		for (const oldImage of airline.images) {
			await this.imageService.remove(oldImage.src);
		}

		const images = [];
		for (const image of input["images[]"]) {
			const imageFileName = await this.imageService.write(image);
			images.push({
				src: imageFileName,
				alt: `Gambar maskapai penerbangan ${airline.name}`,
			});
		}

		airline = await db.airline.update({
			data: {
				images: {
					deleteMany: {},
					create: images,
				},
			},
			where: { id: param.id },
			include: { images: true },
		});

		return airline.images.map((image) => ({
			id: image.id,
			src: `/${image.src}`,
			alt: image.alt,
		}));
	}

	async deleteImages(param: AirlineParam): Promise<ImageOutput[]> {
		const airline = await db.airline.findFirst({
			where: { id: param.id },
			include: { images: true },
		});
		if (!airline) {
			throw new HTTPException(404, {
				message: `Maskapai penerbangan dengan id ${param.id} tidak ditemukan`,
			});
		}

		for (const image of airline.images) {
			await this.imageService.remove(image.src);
		}
		await db.airline.update({
			data: {
				images: { deleteMany: {} },
			},
			where: { id: param.id },
		});

		return airline.images.map((image) => ({
			id: image.id,
			src: `/${image.src}`,
			alt: image.alt,
		}));
	}

	private static _instance: AirlineService | null = null;
	static get instance(): AirlineService {
		if (!AirlineService._instance)
			AirlineService._instance = new AirlineService();
		return AirlineService._instance;
	}
}
