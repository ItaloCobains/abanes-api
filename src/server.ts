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
import v1routes from "./v1";

const app = fastify().withTypeProvider<ZodTypeProvider>();

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
