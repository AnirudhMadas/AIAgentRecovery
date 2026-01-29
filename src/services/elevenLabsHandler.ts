import { callElevenLabs } from "./elevenLabsClient";
import { retry } from "../resilience/retry";
import { retryConfig } from "../config/retryConfig";
import { elevenLabsCircuitBreaker } from "./elevenLabsCircuit";
import { BaseError } from "../errors/BaseError";
import { logger } from "../logging";

export async function processElevenLabsCall(): Promise<void> {
  if (!elevenLabsCircuitBreaker.canRequest()) {
    await logger.log({
      timestamp: new Date().toISOString(),
      service: "ElevenLabs",
      message: "Circuit breaker open — failing fast",
      circuitState: elevenLabsCircuitBreaker.getState()
    });

    throw new Error("Circuit breaker OPEN for ElevenLabs");
  }

  try {
    await retry(
      () => callElevenLabs(),
      new Error("ElevenLabs failure") as BaseError,
      retryConfig
    );

    elevenLabsCircuitBreaker.onSuccess();

    await logger.log({
      timestamp: new Date().toISOString(),
      service: "ElevenLabs",
      message: "Call succeeded",
      circuitState: elevenLabsCircuitBreaker.getState()
    });

  } catch (err) {
    elevenLabsCircuitBreaker.onFailure();

    const error = err as BaseError;

    await logger.log({
      timestamp: new Date().toISOString(),
      service: "ElevenLabs",
      message: error.message,
      errorType: error.retryable ? "Transient" : "Permanent",
      circuitState: elevenLabsCircuitBreaker.getState()
    });

    throw err;
  }
}