import { LogEntry } from "./LogEntry";

export interface Logger {
  log(entry: LogEntry): Promise<void>;
}