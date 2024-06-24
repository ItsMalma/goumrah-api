import crypto from "node:crypto";

export function randomFileName(extension?: string): string {
	const fileName = crypto
		.randomBytes(Number(Bun.env.FILE_NAME_LENGTH))
		.toString("hex");
	return extension ? `${fileName}.${extension}` : fileName;
}

export function fileTypeToExtension(fileType: string): string {
	switch (fileType) {
		case "image/jpeg":
			return "jpg";
		case "image/png":
			return "png";
		case "image/gif":
			return "gif";
		default:
			return "txt";
	}
}
