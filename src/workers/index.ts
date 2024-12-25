import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import AllQueues from "../queue.server";
import { FastifyTypedInstance } from "../types";

export default function (app: FastifyTypedInstance) {
  app.after(() => {
    const serverAdapter = new FastifyAdapter();

    createBullBoard({
      queues: AllQueues.map((queue) => new BullMQAdapter(queue)),
      serverAdapter,
    });
    serverAdapter.setBasePath("/admin/bull");

    app.register(serverAdapter.registerPlugin(), {
      prefix: "/admin/bull",
      basePath: "/admin/bull",
    });

    app.route({
      method: "GET",
      url: "/admin",
      handler: async (req, reply) => {
        return reply.redirect("/admin/bull");
      },
    });

    app.addHook("onRequest", (req, reply, next) => {
      app.basicAuth(req, reply, (err: any) => {
        if (err) {
          reply.code(err.statusCode || 500 >= 400).send({ error: err.name });
        }

        next();
      });

      next();
    });
  });
}
