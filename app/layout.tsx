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
      <body className="antialiased bg-gray-900">
        <div className="page-transition">
          {children}
        </div>
      </body>
    </html>
  )
}
