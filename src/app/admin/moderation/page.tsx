import type { Metadata } from 'next';
import { ModerationQueue } from '@/components/admin/moderation/ModerationQueue';

export const metadata: Metadata = {
  title: 'Moderation | SNIF Admin',
  description: 'Review and moderate user-submitted content.',
  openGraph: {
    title: 'Moderation | SNIF Admin',
    description: 'Review and moderate user-submitted content.',
  },
};

export default function ModerationPage() {
  return <ModerationQueue />;
}
