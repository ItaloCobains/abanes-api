import { FastifyTypedInstance } from "../../types";
import { db, statesTable } from "../../db";
import z from "zod";
import { createStateDocs, getAllStatesDocs, getStatesDocs } from "./schemas";
import { eq } from "drizzle-orm";

export default async function routes(app: FastifyTypedInstance) {
  app.get("/", { schema: getAllStatesDocs }, async (request, reply) => {
    const result = await db.select().from(statesTable);

    return reply.status(200).send(result);
  });

  app.get("/:id", { schema: getStatesDocs }, async (request, reply) => {
    const { id } = request.params;

    const result = await db
      .select()
      .from(statesTable)
      .where(eq(statesTable.id, parseInt(id)))
      .limit(1);

    if (result.length === 0) {
      return reply.status(404).send({ message: "State not found" });
    }

    return reply.status(200).send(result[0]);
  });

  app.post("/", { schema: createStateDocs }, async (request, reply) => {
    const { name, acronym } = request.body;

    if (acronym.length !== 2) {
      return reply
        .status(400)
        .send({ message: "Acronym must have 2 characters" });
    }

    const result = await db.insert(statesTable).values({ name, acronym });

    if (result.rowCount === 0) {
      return reply.status(400).send({ message: "Failed to create state" });
    }

    return reply.status(201).send();
  });
}
