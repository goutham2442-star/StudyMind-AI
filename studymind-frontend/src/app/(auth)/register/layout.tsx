import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join StudyMind AI',
  description: 'Create your free account today and start mastering your university exams with the power of AI.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
