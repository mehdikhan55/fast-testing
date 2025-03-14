import { Geist, Geist_Mono, Space_Grotesk, Chakra_Petch, Space_Mono  } from "next/font/google";
import "./globals.css";

// Use Space Grotesk font for a more futuristic look
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700']
})

const chakraPetch = Chakra_Petch({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chakra-petch',
  weight: ['300', '400', '500', '600', '700']
})

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
  weight: ['400', '700']
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
    <html lang="en" className={`scroll-smooth ${spaceMono.variable}`}>
      <body className={`${spaceMono.className} antialiased font-sans bg-dots`}>
        {children}
      </body>
    </html>
  );
}
