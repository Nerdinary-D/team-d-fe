import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthGuard } from './AuthGuard';

const replace = vi.fn();
let pathname = '/my';
let storedItems: Record<string, string>;

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ replace }),
}));

describe('AuthGuard', () => {
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
        clear: vi.fn(() => {
          storedItems = {};
        }),
      },
    });
    replace.mockClear();
    pathname = '/my';
  });

  it('저장된 owner uuid가 있으면 보호된 페이지를 렌더링한다', async () => {
    window.localStorage.setItem(
      'owner-uuid',
      'a33c6f0b-33a7-46ed-b75d-77637f338424',
    );

    render(
      <AuthGuard>
        <p>protected content</p>
      </AuthGuard>,
    );

    expect(await screen.findByText('protected content')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('저장된 owner uuid가 없으면 splash로 이동한다', async () => {
    render(
      <AuthGuard>
        <p>protected content</p>
      </AuthGuard>,
    );

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/splash');
    });
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('splash 페이지는 owner uuid 없이도 렌더링한다', async () => {
    pathname = '/splash';

    render(
      <AuthGuard>
        <p>splash content</p>
      </AuthGuard>,
    );

    expect(await screen.findByText('splash content')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
