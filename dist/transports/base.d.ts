import { ILoggerTransport, LoggerTransportOptions } from '../interfaces';
export declare class LoggerTransport implements ILoggerTransport {
    static instances: {
        [k: string]: LoggerTransport;
    };
    readonly _id: string;
    readonly _r: string;
    readonly _isBrowser: boolean | '' | undefined;
    readonly channelName: string;
    debug(..._message: unknown[]): Promise<{}>;
    info(..._message: unknown[]): Promise<{}>;
    warn(..._message: unknown[]): Promise<{}>;
    error(..._message: unknown[]): Promise<{}>;
    fatal(..._message: unknown[]): Promise<{}>;
    all(..._message: unknown[]): Promise<{}>;
    format(message: unknown[]): string;
    constructor({ r, destination, channelName }: (LoggerTransportOptions['options'] & {
        r?: string;
    }));
}
export declare type LoggingFunctions = keyof LoggerTransport;
