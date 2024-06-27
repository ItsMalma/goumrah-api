import moment from "moment";
import {
	type InferOutput,
	array,
	check,
	file,
	mimeType,
	minValue,
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

export const bundleDetailInputSchema = object(
	{
		price: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		date: pipe(
			string("Harus berupa string"),
			check(
				(value) => moment(value, "DD/MM/YYYY", true).isValid(),
				"Harus berupa tanggal dengan format DD/MM/YYYY",
			),
			transform((value) => moment(value, "DD/MM/YYYY").toDate()),
		),
		embarkation: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		roomType: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		makkahHotel: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		madinahHotel: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		flight: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
	},
	"Harus berupa object",
);
export type BundleDetailInput = InferOutput<typeof bundleDetailInputSchema>;

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
