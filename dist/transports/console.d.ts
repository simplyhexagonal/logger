import { LoggerTransportOptions } from '../interfaces';
import { LoggerTransport } from './base';
export default class ConsoleTransport extends LoggerTransport {
    readonly destination: string;
    constructor(options: LoggerTransportOptions['options']);
    debug([timestamp, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    info([timestamp, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    warn([timestamp, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    error([timestamp, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    fatal([timestamp, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    all([timestamp, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    recolor(formattedMessage: string): string[];
}
