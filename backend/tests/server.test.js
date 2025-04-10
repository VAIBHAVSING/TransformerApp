// Basic test to ensure testing framework is working
describe('Server Environment', () => {
  test('basic assertion', () => {
    expect(true).toBe(true);
  });

  test('environment variables can be loaded', () => {
    // This test will still pass even if process.env.NODE_ENV is undefined
    const nodeEnv = process.env.NODE_ENV || 'development';
    expect(typeof nodeEnv).toBe('string');
  });
});