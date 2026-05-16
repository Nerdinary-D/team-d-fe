import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const textStyles = [
  { name: 'Header 1', className: 'text-header1', sample: '스포츠 매치 허브' },
  { name: 'Header 2', className: 'text-header2', sample: '오늘의 경기' },
  {
    name: 'Subtitle 1',
    className: 'text-subtitle1',
    sample: '실시간 경기 상태',
  },
  { name: 'Subtitle 2', className: 'text-subtitle2', sample: '팀 라인업' },
  {
    name: 'Body 1',
    className: 'text-body1',
    sample: '경기 일정과 상태를 확인합니다.',
  },
  {
    name: 'Body 2',
    className: 'text-body2',
    sample: '최근 업데이트 기준으로 표시됩니다.',
  },
  { name: 'Caption', className: 'text-caption', sample: '2026.05.16 19:00' },
];

const meta = {
  title: 'Foundations/Typography',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => {
    const rows = textStyles.map((style) => (
      <div
        key={style.name}
        className="grid gap-2 border-b py-4 last:border-b-0 md:grid-cols-[160px_1fr]"
      >
        <div>
          <p className="text-body2 text-foreground">{style.name}</p>
          <p className="font-mono text-caption text-muted-foreground">
            .{style.className}
          </p>
        </div>
        <p className={style.className}>{style.sample}</p>
      </div>
    ));

    return (
      <div className="max-w-3xl rounded-xl border bg-card px-4">{rows}</div>
    );
  },
};
