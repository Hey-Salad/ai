import { describe, it, expect } from 'vitest';
import { loader } from './api.v1._index';

describe('API v1 Index Route', () => {
  it('should return API information', async () => {
    const request = new Request('http://localhost/api/v1');
    const response = await loader({ request, params: {}, context: {} });

    const data = await response.json();

    expect(data).toHaveProperty('name', '@heysalad/ai');
    expect(data).toHaveProperty('version', '0.1.0');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('endpoints');
    expect(data).toHaveProperty('providers');
  });

  it('should list all available endpoints', async () => {
    const request = new Request('http://localhost/api/v1');
    const response = await loader({ request, params: {}, context: {} });
    const data = await response.json();

    expect(data.endpoints).toHaveProperty('chat');
    expect(data.endpoints).toHaveProperty('stream');
    expect(data.endpoints).toHaveProperty('models');
    expect(data.endpoints).toHaveProperty('actions');
    expect(data.endpoints).toHaveProperty('verify');
  });

  it('should list all supported providers', async () => {
    const request = new Request('http://localhost/api/v1');
    const response = await loader({ request, params: {}, context: {} });
    const data = await response.json();

    expect(data.providers).toBeInstanceOf(Array);
    expect(data.providers).toContain('openai');
    expect(data.providers).toContain('anthropic');
    expect(data.providers.length).toBeGreaterThan(0);
  });

  it('should include documentation links', async () => {
    const request = new Request('http://localhost/api/v1');
    const response = await loader({ request, params: {}, context: {} });
    const data = await response.json();

    expect(data).toHaveProperty('documentation');
    expect(data).toHaveProperty('github');
    expect(data).toHaveProperty('npm');
  });
});
