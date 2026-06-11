import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Globe } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#FF5500]/10 border border-[#FF5500]/20">
                <ShieldCheck className="h-5 w-5 text-[#FF5500]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Zeko<span className="text-[#FF5500]">Audit</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-xs">
              Automated audit platform delivering instant page speed, SEO, accessibility, and best practice metrics for modern web apps.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-zinc-500 hover:text-zinc-300">
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-zinc-300">
                <GithubIcon className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-zinc-500 hover:text-zinc-300">
                <Globe className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Product</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#examples" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Example Audits
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Integrations
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-zinc-200">Resources</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <Link href="https://nextjs.org/docs" target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      API Status
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Company</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold text-zinc-200">Legal</h3>
                <ul role="list" className="mt-4 space-y-3">
                  <li>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} ZekoAudit. All rights reserved.
          </p>
          <p className="text-xs text-zinc-500 mt-4 md:mt-0">
            Designed for performance and clarity.
          </p>
        </div>
      </div>
    </footer>
  );
}
