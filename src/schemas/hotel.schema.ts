import {
	array,
	check,
	file,
	mimeType,
	minLength,
	minValue,
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
import { isJSON, isNumeric } from "validator";

export const hotelInputSchema = object(
	{
		thumbnail: pipe(
			file("Harus berupa file"),
			mimeType(["image/png", "image/jpeg"], "Harus berupa gambar"),
		),
		rating: pipe(
			string("Harus berupa string"),
			check(isNumeric, "Harus berupa angka"),
			transform(Number),
			picklist([1, 2, 3, 4, 5], "Harus berupa angka 1-5"),
		),
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		helpLink: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
			url("Harus berupa URL"),
		),
		"images[]": array(
			pipe(
				file("Harus berupa file"),
				mimeType(["image/png", "image/jpeg"], "Harus berupa gambar"),
			),
			"Harus berupa array",
		),
		description: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		facilities: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
			check((value) => isJSON(value), "Harus berupa JSON"),
			transform(JSON.parse),
			array(
				pipe(number("Harus berupa angka"), minValue(1, "Harus lebih dari 0")),
				"Harus berupa array",
			),
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
			string("Harus berupa string"),
			check(isNumeric, "Harus berupa angka"),
			transform(Number),
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		foodType: pipe(
			string("Harus berupa string"),
			check(isNumeric, "Harus berupa angka"),
			transform(Number),
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		foodMenus: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
			check((value) => isJSON(value), "Harus berupa JSON"),
			transform(JSON.parse),
			array(
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
	thumbnail: string(),
	rating: number(),
	name: string(),
	helpLink: string(),
	images: array(string()),
	description: string(),
	facilities: array(
		object({
			icon: string(),
			name: string(),
		}),
	),
	mapLink: string(),
	address: string(),
	distance: number(),
	foodType: string(),
	foodAmount: number(),
	foodMenus: array(
		object({
			amount: number(),
			name: string(),
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
