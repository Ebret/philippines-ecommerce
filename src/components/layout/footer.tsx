import React from 'react';
import Link from 'next/link';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  sections?: FooterSection[];
  copyright?: string;
  socialLinks?: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
}

const Footer: React.FC<FooterProps> = ({
  sections = [],
  copyright = `© ${new Date().getFullYear()} Extreme Life Herbal. All rights reserved.`,
  socialLinks = [],
}) => {
  return (
    <footer className="border-t border-border bg-card transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Footer Content */}
        {sections.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 font-serif text-sm font-bold text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">{copyright}</p>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-label={link.label}
                  className="text-muted-foreground transition-colors duration-200 hover:text-primary"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export { Footer };

