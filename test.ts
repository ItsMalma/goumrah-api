import { DatabaseError } from "pg";
import db from "./src/database";

try {
  await db
    .insertInto("embarkations")
    .values({ name: "Jakarta" })
    .executeTakeFirstOrThrow();
} catch (err) {
  if (err instanceof DatabaseError) {
    console.error(err.column);
  }
}
