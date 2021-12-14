import { LoggerTransportOptions } from '../interfaces';
import { LoggerTransport } from './base';
export default class ConsoleTransport extends LoggerTransport {
    readonly destination: string;
    constructor(options: LoggerTransportOptions['options']);
    debug([prefixes, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    info([prefixes, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    warn([prefixes, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    error([prefixes, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    fatal([prefixes, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    all([prefixes, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    raw([prefixes, ...message]: unknown[]): Promise<{
        destination: string;
        channelName: string;
        result: boolean;
    }>;
    recolor(formattedMessage: string): string[];
}
