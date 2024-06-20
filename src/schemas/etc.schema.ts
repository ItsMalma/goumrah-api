import { nonOptional, object, unknown } from "valibot";

export const baseResponseSchema = object({
	data: nonOptional(unknown()),
	error: nonOptional(unknown()),
});
