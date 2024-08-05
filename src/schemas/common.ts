import {
  object,
  pipe,
  minValue,
  type InferOutput,
  string,
  transform,
  check,
} from "valibot";

export const findSchema = object({
  id: pipe(
    string("Harus string"),
    check((input) => !isNaN(Number(input)), "Harus number"),
    transform(Number),
    minValue(1, "Harus lebih dari 0")
  ),
});
export type FindSchema = InferOutput<typeof findSchema>;
