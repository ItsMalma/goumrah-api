import { vValidator } from "@hono/valibot-validator";
import type { ValidationTargets } from "hono";
import { type GenericSchema, type GenericSchemaAsync, flatten } from "valibot";

export function validate<
  Target extends keyof ValidationTargets,
  Schema extends
    | GenericSchema<unknown, unknown, import("valibot").BaseIssue<unknown>>
    | GenericSchemaAsync<unknown, unknown, import("valibot").BaseIssue<unknown>>
>(target: Target, schema: Schema) {
  return vValidator(target, schema, (result, c) => {
    if (!result.success) {
      if (result.issues.length === 1 && !result.issues[0].path) {
        return c.json({ data: null, error: result.issues[0].message }, 400);
      } else if (
        result.issues.find((issue) => !issue.path) &&
        result.issues.length > 1
      ) {
        return c.json(
          { data: null, error: { "*": [result.issues[0].message] } },
          400
        );
      }
      return c.json({ data: null, error: flatten(result.issues).nested }, 400);
    }
  });
}
