import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Upload Paper — StudyMind AI',
  description: 'Upload your past exam papers to unlock AI-powered insights, summaries, and automated question generation.',
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
