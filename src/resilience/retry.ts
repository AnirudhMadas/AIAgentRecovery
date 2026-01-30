import { BaseError } from "../errors/BaseError";
import { retryConfig } from "../config/retryConfig";

export async function retry<T>(
  operation: () => Promise<T>,
  error: BaseError,
  config = retryConfig
): Promise<T> {
  let attempt = 0;
  let delay = config.initialDelayMs;

  while (attempt < config.maxRetries) {
    try {
      return await operation();
    } catch (err) {
      if (!error.retryable) {
        throw err;
      }

      attempt++;
      if (attempt >= config.maxRetries) {
        throw err;
      }

      console.log(`Retry ${attempt} after ${delay}ms`);
      await new Promise(res => setTimeout(res, delay));
      delay *= config.backoffMultiplier;
    }
  }

  throw error;
}