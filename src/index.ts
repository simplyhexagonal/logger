import {
  ILoggerTransport,
  LoggerOptions,
  LoggerTransportName,
  LogLevels,
  TransportInstances,
  TransportOptions,
  TransportOptionsByLevel,
} from './interfaces';

import transportClasses from './transports';

const LOG_LEVELS = {
  debug: 0,
  info: 10,
  warn: 20,
  error: 30,
  fatal: 40,
  all: 100,
};

const { LOG_LEVEL } = process.env;

const envLogLevel = LOG_LEVELS[(LOG_LEVEL as keyof typeof LOG_LEVELS) || 'debug'];

const defaultTransportOptions: TransportOptions = {
  transport: LoggerTransportName.CONSOLE,
  options: { destination: '' },
};

const defaultOptionsByLevel: TransportOptionsByLevel = {
  debug: [defaultTransportOptions],
  info: [defaultTransportOptions],
  warn: [defaultTransportOptions],
  error: [defaultTransportOptions],
  fatal: [defaultTransportOptions],
  all: [defaultTransportOptions],
};

const initialTransportInstances: TransportInstances = {
  debug: [],
  info: [],
  warn: [],
  error: [],
  fatal: [],
  all: [],
};

export default class Logger {
  private static instance: Logger;

  private readonly _transports: TransportInstances = initialTransportInstances;

  optionsByLevel: TransportOptionsByLevel;

  constructor({ optionsByLevel, singleton = true }: LoggerOptions) {
    this.optionsByLevel = { ...defaultOptionsByLevel, ...optionsByLevel };

    if (singleton && Logger.instance) return Logger.instance;

    if (singleton && !Logger.instance) Logger.instance = this;

    Object.entries(LOG_LEVELS).forEach(([k, v]) => {
      if (v >= envLogLevel || k === LogLevels.ALL) {
        const transportOptions = this.optionsByLevel[k as keyof TransportOptionsByLevel];
        transportOptions.forEach(({ transport, options }) => {
          const TransportClass = transportClasses[transport as keyof typeof transportClasses];

          this._transports[k as keyof TransportInstances].push(new TransportClass(options));
        });
      }
    });
  }

  debug(...message: unknown[]): void {
    this.defaultLog(message, LogLevels.DEBUG);
  }

  info(...message: unknown[]): void {
    this.defaultLog(message, LogLevels.INFO);
  }

  warn(...message: unknown[]): void {
    this.defaultLog(message, LogLevels.WARN);
  }

  error(...message: unknown[]): void {
    this.defaultLog(message, LogLevels.ERROR);
  }

  fatal(...message: unknown[]): void {
    this.defaultLog(message, LogLevels.FATAL);
  }

  all(...message: unknown[]): void {
    this.defaultLog(message, LogLevels.ALL);
  }

  defaultLog(message: unknown[], level: LogLevels): void {
    this._transports[level as keyof TransportInstances].forEach((transport) => {
      transport[level as keyof ILoggerTransport](message);
    });
  }
}
