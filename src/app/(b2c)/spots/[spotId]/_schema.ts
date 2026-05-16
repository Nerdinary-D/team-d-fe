import { z } from 'zod';

// ──────────────────────────────────────────────
// Spot
// ──────────────────────────────────────────────

export const SpotSchema = z.object({
  id: z.string(),
  name: z.string(),
  sport: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string(),
  infraList: z.array(z.string()),
});

export type Spot = z.infer<typeof SpotSchema>;

// ──────────────────────────────────────────────
// PartnerPost
// ──────────────────────────────────────────────

export const PartnerPostSchema = z.object({
  id: z.string(),
  spotId: z.string(),
  title: z.string(),
  content: z.string(),
  schedule: z.string(),
  openChatUrl: z.string(),
  createdAt: z.string(),
});

export type PartnerPost = z.infer<typeof PartnerPostSchema>;

export const CreatePartnerPostInputSchema = z.object({
  spotId: z.string(),
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(50, '50자 이내로 작성해주세요'),
  schedule: z.string().min(1, '일정을 입력해주세요'),
  content: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(500, '500자 이내로 작성해주세요'),
  openChatUrl: z
    .url('올바른 URL을 입력해주세요')
    .refine(
      (url) => url.startsWith('https://open.kakao.com/'),
      '오픈카톡 URL(https://open.kakao.com/...)을 입력해주세요',
    ),
});

export type CreatePartnerPostInput = z.infer<
  typeof CreatePartnerPostInputSchema
>;
