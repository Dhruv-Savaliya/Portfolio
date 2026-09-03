import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono, Syne } from 'next/font/google';
import './globals.css';

// ============================================
// FONTS
// ============================================
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

// ============================================
// METADATA
// ============================================
export const metadata: Metadata = {
  title: 'Dhruv Savaliya — Full Stack Developer',
  description:
    'Full-stack developer specializing in Next.js, React, TypeScript, Node.js and AI-powered applications. Building digital products that combine code, AI & interaction.',
  keywords: [
    'Dhruv Savaliya',
    'Full Stack Developer',
    'Next.js Developer',
    'React Developer',
    'TypeScript',
    'Node.js',
    'AI Developer',
    'Web Developer India',
    'Surat Developer',
    'Portfolio',
  ],
  authors: [{ name: 'Dhruv Savaliya' }],
  creator: 'Dhruv Savaliya',
  metadataBase: new URL('https://dhruvsavaliya.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dhruvsavaliya.dev',
    title: 'Dhruv Savaliya — Full Stack Developer',
    description:
      'Full-stack developer building digital products with code, AI & interaction.',
    siteName: 'Dhruv Savaliya',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dhruv Savaliya — Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhruv Savaliya — Full Stack Developer',
    description:
      'Full-stack developer building digital products with code, AI & interaction.',
    creator: '@dhruvsavaliya',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

// ============================================
// STRUCTURED DATA
// ============================================
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dhruv Savaliya',
  jobTitle: 'Full Stack Developer',
  description:
    'Full-stack developer specializing in Next.js, React, TypeScript, Node.js and AI-powered applications.',
  url: 'https://dhruvsavaliya.dev',
  sameAs: [
    'https://github.com/dhruvsavaliya',
    'https://linkedin.com/in/dhruvsavaliya',
  ],
  knowsAbout: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'AI Integration',
    'Web Development',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Surat',
    addressCountry: 'IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-ds-bg text-ds-text font-body antialiased">
        {children}
      </body>
    </html>
  );
}
