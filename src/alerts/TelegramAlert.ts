import { AlertChannel } from "./AlertChannel";

export class TelegramAlert implements AlertChannel {
  async send(message: string): Promise<void> {
    console.log("Telegram Alert!!", message);
  }
}