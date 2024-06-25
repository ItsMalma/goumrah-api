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

export const hotelFoodInputSchema = object(
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
export type HotelFoodInput = InferOutput<typeof hotelFoodInputSchema>;

export const hotelFoodOutputSchema = object({
	id: number(),
	hotel: number(),
	foodMenu: foodMenuOutputSchema,
	amount: number(),
});
export type HotelFoodOutput = InferOutput<typeof hotelFoodOutputSchema>;

export const hotelFoodParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type HotelFoodParam = InferOutput<typeof hotelFoodParamSchema>;
