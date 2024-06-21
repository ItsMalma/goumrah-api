import {
	check,
	minLength,
	number,
	object,
	pipe,
	string,
	transform,
	unknown,
	type InferOutput,
} from "valibot";
import { isNumeric } from "validator";

export const foodTypeInputSchema = object(
	{
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
	},
	"Harus berupa object",
);
export type FoodTypeInput = InferOutput<typeof foodTypeInputSchema>;

export const foodTypeOutputSchema = object({
	id: number(),
	name: string(),
});
export type FoodTypeOutput = InferOutput<typeof foodTypeOutputSchema>;

export const foodTypeParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type FoodTypeParam = InferOutput<typeof foodTypeParamSchema>;
