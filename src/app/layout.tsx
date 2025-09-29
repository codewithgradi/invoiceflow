import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer'

export const interSans = Inter({
  subsets: ['latin'],
  variable: "--font-inter",
  display:'swap',
})


export const metadata: Metadata = {
  title: "Invoice Flow",
  description: "This is the landing Page",
  icons: {
    icon:'/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable}  antialiased`}
      >

        <div>
          <Navbar/>
          <main>
            {children}
          </main>
        </div>
        <footer>
          <Footer/>

        </footer>
      </body>
    </html>
  );
}
