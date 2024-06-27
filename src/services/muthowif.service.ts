import { HTTPException } from "hono/http-exception";
import db from "../db";
import type { ImageOutput } from "../schemas/image.schema";
import type {
	MuthowifInput,
	MuthowifOutput,
	MuthowifParam,
	MuthowifThumbnailInput,
} from "../schemas/muthowif.schema";
import CRUDService from "./crud.service";
import ImageService from "./image.service";

export default class MuthowifService extends CRUDService<
	MuthowifInput,
	MuthowifOutput,
	MuthowifParam
> {
	private constructor(
		private readonly imageService: ImageService = ImageService.instance,
	) {
		super();
	}

	async create(input: MuthowifInput): Promise<MuthowifOutput> {
		const muthowif = await db.muthowif.create({
			data: {
				name: input.name,
				bio: input.bio,
				detail: input.detail,
			},
			include: {},
		});

		return {
			id: muthowif.id,
			thumbnail: null,
			name: muthowif.name,
			bio: muthowif.bio,
			detail: muthowif.detail,
		};
	}

	async getAll(): Promise<MuthowifOutput[]> {
		const arrayOfMuthowif = await db.muthowif.findMany({
			include: {
				thumbnail: true,
			},
		});

		return arrayOfMuthowif.map((muthowif) => ({
			id: muthowif.id,
			thumbnail: muthowif.thumbnail
				? {
						id: muthowif.thumbnail.id,
						src: muthowif.thumbnail.src,
						alt: muthowif.thumbnail.alt,
					}
				: null,
			name: muthowif.name,
			bio: muthowif.bio,
			detail: muthowif.detail,
		}));
	}

	async get(param: MuthowifParam): Promise<MuthowifOutput> {
		const muthowif = await db.muthowif.findUnique({
			where: param,
			include: {
				thumbnail: true,
			},
		});
		if (!muthowif)
			throw new HTTPException(404, {
				message: `Muthowif dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: muthowif.id,
			thumbnail: muthowif.thumbnail
				? {
						id: muthowif.thumbnail.id,
						src: muthowif.thumbnail.src,
						alt: muthowif.thumbnail.alt,
					}
				: null,
			name: muthowif.name,
			bio: muthowif.bio,
			detail: muthowif.detail,
		};
	}

	async update(
		param: MuthowifParam,
		input: MuthowifInput,
	): Promise<MuthowifOutput> {
		const muthowif = await db.muthowif.update({
			data: {
				name: input.name,
				bio: input.bio,
				detail: input.detail,
			},
			where: {
				id: param.id,
			},
			include: {
				thumbnail: true,
			},
		});

		if (!muthowif)
			throw new HTTPException(404, {
				message: `Muthowif dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: muthowif.id,
			thumbnail: muthowif.thumbnail
				? {
						id: muthowif.thumbnail.id,
						src: muthowif.thumbnail.src,
						alt: muthowif.thumbnail.alt,
					}
				: null,
			name: muthowif.name,
			bio: muthowif.bio,
			detail: muthowif.detail,
		};
	}

	async delete(param: MuthowifParam): Promise<MuthowifOutput> {
		const muthowif = await db.muthowif.delete({
			where: { id: param.id },
			include: {
				thumbnail: true,
			},
		});
		if (!muthowif)
			throw new HTTPException(404, {
				message: `Muthowif dengan id ${param.id} tidak ditemukan`,
			});

		return {
			id: muthowif.id,
			thumbnail: muthowif.thumbnail
				? {
						id: muthowif.thumbnail.id,
						src: muthowif.thumbnail.src,
						alt: muthowif.thumbnail.alt,
					}
				: null,
			name: muthowif.name,
			bio: muthowif.bio,
			detail: muthowif.detail,
		};
	}

	async updateThumbnail(
		param: MuthowifParam,
		input: MuthowifThumbnailInput,
	): Promise<ImageOutput> {
		let muthowif = await db.muthowif.findFirst({
			where: { id: param.id },
			include: { thumbnail: true },
		});
		if (!muthowif) {
			throw new HTTPException(404, {
				message: `Muthowif dengan id ${param.id} tidak ditemukan`,
			});
		}

		if (muthowif.thumbnail) {
			await this.imageService.update(muthowif.thumbnail.src, input.thumbnail);
		} else {
			const imageFileName = await this.imageService.write(input.thumbnail);
			muthowif = await db.muthowif.update({
				data: {
					thumbnail: {
						create: {
							src: imageFileName,
							alt: `Thumbnail maskapai penerbangan ${muthowif.name}`,
						},
					},
				},
				where: { id: param.id },
				include: { thumbnail: true },
			});
		}

		if (!muthowif.thumbnail) {
			throw new HTTPException(500, {
				message: "Terjadi keasalahan saat mengunggah gambar",
			});
		}

		return {
			id: muthowif.thumbnail.id,
			src: muthowif.thumbnail.src,
			alt: muthowif.thumbnail.alt,
		};
	}

	async deleteThumbnail(param: MuthowifParam): Promise<ImageOutput> {
		const muthowif = await db.muthowif.findFirst({
			where: { id: param.id },
			include: { thumbnail: true },
		});
		if (!muthowif) {
			throw new HTTPException(404, {
				message: `Muthowif dengan id ${param.id} tidak ditemukan`,
			});
		}
		if (!muthowif.thumbnail) {
			throw new HTTPException(404, {
				message: `Muthowif dengan id ${param.id} tidak memiliki thumbnail`,
			});
		}

		await this.imageService.remove(muthowif.thumbnail.src);
		await db.muthowif.update({
			data: {
				thumbnail: { delete: {} },
			},
			where: { id: param.id },
		});

		return {
			id: muthowif.thumbnail.id,
			src: muthowif.thumbnail.src,
			alt: muthowif.thumbnail.alt,
		};
	}

	private static _instance: MuthowifService | null = null;
	static get instance(): MuthowifService {
		if (!MuthowifService._instance)
			MuthowifService._instance = new MuthowifService();
		return MuthowifService._instance;
	}
}
