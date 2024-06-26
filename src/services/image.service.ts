import { HTTPException } from "hono/http-exception";
import fs from "node:fs";
import path from "node:path";
import { fileTypeToExtension, randomFileName } from "../utils/file.util";

export default class ImageService {
	async write(file: File): Promise<string> {
		const fileName = randomFileName(fileTypeToExtension(file.type));
		const filePath = path.join(__dirname, "..", "..", "static", fileName);
		await Bun.write(filePath, file);

		return fileName;
	}

	async read(fileName: string): Promise<Blob> {
		const filePath = path.join(__dirname, "..", "..", "static", fileName);
		const file = Bun.file(filePath);
		if (!(await file.exists())) {
			throw new HTTPException(404, {
				message: `File ${fileName} tidak ditemukan`,
			});
		}

		return file;
	}

	async update(oldFileName: string, file: File) {
		const filePath = path.join(__dirname, "..", "..", "static", oldFileName);
		const oldFile = Bun.file(filePath);
		if (!(await oldFile.exists())) {
			throw new HTTPException(404, {
				message: `File ${oldFileName} tidak ditemukan`,
			});
		}

		await Bun.write(filePath, file);
	}

	async remove(fileName: string) {
		const filePath = path.join(__dirname, "..", "..", "static", fileName);
		const file = Bun.file(filePath);
		if (!(await file.exists())) {
			throw new HTTPException(404, {
				message: `File ${fileName} tidak ditemukan`,
			});
		}

		fs.unlinkSync(filePath);
	}

	private static _instance: ImageService | null = null;
	static get instance(): ImageService {
		if (!ImageService._instance) ImageService._instance = new ImageService();
		return ImageService._instance;
	}
}
