import React from "react";
import Header from "../components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      <footer className="w-full bg-white">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,77,166,0.5) 30%, rgba(123,63,228,0.4) 70%, transparent 100%)",
          }}
          aria-hidden
        />
        <p className="py-4 text-sm text-center text-gray-500">
          &copy; {new Date().getFullYear()} ONYX Task Tracker. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
