export enum LogLevelsEnum {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  ALL = 'all',
}

// These are our MVP but should be extended to be kept up to date as we officially
// adopt more transports from the Open Source community
export enum LoggerTransportNameEnum {
  CONSOLE = 'console',
  SLACK = 'slack',
  DISCORD = 'discord',
  EMAIL = 'email',
  SMS = 'sms',
  SOCKET = 'socket',
}

export type LoggerTransportResult = {
  destination?: string,
  channelName?: string,
  result?: unknown; // Better to leave this one up to our transport contributors
  error?: any;
}

export type LoggerTransportFns = {
  [LogLevelsEnum.DEBUG]: (...message: unknown[]) => Promise<LoggerTransportResult>;
  [LogLevelsEnum.INFO]: (...message: unknown[]) => Promise<LoggerTransportResult>;
  [LogLevelsEnum.WARN]: (...message: unknown[]) => Promise<LoggerTransportResult>;
  [LogLevelsEnum.ERROR]: (...message: unknown[]) => Promise<LoggerTransportResult>;
  [LogLevelsEnum.FATAL]: (...message: unknown[]) => Promise<LoggerTransportResult>;
  [LogLevelsEnum.ALL]: (...message: unknown[]) => Promise<LoggerTransportResult>;
}

export interface ILoggerTransport extends LoggerTransportFns {
  readonly _id: string;
  readonly _r: string;
  readonly _isBrowser: boolean | '' | undefined;
  readonly channelName: string;
}

export type LoggerBroadcastFns = {
  [LogLevelsEnum.DEBUG]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
  [LogLevelsEnum.INFO]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
  [LogLevelsEnum.WARN]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
  [LogLevelsEnum.ERROR]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
  [LogLevelsEnum.FATAL]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
  [LogLevelsEnum.ALL]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
}

export type TransportInstances = {
  [k in LogLevelsEnum]: ILoggerTransport[];
}

export interface LoggerTransportOptions<
  T extends {
    destination: string,
    channelName?: string,
    name?: string;
  } = {
    destination: string,
    channelName?: string,
    name?: string;
  }
> {
  transport: LoggerTransportNameEnum | string;
  options: T;
}

export type LoggerTransportOptionsByLevel = {
  [k in LogLevelsEnum]: LoggerTransportOptions[];
}
