import {
	type InferOutput,
	check,
	minLength,
	number,
	object,
	pipe,
	string,
	transform,
	unknown,
} from "valibot";
import { isNumeric } from "validator";

export const aircraftInputSchema = object(
	{
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
	},
	"Harus berupa object",
);
export type AircraftInput = InferOutput<typeof aircraftInputSchema>;

export const aircraftOutputSchema = object({
	id: number(),
	name: string(),
});
export type AircraftOutput = InferOutput<typeof aircraftOutputSchema>;

export const aircraftParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type AircraftParam = InferOutput<typeof aircraftParamSchema>;
