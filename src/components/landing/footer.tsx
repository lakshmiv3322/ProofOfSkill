import { ShieldCheck, Twitter, Linkedin, Github } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Demo Report', 'API Documentation'],
  Company: ['About Us', 'Careers', 'Blog', 'Press Kit'],
  Resources: ['Help Center', 'Community', 'Webinars', 'Status Page'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'],
};

interface FooterProps {
  onVerifyClick?: () => void;
}

export function Footer({ onVerifyClick }: FooterProps) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight">ProofOfSkill</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Transparent, rubric-based skill assessment with verifiable, shareable evidence.
            </p>
            <div className="mt-4">
              <button
                onClick={onVerifyClick}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Public Registry & Certificate Verifier →
              </button>
            </div>
            <div className="mt-4 flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold">{category}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 ProofOfSkill, Inc. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for trade schools, vocational programs, and enterprise training.
          </p>
        </div>
      </div>
    </footer>
  );
}
