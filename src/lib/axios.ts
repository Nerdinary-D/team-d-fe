import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getOrCreateClientUuid } from './uuid';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipOwnerUuidInjection?: boolean;
  }
}

/**
 * 서버 공통 응답 envelope.
 * 인터셉터에서 `result`만 떼서 `response.data`로 돌려주므로,
 * 호출부에서는 `api.get<T>` 의 `T`에 곧바로 `result` 타입을 넣으면 된다.
 */
export type ApiEnvelope<T> = {
  success: boolean;
  code: string;
  message: string;
  result: T;
};

export class ApiError extends Error {
  code: string;
  status?: number;

  constructor(code: string, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

function isEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    'result' in value
  );
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

const BODY_METHODS = new Set(['post', 'put', 'patch']);

/**
 * 모든 body 가 있는 요청(POST/PUT/PATCH)에 client uuid 를 자동 첨부.
 * uuid 는 localStorage 에서 읽고, 없으면 그 자리에서 생성해 저장한다.
 * 호출부에서 명시적으로 `uuid` 를 넣은 경우 그 값을 우선한다.
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method?.toLowerCase();
  if (!method || !BODY_METHODS.has(method)) return config;
  if (config.skipOwnerUuidInjection) return config;

  const uuid = getOrCreateClientUuid();
  if (!uuid) return config;

  const current = config.data;

  if (current == null) {
    config.data = { uuid };
  } else if (
    typeof current === 'object' &&
    !Array.isArray(current) &&
    !(typeof FormData !== 'undefined' && current instanceof FormData) &&
    !(typeof Blob !== 'undefined' && current instanceof Blob)
  ) {
    config.data = { uuid, ...current };
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    const body: unknown = response.data;

    if (!isEnvelope(body)) {
      return response;
    }

    if (!body.success) {
      throw new ApiError(body.code, body.message, response.status);
    }

    response.data = body.result;
    return response;
  },
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    const envelope = error.response?.data;

    if (isEnvelope(envelope)) {
      throw new ApiError(
        envelope.code,
        envelope.message,
        error.response?.status,
      );
    }

    throw error;
  },
);
