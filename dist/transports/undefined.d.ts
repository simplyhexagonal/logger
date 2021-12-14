import { LoggerTransportOptions } from '../interfaces';
import { LoggerTransport } from './base';
export declare const errorString = "LOGGER ERROR: transport \"TRANSPORT_NAME\" is NOT available, it was not defined in the logger options!";
export default class UndefinedTransport extends LoggerTransport {
    readonly transportName: undefined | string;
    readonly destination: string;
    constructor(options: LoggerTransportOptions['options']);
    debug(message: unknown[]): Promise<{}>;
    info(message: unknown[]): Promise<{}>;
    warn(message: unknown[]): Promise<{}>;
    error(message: unknown[]): Promise<{}>;
    fatal(message: unknown[]): Promise<{}>;
    all(message: unknown[]): Promise<{}>;
    raw(message: unknown[]): Promise<{}>;
    throwDefault(): void;
    recolor(formattedMessage: string): string[];
}
