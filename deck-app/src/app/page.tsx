import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero with subtle gradient */}
      <section className="relative flex flex-col items-center justify-center px-8 pt-20 pb-16 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl translate-y-1/2" />

        <div className="relative text-center max-w-3xl">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500 text-sm font-semibold uppercase tracking-wide mb-4">
            From CancerHacker Lab • Part of axestack
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Prompt Deck
          </h1>
          <p className="text-2xl text-slate-600 mb-8">
            Generate. Edit. Iterate.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500 font-semibold"> Fast.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              href="/create"
              className="inline-block bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white text-2xl font-bold px-10 py-5 rounded-xl shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-105"
            >
              Create a Deck
            </Link>
            <Link
              href="/audit"
              className="inline-block border-2 border-slate-200 text-slate-700 hover:border-violet-400 hover:text-violet-600 text-2xl font-bold px-10 py-5 rounded-xl transition-all hover:scale-105 bg-white/80 backdrop-blur-sm"
            >
              Audit Your Deck
            </Link>
          </div>
          <p className="text-lg text-slate-500 mb-4">
            Answer 6 questions. Get a 10-slide deck. Refine with natural language until investor-ready.
          </p>
          <p className="text-sm text-slate-400">No signup required • Both free</p>
        </div>
      </section>

      {/* Social Proof - gradient border */}
      <section className="relative py-8 px-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center mb-6">
            <div>
              <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-500 text-transparent bg-clip-text">5 min</p>
              <p className="text-sm text-slate-500">Time to deck</p>
            </div>
            <div>
              <p className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 to-orange-500 text-transparent bg-clip-text">50+</p>
              <p className="text-sm text-slate-500">Founders served</p>
            </div>
            <div>
              <p className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-transparent bg-clip-text">$75M+</p>
              <p className="text-sm text-slate-500">Raised by CHL community</p>
            </div>
          </div>
          <p className="text-center text-base font-medium text-slate-600">
            Used by founders and builders at Google, Facebook, Included Health, MIT, Stanford
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-8 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">What founders are saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-600 mb-4">"Went from idea to investor meeting in a day. The pushback on my vague answers was exactly what I needed."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center font-bold text-white">JK</div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">James K.</p>
                  <p className="text-xs text-slate-500">Raised $1.2M seed</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-600 mb-4">"Better than paying $5K for a deck designer. The AI actually understands what investors want to see."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full flex items-center justify-center font-bold text-white">SP</div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">Sarah P.</p>
                  <p className="text-xs text-slate-500">YC W24</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-slate-600 mb-4">"The 6 questions forced me to clarify my thinking. My pitch is 10x sharper now."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center font-bold text-white">MR</div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">Marcus R.</p>
                  <p className="text-xs text-slate-500">2x founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powered by */}
      <section className="py-8 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-slate-400 mb-3">POWERED BY</p>
          <div className="flex items-center justify-center gap-6 text-slate-500">
            <span className="flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500 font-mono text-sm font-semibold">/fundraise</span>
              <span className="text-slate-400">axestack skill</span>
            </span>
            <span className="text-slate-300">•</span>
            <span>Claude Code</span>
            <span className="text-slate-300">•</span>
            <span>Anthropic</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-teal-50" />
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-500/25">1</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Answer 6 questions</h3>
              <p className="text-slate-500">Our proprietary discovery flow extracts the core of your pitch. No fluff allowed.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-fuchsia-500/25">2</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI generates deck</h3>
              <p className="text-slate-500">Purpose-built prompts trained on 100s of funded decks. Kawasaki 10/20/30 enforced.</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-500/25">3</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Iterate & score</h3>
              <p className="text-slate-500">Chat-based editing with real-time scoring. Know exactly where you stand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Framework */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-4">Built on proven frameworks</h2>
          <p className="text-slate-500 text-center mb-12">We've studied hundreds of successful decks to distill what actually works.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-violet-300 hover:shadow-md transition-all">
              <p className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">Kawasaki</p>
              <p className="text-sm text-slate-500">10/20/30 rule</p>
            </div>
            <div className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-fuchsia-300 hover:shadow-md transition-all">
              <p className="font-semibold text-slate-900 group-hover:text-fuchsia-600 transition-colors">YC</p>
              <p className="text-sm text-slate-500">2-sentence clarity</p>
            </div>
            <div className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-orange-300 hover:shadow-md transition-all">
              <p className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">a16z</p>
              <p className="text-sm text-slate-500">Metrics that matter</p>
            </div>
            <div className="group bg-white border border-slate-200 p-5 rounded-2xl hover:border-teal-300 hover:shadow-md transition-all">
              <p className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">Sequoia</p>
              <p className="text-sm text-slate-500">Problem → Solution</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-orange-50" />
        <div className="relative">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to build your deck?</h2>
          <p className="text-slate-500 mb-8">6 questions. 5 minutes. An investor-ready deck.</p>
          <Link
            href="/create"
            className="inline-block bg-gradient-to-r from-violet-600 to-teal-500 hover:from-violet-700 hover:to-teal-600 text-white text-xl font-semibold px-8 py-4 rounded-xl shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-105"
          >
            Create Your Deck — Free
          </Link>
        </div>
      </section>

      {/* Built by */}
      <section className="border-t border-slate-200 py-12 px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-slate-400 mb-4">BUILT BY</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/ari.png" alt="Ari Akerstein" className="w-16 h-16 rounded-full object-cover shadow-lg ring-2 ring-violet-100" />
            <div className="text-left">
              <p className="font-semibold text-slate-900">Ari Akerstein</p>
              <p className="text-sm text-slate-500">Serial founder • Ex-Facebook PM • Cancer Hacker Lab</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Previously led products at Facebook reaching billions of users.
            Founded multiple startups. Built this tool after creating 50+ pitch decks
            and raising from top-tier VCs.
          </p>
          <Link href="/about" className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-teal-500 text-sm font-medium hover:underline mt-4 inline-block">
            Learn more →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 Prompt Deck. Part of{' '}
            <a href="https://github.com/ariakerstein/axestack" className="text-violet-600 hover:underline">
              axestack
            </a>
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/about" className="hover:text-violet-600 transition-colors">About</Link>
            <a href="https://github.com/ariakerstein/axestack" className="hover:text-violet-600 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
