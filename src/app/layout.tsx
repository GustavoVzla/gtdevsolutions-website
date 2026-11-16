import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ChatWidget from "@/components/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gtdevsolutions.com"),
  title: "GT Dev Solutions | Automatización Inteligente, Desarrollo Web e IA",
  description: "Empresa de automatización con IA y desarrollo web y apps en España. Soluciones con n8n, React/Next.js, chatbots inteligentes y blockchain para empresas en España y Latinoamérica.",
  keywords: ["automatización", "n8n", "desarrollo web", "desarrollo apps", "React", "Next.js", "IA", "chatbots", "blockchain", "Madrid", "España", "Latinoamérica"],
  authors: [{ name: "Gustavo Tejera", url: "https://www.linkedin.com/in/gustavotejera" }],
  icons: {
    icon: "/favicon-gt.png",
    apple: "/favicon-gt.png",
  },
  openGraph: {
    title: "GT Dev Solutions | Automatización Inteligente, Desarrollo Web e IA",
    description: "Empresa de automatización con IA y desarrollo web y apps en España. Soluciones para empresas en España y Latinoamérica.",
    url: "https://gtdevsolutions.com",
    siteName: "GT Dev Solutions",
    images: [{ url: "/logo-gt.png", width: 1024, height: 1024, alt: "GT Dev Solutions Logo" }],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <Header />
        {children}
        <Footer />
        <ChatWidget />
        <ScrollReveal />
      </body>
    </html>
  );
}
