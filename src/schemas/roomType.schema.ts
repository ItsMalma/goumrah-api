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

export const roomTypeInputSchema = object(
	{
		name: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
	},
	"Harus berupa object",
);
export type RoomTypeInput = InferOutput<typeof roomTypeInputSchema>;

export const roomTypeOutputSchema = object({
	id: number(),
	name: string(),
});
export type RoomTypeOutput = InferOutput<typeof roomTypeOutputSchema>;

export const roomTypeParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type RoomTypeParam = InferOutput<typeof roomTypeParamSchema>;
