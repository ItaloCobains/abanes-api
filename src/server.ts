import "dotenv/config";
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import AllQueues from "./queue.server";
import v1routes from "./v1";

const serverAdapter = new FastifyAdapter();

createBullBoard({
  queues: AllQueues.map((queue) => new BullMQAdapter(queue)),
  serverAdapter,
});

const app = fastify().withTypeProvider<ZodTypeProvider>();

serverAdapter.setBasePath("/admin/bull");

app.register(serverAdapter.registerPlugin(), {
  prefix: "/admin/bull",
  basePath: "/admin/bull",
});

app.register(import("@fastify/redis"), {
  url: process.env.REDIS_URL,
});

app.setValidatorCompiler(validatorCompiler);

app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Abanes API DOCUMENTATION",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/documentation",
});

app.register(v1routes, { prefix: "/v1" });

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log("Server is running on port 3000");
  });
