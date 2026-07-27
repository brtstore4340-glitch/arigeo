import { Linkedin, Instagram, Youtube, Facebook } from 'lucide-react';
import { footerColumns } from '@/lib/siteData';

const socials = [
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Facebook, label: 'Facebook' },
];

export default function Footer() {
  return (
    <footer id="careers" className="bg-secondary px-6 py-16 border-t border-border">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-8 mb-12">
          {/* Logo + description */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="text-2xl font-bold flex items-center mb-4">
              ARIGE
              <span className="inline-block w-[0.6em] h-[0.6em] bg-primary rounded-full ml-[0.1em]"></span>
            </a>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              ARIGEO develops trusted household and skincare products that bring quality to
              everyday life.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold text-sm mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2024 ARIGEO Co., Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Use
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}