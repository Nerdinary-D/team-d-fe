'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
} from '@/components/common/BottomSheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/common/Form';
import { Input } from '@/components/common/Input';
import { toast } from '@/components/common/Toast';
import { cn } from '@/lib/utils';
import { useCreatePartnerPost } from '../_fetch';
import { CreatePartnerPostInputSchema } from '../_schema';

const FormSchema = CreatePartnerPostInputSchema.omit({ spotId: true });
type FormValues = z.infer<typeof FormSchema>;

const DEFAULT_VALUES: FormValues = {
  title: '',
  schedule: '',
  content: '',
  openChatUrl: '',
};

const labelClass = 'text-body2 text-gray-500';
const inputClass =
  'h-auto rounded-[10px] border-gray-400 px-4 py-[15px] text-subtitle2 placeholder:text-gray-400';
const textareaClass = cn(
  'w-full min-w-0 rounded-[10px] border border-gray-400 px-4 py-[15px] text-subtitle2 outline-none transition-colors placeholder:text-gray-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
);

export type PartnerPostFormDialogProps = {
  spotId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PartnerPostFormDialog({
  spotId,
  open,
  onOpenChange,
}: PartnerPostFormDialogProps) {
  const mutation = useCreatePartnerPost();

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(FormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset(DEFAULT_VALUES);
    onOpenChange(next);
  };

  const handleSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      { ...values, spotId },
      {
        onSuccess: () => {
          toast.success('모집글이 등록되었습니다');
          form.reset(DEFAULT_VALUES);
          onOpenChange(false);
        },
        onError: () => {
          toast.error('등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
        },
      },
    );
  });

  const titleField = (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className={labelClass}>제목</FormLabel>
          <FormControl>
            <Input
              placeholder="예: 이번주 주말 같이 탁구치실 분!"
              maxLength={50}
              className={inputClass}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const scheduleField = (
    <FormField
      control={form.control}
      name="schedule"
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className={labelClass}>날짜/시간</FormLabel>
          <FormControl>
            <Input
              placeholder="예: 매주 월요일 오후 6시"
              className={inputClass}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const contentField = (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className={labelClass}>모집 내용</FormLabel>
          <FormControl>
            <textarea
              placeholder="모집내용을 자유롭게 입력해보세요."
              rows={5}
              maxLength={500}
              {...field}
              className={textareaClass}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const openChatField = (
    <FormField
      control={form.control}
      name="openChatUrl"
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <FormLabel className={labelClass}>오픈 카카오톡 링크</FormLabel>
          <FormControl>
            <Input
              placeholder="링크를 입력해주세요."
              inputMode="url"
              autoComplete="off"
              className={inputClass}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const submitButton = (
    <Button
      type="submit"
      loading={mutation.isPending}
      className="h-[50px] rounded-[40px] bg-main text-white"
      fullWidth
    >
      등록하기
    </Button>
  );

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange}>
      <BottomSheetContent className="gap-[30px] px-4 pt-5 pb-5">
        <BottomSheetHeader>
          <BottomSheetTitle>모집글 등록하기</BottomSheetTitle>
        </BottomSheetHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-5">
              {titleField}
              {scheduleField}
              {contentField}
              {openChatField}
            </div>
            {submitButton}
          </form>
        </Form>
      </BottomSheetContent>
    </BottomSheet>
  );
}
