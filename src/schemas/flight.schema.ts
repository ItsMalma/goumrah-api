import moment from "moment";
import {
	type InferOutput,
	array,
	check,
	date,
	minLength,
	minValue,
	nullable,
	number,
	object,
	pipe,
	string,
	transform,
	unknown,
} from "valibot";
import { isNumeric } from "validator";
import { aircraftOutputSchema } from "./aircraft.schema";
import { airlineOutputSchema } from "./airline.schema";
import { airportOutputSchema } from "./airport.schema";

export const flightEventInputSchema = object({
	dateTime: pipe(
		string("Harus berupa string"),
		check((value) => moment(value, "DD/MM/YYYY HH:mm ZZ", true).isValid()),
		transform((value) => moment(value, "DD/MM/YYYY HH:mm ZZ", true).date()),
	),
	airport: pipe(
		number("Harus berupa angka"),
		minValue(1, "Harus lebih dari 0"),
	),
	terminal: pipe(
		string("Harus berupa string"),
		minLength(1, "Tidak boleh kosong"),
	),
});
export type FlightEventInput = InferOutput<typeof flightEventInputSchema>;

export const flightScheduleInputSchema = object(
	{
		transitDuration: nullable(
			pipe(number("Harus berupa angka"), minValue(0, "Tidak boleh negatif")),
		),
		takeOff: flightEventInputSchema,
		duration: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		flightNumber: pipe(
			string("Harus berupa string"),
			minLength(1, "Tsidak boleh kosong"),
		),
		aircraft: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		baggage: pipe(
			number("Harus berupa angka"),
			minValue(0, "Tidak boleh negatif"),
		),
		cabinBaggage: pipe(
			number("Harus berupa angka"),
			minValue(0, "Tidak boleh negatif"),
		),
		seatLayout: pipe(
			string("Harus berupa string"),
			minLength(1, "Tidak boleh kosong"),
		),
		landing: flightEventInputSchema,
	},
	"Harus berupa object",
);
export type FlightScheduleInput = InferOutput<typeof flightScheduleInputSchema>;

export const flightInputSchema = object(
	{
		airline: pipe(
			number("Harus berupa angka"),
			minValue(1, "Harus lebih dari 0"),
		),
		outbound: pipe(array(flightScheduleInputSchema), minLength(1, "Minimal 1")),
		inbound: pipe(array(flightScheduleInputSchema), minLength(1, "Minimal 1")),
	},
	"Harus berupa object",
);
export type FlightInput = InferOutput<typeof flightInputSchema>;

export const flightEventOutputSchema = object({
	datetime: date(),
	airport: airportOutputSchema,
	terminal: string(),
});
export type FlightEventOutput = InferOutput<typeof flightEventOutputSchema>;

export const flightScheduleOutputSchema = object({
	transitDuration: nullable(number()),
	takeOff: flightEventOutputSchema,
	duration: number(),
	flightNumber: string(),
	aircraft: aircraftOutputSchema,
	baggage: number(),
	cabinBaggage: number(),
	seatLayout: string(),
	landing: flightEventOutputSchema,
});
export type FlightScheduleOutput = InferOutput<
	typeof flightScheduleOutputSchema
>;

export const flightOutputSchema = object({
	id: number(),
	airline: airlineOutputSchema,
	outbound: object({
		departureAirport: airportOutputSchema,
		duration: number(),
		arrivalAirport: airportOutputSchema,
		schedules: array(flightScheduleOutputSchema),
	}),
	inbound: object({
		departureAirport: airportOutputSchema,
		duration: number(),
		arrivalAirport: airportOutputSchema,
		schedules: array(flightScheduleOutputSchema),
	}),
});
export type FlightOutput = InferOutput<typeof flightOutputSchema>;

export const flightParamSchema = object({
	id: pipe(
		unknown(),
		check(isNumeric, "Harus berupa angka"),
		transform(Number),
	),
});
export type FlightParam = InferOutput<typeof flightParamSchema>;
