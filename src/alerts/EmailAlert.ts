import { AlertChannel } from "./AlertChannel";

export class EmailAlert implements AlertChannel {
  async send(message: string): Promise<void> {
    console.log("Email Alert!!", message);
  }
}