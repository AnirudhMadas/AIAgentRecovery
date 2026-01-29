export abstract class BaseError extends Error {
  public readonly service: string;
  public readonly retryable: boolean;

  constructor(message: string, service: string, retryable: boolean) {
    super(message);
    this.service = service;
    this.retryable = retryable;
  }
}