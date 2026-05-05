import { Metadata } from 'next';
import LandingClient from './LandingClient';

export const metadata: Metadata = {
  title: 'StudyMind AI — Master Your University Exams',
  description: 'Upload past papers, ask AI-powered questions, and get instant explanations tailored to your syllabus. The ultimate study companion for university students.',
  openGraph: {
    title: 'StudyMind AI — Master Your University Exams',
    description: 'Transform your study habits with AI-powered exam paper analysis.',
    images: ['/og-image.png'],
    type: 'website',
    url: 'https://studymind-ai.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyMind AI',
    description: 'AI-powered academic intelligence platform.',
    images: ['/og-image.png'],
  },
};

export default function Page() {
  return <LandingClient />;
}
