import { callElevenLabs } from "./elevenLabsClient";
import { retry } from "../resilience/retry";
import { retryConfig } from "../config/retryConfig";
import { elevenLabsCircuitBreaker } from "./elevenLabsCircuit";
import { BaseError } from "../errors/BaseError";

export async function processElevenLabsCall(): Promise<void> {
  if (!elevenLabsCircuitBreaker.canRequest()) {
    throw new Error("Circuit breaker OPEN for ElevenLabs");
  }

  try {
    await retry(
      () => callElevenLabs(),
      new Error("ElevenLabs failure") as BaseError,
      retryConfig
    );

    elevenLabsCircuitBreaker.onSuccess();
  } catch (err) {
    elevenLabsCircuitBreaker.onFailure();
    throw err;
  }
}