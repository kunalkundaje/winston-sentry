const SentryTransport = require('../index');

const getMockSentry = () => {
  const mockScope = {
    setLevel: jest.fn(),
    setExtra: jest.fn(),
  };

  return {
    mockScope,
    withScope: jest.fn(cb => {
      cb(mockScope);
    }),
    captureMessage: jest.fn(),
    close: jest.fn(() => Promise.resolve(true)),
  }
}

test('instantiates', () => {
  const Sentry = getMockSentry();
  const Transport = new SentryTransport({ Sentry });

  expect(Transport._sentry).toBe(Sentry);
  expect(Transport._close).toBe(undefined);
});

test('log calls sentry functions', () => {
  const Sentry = getMockSentry();
  const Transport = new SentryTransport({ Sentry });

  const cb = jest.fn();
  Transport.log({ level: 'error', message: 'message' }, cb);

  expect(cb).toHaveBeenCalledWith(null, true);
  expect(Sentry.mockScope.setLevel).toHaveBeenCalledWith('error')
  expect(Sentry.mockScope.setExtra).toHaveBeenCalledWith('context', {});
  expect(Sentry.captureMessage).toHaveBeenCalledWith('message');
  expect(Sentry.close).not.toHaveBeenCalled();
});

test('instantiates with close and calls sentry functions', () => {
  const Sentry = getMockSentry();
  const Transport = new SentryTransport({ Sentry, close: true });

  expect(Transport._sentry).toBe(Sentry);
  expect(Transport._close).toBe(true);

  const cb = jest.fn();
  Transport.log({ level: 'error', message: 'message' }, cb);
  expect(Sentry.close).toHaveBeenCalled();
});
