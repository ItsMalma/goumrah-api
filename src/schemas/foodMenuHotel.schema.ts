import {
	type InferOutput,
	check,
	minValue,
	number,
	object,
	pipe,
	transform,
	unknown,
} from "valibot";
import { isNumeric } from "validator";
import { foodMenuOutputSchema } from "./foodMenu.schema";

export const foodMenuHotelInputSchema = object(
	{
		hotel: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		foodMenu: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		amount: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
	},
	"Harus berupa object",
);
export type FoodMenuHotelInput = InferOutput<typeof foodMenuHotelInputSchema>;

export const foodMenuHotelOutputSchema = object({
	id: number(),
	hotel: number(),
	foodMenu: foodMenuOutputSchema,
	amount: number(),
});
export type FoodMenuHotelOutput = InferOutput<typeof foodMenuHotelOutputSchema>;

export const foodMenuHotelParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type FoodMenuHotelParam = InferOutput<typeof foodMenuHotelParamSchema>;
