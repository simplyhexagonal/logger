export declare enum LogLevelsEnum {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
    ALL = "all",
    RAW = "raw"
}
export declare enum LoggerTransportNameEnum {
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
    [LogLevelsEnum.DEBUG]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevelsEnum.INFO]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevelsEnum.WARN]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevelsEnum.ERROR]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevelsEnum.FATAL]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevelsEnum.ALL]: (...message: unknown[]) => Promise<LoggerTransportResult>;
    [LogLevelsEnum.RAW]: (...message: unknown[]) => Promise<LoggerTransportResult>;
};
export interface ILoggerTransport extends LoggerTransportFns {
    readonly _id: string;
    readonly _r: string;
    readonly _isBrowser: boolean | '' | undefined;
    readonly channelName: string;
}
export declare type LoggerBroadcastFns = {
    [LogLevelsEnum.DEBUG]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevelsEnum.INFO]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevelsEnum.WARN]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevelsEnum.ERROR]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevelsEnum.FATAL]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevelsEnum.ALL]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
    [LogLevelsEnum.RAW]: (...message: unknown[]) => Promise<LoggerTransportResult[]>;
};
export declare type TransportInstances = {
    [k in LogLevelsEnum]: ILoggerTransport[];
};
export interface BaseLoggerTransportOptions {
    destination: string;
    channelName?: string;
    name?: string;
}
export interface LoggerTransportOptions<T = any> {
    transport: LoggerTransportNameEnum | string;
    options: BaseLoggerTransportOptions & T;
}
export declare type LoggerTransportOptionsByLevel = {
    [k in LogLevelsEnum]: LoggerTransportOptions[];
};
export interface AppIdentifiers {
    region?: string;
    clusterType?: string;
    cluster?: string;
    hostname?: string;
    ip?: string;
    app?: string;
}
