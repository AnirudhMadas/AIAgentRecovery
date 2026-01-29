import { AlertManager } from "./AlertManager";
import { EmailAlert } from "./EmailAlert";
import { TelegramAlert } from "./TelegramAlert";
import { WebhookAlert } from "./WebhookAlert";

export const alertManager = new AlertManager([
  new EmailAlert(),
  new TelegramAlert(),
  new WebhookAlert()
]);