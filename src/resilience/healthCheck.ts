export interface HealthCheck {
  check(): Promise<boolean>;
}