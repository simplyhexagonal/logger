// @ts-ignore
import { version } from '../package.json';

import {
  LoggerTransportNameEnum,
  LogLevelsEnum,
  TransportInstances,
  LoggerTransportOptions,
  LoggerTransportOptionsByLevel,
  LoggerTransportResult,
  LoggerBroadcastFns,
  AppIdentifiers,
} from './interfaces';

import { LoggerTransport } from './transports/base';
import ConsoleTransport from './transports/console';
import UndefinedTransport from './transports/undefined';

export * from './interfaces';

export { LoggerTransport } from './transports/base';

export const LoggerTransportName = {...LoggerTransportNameEnum};
export const LogLevels = {...LogLevelsEnum};

export interface LoggerTransportClasses {
  [LoggerTransportName.CONSOLE]: typeof LoggerTransport;
  [LoggerTransportName.SLACK]?: typeof LoggerTransport;
  [LoggerTransportName.DISCORD]?: typeof LoggerTransport;
  [LoggerTransportName.EMAIL]?: typeof LoggerTransport;
  [LoggerTransportName.SMS]?: typeof LoggerTransport;
  [LoggerTransportName.SOCKET]?: typeof LoggerTransport;
  [k: string]: typeof LoggerTransport | undefined;
}

let performanceShim: Performance;

if (typeof window === 'undefined' || !window.performance) {
  performanceShim = require('perf_hooks').performance;
} else {
  performanceShim = window.performance;
}

const LOG_LEVELS = {
  debug: 0,
  info: 10,
  warn: 20,
  error: 30,
  fatal: 40,
  all: 100,
  raw: 110,
};

export interface LoggerOptions {
  optionsByLevel?: LoggerTransportOptionsByLevel;
  transports?: Partial<LoggerTransportClasses>;
  singleton?: boolean;
  logLevel?: keyof typeof LOG_LEVELS;
  catchTransportErrors?: boolean;
  fallbackTransport?: typeof LoggerTransport;
  appIdentifiers?: AppIdentifiers;
}

const defaultLoggerTransportOptions: LoggerTransportOptions = {
  transport: LoggerTransportName.CONSOLE,
  options: {
    destination: LoggerTransportName.CONSOLE,
    channelName: LoggerTransportName.CONSOLE,
  },
};

const defaultOptionsByLevel: LoggerTransportOptionsByLevel = {
  debug: [defaultLoggerTransportOptions],
  info: [defaultLoggerTransportOptions],
  warn: [defaultLoggerTransportOptions],
  error: [defaultLoggerTransportOptions],
  fatal: [defaultLoggerTransportOptions],
  all: [defaultLoggerTransportOptions],
  raw: [defaultLoggerTransportOptions],
};

const initialTransportInstances: TransportInstances = {
  debug: [],
  info: [],
  warn: [],
  error: [],
  fatal: [],
  all: [],
  raw: [],
};

const defaultTransports = {
  [LoggerTransportName.CONSOLE]: ConsoleTransport,
  [LoggerTransportName.SLACK]: UndefinedTransport,
  [LoggerTransportName.DISCORD]: UndefinedTransport,
  [LoggerTransportName.EMAIL]: UndefinedTransport,
  [LoggerTransportName.SMS]: UndefinedTransport,
  [LoggerTransportName.SOCKET]: UndefinedTransport,
};

/**
 * The `Logger` class does the heavy-lifting of keeping track of transports,
 * broadcasting to the appropriate transports (or not) based on the log levels,
 * and aggregating the results from said broadcasts.
 */
export default class Logger {
  private static instance: Logger;

  static version: string = version;
  static LoggerTransportName = LoggerTransportName;
  static LogLevels = LogLevels;
  static LoggerTransport = LoggerTransport;
  static hrTime() {
    return performanceShim.timeOrigin + performanceShim.now();
  }

  static default: typeof Logger = Logger;

  _timers: {[k: string]: number} = {};

  optionsByLevel: LoggerTransportOptionsByLevel;
  availableTransports: LoggerTransportClasses;
  transportInstances: TransportInstances = JSON.parse(
    JSON.stringify(initialTransportInstances)
  );
  appIdentifiers: AppIdentifiers = {};

  catchTransportErrors: boolean = false;
  readonly fallbackTransport: undefined | LoggerTransport;

  private appIdString(): string {
    const {
      region,
      clusterType,
      cluster,
      hostname,
      ip,
      app,
    } = this.appIdentifiers;

    const result = [
      region,
      clusterType,
      cluster,
      hostname,
      ip,
      app
    ].filter(
      (i) => i
    ).join(' > ');

    return (result) ? `[${result}]` : '';
  }

  constructor({
    optionsByLevel,
    transports,
    singleton = true,
    logLevel,
    catchTransportErrors,
    fallbackTransport,
    appIdentifiers,
  }: LoggerOptions) {
    this.optionsByLevel = { ...defaultOptionsByLevel, ...optionsByLevel };
    this.availableTransports = {...defaultTransports, ...transports};
    this.appIdentifiers = appIdentifiers || {};

    const {
      LOG_LEVEL,
      LOGGER_CATCH_TRANSPORT_ERRORS,
    } = process.env;

    this.catchTransportErrors = (
      (LOGGER_CATCH_TRANSPORT_ERRORS || '').toLowerCase() === 'true'
    ) || catchTransportErrors || this.catchTransportErrors;

    if (singleton && Logger.instance) return Logger.instance;

    if (singleton && !Logger.instance) Logger.instance = this;

    if (this.catchTransportErrors) {
      if (fallbackTransport) {
        this.fallbackTransport = new fallbackTransport({
          destination: `Logger:Fallback(${fallbackTransport.name})`
        });
      } else {
        this.fallbackTransport = new ConsoleTransport({destination: 'Logger:Fallback'});
      }
    }

    const envLogLevel = LOG_LEVELS[LOG_LEVEL as keyof typeof LOG_LEVELS];

    const destinations: string[] = [];
    const transportInstanceMap: {[k: string]: LoggerTransport} = {};

    /**
     * To save on resources, register singleton transports only for the log levels
     * above or equal the configured log level
     */
    Object.entries(LOG_LEVELS).forEach(([k, v]) => {this.broadcast
      if (
        v >= (
          envLogLevel // This is our environment variable override feature
          || (
            (
              logLevel
            ) ? (
              LOG_LEVELS[logLevel as keyof typeof LOG_LEVELS]
            ) : (
              LOG_LEVELS[LogLevels.DEBUG]
            )
          )
        ) || k === LogLevels.ALL
      ) {
        let lvlOptions = this.optionsByLevel[k as keyof LoggerTransportOptionsByLevel];

        if (lvlOptions.length === 0) {
          lvlOptions = defaultOptionsByLevel[k as keyof LoggerTransportOptionsByLevel];
        }

        lvlOptions.forEach(({transport, options}) => {
          const {destination} = options;
          const TransportClass = this.availableTransports[transport as LoggerTransportNameEnum]
              || UndefinedTransport;

          if (!destinations.includes(destination)) {
            destinations.push(destination);

            transportInstanceMap[destination] = new TransportClass({
              name: transport,
              ...options,
            });
          }

          this.transportInstances[k as keyof TransportInstances].push(
            transportInstanceMap[destination]
          );
        });
      }
    });
  }

  time(operationIdentifier: string) {
    this._timers[operationIdentifier] = Logger.hrTime();
  }

  async timeEnd(operationIdentifier: string) {
    const {
      [`${operationIdentifier}`]: time,
      ...rest
    } = this._timers;

    if (!time) {
      await this.channel(LoggerTransportName.CONSOLE).warn(`Timer '${operationIdentifier}' does not exist`);
      return -1;
    }

    this._timers = rest;

    const result = Logger.hrTime() - time;

    await this.raw(`${operationIdentifier}: ${result} ms`);

    return result;
  }

  cleanupTimers() {
    this._timers = {};
  }

  async debug(...message: unknown[]) {
    return await this.broadcast(message, LogLevels.DEBUG);
  }

  async info(...message: unknown[]) {
    return await this.broadcast(message, LogLevels.INFO);
  }

  async warn(...message: unknown[]) {
    return await this.broadcast(message, LogLevels.WARN);
  }

  async error(...message: unknown[]) {
    return await this.broadcast(message, LogLevels.ERROR);
  }

  async fatal(...message: unknown[]) {
    return await this.broadcast(message, LogLevels.FATAL);
  }

  async all(...message: unknown[]) {
    return await this.broadcast(message, LogLevels.ALL);
  }

  // Convenience alias to make it easier to use the logger
  // as drop-in replacement for console.log
  async log(...message: unknown[]) {
    return await this.broadcast(message, LogLevels.ALL);
  }

  async raw(...message: unknown[]) {
    return await this.broadcast(message, LogLevels.RAW);
  }

  channel(channelName: string): LoggerBroadcastFns {
    return {
      [LogLevels.DEBUG]: async (...message: unknown[]) => {
        return await this.broadcast(message, LogLevels.DEBUG, channelName)
      },
      [LogLevels.INFO]: async (...message: unknown[]) => {
        return await this.broadcast(message, LogLevels.INFO, channelName)
      },
      [LogLevels.WARN]: async (...message: unknown[]) => {
        return await this.broadcast(message, LogLevels.WARN, channelName)
      },
      [LogLevels.ERROR]: async (...message: unknown[]) => {
        return await this.broadcast(message, LogLevels.ERROR, channelName)
      },
      [LogLevels.FATAL]: async (...message: unknown[]) => {
        return await this.broadcast(message, LogLevels.FATAL, channelName)
      },
      [LogLevels.ALL]: async (...message: unknown[]) => {
        return await this.broadcast(message, LogLevels.ALL, channelName)
      },
      [LogLevels.RAW]: async (...message: unknown[]) => {
        return await this.broadcast(message, LogLevels.RAW, channelName)
      },
    };
  }

  async broadcast(
    message: unknown[],
    level: LogLevelsEnum,
    channelName: string = '-',
  ): Promise<LoggerTransportResult[]> {
    const results: Promise<LoggerTransportResult>[] = [];

    await this.transportInstances[level as keyof TransportInstances].reduce(
      async (a, transport) => {
        await a;

        if (channelName === '-' || transport.channelName === channelName) {
          const result = transport[level as LogLevelsEnum](
            [
              [
                this.appIdString(),
                `[${new Date().toISOString()}]`,
              ].join(' '),
              ...message,
            ].filter((m) => m)
          ).catch((e) => {
            if (!this.catchTransportErrors) {
              throw e;
            };

            const fallbackResult = (this.fallbackTransport as LoggerTransport).error(
              [
                [
                  this.appIdString(),
                  `[${new Date().toISOString()}]`,
                ].join(' '),
                e,
              ]
            ).then((r) => ({
              ...(e.transportResult || {}),
              ...r,
            }));

            return fallbackResult;
          });

          results.push(result);

          return result;
        }

        return Promise.resolve();
      },
      Promise.resolve() as Promise<void | LoggerTransportResult>
    );

    return await Promise.all(results);
  }
}
