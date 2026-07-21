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
