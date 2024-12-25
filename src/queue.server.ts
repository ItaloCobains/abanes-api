import "dotenv/config";
import type { Processor } from "bullmq";
import { Queue, Worker, QueueEvents } from "bullmq";
import path from "node:path";

const connection = {
  url: process.env.REDIS_URL,
};

type AugmentedQueue<T> = Queue<T> & {
  events: QueueEvents;
};
type RegisteredQueue = {
  queue: Queue;
  queueEvents: QueueEvents;
  worker: Worker;
};
declare global {
  var __registeredQueues: Record<string, RegisteredQueue> | undefined;
}
const registeredQueues =
  global.__registeredQueues || (global.__registeredQueues = {});

/**
 *
 * @param name Unique name of the queue
 * @param processor
 */
export function registerQueue<T>(
  name: string,
  processor: Processor<T> | string
) {
  if (!registeredQueues[name]) {
    const queue = new Queue(name, { connection });
    const queueEvents = new QueueEvents(name, {
      connection,
    });
    const worker = new Worker<T>(name, processor, {
      connection,
      lockDuration: 1000 * 60 * 15,
      concurrency: 8,
    });
    registeredQueues[name] = {
      queue,
      queueEvents,
      worker,
    };
  }
  const queue = registeredQueues[name].queue as AugmentedQueue<T>;
  queue.events = registeredQueues[name].queueEvents;
  return queue;
}

export const exempleQueue = registerQueue(
  "exemple",
  path.join(__dirname, "./workers/exemple.worker.ts")
);
// exempleQueue.add("exemple", { data: "Hello" });

// Add your queues here, for bullmq dashboard
export default [exempleQueue];
