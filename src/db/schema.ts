import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const statesTable = pgTable("states", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  acronym: varchar({ length: 2 }).notNull(),
});
