import z from "zod";
import { FastifyTypedInstance } from "./types";

export async function routes(app: FastifyTypedInstance) {
  app.post(
    "/users",
    {
      schema: {
        tags: ["Users"],
        description: "Create a new user",
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.null().describe("User created successfully"),
        },
      },
    },
    async (request, reply) => {
      const { email, name } = request.body;

      return reply.status(201).send();
    }
  );
}
