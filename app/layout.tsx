import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/app/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Atena - Your Study Assistant",
  description: "Study assistant to help you excel in your studies",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`font-sans ${inter.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 