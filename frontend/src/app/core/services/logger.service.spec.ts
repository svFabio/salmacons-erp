import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    service = new LoggerService();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
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
