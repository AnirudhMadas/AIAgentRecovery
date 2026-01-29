import { HealthCheck } from "./healthCheck";

export class ElevenLabsHealthCheck implements HealthCheck {
  async check(): Promise<boolean> {
    return Math.random() > 0.3;
  }
}