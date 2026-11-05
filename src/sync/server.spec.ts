// The registration calls must match version 1 exactly: the service and the existing accounts depend on them.
import { describe, expect, it } from 'vitest';
import { SYNC_SERVER, syncCall, type Fetcher } from './server';

const reply = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

describe('the sync service calls', () => {
  it('uses the same address as version 1', () => {
    expect(SYNC_SERVER).toBe('https://couchdbadmin.dailynomie.com');
  });

  it('posts the email as JSON to /register', async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const fetcher: Fetcher = async (url, init) => {
      calls.push({ url, init });
      return reply({ message: 'Registered' });
    };
    const message = await syncCall('register', 'me@example.com', fetcher);
    expect(message).toBe('Registered');
    expect(calls[0].url).toBe('https://couchdbadmin.dailynomie.com/register');
    expect(calls[0].init.method).toBe('POST');
    expect(calls[0].init.body).toBe('{"email":"me@example.com"}');
    expect(calls[0].init.headers).toEqual({ 'Content-type': 'application/json; charset=UTF-8' });
  });

  it('posts the email to /unregister for an opt out', async () => {
    let url = '';
    await syncCall('unregister', 'me@example.com', async (u) => {
      url = u;
      return reply({ message: 'Unregistered' });
    });
    expect(url).toBe('https://couchdbadmin.dailynomie.com/unregister');
  });

  it('throws when the reply has no message', async () => {
    await expect(syncCall('register', 'a@b.c', async () => reply({ error: true }))).rejects.toThrow();
  });

  it('throws when the service cannot be reached', async () => {
    await expect(
      syncCall('register', 'a@b.c', async () => {
        throw new TypeError('Failed to fetch');
      })
    ).rejects.toThrow();
  });
});
