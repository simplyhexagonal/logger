/* eslint-disable no-console */
import {
  yellow,
  parse,
} from 'ansicolor';

import { LoggerTransportOptions, LoggerTransportResult } from '../interfaces';
import { LoggerTransport } from './base';

class UndefinedTransportError extends Error {
  transportResult: LoggerTransportResult;

  constructor(message: string, transportResult: LoggerTransportResult) {
    super(message);

    this.transportResult = transportResult;
  };
}

export const errorString = `LOGGER ERROR: transport "TRANSPORT_NAME" is NOT available, it was not defined in the logger options!`;

export default class UndefinedTransport extends LoggerTransport {
  readonly transportName: undefined | string;
  readonly destination: string;

  constructor(options: LoggerTransportOptions['options']) {
    const r = Math.random().toString(36).substring(7);
    super({...options, r});

    console.log(
      ...this.recolor(yellow(new Date().toISOString())),
      ...this.recolor(yellow(`WARN 🟡:\n\n\tLogger transport "${options.name}" is NOT defined!\n`)),
    );

    this.destination = options.destination;
    this.transportName = options.name;
  }

  async debug(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async info(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async warn(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async error(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async fatal(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async all(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  async raw(message: unknown[]) {
    this.throwDefault();
    return {};
  }

  throwDefault() {
    const errorMessage = errorString.replace('TRANSPORT_NAME', this.transportName || 'undefined');
    const error = new UndefinedTransportError(
      errorMessage,
      {
        destination: this.destination,
        channelName: this.channelName,
        error: new Error(errorMessage),
      },
    );

    throw error;
  }

  recolor(formattedMessage: string) {
    if (this._isBrowser) {
      return parse(formattedMessage).asChromeConsoleLogArguments;
    }

    return [formattedMessage];
  }
}
