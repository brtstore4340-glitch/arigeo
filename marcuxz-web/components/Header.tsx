"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "หน้าแรก", href: "#" },
    { name: "บริการ", href: "#services" },
    { name: "ผลงาน", href: "#proof" },
    { name: "ขั้นตอนทำงาน", href: "#workflow" },
    { name: "แพ็กเกจ", href: "#pricing" },
    { name: "คำถามที่พบบ่อย", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 glass-card rounded-none border-t-0 border-x-0 border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white tracking-tighter glow-text">
          Marcuxz<span className="text-cyan">Web</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="text-gray-300 hover:text-cyan transition-colors">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <Link
            href="#contact"
            className="px-6 py-2.5 rounded-full bg-cyan hover:bg-cyan/90 text-black font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          >
            ปรึกษาฟรี
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-300" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-near-black border-b border-white/10 flex flex-col py-4 px-6 gap-4">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="text-gray-300 hover:text-cyan py-2"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="#contact"
            className="mt-2 text-center px-6 py-3 rounded-full bg-cyan text-black font-semibold"
            onClick={() => setIsOpen(false)}
          >
            ปรึกษาฟรี
          </Link>
        </div>
      )}
    </header>
  );
}
