import { Logger } from "./Logger";
import { LogEntry } from "./LogEntry";

export class GoogleSheetLogger implements Logger {
  async log(entry: LogEntry): Promise<void> {
    console.log("📊 [GoogleSheet]", entry);
  }
}