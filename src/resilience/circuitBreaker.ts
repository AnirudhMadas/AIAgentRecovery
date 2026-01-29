export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  private failureCount = 0;
  private state: CircuitState = "CLOSED";
  private lastFailureTime = 0;

  constructor(
    private readonly failureThreshold: number,
    private readonly resetTimeoutMs: number,
  ) {}

  /** Check if a request is allowed */
  canRequest(): boolean {
    if (this.state === "OPEN") {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.resetTimeoutMs) {
        this.state = "HALF_OPEN";
        return true;
      }
      return false;
    }
    return true;
  }

  /** Call when a request succeeds */
  onSuccess(): void {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  public forceHalfOpen(): void {
    this.state = "HALF_OPEN";
  }

  /** Call when a request fails */
  onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}
