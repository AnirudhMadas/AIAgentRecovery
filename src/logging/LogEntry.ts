export interface LogEntry {
  timestamp: string;
  service: string;
  message: string;
  errorType?: "Transient" | "Permanent";
  retryCount?: number;
  circuitState?: "CLOSED" | "OPEN" | "HALF_OPEN";
}