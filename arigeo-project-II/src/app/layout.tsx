import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ARIGEO | พันธมิตรด้านเวชภัณฑ์ เคมีภัณฑ์ และการเกษตร',
  description: 'บริษัท อะริเกโอ จำกัด (ARIGEO COMPANY LIMITED) จัดจำหน่ายยา เครื่องมือแพทย์ เคมีภัณฑ์ และผลิตภัณฑ์เพื่อการเกษตรแบบครบวงจร',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
