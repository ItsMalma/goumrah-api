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

export const embarkationInputSchema = object(
	{
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
	},
	"Harus berupa object",
);
export type EmbarkationInput = InferOutput<typeof embarkationInputSchema>;

export const embarkationOutputSchema = object({
	id: number(),
	name: string(),
});
export type EmbarkationOutput = InferOutput<typeof embarkationOutputSchema>;

export const embarkationParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type EmbarkationParam = InferOutput<typeof embarkationParamSchema>;
