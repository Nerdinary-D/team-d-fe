import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SplashView } from './SplashView';

const replace = vi.hoisted(() => vi.fn());
const mutate = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace,
  }),
}));

vi.mock('../_fetch', () => ({
  useLoginCustomer: () => ({
    mutate,
  }),
}));

let storedItems: Record<string, string>;

describe('SplashView', () => {
  beforeEach(() => {
    vi.useFakeTimers();
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
        clear: vi.fn(() => {
          storedItems = {};
        }),
      },
    });
    replace.mockClear();
    mutate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('스플래시를 2초 보여준 뒤 온보딩으로 이동한다', () => {
    render(<SplashView />);

    act(() => {
      vi.advanceTimersByTime(1999);
    });

    expect(replace).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(replace).toHaveBeenCalledWith('/onboarding');
  });

  it('이미 가입된 사용자는 스플래시를 2초 보여준 뒤 홈으로 이동한다', () => {
    window.localStorage.setItem('client-uuid', 'client-uuid-1');

    render(<SplashView />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(replace).toHaveBeenCalledWith('/');
    expect(mutate).not.toHaveBeenCalled();
  });
});
