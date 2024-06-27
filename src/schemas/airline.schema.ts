import {
	array,
	check,
	file,
	mimeType,
	minLength,
	nullable,
	number,
	object,
	picklist,
	pipe,
	string,
	transform,
	unknown,
	url,
	type InferOutput,
} from "valibot";
import { isNumeric } from "validator";
import { imageOutputSchema } from "./image.schema";

export const airlineInputSchema = object(
	{
		rating: picklist([1, 2, 3, 4, 5], "Harus berupa angka 1-5"),
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		helpLink: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
			url("Harus berupa URL"),
		),
	},
	"Harus berupa object",
);
export type AirlineInput = InferOutput<typeof airlineInputSchema>;

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
