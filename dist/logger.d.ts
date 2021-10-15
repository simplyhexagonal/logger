import { LoggerTransportNameEnum, LogLevelsEnum, TransportInstances, LoggerTransportOptionsByLevel, LoggerTransportResult, LoggerBroadcastFns, AppIdentifiers } from './interfaces';
import { LoggerTransport } from './transports/base';
export * from './interfaces';
export { LoggerTransport } from './transports/base';
export declare const LoggerTransportName: {
    CONSOLE: LoggerTransportNameEnum.CONSOLE;
    SLACK: LoggerTransportNameEnum.SLACK;
    DISCORD: LoggerTransportNameEnum.DISCORD;
    EMAIL: LoggerTransportNameEnum.EMAIL;
    SMS: LoggerTransportNameEnum.SMS;
    SOCKET: LoggerTransportNameEnum.SOCKET;
};
export declare const LogLevels: {
    DEBUG: LogLevelsEnum.DEBUG;
    INFO: LogLevelsEnum.INFO;
    WARN: LogLevelsEnum.WARN;
    ERROR: LogLevelsEnum.ERROR;
    FATAL: LogLevelsEnum.FATAL;
    ALL: LogLevelsEnum.ALL;
};
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
    transports?: Partial<LoggerTransportClasses>;
    singleton?: boolean;
    logLevel?: keyof typeof LOG_LEVELS;
    catchTransportErrors?: boolean;
    fallbackTransport?: typeof LoggerTransport;
    appIdentifiers?: AppIdentifiers;
}
/**
 * The `Logger` class does the heavy-lifting of keeping track of transports,
 * broadcasting to the appropriate transports (or not) based on the log levels,
 * and aggregating the results from said broadcasts.
 */
export default class Logger {
    private static instance;
    static version: string;
    static LoggerTransportName: {
        CONSOLE: LoggerTransportNameEnum.CONSOLE;
        SLACK: LoggerTransportNameEnum.SLACK;
        DISCORD: LoggerTransportNameEnum.DISCORD;
        EMAIL: LoggerTransportNameEnum.EMAIL;
        SMS: LoggerTransportNameEnum.SMS;
        SOCKET: LoggerTransportNameEnum.SOCKET;
    };
    static LogLevels: {
        DEBUG: LogLevelsEnum.DEBUG;
        INFO: LogLevelsEnum.INFO;
        WARN: LogLevelsEnum.WARN;
        ERROR: LogLevelsEnum.ERROR;
        FATAL: LogLevelsEnum.FATAL;
        ALL: LogLevelsEnum.ALL;
    };
    static LoggerTransport: typeof LoggerTransport;
    optionsByLevel: LoggerTransportOptionsByLevel;
    availableTransports: LoggerTransportClasses;
    transportInstances: TransportInstances;
    appIdentifiers: AppIdentifiers;
    catchTransportErrors: boolean;
    readonly fallbackTransport: undefined | LoggerTransport;
    private appIdString;
    constructor({ optionsByLevel, transports, singleton, logLevel, catchTransportErrors, fallbackTransport, appIdentifiers, }: LoggerOptions);
    debug(...message: unknown[]): Promise<LoggerTransportResult[]>;
    info(...message: unknown[]): Promise<LoggerTransportResult[]>;
    warn(...message: unknown[]): Promise<LoggerTransportResult[]>;
    error(...message: unknown[]): Promise<LoggerTransportResult[]>;
    fatal(...message: unknown[]): Promise<LoggerTransportResult[]>;
    all(...message: unknown[]): Promise<LoggerTransportResult[]>;
    channel(channelName: string): LoggerBroadcastFns;
    broadcast(message: unknown[], level: LogLevelsEnum, channelName?: string): Promise<LoggerTransportResult[]>;
}
