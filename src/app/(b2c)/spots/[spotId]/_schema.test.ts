import { describe, expect, it } from 'vitest';
import { CreatePartnerPostInputSchema } from './_schema';

const validInput = {
  spotId: '1',
  title: '함께 풋살하실 분 구합니다',
  schedule: '매주 월요일 / 6시',
  content: '초보 환영, 매주 1회 풋살 모임입니다.',
  openChatUrl: 'https://open.kakao.com/o/example1',
};

describe('CreatePartnerPostInputSchema', () => {
  it('유효한 입력이면 통과한다', () => {
    expect(CreatePartnerPostInputSchema.safeParse(validInput).success).toBe(
      true,
    );
  });

  it('title이 비었으면 실패한다', () => {
    const result = CreatePartnerPostInputSchema.safeParse({
      ...validInput,
      title: '',
    });
    expect(result.success).toBe(false);
  });

  it('title이 50자를 초과하면 실패한다', () => {
    const result = CreatePartnerPostInputSchema.safeParse({
      ...validInput,
      title: 'a'.repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it('schedule이 비었으면 실패한다', () => {
    const result = CreatePartnerPostInputSchema.safeParse({
      ...validInput,
      schedule: '',
    });
    expect(result.success).toBe(false);
  });

  it('content가 500자를 초과하면 실패한다', () => {
    const result = CreatePartnerPostInputSchema.safeParse({
      ...validInput,
      content: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it('openChatUrl이 잘못된 URL이면 실패한다', () => {
    const result = CreatePartnerPostInputSchema.safeParse({
      ...validInput,
      openChatUrl: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('openChatUrl이 카카오톡 도메인이 아니면 실패한다', () => {
    const result = CreatePartnerPostInputSchema.safeParse({
      ...validInput,
      openChatUrl: 'https://example.com/o/abc',
    });
    expect(result.success).toBe(false);
  });

  it('openChatUrl이 https://open.kakao.com/ 으로 시작하면 통과한다', () => {
    const result = CreatePartnerPostInputSchema.safeParse({
      ...validInput,
      openChatUrl: 'https://open.kakao.com/o/abc123',
    });
    expect(result.success).toBe(true);
  });
});
