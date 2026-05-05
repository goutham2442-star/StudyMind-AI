import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings — StudyMind AI',
  description: 'Manage your profile, academic preferences, AI behavior, and view your study statistics.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
