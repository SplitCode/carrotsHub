export type LoggerEventParams = Record<
  string,
  string | number | boolean | undefined
>;

export interface LogEvent {
  name: string;
  params?: LoggerEventParams;
}

export enum LogLevel {
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}
