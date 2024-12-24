import { FastifyTypedInstance } from "../../types";
import {
  createStateDocs,
  deleteStateDocs,
  getAllStatesDocs,
  getStatesDocs,
  updateStateDocs,
} from "./schemas";
import { StatesService } from "./service";

export default async function routes(app: FastifyTypedInstance) {
  app.get("/", { schema: getAllStatesDocs }, async (_request, reply) => {
    const { redis } = app;

    const cachedStates = await redis.get("states-get-all");

    if (cachedStates) {
      return reply.status(200).send(JSON.parse(cachedStates));
    }

    const result = await StatesService.getAllStates();

    await redis.set("states-get-all", JSON.stringify(result), "EX", 60);

    return reply.status(200).send(result);
  });

  app.get("/:id", { schema: getStatesDocs }, async (request, reply) => {
    const { id } = request.params;

    const result = await StatesService.getState(parseInt(id));

    if (result.length === 0) {
      return reply.status(404).send({ message: "State not found" });
    }

    return reply.status(200).send(result[0]);
  });

  app.post("/", { schema: createStateDocs }, async (request, reply) => {
    const { redis } = app;
    const { name, acronym } = request.body;

    if (acronym.length !== 2) {
      return reply
        .status(400)
        .send({ message: "Acronym must have 2 characters" });
    }

    const existingAcronym = await StatesService.getStateByAcronym(acronym);

    if (existingAcronym.length > 0) {
      return reply
        .status(400)
        .send({ message: "State with this acronym already exists" });
    }

    const result = await StatesService.createState(name, acronym);

    if (result.rowCount === 0) {
      return reply.status(400).send({ message: "Failed to create state" });
    }

    await redis.del("states-get-all");

    return reply.status(201).send();
  });

  app.put("/:id", { schema: updateStateDocs }, async (request, reply) => {
    const { id } = request.params;
    const { name, acronym } = request.body;
    const { redis } = app;

    if (acronym.length !== 2) {
      return reply
        .status(400)
        .send({ message: "Acronym must have 2 characters" });
    }

    const existingAcronym = await StatesService.getStateByAcronym(acronym);

    if (existingAcronym.length > 0 && existingAcronym[0].id !== parseInt(id)) {
      return reply
        .status(400)
        .send({ message: "State with this acronym already exists" });
    }

    const result = await StatesService.updateState(parseInt(id), name, acronym);

    if (result.rowCount === 0) {
      return reply.status(404).send({ message: "State not found" });
    }

    await redis.del("states-get-all");

    return reply.status(204).send();
  });

  app.delete("/:id", { schema: deleteStateDocs }, async (request, reply) => {
    const { id } = request.params;
    const { redis } = app;

    const result = await StatesService.deleteState(parseInt(id));

    if (result.rowCount === 0) {
      return reply.status(404).send({ message: "State not found" });
    }

    await redis.del("states-get-all");

    return reply.status(204).send();
  });
}
