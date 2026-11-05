// The DailyNomie Sync Service's registration calls. The address, the request and the reply are the ones version 1 of
// this plugin used, so the service and the accounts that already exist keep working.
export const SYNC_SERVER = 'https://couchdbadmin.dailynomie.com';

export type SyncAction = 'register' | 'unregister';
export type Fetcher = (url: string, init: RequestInit) => Promise<Response>;

// Sends the email address to the service and returns the message it replies with. Throws when the service cannot be
// reached or does not reply with a message.
export const syncCall = async (action: SyncAction, email: string, fetcher: Fetcher = (url, init) => fetch(url, init)): Promise<string> => {
  const response = await fetcher(`${SYNC_SERVER}/${action}`, {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: { 'Content-type': 'application/json; charset=UTF-8' },
  });
  const json = (await response.json()) as { message?: unknown };
  if (typeof json.message !== 'string') throw new Error('The sync service sent no message');
  return json.message;
};
