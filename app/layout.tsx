import type { Metadata } from 'next'
import './globals.css'
import { SupabaseClient, createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: 'FreelanceOS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  )
}