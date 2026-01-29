import { processElevenLabsCall } from "./services/elevenLabsHandler";
import { elevenLabsCircuitBreaker } from "./services/elevenLabsCircuit";
import { ElevenLabsHealthCheck } from "./resilience/ElevenLabsHealthCheck";
import { HealthCheckScheduler } from "./resilience/HealthCheckScheduler";

const healthChecker = new HealthCheckScheduler(
  "ElevenLabs",
  elevenLabsCircuitBreaker,
  new ElevenLabsHealthCheck(),
  5000 // check every 5 seconds
);

healthChecker.start();

async function main() {
  for (let i = 0; i < 20; i++) {
    try {
      await processElevenLabsCall();
    } catch (err) {
      console.log("Call failed:", (err as Error).message);
    }

    await new Promise(res => setTimeout(res, 1000));
  }
}

main();