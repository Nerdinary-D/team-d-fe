import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearClientUuid,
  getClientUuid,
  getOrCreateClientUuid,
  setClientUuid,
} from './uuid';

let storedItems: Record<string, string>;

describe('client uuid storage', () => {
  beforeEach(() => {
    storedItems = {};
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: vi.fn((key: string) => storedItems[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          storedItems[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete storedItems[key];
        }),
      },
    });
  });

  it('client-uuid를 앱 전역 식별자로 저장하고 읽는다', () => {
    setClientUuid('client-id');

    expect(window.localStorage.getItem('client-uuid')).toBe('client-id');
    expect(getClientUuid()).toBe('client-id');
  });

  it('기존 owner-uuid 저장값은 client-uuid로 마이그레이션한다', () => {
    window.localStorage.setItem('owner-uuid', 'legacy-id');

    expect(getClientUuid()).toBe('legacy-id');
    expect(window.localStorage.getItem('client-uuid')).toBe('legacy-id');
    expect(window.localStorage.getItem('owner-uuid')).toBeNull();
  });

  it('새 식별자를 만들 때도 client-uuid 키만 사용한다', () => {
    const uuid = getOrCreateClientUuid();

    expect(uuid).toEqual(expect.any(String));
    expect(window.localStorage.getItem('client-uuid')).toBe(uuid);
    expect(window.localStorage.getItem('owner-uuid')).toBeNull();
  });

  it('식별자를 지울 때 기존 owner-uuid도 함께 지운다', () => {
    window.localStorage.setItem('client-uuid', 'client-id');
    window.localStorage.setItem('owner-uuid', 'legacy-id');

    clearClientUuid();

    expect(window.localStorage.getItem('client-uuid')).toBeNull();
    expect(window.localStorage.getItem('owner-uuid')).toBeNull();
  });
});
