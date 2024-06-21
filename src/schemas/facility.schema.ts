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

export const facilityInputSchema = object(
	{
		icon: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
	},
	"Harus berupa object",
);
export type FacilityInput = InferOutput<typeof facilityInputSchema>;

export const facilityOutputSchema = object({
	id: number(),
	icon: string(),
	name: string(),
});
export type FacilityOutput = InferOutput<typeof facilityOutputSchema>;

export const facilityParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type FacilityParam = InferOutput<typeof facilityParamSchema>;
