import { CircuitBreaker } from "./circuitBreaker";
import { HealthCheck } from "./healthCheck";
import { logger } from "../logging";

export class HealthCheckScheduler {
  constructor(
    private readonly serviceName: string,
    private readonly circuitBreaker: CircuitBreaker,
    private readonly healthCheck: HealthCheck,
    private readonly intervalMs: number
  ) {}

  start(): void {
    setInterval(async () => {
      if (this.circuitBreaker.getState() !== "OPEN") {
        return;
      }

      const healthy = await this.healthCheck.check();

      if (healthy) {
        this.circuitBreaker.forceHalfOpen();

        await logger.log({
          timestamp: new Date().toISOString(),
          service: this.serviceName,
          message: "Health check passed — moving to HALF_OPEN",
          circuitState: "HALF_OPEN",
        });
      }
    }, this.intervalMs);
  }
}