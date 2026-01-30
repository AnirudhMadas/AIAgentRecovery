import { AlertChannel } from "./AlertChannel";

export class WebhookAlert implements AlertChannel {
  async send(message: string): Promise<void> {
    console.log("Webhook Alert!!", message);
  }
}