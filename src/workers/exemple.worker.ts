import { SandboxedJob } from "bullmq";

export default async function (job: SandboxedJob) {
  console.log("Hello from worker");
  console.log(job.data);
  return { status: "ok" };
}
