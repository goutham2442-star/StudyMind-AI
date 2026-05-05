import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — StudyMind AI',
  description: 'Log in to your StudyMind AI account to access your personal study dashboard and AI tutor.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
