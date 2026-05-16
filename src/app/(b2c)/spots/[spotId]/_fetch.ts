import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addMockPartnerPost,
  generateMockPostId,
  getMockPartnerPosts,
  getMockSpot,
} from "./_mock";
import type {
  CreatePartnerPostInput,
  PartnerPost,
  Spot,
} from "./_schema";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type { Spot, PartnerPost, CreatePartnerPostInput };

// ──────────────────────────────────────────────
// HTTP calls — FIXME: MOCK, axios로 교체
// ──────────────────────────────────────────────

function mockDelay() {
  return new Promise<void>((resolve) => setTimeout(resolve, 200));
}

async function fetchSpot(spotId: string): Promise<Spot> {
  await mockDelay();
  return getMockSpot(spotId);
}

async function fetchPartnerPosts(spotId: string): Promise<PartnerPost[]> {
  await mockDelay();
  return getMockPartnerPosts(spotId);
}

async function postPartnerPost(
  input: CreatePartnerPostInput,
): Promise<PartnerPost> {
  await mockDelay();
  const created: PartnerPost = {
    id: generateMockPostId(),
    spotId: input.spotId,
    title: input.title,
    content: input.content,
    schedule: input.schedule,
    openChatUrl: input.openChatUrl,
    createdAt: new Date().toISOString(),
  };
  addMockPartnerPost(created);
  return created;
}

// ──────────────────────────────────────────────
// queryOptions
// ──────────────────────────────────────────────

export const spotQuery = (spotId: string) =>
  queryOptions({
    queryKey: ["spots", "detail", spotId] as const,
    queryFn: () => fetchSpot(spotId),
    enabled: Boolean(spotId),
  });

export const partnerPostsQuery = (spotId: string) =>
  queryOptions({
    queryKey: ["spots", spotId, "partner-posts"] as const,
    queryFn: () => fetchPartnerPosts(spotId),
    enabled: Boolean(spotId),
  });

// ──────────────────────────────────────────────
// Mutation hooks
// ──────────────────────────────────────────────

export function useCreatePartnerPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postPartnerPost,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: partnerPostsQuery(variables.spotId).queryKey,
      });
    },
  });
}
