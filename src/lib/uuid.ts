const CLIENT_UUID_STORAGE_KEY = 'client-uuid';
const LEGACY_OWNER_UUID_STORAGE_KEY = 'owner-uuid';

export const CLIENT_UUID_CHANGE_EVENT = 'client-uuid:change';

/** @deprecated Use CLIENT_UUID_CHANGE_EVENT instead. */
export const OWNER_UUID_CHANGE_EVENT = CLIENT_UUID_CHANGE_EVENT;

/**
 * v4 UUID 생성.
 * 최신 브라우저/Node 18+ 에서는 `crypto.randomUUID()` 를 그대로 사용하고,
 * 폴리필이 필요한 환경을 위한 fallback 도 함께 제공한다.
 */
export function generateUuid(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function'
  ) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(
    '',
  );
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function dispatchClientUuidChange() {
  window.dispatchEvent(new Event(CLIENT_UUID_CHANGE_EVENT));
}

/** localStorage 에 저장된 앱 전역 client uuid 조회. 없으면 null. */
export function getClientUuid(): string | null {
  if (!isBrowser()) return null;
  try {
    const current = window.localStorage.getItem(CLIENT_UUID_STORAGE_KEY);
    if (current) return current;

    const legacyOwnerUuid = window.localStorage.getItem(
      LEGACY_OWNER_UUID_STORAGE_KEY,
    );
    if (!legacyOwnerUuid) return null;

    window.localStorage.setItem(CLIENT_UUID_STORAGE_KEY, legacyOwnerUuid);
    window.localStorage.removeItem(LEGACY_OWNER_UUID_STORAGE_KEY);

    return legacyOwnerUuid;
  } catch {
    return null;
  }
}

/** client uuid 를 localStorage 에 저장. 같은 탭 구독자에게 변경 이벤트도 발행. */
export function setClientUuid(uuid: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(CLIENT_UUID_STORAGE_KEY, uuid);
    window.localStorage.removeItem(LEGACY_OWNER_UUID_STORAGE_KEY);
    dispatchClientUuidChange();
  } catch {
    // storage quota / private mode 등은 무시
  }
}

/**
 * 저장된 client uuid 가 없으면 새로 생성해서 저장한 뒤 반환.
 * 서버 환경에서는 빈 문자열을 돌려준다 (인터셉터에서 호출되더라도 SSR 충돌 없음).
 */
export function getOrCreateClientUuid(): string {
  if (!isBrowser()) return '';
  const existing = getClientUuid();
  if (existing) return existing;
  const fresh = generateUuid();
  setClientUuid(fresh);
  return fresh;
}

/** client uuid 삭제 (로그아웃). 같은 탭 구독자에게 변경 이벤트도 발행. */
export function clearClientUuid(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(CLIENT_UUID_STORAGE_KEY);
    window.localStorage.removeItem(LEGACY_OWNER_UUID_STORAGE_KEY);
    dispatchClientUuidChange();
  } catch {
    // ignore
  }
}

/** @deprecated Use getClientUuid instead. */
export const getOwnerUuid = getClientUuid;

/** @deprecated Use setClientUuid instead. */
export const setOwnerUuid = setClientUuid;

/** @deprecated Use getOrCreateClientUuid instead. */
export const getOrCreateOwnerUuid = getOrCreateClientUuid;

/** @deprecated Use clearClientUuid instead. */
export const clearOwnerUuid = clearClientUuid;
