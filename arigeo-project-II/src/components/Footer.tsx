import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-arigeo-black text-white pt-24 pb-12">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          
          <div className="lg:col-span-1">
            <div className="font-black text-3xl tracking-tighter mb-6">
              <span className="text-white">ARI</span>
              <span className="text-arigeo-red">GEO</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              พันธมิตรด้านการจัดจำหน่ายยา เครื่องมือแพทย์ เคมีภัณฑ์ และผลิตภัณฑ์เพื่อการเกษตรแบบครบวงจร
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#home" className="hover:text-arigeo-red transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-arigeo-red transition-colors">About Us</a></li>
              <li><a href="#products" className="hover:text-arigeo-red transition-colors">Products</a></li>
              <li><a href="#quality" className="hover:text-arigeo-red transition-colors">Quality Standard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Industries</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#industries" className="hover:text-arigeo-red transition-colors">Hospitals & Clinics</a></li>
              <li><a href="#industries" className="hover:text-arigeo-red transition-colors">Pharmacies</a></li>
              <li><a href="#industries" className="hover:text-arigeo-red transition-colors">Laboratories</a></li>
              <li><a href="#industries" className="hover:text-arigeo-red transition-colors">Agriculture</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>123 ARIGEO Tower, Bangkok</li>
              <li>Thailand 10110</li>
              <li className="text-arigeo-red font-bold mt-4">sales@arigeo.com</li>
              <li className="text-arigeo-red font-bold">+66 2 123 4567</li>
            </ul>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ARIGEO COMPANY LIMITED. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
