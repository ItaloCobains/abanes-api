import { FastifyTypedInstance } from "../../types";
import { StatesService } from "../states/service";
import {
  createCityDocs,
  deleteCityDocs,
  getAllCitiesDocs,
  getCityDocs,
  updateCityDocs,
} from "./schema";
import { CitiesService } from "./service";

export default async function routes(app: FastifyTypedInstance) {
  app.get("/", { schema: getAllCitiesDocs }, async (_request, reply) => {
    const result = await CitiesService.getAllCities();

    return reply.status(200).send(result);
  });

  app.get("/:id", { schema: getCityDocs }, async (request, reply) => {
    const { id } = request.params;

    const result = await CitiesService.getCity(parseInt(id));

    if (result.length === 0) {
      return reply.status(404).send({ message: "City not found" });
    }

    return reply.status(200).send(result[0]);
  });

  app.post("/", { schema: createCityDocs }, async (request, reply) => {
    const { name, state_id } = request.body;

    const validIfStateExists = await StatesService.getState(state_id);

    if (validIfStateExists.length === 0) {
      return reply.status(400).send({ message: "State not found" });
    }

    const result = await CitiesService.createCity(name, state_id);

    if (result.rowCount === 0) {
      return reply.status(400).send({ message: "Failed to create city" });
    }

    return reply.status(201).send();
  });

  app.put("/:id", { schema: updateCityDocs }, async (request, reply) => {
    const { id } = request.params;
    const { name, state_id } = request.body;

    const validIfStateExists = await StatesService.getState(state_id);

    if (validIfStateExists.length === 0) {
      return reply.status(400).send({ message: "State not found" });
    }

    const result = await CitiesService.updateCity(parseInt(id), name, state_id);

    if (result.rowCount === 0) {
      return reply.status(400).send({ message: "Failed to update city" });
    }

    return reply.status(200).send();
  });

  app.delete("/:id", { schema: deleteCityDocs }, async (request, reply) => {
    const { id } = request.params;

    const result = await CitiesService.deleteCity(parseInt(id));

    if (result.rowCount === 0) {
      return reply.status(400).send({ message: "Failed to delete city" });
    }

    return reply.status(200).send();
  });
}
