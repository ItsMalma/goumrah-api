import path from "node:path";
import type { DeepPartial, FindOneOptions } from "typeorm";
import Image from "../entities/image.entity";
import type {
	ImageInput,
	ImageOutput,
	ImageParam,
} from "../schemas/image.schema";
import { fileTypeToExtension, randomFileName } from "../utils/file.util";
import CRUDService from "./crud.service";

export default class ImageService extends CRUDService<
	Image,
	ImageInput,
	ImageOutput,
	ImageParam
> {
	private constructor() {
		super(Image, "Gambar");
	}

	public async write(file: File): Promise<string> {
		const fileName = randomFileName(fileTypeToExtension(file.type));
		await Bun.write(path.join(__dirname, "..", "..", "static", fileName), file);

		return fileName;
	}

	protected async mapCreate(input: ImageInput): Promise<DeepPartial<Image>> {
		const fileName = await this.write(input.file);

		return {
			src: fileName,
			alt: input.alt,
		};
	}

	protected async mapUpdate(old: Image, input: ImageInput): Promise<Image> {
		const fileName = await this.write(input.file);

		old.src = fileName;
		old.alt = input.alt;

		return old;
	}

	protected mapParam(param: ImageParam): FindOneOptions<Image> {
		return { where: { id: param.id } };
	}

	protected mapOutput(entity: Image): ImageOutput {
		return {
			id: entity.id,
			src: `/${entity.src}`,
			alt: entity.alt,
		};
	}

	private static _instance: ImageService | null = null;
	static get instance(): ImageService {
		if (!ImageService._instance) ImageService._instance = new ImageService();
		return ImageService._instance;
	}
}
