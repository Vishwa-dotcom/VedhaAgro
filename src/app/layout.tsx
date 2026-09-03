import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { ProductProvider } from "@/context/ProductContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vedha Agro - Agricultural Equipment & Pesticide Sprayers",
  description:
    "Buy pesticide sprayer pumps, agricultural equipment, and farming solutions from Vedha Agro. Trusted quality products for farmers.",
  keywords:
    "pesticide sprayers, agricultural equipment, farming tools, sprayer pumps, agricultural products",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ProductProvider>
          <OrderProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </CartProvider>
          </OrderProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
