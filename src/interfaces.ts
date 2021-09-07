export enum LogLevels {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  ALL = 'all',
}

export enum LoggerTransportName {
  CONSOLE = 'console',
  SLACK = 'slack',
  DISCORD = 'discord',
  EMAIL = 'email',
  SMS = 'sms',
  SOCKET = 'socket',
}

export type ILoggerTransport = {
  [k in LogLevels]: (message: unknown[]) => void;
};

export type TransportInstances = {
  [k in LogLevels]: ILoggerTransport[];
};

export interface TransportOptions<T extends { destination: string } = { destination: string }> {
  transport: LoggerTransportName;
  options: T;
}

export type TransportOptionsByLevel = {
  [k in LogLevels]: TransportOptions[];
};

export interface LoggerOptions {
  optionsByLevel?: TransportOptionsByLevel;
  singleton?: boolean;
}
