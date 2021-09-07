/* eslint-disable no-console */
import {
  yellow,
  green,
  black,
  red,
  bgRed,
  bgYellow,
  lightCyan,
  parse,
} from 'ansicolor';

import { TransportOptions } from '../interfaces';
import { LoggerTransport } from './base';

export default class ConsoleTransport extends LoggerTransport {
  constructor(options: TransportOptions['options']) {
    const r = Math.random().toString(36).substring(7);
    super(r, options);

    if (r !== this._r) {
      return this;
    }
  }

  debug(message: unknown[]): void {
    console.log(...this.recolor(yellow(this.format(['🐞️', ...message]))));
  }

  info(message: unknown[]): void {
    console.log(...this.recolor(green(this.format(['✅️', ...message]))));
  }

  warn(message: unknown[]): void {
    console.log(...this.recolor(bgYellow(black(this.format(['🟡', ...message])))));
  }

  error(message: unknown[]): void {
    console.log(...this.recolor(red(this.format(['🚨️', ...message]))));
  }

  fatal(message: unknown[]): void {
    console.log(...this.recolor(bgRed(this.format(['💀', ...message]))));
  }

  all(message: unknown[]): void {
    console.log(...this.recolor(lightCyan(this.format(['📝', ...message]))));
  }

  recolor(formattedMessage: string) {
    if (this._isBrowser) {
      return parse(formattedMessage).asChromeConsoleLogArguments;
    }

    return [formattedMessage];
  }
}
