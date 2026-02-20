export interface ApiKeyRecord {
  id: string;
  name: string;
  key: string;
  secret: string;
  createdAt: string;
  revoked: boolean;
}

export interface ApiKeyPublic extends Omit<ApiKeyRecord, 'secret'> {
  secret: string; // masked as hss_****...
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function generateApiKey(): string {
  return `hsk_live_${randomHex(16)}`; // 32 hex chars
}

export function generateClientSecret(): string {
  return `hss_${randomHex(24)}`; // 48 hex chars
}

export async function createKey(
  kv: KVNamespace,
  name: string
): Promise<ApiKeyRecord> {
  const id = randomHex(8);
  const record: ApiKeyRecord = {
    id,
    name,
    key: generateApiKey(),
    secret: generateClientSecret(),
    createdAt: new Date().toISOString(),
    revoked: false,
  };

  // Store the key record
  await kv.put(`key:${id}`, JSON.stringify(record));

  // Update the index
  const indexRaw = await kv.get('keys:index');
  const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];
  index.push(id);
  await kv.put('keys:index', JSON.stringify(index));

  return record;
}

export async function listKeys(kv: KVNamespace): Promise<ApiKeyPublic[]> {
  const indexRaw = await kv.get('keys:index');
  if (!indexRaw) return [];

  const index: string[] = JSON.parse(indexRaw);
  const records: ApiKeyPublic[] = [];

  for (const id of index) {
    const raw = await kv.get(`key:${id}`);
    if (!raw) continue;
    const record: ApiKeyRecord = JSON.parse(raw);
    if (record.revoked) continue;
    records.push({
      ...record,
      secret: `hss_${'*'.repeat(12)}`,
    });
  }

  return records.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function revokeKey(kv: KVNamespace, id: string): Promise<void> {
  const raw = await kv.get(`key:${id}`);
  if (!raw) return;
  const record: ApiKeyRecord = JSON.parse(raw);
  record.revoked = true;
  await kv.put(`key:${id}`, JSON.stringify(record));
}
