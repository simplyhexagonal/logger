import Logger from '../src';
import { LoggerTransportName, LoggerTransportResult, LogLevels } from '../src/interfaces';
import { errorString } from '../src/transports/undefined';

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
    expect(transportInstanceUids.length).toBe(5);
    expect(transportInstanceUidsUnique.length).toBe(2);
  });

  /**
   * By default Logger will ship with the Console transport.
   */
  it('should log to console', async () => {
    const logger = new Logger({logLevel: LogLevels.INFO});

    const result = await logger.warn('Hello logger', 1, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
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
      },
      singleton: false,
    });

    const result = await logger.all('Hello logger', 3, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
    expect(result[0].channelName).toBe('-');
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
      },
      singleton:false,
    });

    let results = await logger.debug('Hello logger', 14, 'app', { simply: 'hexagonal' });

    expect(results.length).toBe(3);
    expect((results[0] as LoggerTransportResult).channelName).toBe('mongo');
    expect((results[1] as LoggerTransportResult).channelName).toBe('mssql');

    results = await logger.channel('mssql').debug('Hello logger', 15, 'app', { simply: 'hexagonal' });

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
            destination:
              'https://discord.com/api/webhooks/50M37HIN9/B09U5',
          },
        },
      ],
      debug: [],
      error: [],
      fatal: [],
      all: [],
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

    let result = await logger1.info('Hello logger', 16, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
    expect((result[0].result as any).error).toBeDefined();

    await logger2.info('Hello logger', 17, 'app', { simply: 'hexagonal' }).catch(
      (e) => expect(e.message).toMatch(
        errorString.replace('TRANSPORT_NAME', LoggerTransportName.DISCORD)
      )
    );

    result = await logger3.info('Hello logger', 18, 'app', { simply: 'hexagonal' });

    expect(result.length).toBe(1);
    expect((result[0].result as any).error).toBeDefined();
  });
});
