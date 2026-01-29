import { BaseError } from "./BaseError";

export class TransientError extends BaseError {
  constructor(message: string, service: string) {
    super(message, service, true);
  }
}