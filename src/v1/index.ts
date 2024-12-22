import { FastifyTypedInstance } from "../types";

export default async function routes(app: FastifyTypedInstance) {
  app.register(require("./states"), { prefix: "/states" });
}
