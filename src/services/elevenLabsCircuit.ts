import { CircuitBreaker } from "../resilience/circuitBreaker";

export const elevenLabsCircuitBreaker = new CircuitBreaker(
  3,        // failure threshold
  30000    // 30s reset timeout
);