import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/providers/query-provider'

export const metadata: Metadata = {
  title: {
    default: 'TEMTECH Studio — Dashboard',
    template: '%s | TEMTECH Studio',
  },
  description:
    'Dashboard CRM premium para TEMTECH Studio. Gestión de leads, clientes, proyectos, tareas y presupuestos.',
  keywords: ['CRM', 'dashboard', 'gestión', 'TEMTECH', 'proyectos'],
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/td-logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180' },
    ],
    shortcut: '/td-logo.svg',
  },
  openGraph: {
    title: 'TEMTECH Studio — Dashboard',
    description: 'Dashboard CRM premium para TEMTECH Studio.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'TEMTECH Studio',
  },
  twitter: {
    card: 'summary',
    title: 'TEMTECH Studio — Dashboard',
    description: 'Dashboard CRM premium para TEMTECH Studio.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
