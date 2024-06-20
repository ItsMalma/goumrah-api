import { vValidator } from "@hono/valibot-validator";
import type { ValidationTargets } from "hono";
import { flatten, type GenericSchema, type GenericSchemaAsync } from "valibot";

export function validate<
	Target extends keyof ValidationTargets,
	Schema extends
		| GenericSchema<unknown, unknown, import("valibot").BaseIssue<unknown>>
		| GenericSchemaAsync<
				unknown,
				unknown,
				import("valibot").BaseIssue<unknown>
		  >,
>(target: Target, schema: Schema) {
	return vValidator(target, schema, (result, c) => {
		if (!result.success) {
			return c.json(flatten(result.issues).nested, 400);
		}
	});
}
