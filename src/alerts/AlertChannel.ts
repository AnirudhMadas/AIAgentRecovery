export interface AlertChannel {
  send(message: string): Promise<void>;
}