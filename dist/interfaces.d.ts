export declare enum LogLevels {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
    ALL = "all"
}
export declare enum LoggerTransportName {
    CONSOLE = "console",
    SLACK = "slack",
    DISCORD = "discord",
    EMAIL = "email",
    SMS = "sms",
    SOCKET = "socket"
}
export declare type LoggerTransportResult = {
    destination?: string;
    channelName?: string;
    result?: unknown;
    error?: any;
};
export declare type LoggerTransportFns = {
    [LogLevels.DEBUG]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevels.INFO]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevels.WARN]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevels.ERROR]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevels.FATAL]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevels.ALL]: (...message: unknown[]) => Promise<LoggerTransportResult>;
};
export interface ILoggerTransport extends LoggerTransportFns {
    readonly _id: string;
    readonly _r: string;
    readonly _isBrowser: boolean | '' | undefined;
    readonly channelName: string;
}
export declare type LoggerBroadcastFns = {
    [LogLevels.DEBUG]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevels.INFO]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevels.WARN]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevels.ERROR]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevels.FATAL]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevels.ALL]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
};
export declare type TransportInstances = {
    [k in LogLevels]: ILoggerTransport[];
};
export interface LoggerTransportOptions<T extends {
    destination: string;
    channelName?: string;
    name?: string;
} = {
    destination: string;
    channelName?: string;
    name?: string;
}> {
    transport: LoggerTransportName | string;
    options: T;
}
export declare type LoggerTransportOptionsByLevel = {
    [k in LogLevels]: LoggerTransportOptions[];
};
