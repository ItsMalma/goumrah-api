import {
	type InferOutput,
	array,
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

export const bundleInputSchema = object(
	{
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		description: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
	},
	"Harus berupa object",
);
export type AirlineInput = InferOutput<typeof bundleInputSchema>;

export const airlineOutputSchema = object({
	id: number(),
	thumbnail: nullable(imageOutputSchema),
	rating: number(),
	name: string(),
	helpLink: string(),
	images: array(imageOutputSchema),
});
export type AirlineOutput = InferOutput<typeof airlineOutputSchema>;

export const airlineParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type AirlineParam = InferOutput<typeof airlineParamSchema>;

export const airlineThumbnailInputSchema = object({
	thumbnail: pipe(
		file("Harus berupa file"),
		mimeType(["image/png", "image/jpeg"], "Harus berupa gambar"),
	),
});
export type AirlineThumbnailInput = InferOutput<
	typeof airlineThumbnailInputSchema
>;

export const airlineImagesInputSchema = object({
	"images[]": array(
		pipe(
			file("Harus berupa file"),
			mimeType(["image/png", "image/jpeg"], "Harus berupa gambar"),
		),
		"Harus berupa array",
	),
});
export type AirlineImagesInput = InferOutput<typeof airlineImagesInputSchema>;
