import './globals.css'

export const metadata = {
  title: 'WellnessWatch',
  description: 'Your intelligent AI companion, making health monitoring simple and accessible',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
