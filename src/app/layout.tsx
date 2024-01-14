import './globals.css'

export const metadata = {
  title: ' WebPush Tutorial',
  description: 'Native Apps Are Dead - WebPush on iOS with Next.js!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
