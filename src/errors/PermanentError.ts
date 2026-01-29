import { BaseError } from "./BaseError";

export class PermanentError extends BaseError {
  constructor(message: string, service: string) {
    super(message, service, false);
  }
}