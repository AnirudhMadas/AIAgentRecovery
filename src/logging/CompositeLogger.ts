import { Logger } from "./Logger";
import { LogEntry } from "./LogEntry";

export class CompositeLogger implements Logger {
  constructor(private readonly loggers: Logger[]) {}

  async log(entry: LogEntry): Promise<void> {
    await Promise.all(
      this.loggers.map(logger => logger.log(entry))
    );
  }
}