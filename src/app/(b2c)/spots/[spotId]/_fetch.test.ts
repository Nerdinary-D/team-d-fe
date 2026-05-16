import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { spotQuery } from './_fetch';

const apiGet = vi.hoisted(() => vi.fn());

vi.mock('@/lib/axios', () => ({
  api: { get: apiGet },
}));

function createFacilityResponse(id = 42) {
  return {
    data: {
      id,
      name: '강남 스포츠 센터',
      category: 'BADMINTON',
      image: 'https://image.com/facility/42.png',
      region: 'SEOUL',
      curations: ['NO_STEP_COURT_ENTRY'],
      address: {
        sido: '서울',
        sigungu: '강남구',
        roadAddress: '테헤란로 1',
        detailAddress: '2층',
        latitude: '37.5',
        longitude: '127.0',
      },
    },
  };
}

describe('spotQuery', () => {
  beforeEach(() => {
    apiGet.mockReset();
    apiGet.mockResolvedValue(createFacilityResponse());
  });

  it('라우트 spotId를 시설 상세 API facilityId로 사용한다', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const spot = await queryClient.fetchQuery(spotQuery('42'));

    expect(apiGet).toHaveBeenCalledWith('/api/v1/facilities/42');
    expect(spot).toMatchObject({
      id: '42',
      name: '강남 스포츠 센터',
      sport: '배드민턴',
    });
  });

  it('숫자가 아닌 spotId면 시설 상세 API를 호출하지 않는다', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    await expect(queryClient.fetchQuery(spotQuery('invalid'))).rejects.toThrow(
      '유효하지 않은 시설 ID입니다.',
    );
    expect(apiGet).not.toHaveBeenCalled();
  });
});
