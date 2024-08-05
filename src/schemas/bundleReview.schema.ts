import type { ColumnType, GeneratedAlways } from "kysely";
import { number, object, picklist, pipe, type InferOutput } from "valibot";

export const createBundleReviewSchema = object({
  rating: pipe(number("Harus number"), picklist([1, 2, 3, 4, 5], "Harus 1-5")),
});
export type CreateBundleReview = InferOutput<typeof createBundleReviewSchema>;

export type BundleReviewOutput = {
  id: number;
  rating: 1 | 2 | 3 | 4 | 5;
};

export type BundleReviewTable = {
  id: GeneratedAlways<number>;
  bundle_id: number;
  rating: 1 | 2 | 3 | 4 | 5;
  created_at: ColumnType<Date, Date | undefined, never>;
  updated_at: ColumnType<Date, Date | undefined, Date | undefined>;
  deleted_at: ColumnType<Date | null, never, Date | null | undefined>;
};
