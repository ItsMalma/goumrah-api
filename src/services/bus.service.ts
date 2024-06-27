import { HTTPException } from "hono/http-exception";
import db from "../db";
import type {
	BusInput,
	BusOutput,
	BusParam,
	BusThumbnailInput,
} from "../schemas/bus.schema";
import type { ImageOutput } from "../schemas/image.schema";
import CRUDService from "./crud.service";
import ImageService from "./image.service";

export default class BusService extends CRUDService<
	BusInput,
	BusOutput,
	BusParam
> {
	private constructor(
		private readonly imageService: ImageService = ImageService.instance,
	) {
		super();
	}

	async create(input: BusInput): Promise<BusOutput> {
		const bus = await db.bus.create({
			data: {
				name: input.name,
				helpLink: input.helpLink,
			},
			include: {},
		});

		return {
			id: bus.id,
			thumbnail: null,
			name: bus.name,
			helpLink: bus.helpLink,
		};
	}

	async getAll(): Promise<BusOutput[]> {
		const buses = await db.bus.findMany({
			include: {
				thumbnail: true,
			},
		});

		return buses.map((bus) => ({
			id: bus.id,
			thumbnail: bus.thumbnail
				? {
						id: bus.thumbnail.id,
						src: bus.thumbnail.src,
						alt: bus.thumbnail.alt,
					}
				: null,
			name: bus.name,
			helpLink: bus.helpLink,
		}));
	}

	async get(param: BusParam): Promise<BusOutput> {
		const bus = await db.bus.findUnique({
			where: param,
			include: {
				thumbnail: true,
			},
		});
		if (!bus)
			throw new HTTPException(404, {
				message: `Bis dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: bus.id,
			thumbnail: bus.thumbnail
				? {
						id: bus.thumbnail.id,
						src: bus.thumbnail.src,
						alt: bus.thumbnail.alt,
					}
				: null,
			name: bus.name,
			helpLink: bus.helpLink,
		};
	}

	async update(param: BusParam, input: BusInput): Promise<BusOutput> {
		const bus = await db.bus.update({
			data: {
				name: input.name,
				helpLink: input.helpLink,
			},
			where: {
				id: param.id,
			},
			include: {
				thumbnail: true,
			},
		});

		if (!bus)
			throw new HTTPException(404, {
				message: `Bis dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: bus.id,
			thumbnail: bus.thumbnail
				? {
						id: bus.thumbnail.id,
						src: bus.thumbnail.src,
						alt: bus.thumbnail.alt,
					}
				: null,
			name: bus.name,
			helpLink: bus.helpLink,
		};
	}

	async delete(param: BusParam): Promise<BusOutput> {
		const bus = await db.bus.delete({
			where: { id: param.id },
			include: {
				thumbnail: true,
			},
		});
		if (!bus)
			throw new HTTPException(404, {
				message: `Bis dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: bus.id,
			thumbnail: bus.thumbnail
				? {
						id: bus.thumbnail.id,
						src: bus.thumbnail.src,
						alt: bus.thumbnail.alt,
					}
				: null,
			name: bus.name,
			helpLink: bus.helpLink,
		};
	}

	async updateThumbnail(
		param: BusParam,
		input: BusThumbnailInput,
	): Promise<ImageOutput> {
		let bus = await db.bus.findFirst({
			where: { id: param.id },
			include: { thumbnail: true },
		});
		if (!bus) {
			throw new HTTPException(404, {
				message: `Bis dengan id ${param.id} tidak ditemukan`,
			});
		}

		if (bus.thumbnail) {
			await this.imageService.update(bus.thumbnail.src, input.thumbnail);
		} else {
			const imageFileName = await this.imageService.write(input.thumbnail);
			bus = await db.bus.update({
				data: {
					thumbnail: {
						create: {
							src: imageFileName,
							alt: `Thumbnail maskapai penerbangan ${bus.name}`,
						},
					},
				},
				where: { id: param.id },
				include: { thumbnail: true },
			});
		}

		if (!bus.thumbnail) {
			throw new HTTPException(500, {
				message: "Terjadi keasalahan saat mengunggah gambar",
			});
		}

		return {
			id: bus.thumbnail.id,
			src: bus.thumbnail.src,
			alt: bus.thumbnail.alt,
		};
	}

	async deleteThumbnail(param: BusParam): Promise<ImageOutput> {
		const bus = await db.bus.findFirst({
			where: { id: param.id },
			include: { thumbnail: true },
		});
		if (!bus) {
			throw new HTTPException(404, {
				message: `Bis dengan id ${param.id} tidak ditemukan`,
			});
		}
		if (!bus.thumbnail) {
			throw new HTTPException(404, {
				message: `Bis dengan id ${param.id} tidak memiliki thumbnail`,
			});
		}

		await this.imageService.remove(bus.thumbnail.src);
		await db.bus.update({
			data: {
				thumbnail: { delete: {} },
			},
			where: { id: param.id },
		});

		return {
			id: bus.thumbnail.id,
			src: bus.thumbnail.src,
			alt: bus.thumbnail.alt,
		};
	}

	private static _instance: BusService | null = null;
	static get instance(): BusService {
		if (!BusService._instance) BusService._instance = new BusService();
		return BusService._instance;
	}
}
