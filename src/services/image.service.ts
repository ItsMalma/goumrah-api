import { HTTPException } from "hono/http-exception";
import path from "node:path";
import db from "../db";
import type { HotelParam } from "../schemas/hotel.schema";
import type {
	ImageInput,
	ImageOutput,
	ImageParam,
} from "../schemas/image.schema";
import { fileTypeToExtension, randomFileName } from "../utils/file.util";
import CRUDService from "./crud.service";

export default class ImageService extends CRUDService<
	ImageInput,
	ImageOutput,
	ImageParam
> {
	private constructor() {
		super();
	}

	async create(input: ImageInput): Promise<ImageOutput> {
		const fileName = randomFileName(fileTypeToExtension(input.file.type));
		const filePath = path.join(__dirname, "..", "..", "static", fileName);
		await Bun.write(filePath, input.file);

		const image = await db.image.create({
			data: {
				src: fileName,
				alt: input.alt,
			},
		});

		return image;
	}

	async getAll(): Promise<ImageOutput[]> {
		const images = await db.image.findMany();

		return images;
	}

	async get(param: ImageParam): Promise<ImageOutput> {
		const image = await db.image.findUnique({
			where: param,
		});
		if (!image)
			throw new HTTPException(404, { message: "Gambar tidak ditemukan" });

		return image;
	}

	async getFromHotel(param: HotelParam): Promise<ImageOutput[]> {
		const images = await db.image.findMany({
			where: {
				hotels: { some: param },
			},
		});

		return images;
	}

	async update(param: ImageParam, input: ImageInput): Promise<ImageOutput> {
		const fileName = randomFileName(fileTypeToExtension(input.file.type));
		const filePath = path.join(__dirname, "..", "..", "static", fileName);
		await Bun.write(filePath, input.file);

		const image = await db.image.update({
			where: param,
			data: {
				src: fileName,
				alt: input.alt,
			},
		});
		if (!image)
			throw new HTTPException(404, { message: "Gambar tidak ditemukan" });

		return image;
	}

	async delete(param: ImageParam): Promise<ImageOutput> {
		const image = await db.image.delete({
			where: param,
		});
		if (!image)
			throw new HTTPException(404, { message: "Gambar tidak ditemukan" });

		return image;
	}

	private static _instance: ImageService | null = null;
	static get instance(): ImageService {
		if (!ImageService._instance) ImageService._instance = new ImageService();
		return ImageService._instance;
	}
}
