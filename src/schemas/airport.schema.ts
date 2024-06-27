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

export const airportInputSchema = object(
	{
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		code: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
	},
	"Harus berupa object",
);
export type AirportInput = InferOutput<typeof airportInputSchema>;

export const airportOutputSchema = object({
	id: number(),
	name: string(),
	code: string(),
});
export type AirportOutput = InferOutput<typeof airportOutputSchema>;

export const airportParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type AirportParam = InferOutput<typeof airportParamSchema>;
