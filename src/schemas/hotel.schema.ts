import {
	array,
	check,
	file,
	mimeType,
	minLength,
	minValue,
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
import { facilityOutputSchema } from "./facility.schema";
import { foodMenuOutputSchema } from "./foodMenu.schema";
import { foodTypeOutputSchema } from "./foodType.schema";
import { imageOutputSchema } from "./image.schema";

export const hotelInputSchema = object(
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
		description: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		facilities: array(
			pipe(number("Harus berupa angka"), minValue(1, "Harus lebih dari 0")),
			"Harus berupa array",
		),
		mapLink: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
			url("Harus berupa URL"),
		),
		address: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		distance: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		foodType: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		foodMenus: array(
			object(
				{
					id: pipe(
						number("Harus berupa angka"),
						minValue(1, "Harus lebih dari 0"),
					),
					amount: pipe(
						number("Harus berupa angka"),
						minValue(1, "Harus lebih dari 0"),
					),
				},
				"Harus berupa object",
			),
			"Harus berupa array",
		),
		reviewLink: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
			url("Harus berupa URL"),
		),
	},
	"Harus berupa object",
);
export type HotelInput = InferOutput<typeof hotelInputSchema>;

export const hotelOutputSchema = object({
	id: number(),
	thumbnail: nullable(imageOutputSchema),
	rating: number(),
	name: string(),
	helpLink: string(),
	images: array(imageOutputSchema),
	description: string(),
	facilities: array(facilityOutputSchema),
	mapLink: string(),
	address: string(),
	distance: number(),
	foodType: foodTypeOutputSchema,
	foodAmount: number(),
	foodMenus: array(
		object({
			foodMenu: foodMenuOutputSchema,
			amount: number(),
		}),
	),
	reviewLink: string(),
});
export type HotelOutput = InferOutput<typeof hotelOutputSchema>;

export const hotelParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type HotelParam = InferOutput<typeof hotelParamSchema>;

export const hotelThumbnailInputSchema = object({
	thumbnail: pipe(
		file("Harus berupa file"),
		mimeType(["image/png", "image/jpeg"], "Harus berupa gambar"),
	),
});
export type HotelThumbnailInput = InferOutput<typeof hotelThumbnailInputSchema>;

export const hotelImagesInputSchema = object({
	"images[]": array(
		pipe(
			file("Harus berupa file"),
			mimeType(["image/png", "image/jpeg"], "Harus berupa gambar"),
		),
		"Harus berupa array",
	),
});
export type HotelImagesInput = InferOutput<typeof hotelImagesInputSchema>;
