import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kasatria Periodic Table',
  description: 'Interactive 3D periodic table with Google Sheets data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

