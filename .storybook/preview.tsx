import type { Preview } from '@storybook/nextjs-vite';
import { StorybookProvider } from './storybook-provider';
import '../src/app/globals.css';
import './preview.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <StorybookProvider>
        <Story />
      </StorybookProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
