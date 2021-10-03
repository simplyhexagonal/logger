// @ts-ignore
export { version } from '../package.json';
export * from './interfaces';

import {
  LoggerTransportName,
  LogLevels,
  TransportInstances,
  LoggerTransportOptions,
  LoggerTransportOptionsByLevel,
  LoggerTransportResult,
  LoggerBroadcastFns,
} from './interfaces';

import {LoggerTransport} from './transports/base';
import ConsoleTransport from './transports/console';
import UndefinedTransport from './transports/undefined';

export interface LoggerTransportClasses {
  [LoggerTransportName.CONSOLE]: typeof LoggerTransport;
  [LoggerTransportName.SLACK]?: typeof LoggerTransport;
  [LoggerTransportName.DISCORD]?: typeof LoggerTransport;
  [LoggerTransportName.EMAIL]?: typeof LoggerTransport;
  [LoggerTransportName.SMS]?: typeof LoggerTransport;
  [LoggerTransportName.SOCKET]?: typeof LoggerTransport;
  [k: string]: typeof LoggerTransport | undefined;
}

const LOG_LEVELS = {
  debug: 0,
  info: 10,
  warn: 20,
  error: 30,
  fatal: 40,
  all: 100,
};

export interface LoggerOptions {
  optionsByLevel?: LoggerTransportOptionsByLevel;
  transports?: LoggerTransportClasses;
  singleton?: boolean;
  logLevel?: keyof typeof LOG_LEVELS;
  catchTransportErrors?: boolean;
  fallbackTransport?: typeof LoggerTransport;
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
};

const initialTransportInstances: TransportInstances = {
  debug: [],
  info: [],
  warn: [],
  error: [],
  fatal: [],
  all: [],
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

  optionsByLevel: LoggerTransportOptionsByLevel;
  availableTransports: LoggerTransportClasses;
  transportInstances: TransportInstances = JSON.parse(
    JSON.stringify(initialTransportInstances)
  );

  catchTransportErrors: boolean = false;
  readonly fallbackTransport: undefined | LoggerTransport;

  constructor({
    optionsByLevel,
    transports,
    singleton = true,
    logLevel,
    catchTransportErrors,
    fallbackTransport,
  }: LoggerOptions) {
    this.optionsByLevel = { ...defaultOptionsByLevel, ...optionsByLevel };
    this.availableTransports = {...defaultTransports, ...transports};

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
          const TransportClass = this.availableTransports[transport as LoggerTransportName]
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

  debug(...message: unknown[]) {
    return this.broadcast(message, LogLevels.DEBUG);
  }

  info(...message: unknown[]) {
    return this.broadcast(message, LogLevels.INFO);
  }

  warn(...message: unknown[]) {
    return this.broadcast(message, LogLevels.WARN);
  }

  error(...message: unknown[]) {
    return this.broadcast(message, LogLevels.ERROR);
  }

  fatal(...message: unknown[]) {
    return this.broadcast(message, LogLevels.FATAL);
  }

  all(...message: unknown[]) {
    return this.broadcast(message, LogLevels.ALL);
  }

  channel(channelName: string): LoggerBroadcastFns {
    return {
      [LogLevels.DEBUG]: async (...message: unknown[]) => {
        return this.broadcast(message, LogLevels.DEBUG, channelName)
      },
      [LogLevels.INFO]: async (...message: unknown[]) => {
        return this.broadcast(message, LogLevels.INFO, channelName)
      },
      [LogLevels.WARN]: async (...message: unknown[]) => {
        return this.broadcast(message, LogLevels.WARN, channelName)
      },
      [LogLevels.ERROR]: async (...message: unknown[]) => {
        return this.broadcast(message, LogLevels.ERROR, channelName)
      },
      [LogLevels.FATAL]: async (...message: unknown[]) => {
        return this.broadcast(message, LogLevels.FATAL, channelName)
      },
      [LogLevels.ALL]: async (...message: unknown[]) => {
        return this.broadcast(message, LogLevels.ALL, channelName)
      },
    };
  }

  async broadcast(
    message: unknown[],
    level: LogLevels,
    channelName: string = '-',
  ): Promise<LoggerTransportResult[]> {
    const results: Promise<LoggerTransportResult>[] = [];

    await this.transportInstances[level as keyof TransportInstances].reduce(
      async (a, transport) => {
        await a;

        if (channelName === '-' || transport.channelName === channelName) {
          const result = transport[level as LogLevels](
            [new Date().toISOString(), ...message]
          ).catch((e) => {
            if (!this.catchTransportErrors) {
              throw e;
            };

            const fallbackResult = (this.fallbackTransport as LoggerTransport).error(
              [new Date().toISOString(), e]
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
