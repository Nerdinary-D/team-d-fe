import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const colorGroups = [
  {
    title: 'Brand',
    colors: [
      { name: 'Main', className: 'bg-main', token: '--color-main' },
      { name: 'Sub', className: 'bg-sub', token: '--color-sub' },
      { name: 'Primary', className: 'bg-primary', token: '--primary' },
      { name: 'Accent', className: 'bg-accent', token: '--accent' },
    ],
  },
  {
    title: 'Surface',
    colors: [
      { name: 'Background', className: 'bg-background', token: '--background' },
      { name: 'Card', className: 'bg-card', token: '--card' },
      { name: 'Popover', className: 'bg-popover', token: '--popover' },
      { name: 'Muted', className: 'bg-muted', token: '--muted' },
    ],
  },
  {
    title: 'System',
    colors: [
      { name: 'Border', className: 'bg-border', token: '--border' },
      { name: 'Input', className: 'bg-input', token: '--input' },
      { name: 'Ring', className: 'bg-ring', token: '--ring' },
      {
        name: 'Destructive',
        className: 'bg-destructive',
        token: '--destructive',
      },
    ],
  },
];

const meta = {
  title: 'Foundations/Colors',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Palette: Story = {
  render: () => {
    const groups = colorGroups.map((group) => {
      const swatches = group.colors.map((color) => (
        <div
          key={color.name}
          className="overflow-hidden rounded-lg border bg-card"
        >
          <div className={`h-16 ${color.className}`} />
          <div className="space-y-1 p-3">
            <p className="text-body2 text-foreground">{color.name}</p>
            <p className="font-mono text-caption text-muted-foreground">
              {color.token}
            </p>
          </div>
        </div>
      ));

      return (
        <section key={group.title} className="space-y-3">
          <h2 className="text-subtitle1 text-foreground">{group.title}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {swatches}
          </div>
        </section>
      );
    });

    return <div className="max-w-4xl space-y-8">{groups}</div>;
  },
};
