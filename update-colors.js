const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace colors
  content = content.replace(/corporate-green/g, 'arigeo-red');
  content = content.replace(/corporate-teal/g, 'arigeo-darkred');
  content = content.replace(/corporate-gold/g, 'arigeo-red');
  content = content.replace(/corporate-slate/g, 'arigeo-gray');
  content = content.replace(/corporate-offwhite/g, 'arigeo-light');
  content = content.replace(/bg-\[\#0f5132\]/g, 'bg-arigeo-red');
  content = content.replace(/bg-\[\#0d9488\]/g, 'bg-arigeo-darkred');
  content = content.replace(/bg-\[\#334155\]/g, 'bg-arigeo-black');
  content = content.replace(/bg-\[\#d4af37\]/g, 'bg-arigeo-red');
  
  // Replace Logo placeholders
  if (file === 'Header.tsx') {
    content = content.replace(/<div className="w-10 h-10 bg-arigeo-red rounded-lg flex items-center justify-center text-white font-bold text-xl">A<\/div>/g, '<img src="/images/logos/arigeo.png" alt="Arigeo Logo" className="h-10 w-auto object-contain" />');
    content = content.replace(/<span className="font-bold text-xl text-arigeo-red tracking-tight">ARIGEO<\/span>/g, '');
  }
  if (file === 'Footer.tsx') {
    content = content.replace(/<div className="w-8 h-8 bg-arigeo-red rounded flex items-center justify-center text-white font-bold text-sm">A<\/div>/g, '<img src="/images/logos/arigeo.png" alt="Arigeo Logo" className="h-10 w-auto object-contain brightness-0 invert" />');
    content = content.replace(/<span className="font-bold text-xl text-white tracking-tight">ARIGEO<\/span>/g, '');
  }

  // Add movement animations
  content = content.replace(/animate-fade-up/g, 'animate-fade-up hover-lift');
  content = content.replace(/shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1/g, 'shadow-sm hover-lift');
  
  // Add float to some elements like hero image
  content = content.replace(/className="relative lg:h-\[600px\] flex items-center justify-center animate-fade-up opacity-0 stagger-2"/g, 'className="relative lg:h-[600px] flex items-center justify-center animate-fade-up opacity-0 stagger-2 animate-float"');

  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Colors, logos, and movements updated successfully.');
