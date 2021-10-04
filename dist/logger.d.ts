import { LoggerTransportName, LogLevels, TransportInstances, LoggerTransportOptionsByLevel, LoggerTransportResult, LoggerBroadcastFns } from './interfaces';
import { LoggerTransport } from './transports/base';
export * from './interfaces';
export interface LoggerTransportClasses {
    [LoggerTransportName.CONSOLE]: typeof LoggerTransport;
    [LoggerTransportName.SLACK]?: typeof LoggerTransport;
    [LoggerTransportName.DISCORD]?: typeof LoggerTransport;
    [LoggerTransportName.EMAIL]?: typeof LoggerTransport;
    [LoggerTransportName.SMS]?: typeof LoggerTransport;
    [LoggerTransportName.SOCKET]?: typeof LoggerTransport;
    [k: string]: typeof LoggerTransport | undefined;
}
declare const LOG_LEVELS: {
    debug: number;
    info: number;
    warn: number;
    error: number;
    fatal: number;
    all: number;
};
export interface LoggerOptions {
    optionsByLevel?: LoggerTransportOptionsByLevel;
    transports?: LoggerTransportClasses;
    singleton?: boolean;
    logLevel?: keyof typeof LOG_LEVELS;
    catchTransportErrors?: boolean;
    fallbackTransport?: typeof LoggerTransport;
}
/**
 * The `Logger` class does the heavy-lifting of keeping track of transports,
 * broadcasting to the appropriate transports (or not) based on the log levels,
 * and aggregating the results from said broadcasts.
 */
export default class Logger {
    private static version;
    private static instance;
    optionsByLevel: LoggerTransportOptionsByLevel;
    availableTransports: LoggerTransportClasses;
    transportInstances: TransportInstances;
    catchTransportErrors: boolean;
    readonly fallbackTransport: undefined | LoggerTransport;
    constructor({ optionsByLevel, transports, singleton, logLevel, catchTransportErrors, fallbackTransport, }: LoggerOptions);
    debug(...message: unknown[]): Promise<LoggerTransportResult[]>;
    info(...message: unknown[]): Promise<LoggerTransportResult[]>;
    warn(...message: unknown[]): Promise<LoggerTransportResult[]>;
    error(...message: unknown[]): Promise<LoggerTransportResult[]>;
    fatal(...message: unknown[]): Promise<LoggerTransportResult[]>;
    all(...message: unknown[]): Promise<LoggerTransportResult[]>;
    channel(channelName: string): LoggerBroadcastFns;
    broadcast(message: unknown[], level: LogLevels, channelName?: string): Promise<LoggerTransportResult[]>;
}
