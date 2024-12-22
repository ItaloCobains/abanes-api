import { relations } from "drizzle-orm";
import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const statesTable = pgTable("states", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  acronym: varchar({ length: 2 }).notNull(),
});

export const statesRelations = relations(statesTable, ({ many }) => ({
  cities: many(citiesTable),
}));

export const citiesTable = pgTable("cities", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  state_id: integer().notNull(),
});

export const citiesRelations = relations(citiesTable, ({ one }) => ({
  state: one(statesTable),
}));
