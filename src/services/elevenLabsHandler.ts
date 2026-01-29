import { callElevenLabs } from "./elevenLabsClient";
import { retry } from "../resilience/retry";
import { retryConfig } from "../config/retryConfig";
import { elevenLabsCircuitBreaker } from "./elevenLabsCircuit";
import { BaseError } from "../errors/BaseError";
import { logger } from "../logging";
import { alertManager } from "../alerts";

export async function processElevenLabsCall(): Promise<void> {

  // 1️⃣ Fail fast if circuit is already OPEN
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
    // 2️⃣ Try calling ElevenLabs with retry
    await retry(
      () => callElevenLabs(),
      new Error("ElevenLabs failure") as BaseError,
      retryConfig
    );

    // 3️⃣ Success → reset circuit breaker
    elevenLabsCircuitBreaker.onSuccess();

    await logger.log({
      timestamp: new Date().toISOString(),
      service: "ElevenLabs",
      message: "Call succeeded",
      circuitState: elevenLabsCircuitBreaker.getState(),
    });

  } catch (err) {
    // 4️⃣ Failure → record failure
    elevenLabsCircuitBreaker.onFailure();

    const error = err as BaseError;
    const circuitState = elevenLabsCircuitBreaker.getState();

    // 5️⃣ ALERT ONLY when circuit transitions to OPEN
    if (circuitState === "OPEN") {
      await alertManager.notify(
        "🚨 Circuit breaker OPEN for ElevenLabs"
      );
    }

    // 6️⃣ Alert on permanent failures (if any)
    if (!error.retryable) {
      await alertManager.notify(
        `❌ Permanent failure in ElevenLabs: ${error.message}`
      );
    }

    // 7️⃣ Log the failure
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