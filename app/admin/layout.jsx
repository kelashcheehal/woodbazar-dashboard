import { Jost } from "next/font/google";

import "../../app/globals.css";

import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function AdminLayout({ children }) {
  return (
    <div className={`${jost.variable} font-sans antialiased`}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          <Header />
          <main className="flex-1 p-6 overflow-auto no-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
