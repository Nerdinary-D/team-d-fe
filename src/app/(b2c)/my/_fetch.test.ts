import { describe, expect, it } from 'vitest';
import { likesMeItemToFavoriteFacility } from './_fetch';

describe('likesMeItemToFavoriteFacility', () => {
  it('likes/me 응답 아이템을 FacilityCard 데이터로 변환한다', () => {
    expect(
      likesMeItemToFavoriteFacility({
        uuid: 'facility-uuid-1',
        image: '/facility.png',
        name: '서울 배드민턴장',
        category: 'BADMINTON',
        hashTags: ['NO_STEP_COURT_ENTRY', 'BRAILLE_INFRASTRUCTURE'],
        isLiked: true,
      }),
    ).toEqual({
      id: 'facility-uuid-1',
      name: '서울 배드민턴장',
      sportName: '배드민턴',
      imageSrc: '/facility.png',
      imageAlt: '서울 배드민턴장 이미지',
      badges: ['courtAccess', 'brailleGuide'],
      isFavorite: true,
    });
  });

  it('알 수 없는 category와 hashTag를 안전하게 처리한다', () => {
    expect(
      likesMeItemToFavoriteFacility({
        uuid: 'facility-uuid-2',
        image: '',
        name: '새 종목 시설',
        category: 'NEW_SPORT',
        hashTags: ['UNKNOWN_HASH_TAG'],
        isLiked: false,
      }),
    ).toEqual({
      id: 'facility-uuid-2',
      name: '새 종목 시설',
      sportName: 'NEW_SPORT',
      imageSrc: '/images/home/facility-placeholder.svg',
      imageAlt: '새 종목 시설 이미지',
      badges: [],
      isFavorite: false,
    });
  });
});
