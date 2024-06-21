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

export const foodMenuInputSchema = object(
	{
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
	},
	"Harus berupa object",
);
export type FoodMenuInput = InferOutput<typeof foodMenuInputSchema>;

export const foodMenuOutputSchema = object({
	id: number(),
	name: string(),
});
export type FoodMenuOutput = InferOutput<typeof foodMenuOutputSchema>;

export const foodMenuParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type FoodMenuParam = InferOutput<typeof foodMenuParamSchema>;
