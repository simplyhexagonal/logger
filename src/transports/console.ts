/* eslint-disable no-console */
import {
  yellow,
  green,
  red,
  bgRed,
  lightCyan,
  lightMagenta,
  parse,
} from 'ansicolor';

import { LoggerTransportOptions, LogLevels } from '../interfaces';
import { LoggerTransport } from './base';

export default class ConsoleTransport extends LoggerTransport {
  readonly destination: string;

  constructor(options: LoggerTransportOptions['options']) {
    const r = Math.random().toString(36).substring(7);
    super({...options, r});

    this.destination = options.destination;

    if (r !== this._r) {
      return this;
    }
  }

  async debug([timestamp, ...message]: unknown[]) {
    console.log(...this.recolor(lightMagenta(this.format(
      [
        timestamp,
        LogLevels.DEBUG.toUpperCase(),
        '🐞️:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async info([timestamp, ...message]: unknown[]) {
    console.log(...this.recolor(green(this.format(
      [
        timestamp,
        LogLevels.INFO.toUpperCase(),
        '✅️:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async warn([timestamp, ...message]: unknown[]) {
    console.log(...this.recolor(yellow(this.format(
      [
        timestamp,
        LogLevels.WARN.toUpperCase(),
        '🟡:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async error([timestamp, ...message]: unknown[]) {
    console.log(...this.recolor(red(this.format(
      [
        timestamp,
        LogLevels.ERROR.toUpperCase(),
        '🚨️:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async fatal([timestamp, ...message]: unknown[]) {
    console.log(...this.recolor(bgRed(this.format(
      [
        timestamp,
        LogLevels.FATAL.toUpperCase(),
        '💀:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  async all([timestamp, ...message]: unknown[]) {
    console.log(...this.recolor(lightCyan(this.format(
      [
        timestamp,
        LogLevels.ALL.toUpperCase(),
        '📝:\n\n',
        ...message,
        '\n',
      ]
    ).replace(/\n/g, '\n\t'))));

    return {
      destination: this.destination,
      channelName: this.channelName,
      result: true,
    };
  }

  recolor(formattedMessage: string) {
    if (this._isBrowser) {
      return parse(formattedMessage).asChromeConsoleLogArguments;
    }

    return [formattedMessage];
  }
}
