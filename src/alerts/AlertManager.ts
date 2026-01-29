import { AlertChannel } from "./AlertChannel";

export class AlertManager {
  constructor(private readonly channels: AlertChannel[]) {}

  async notify(message: string): Promise<void> {
    await Promise.all(
      this.channels.map(channel => channel.send(message))
    );
  }
}