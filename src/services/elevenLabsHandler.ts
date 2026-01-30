import { callElevenLabs } from "./elevenLabsClient";
import { retry } from "../resilience/retry";
import { retryConfig } from "../config/retryConfig";
import { elevenLabsCircuitBreaker } from "./elevenLabsCircuit";
import { BaseError } from "../errors/BaseError";
import { logger } from "../logging";
import { alertManager } from "../alerts";

export async function processElevenLabsCall(): Promise<void> {

  //  Fail fast if circuit is already OPEN
  if (!elevenLabsCircuitBreaker.canRequest()) {
    await logger.log({
      timestamp: new Date().toISOString(),
      service: "ElevenLabs",
      message: "Circuit breaker open — failing fast",
      circuitState: elevenLabsCircuitBreaker.getState(),
    });

    throw new Error("Circuit breaker OPEN for ElevenLabs");
  }

  try {
    //  Try calling ElevenLabs with retry
    await retry(
      () => callElevenLabs(),
      new Error("ElevenLabs failure") as BaseError,
      retryConfig
    );

    //  Success → reset circuit breaker
    elevenLabsCircuitBreaker.onSuccess();

    await logger.log({
      timestamp: new Date().toISOString(),
      service: "ElevenLabs",
      message: "Call succeeded",
      circuitState: elevenLabsCircuitBreaker.getState(),
    });

  } catch (err) {
    //  Failure → record failure
    elevenLabsCircuitBreaker.onFailure();

    const error = err as BaseError;
    const circuitState = elevenLabsCircuitBreaker.getState();

    //  ALERT ONLY when circuit transitions to OPEN
    if (circuitState === "OPEN") {
      await alertManager.notify(
        "Circuit breaker OPEN for ElevenLabs"
      );
    }

    //  Alert on permanent failures (if any)
    if (!error.retryable) {
      await alertManager.notify(
        `Permanent failure in ElevenLabs: ${error.message}`
      );
    }

    //  Log the failure
    await logger.log({
      timestamp: new Date().toISOString(),
      service: "ElevenLabs",
      message: error.message,
      errorType: error.retryable ? "Transient" : "Permanent",
      circuitState,
    });

    throw err;
  }
}