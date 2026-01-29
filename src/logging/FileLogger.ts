import { Logger } from "./Logger";
import { LogEntry } from "./LogEntry";
import fs from "fs";
import { promisify } from "util";

const appendFileAsync = promisify(fs.appendFile);

export class FileLogger implements Logger {
  constructor(private readonly filePath: string) {}

  async log(entry: LogEntry): Promise<void> {
    const line = JSON.stringify(entry) + "\n";
    await appendFileAsync(this.filePath, line);
  }
}