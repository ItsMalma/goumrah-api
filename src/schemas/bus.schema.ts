import {
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
	url,
	type InferOutput,
} from "valibot";
import { isNumeric } from "validator";
import { imageOutputSchema } from "./image.schema";

export const busInputSchema = object(
	{
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
export type BusInput = InferOutput<typeof busInputSchema>;

export const busOutputSchema = object({
	id: number(),
	thumbnail: nullable(imageOutputSchema),
	name: string(),
	helpLink: string(),
});
export type BusOutput = InferOutput<typeof busOutputSchema>;

export const busParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type BusParam = InferOutput<typeof busParamSchema>;

export const busThumbnailInputSchema = object({
	thumbnail: pipe(
		file("Harus berupa file"),
		mimeType(["image/png", "image/jpeg"], "Harus berupa gambar"),
	),
});
export type BusThumbnailInput = InferOutput<typeof busThumbnailInputSchema>;
