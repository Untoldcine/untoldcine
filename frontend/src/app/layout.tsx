import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UntoldCine",
  description: "A platform for actors, producers, writers, and cinephiles to tell and share their stories.",
  icons: {
    icon: '../favicon.ico',
  },
  openGraph: {
    title: 'UntoldCine',
    description: 'Software Engineer Portfolio for Michael Deng',
    images: [
      {
        url:'https://www.untoldcine.com/untold.svg',
        width: 800,
        height: 600
      },
      {
        url:'https://www.untoldcine.com/untold.svg',
        width: 1800,
        height: 1600
      }
    ],
    type: 'website',
    locale: 'en_US',
    url: 'https://www.untoldcine.com/',
    siteName: 'Untold Cine'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
