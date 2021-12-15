import Logger, {
  LoggerTransportName,
  LoggerTransportOptions,
  LoggerTransportResult,
  LogLevels,
  LoggerTransport,
} from '../src';

import { errorString } from '../src/transports/undefined';

class MockTransport extends LoggerTransport {
  readonly destination: string;

  constructor(options: LoggerTransportOptions['options']) {
    const r = Math.random().toString(36).substring(7);
    super({...options, r});

    this.destination = 'mock';

    if (r !== this._r) {
      return this;
    }
  }

  async error([timestamp, ...message]: unknown[]) {
    console.log(timestamp, 'MOCK:', ...message);

    return {
      destination: this.destination,
      channelName: this.channelName,
    };
  }
}

describe('logger', () => {
  /** 
   * When more than one instance of Logger is generates using `singleton: false`,
   * we have to avoid creating duplicate transports. As such, transports will use
   * their transport name and destination to keep track of the appropriate singleton
   * instances of themselves.
  */
  it('should make sure transports instances are singleton based on destination', () => {
    const logger1 = new Logger({logLevel: LogLevels.INFO});
    const logger2 = new Logger({
      logLevel: LogLevels.INFO,
      optionsByLevel: {
        warn: [
          {
            transport: LoggerTransportName.CONSOLE,
            options: {
              destination:
                'TEST',
            },
          },
        ],
        info: [],
        debug: [],
        error: [],
        fatal: [],
        all: [],
        raw: [],
      },
      singleton: false,
    });

    const transportInstanceUids = Object.entries(
      logger2.transportInstances
    ).reduce(
      (a, [k, v]) => {
        a.push(
          ...(v.reduce((b, c) => {
            b.push(`${c._id}${c._r}`);
            return b;
          }, [] as string[]))
        );
        return a;
      },
      [] as string[],
    );

    const transportInstanceUidsUnique = [
      ...new Set(transportInstanceUids)
    ];

    expect(
      `${logger2.transportInstances.info[0]._id}${logger2.transportInstances.info[0]._r}`
    ).toBe(
      `${logger1.transportInstances.info[0]._id}${logger1.transportInstances.info[0]._r}`
    );
    expect(transportInstanceUids.length).toBe(6);
    expect(transportInstanceUidsUnique.length).toBe(2);
  });

  /**
   * By default Logger will ship with the Console transport.
   */
  it('should log to console', async () => {
    const messages: string[] = [];

    const {log} = console;
    console.log = (...args) => {
      messages.push(args[0] as unknown as string);
      log(...args);
    };

    const logger = new Logger({logLevel: LogLevels.INFO});
    let dateComparison = new Date().toISOString().split('T')[0];

    let result = await logger.warn('Hello logger', 0, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);

    // Raw messages must only contain the formatted message (NO date, NO log level, NO colors)
    result = await logger.raw('Hello logger', 1, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);

    expect(messages.length).toBe(2);
    expect(messages[0].includes(dateComparison)).toBe(true);
    expect(messages[1].includes(dateComparison)).toBe(false);

    console.log = log;
  });

  /**
   * Logging to a level lower than the configured log level should do nothing.
   */
  it('should not log to console', async () => {
    const logger = new Logger({logLevel: LogLevels.INFO});

    const result = await logger.debug('Hello logger', 2, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(0);
  });

  /**
   * Using the `.all` broadcast function should log no matter what, even if
   * there's no transport defined for that log level.
   */
  it('should log to console no matter what', async () => {
    const logger = new Logger({
      logLevel: LogLevels.INFO,
      optionsByLevel: {
        warn: [],
        info: [
          {
            transport: LoggerTransportName.CONSOLE,
            options: {
              destination: 'TEST_ALL1',
              channelName: 'all',
            },
          },
        ],
        debug: [
          {
            transport: LoggerTransportName.CONSOLE,
            options: {
              destination: 'TEST_ALL2',
              channelName: 'all',
            },
          },
        ],
        error: [],
        fatal: [],
        all: [],
        raw: [],
      },
      singleton: false,
    });

    const result = await logger.all('Hello logger', 3, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
    expect(result[0].channelName).toBe(LoggerTransportName.CONSOLE);
  });

  /**
   * Passing options for a transport that is not available is a serious code smell
   * that should be looked at immediately. As such, throwing a human readable error
   * is the best way to help catch the problem.
   */
  it('should throw error for undefined transports', async () => {
    const logger1 = new Logger({
      logLevel: LogLevels.INFO,
      optionsByLevel: {
        warn: [],
        info: [
          {
            transport: LoggerTransportName.DISCORD,
            options: {
              destination:
                'https://discord.com/api/webhooks/50M37HIN9/B09U5',
            },
          },
        ],
        debug: [],
        error: [],
        fatal: [],
        all: [],
        raw: [],
      },
      singleton: false,
    });

    const logger2 = new Logger({
      logLevel: LogLevels.INFO,
      optionsByLevel: {
        warn: [],
        info: [
          {
            transport: 'brain',
            options: {
              destination:
                'neurons',
            },
          },
        ],
        debug: [],
        error: [],
        fatal: [],
        all: [],
        raw: [],
      },
      singleton: false,
    });

    await logger1.info('Hello logger', 4, 'app', { simply: 'hexagonal' }).catch(
      (e) => expect(e.message).toMatch(errorString.replace('TRANSPORT_NAME', LoggerTransportName.DISCORD))
    );

    await logger2.info('Hello logger', 5, 'app', { simply: 'hexagonal' }).catch(
      (e) => expect(e.message).toMatch(errorString.replace('TRANSPORT_NAME', 'brain'))
    );
  });

  /**
   * Log level can be set in code, but it is vital for production environments to
   * be able to override these settings without needing to change code and re-deploy.
   */
  it('should be able to have log level overwritten by env var', async () => {
    process.env.LOG_LEVEL = LogLevels.INFO;
    const logger = new Logger({singleton: false});

    let result = await logger.debug('Hello logger', 6, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(0);

    result = await logger.info('Hello logger', 7, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
  });

  /**
   * Just a sanity check for peace of mind's sake.
   */
  it('should be able to log at every level', async () => {
    process.env.LOG_LEVEL = '';
    const logger = new Logger({
      logLevel: LogLevels.DEBUG,
      singleton: false,
    });

    let result = await logger.debug('Hello logger', 8, 'app', { simply: 'hexagonal' });
    await logger.debug('Trying to teach', 2, 'tooters', {to: 'toot'});

    expect(result.length).toBe(1);

    result = await logger.info('Hello logger', 9, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);

    result = await logger.warn('Hello logger', 10, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);

    result = await logger.error('Hello logger', 11, 'app', new Error('not really an error'));

    expect(result.length).toBe(1);

    result = await logger.fatal('Hello logger', 12, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);

    result = await logger.all('Hello logger', 13, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);

    result = await logger.raw('Hello logger', 14, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
  });

  /**
   * Probably the most useful feature! Being able to send logs to specific channels
   * allows development teams to assign their members monitoring responsibility to
   * only the channels that pertain to their expertise.
   */
  it('should be able to log to specific channels', async () => {
    const logger = new Logger({
      logLevel: LogLevels.DEBUG,
      optionsByLevel: {
        warn: [],
        info: [],
        debug: [
          {
            transport: LoggerTransportName.CONSOLE,
            options: {
              destination: 'TEST1',
              channelName: 'mongo',
            },
          },
          {
            transport: LoggerTransportName.CONSOLE,
            options: {
              destination: 'TEST2',
              channelName: 'mssql',
            },
          },
          {
            transport: LoggerTransportName.CONSOLE,
            options: {
              destination: 'TEST3',
              channelName: 'mssql',
            },
          },
        ],
        error: [],
        fatal: [],
        all: [],
        raw: [],
      },
      singleton:false,
    });

    let results = await logger.debug('Hello logger', 15, 'app', { simply: 'hexagonal' });

    expect(results.length).toBe(3);
    expect((results[0] as LoggerTransportResult).channelName).toBe('mongo');
    expect((results[1] as LoggerTransportResult).channelName).toBe('mssql');

    results = await logger.channel('mssql').debug('Hello logger', 16, 'app', { simply: 'hexagonal' });

    expect(results.length).toBe(2);
    expect((results[0] as LoggerTransportResult).destination).toBe('TEST2');
    expect((results[0] as LoggerTransportResult).channelName).toBe('mssql');
    expect((results[1] as LoggerTransportResult).destination).toBe('TEST3');
    expect((results[1] as LoggerTransportResult).channelName).toBe('mssql');
  });

  /**
   * Transports will fail, and when they do we will want to be able to continue
   * running our apps without them dying due to errors out of our control.
   */
  it('should be able to be configured to never throw a transport error', async () => {
    const optionsByLevel = {
      warn: [],
      info: [
        {
          transport: LoggerTransportName.DISCORD,
          options: {
            destination: 'https://discord.com/api/webhooks/50M37HIN9/B09U5',
          },
        },
      ],
      debug: [],
      error: [],
      fatal: [],
      all: [],
      raw: [],
    };

    const logger1 = new Logger({
      logLevel: LogLevels.INFO,
      optionsByLevel,
      singleton: false,
      catchTransportErrors: true,
    });

    const logger2 = new Logger({
      logLevel: LogLevels.INFO,
      optionsByLevel,
      singleton: false,
    });

    // Again, important to be able to override these mission critical
    // configurations from environment variables
    process.env.LOGGER_CATCH_TRANSPORT_ERRORS = 'TRUE';

    const logger3 = new Logger({
      logLevel: LogLevels.INFO,
      optionsByLevel,
      singleton: false,
      catchTransportErrors: false, // we expect the env var to take precedence
    });

    let result = await logger1.info('Hello logger', 17, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
    expect(result[0].error).toBeDefined();

    await logger2.info('Hello logger', 18, 'app', { simply: 'hexagonal' }).catch(
      (e) => expect(e.message).toMatch(
        errorString.replace('TRANSPORT_NAME', LoggerTransportName.DISCORD)
      )
    );

    result = await logger3.info('Hello logger', 19, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
    expect(result[0].error).toBeDefined();
  });

  it('should be able to be configured to use a custom fallback transport', async () => {
    const optionsByLevel = {
      warn: [],
      info: [],
      debug: [
        {
          transport: LoggerTransportName.DISCORD,
          options: {
            destination: 'https://discord.com/api/webhooks/F411B4CK/B09U5',
          },
        },
      ],
      error: [],
      fatal: [],
      all: [],
      raw: [],
    };

    const logger1 = new Logger({
      logLevel: LogLevels.DEBUG,
      optionsByLevel: optionsByLevel,
      singleton: false,
      catchTransportErrors: true,
      fallbackTransport: MockTransport,
    });

    const logger2 = new Logger({
      logLevel: LogLevels.DEBUG,
      optionsByLevel: optionsByLevel,
      singleton: false,
      catchTransportErrors: true,
    });

    let result = await logger1.debug('Hello logger', 20, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
    expect(result[0].error).toBeDefined();
    expect((result[0] as LoggerTransportResult).destination).toBe('mock');

    result = await logger2.debug('Hello logger', 21, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
    expect(result[0].error).toBeDefined();
    expect((result[0].result as any).destination).not.toBe('mock');
  });

  it('should be able to be configured with app identifiers', async () => {
    const messages: string[] = [];

    const {log} = console;
    console.log = (...args) => {
      messages.push(args[0] as unknown as string);
      log(...args);
    };

    const logger0 = new Logger({
      singleton: false,
    });

    const logger1 = new Logger({
      singleton: false,
      appIdentifiers: {
        clusterType: 'TEST',
      },
    });

    const logger2 = new Logger({
      singleton: false,
      appIdentifiers: {
        clusterType: 'TEST',
        app: 'logger',
      },
    });

    const logger3 = new Logger({
      singleton: false,
      appIdentifiers: {
        region: 'local',
        clusterType: 'TEST',
        cluster: 'jest',
        hostname: 'simplyhexagonal',
        ip: '0.0.0.0',
        app: 'logger',
      },
    });

    await logger0.all('1');
    await logger1.warn('2');
    await logger2.info('3');
    await logger3.debug('4');

    // no expectationRegex0 as logger0 has no appIdentifiers
    const expectationRegex1 = /\[TEST\]/;
    const expectationRegex2 = /\[TEST > logger\]/;
    const expectationRegex3 = /\[local > TEST > jest > simplyhexagonal > 0.0.0.0 > logger\]/;

    expect(
      expectationRegex1.test(messages[0])
      || expectationRegex2.test(messages[0])
      || expectationRegex3.test(messages[0])
    ).toBe(false);

    expect(expectationRegex1.test(messages[1])).toBe(true);
    expect(
      expectationRegex2.test(messages[1])
      || expectationRegex3.test(messages[1])
    ).toBe(false);
    expect(expectationRegex2.test(messages[2])).toBe(true);
    expect(
      expectationRegex1.test(messages[2])
      || expectationRegex3.test(messages[2])
    ).toBe(false);
    expect(expectationRegex3.test(messages[3])).toBe(true);
    expect(
      expectationRegex1.test(messages[3])
      || expectationRegex2.test(messages[3])
    ).toBe(false);

    console.log = log;
  });
});
