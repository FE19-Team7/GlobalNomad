import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import CalendarBadge from './CalendarBadge';

const meta: Meta<typeof CalendarBadge> = {
  title: 'Components/CalendarBadge',
  component: CalendarBadge,
};
export default meta;
type Story = StoryObj<typeof CalendarBadge>;

export const Default: Story = {
  args: {
    dateLabel: 1,
    dot: { visible: true, color: '#ff2727', offset: { top: 6, right: 6 } },
    statuses: [
      { key: 'reserve', label: '예약', count: 1, variant: 'primary' },
      { key: 'approve', label: '승인', count: 1, variant: 'warning' },
      { key: 'done', label: '완료', count: 1, variant: 'muted' },
    ],
    size: 'md',
  },
};