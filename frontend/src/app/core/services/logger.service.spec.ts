import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new LoggerService();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('error() should call console.error with context and error', () => {
    const err = new Error('boom');
    service.error('TestContext', err);
    expect(consoleErrorSpy).toHaveBeenCalledWith('[TestContext]', err);
  });

  it('warn() should call console.warn with formatted message', () => {
    service.warn('TestContext', 'something odd');
    expect(consoleWarnSpy).toHaveBeenCalledWith('[TestContext] something odd');
  });
});
