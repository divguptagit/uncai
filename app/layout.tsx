import './globals.css'
import PageTransition from './components/PageTransition'

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
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
