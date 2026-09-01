import { ShieldCheck, Twitter, Linkedin, Github, ExternalLink } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Demo Report', 'BlazePose Kinematics'],
  Company: ['About Us', 'Accreditation', 'Blog', 'Security Whitepaper'],
  Resources: ['Rubric Standards', 'AHA Guidelines', 'Edge API Docs', 'Status Page'],
  Legal: ['Privacy Policy', 'Zero Video Retention', 'FERPA Compliance', 'Terms'],
};

interface FooterProps {
  onVerifyClick?: () => void;
}

export function Footer({ onVerifyClick }: FooterProps) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-steel text-brass border border-hairline">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-lg font-headline font-bold tracking-tight text-porcelain">ProofOfSkill</span>
            </div>
            <p className="mt-4 max-w-xs text-xs sm:text-sm text-slateText leading-relaxed">
              Transparent, deterministic skill assessment with cryptographically verifiable, shareable evidence.
            </p>
            <div className="mt-4">
              <button
                onClick={onVerifyClick}
                className="inline-flex items-center gap-1.5 text-xs text-brass font-semibold font-mono hover:text-amber-300 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Public Registry & Certificate Verifier</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-4 flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-emerald-500/40 hover:text-emerald-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4">{category}</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="transition-colors hover:text-emerald-400"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row text-xs text-slate-500 font-mono">
          <p>
            &copy; 2026 ProofOfSkill, Inc. All rights reserved.
          </p>
          <p>
            Built for trade schools, vocational programs, and enterprise credentialing.
          </p>
        </div>
      </div>
    </footer>
  );
}
