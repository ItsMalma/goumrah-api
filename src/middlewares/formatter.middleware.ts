import { createMiddleware } from "hono/factory";
import type { StatusCode } from "hono/utils/http-status";
import { safeParse } from "valibot";
import { baseResponseSchema } from "../schemas/etc.schema";

function isError(statusCode: number): boolean {
	return statusCode >= 400;
}

export const formatter = createMiddleware(async (c, next) => {
	await next();

	const output = c.res.headers
		.get("Content-Type")
		?.startsWith("application/json")
		? await c.res.json()
		: await c.res.text();

	const parsedOutput = safeParse(baseResponseSchema, output);
	if (!parsedOutput.success || !parsedOutput.typed) {
		const statusCode = c.res.status as StatusCode;
		c.res = undefined;

		if (isError(statusCode)) {
			c.res = c.json(
				{
					data: null,
					error: output,
				},
				statusCode,
			);
		} else {
			c.res = c.json(
				{
					data: output,
					error: null,
				},
				statusCode,
			);
		}
	}
});
