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

export const imageInputSchema = object(
	{
		file: pipe(
			file("Harus berupa file"),
			mimeType(["image/png", "image/jpeg"], "Harus berupa gambar"),
		),
		alt: nullable(
			pipe(string("Harus berupa string"), minLength(1, "Tidak boleh kosong")),
		),
	},
	"Harus berupa object",
);
export type ImageInput = InferOutput<typeof imageInputSchema>;

export const imageOutputSchema = object({
	id: number(),
	src: string(),
	alt: nullable(string()),
});
export type ImageOutput = InferOutput<typeof imageOutputSchema>;

export const imageParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type ImageParam = InferOutput<typeof imageParamSchema>;
