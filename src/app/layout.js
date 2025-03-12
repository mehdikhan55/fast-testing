import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Use Space Grotesk font for a more futuristic look
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700']
})

export const metadata = {
  title: 'FAST @ CSI - Where Learning FASTs Innovation',
  description: 'An educational initiative designed to Inspire Growth, Nurture Innovation, and Achieve Technical Excellence among students.',
  keywords: 'education, innovation, FAST, CSI, learning, students, growth, technology',
  author: 'FAST @ CSI',
  colorScheme: 'dark',
  themeColor: '#0F172A',
  viewport: 'width=device-width, initial-scale=1.0'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${spaceGrotesk.variable}`}>
      <body className={`${spaceGrotesk.className} antialiased font-sans bg-dots`}>
        {children}
      </body>
    </html>
  );
}
