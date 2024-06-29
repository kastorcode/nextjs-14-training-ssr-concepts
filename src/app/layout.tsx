import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata : Metadata = {
  title: "Next.js 14 Training SSR Concepts",
  description: "Generated by create next app",
  authors: [{ name: "Matheus Ramalho de Oliveira", url: "https://github.com/kastorcode" }]
}

export default function RootLayout ({ children } : Readonly <{ children : React.ReactNode }>) {

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )

}