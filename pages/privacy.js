import Head from "next/head";
import Link from "next/link";
import { PawPrint, ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — Pets in Cabin</title>
        <meta name="description" content="Privacy policy for Pets in Cabin — what data we collect, why, and your rights." />
      </Head>

      <div
        className="min-h-screen text-stone-900"
        style={{
          backgroundColor: "#faf6ed",
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');
          .font-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
          body { font-family: 'Inter', sans-serif; }
        `}</style>

        <nav className="border-b border-stone-300 px-6 md:px-12 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <PawPrint className="w-5 h-5 text-stone-700 group-hover:text-amber-700 transition-colors" strokeWidth={1.5} />
              <span className="font-serif italic text-stone-700 group-hover:text-amber-700 transition-colors">
                Pets in Cabin
              </span>
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 text-sm">
              <ArrowLeft className="w-4 h-4" />
              <span className="uppercase tracking-widest text-xs">Back to site</span>
            </Link>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="text-xs uppercase tracking-[0.25em] text-stone-500 mb-6">Pets in Cabin</div>

          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6 leading-tight">
            Privacy <span className="italic text-stone-600">Policy</span>
          </h1>

          <p className="font-serif italic text-stone-600 text-lg mb-12">
            What data this site collects, why, and what you can do about it. Last updated: May 2026.
          </p>

          <div className="space-y-10 font-serif text-lg text-stone-800 leading-relaxed">

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">A note from Theo's Mum</h2>
              <p>
                I want to be upfront: I'm a pet mum who built this site to help other pet owners, not a tech company harvesting data. This page exists because the law requires it, and because you deserve to know exactly what happens when you visit.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">Who runs this site</h2>
              <p>
                Pets in Cabin is a personal guide written and maintained by an individual ("Theo's Mum") in the United Kingdom. It is not a registered business. The site can be reached at <span className="not-italic">petsincabin.com</span>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">What data is collected</h2>
              <p className="mb-4">
                When you visit this site, very limited information is collected automatically through Vercel Web Analytics, a privacy-friendly analytics tool. Specifically:
              </p>
              <ul className="space-y-2 ml-5">
                <li>— Which pages you visited and how long you spent on them</li>
                <li>— The country you visited from (not your exact location)</li>
                <li>— The type of device and browser you used</li>
                <li>— The website you arrived from (e.g. Google, Instagram, a direct link)</li>
              </ul>
              <p className="mt-4">
                Vercel Analytics does <em>not</em> use cookies, does <em>not</em> track you across websites, and does <em>not</em> collect personally identifiable information like your name, email, or IP address. The data is aggregated and anonymous.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">When you contact me</h2>
              <p>
                If you use the contact section to email me, I receive whatever you send: your name, your email address, and your message. I use this information only to reply to you. Your email is not added to any mailing list, shared with third parties, or used for marketing. I keep emails for as long as needed to remember our conversation, and you can ask me to delete them at any time.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">Cookies</h2>
              <p>
                This site does not set any cookies of its own. The Google Fonts service used for the site's typography may set a small technical cookie to deliver fonts efficiently — this is the only third-party cookie possible during a normal visit.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">Third parties</h2>
              <p className="mb-4">The site relies on a small number of trusted services:</p>
              <ul className="space-y-2 ml-5">
                <li>— <strong className="font-medium">Vercel</strong> — hosts the website and provides anonymous analytics</li>
                <li>— <strong className="font-medium">Cloudflare</strong> — manages the domain</li>
                <li>— <strong className="font-medium">Google Fonts</strong> — delivers the fonts you see</li>
                <li>— <strong className="font-medium">Google Mail</strong> — handles the contact email (forwarded from Gmail)</li>
              </ul>
              <p className="mt-4">
                Each of these has its own privacy policy. None of them have access to identifying information about you beyond what is technically necessary to load and serve the site.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">Affiliate links and recommendations</h2>
              <p>
                In the future, this site may include affiliate links to products or services I genuinely recommend (carriers, pet insurance, relocation services, etc.). When that happens, those links will be clearly disclosed, and clicking them does not change the price you pay — but I may earn a small commission from the brand if you buy. I will only ever recommend things I would use myself.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">Your rights</h2>
              <p className="mb-4">
                Under UK and EU data protection law (UK GDPR / GDPR), you have the right to:
              </p>
              <ul className="space-y-2 ml-5">
                <li>— Ask what data I have about you (likely none, beyond your contact email)</li>
                <li>— Ask me to correct or delete it</li>
                <li>— Withdraw consent at any time</li>
                <li>— Complain to the Information Commissioner's Office (ICO) at <span className="not-italic">ico.org.uk</span></li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, just reply to whatever email thread we have or use the contact form on the homepage.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">Children</h2>
              <p>
                This site is intended for adult pet owners. It does not knowingly collect any data from children under 16.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">Changes to this policy</h2>
              <p>
                If this policy changes, I'll update the date at the top. Major changes will be flagged on the homepage for at least 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-stone-900 mb-3">Contact</h2>
              <p>
                Any questions or concerns about how your data is handled — please get in touch via the contact section on the <Link href="/" className="text-amber-700 underline decoration-amber-300 underline-offset-4 hover:text-amber-800 transition-colors">homepage</Link>.
              </p>
            </section>

          </div>

          <div className="mt-16 pt-10 border-t border-stone-300">
            <Link href="/" className="inline-flex items-center gap-3 bg-stone-900 text-stone-50 px-7 py-3.5 hover:bg-amber-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="uppercase tracking-widest text-xs font-medium">Back to the guide</span>
            </Link>
          </div>
        </main>

        <footer className="py-12 px-6 md:px-12 bg-stone-900 text-stone-400 border-t border-stone-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
              <span className="font-serif italic text-stone-300">Pets in Cabin · A guide by Theo's Mum</span>
            </div>
            <p className="text-stone-500 text-sm">© 2026 Pets in Cabin. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
