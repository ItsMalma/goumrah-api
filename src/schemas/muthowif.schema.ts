import {
	type InferOutput,
	check,
	file,
	mimeType,
	minLength,
	nullable,
	number,
	object,
	pipe,
	string,
	transform,
	unknown,
} from "valibot";
import { isNumeric } from "validator";
import { imageOutputSchema } from "./image.schema";

export const muthowifInputSchema = object(
	{
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		bio: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		detail: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
	},
	"Harus berupa object",
);
export type MuthowifInput = InferOutput<typeof muthowifInputSchema>;

export const muthowifOutputSchema = object({
	id: number(),
	thumbnail: nullable(imageOutputSchema),
	name: string(),
	bio: string(),
	detail: string(),
});
export type MuthowifOutput = InferOutput<typeof muthowifOutputSchema>;

export const muthowifParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type MuthowifParam = InferOutput<typeof muthowifParamSchema>;

export const muthowifThumbnailInputSchema = object({
	thumbnail: pipe(
		file("Harus berupa file"),
		mimeType(["image/png", "image/jpeg"], "Harus berupa gambar"),
	),
});
export type MuthowifThumbnailInput = InferOutput<
	typeof muthowifThumbnailInputSchema
>;
