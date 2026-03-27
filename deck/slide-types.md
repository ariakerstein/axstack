# Slide Type Catalog

10 slide types. Each section shows one complete real example (from the March 2026 update deck, dark-modern theme) followed by usage notes. Use these as patterns - adapt content and theme classes, don't copy literally.

---

## 1. Cover

Full-screen centered intro. Always the first slide. No header bar.

```html
<section
  class="slide slide-centered bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
>
  <div class="text-center max-w-5xl">
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="mx-auto mb-6"
      style="height: 120px;"
    />
    <h1 class="text-6xl font-bold mb-4">Navis Health AI</h1>
    <p class="text-3xl text-emerald-400 mb-6">Progress Update</p>
    <p class="text-xl text-slate-400 mb-10">March 2026</p>
    <div class="flex justify-center gap-6 text-base text-slate-400">
      <span>Product Progress</span>
      <span class="text-slate-600">|</span>
      <span>Early Patient Signal</span>
      <span class="text-slate-600">|</span>
      <span>Fundraising Status</span>
    </div>
  </div>
  <div class="slide-number text-slate-500">1</div>
</section>
```

**Elements:** Logo (120px), title (text-6xl), subtitle (text-3xl, accent color), date (text-xl), optional topic pills.
**Density:** 1 title + 1 subtitle + date. Max 4 topic pills.

---

## 2. Statement

Big headline with supporting evidence below. Good for problem slides, thesis, "why now."

```html
<section class="slide slide-centered bg-slate-900 text-white">
  <div class="absolute top-8 left-8 right-8 flex justify-between items-center">
    <p class="text-sm text-slate-400 font-medium uppercase tracking-widest">
      The Challenge
    </p>
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="h-8 opacity-30"
    />
  </div>
  <div class="w-full max-w-6xl">
    <h2 class="text-5xl font-bold mb-10 text-center">
      Doctors have Epic. Patients have a mess.
    </h2>
    <div class="grid grid-cols-2 gap-10 mb-8">
      <div class="text-center">
        <p class="text-lg font-bold text-red-400 uppercase tracking-wide mb-4">
          Wait Times Increasing
        </p>
        <img
          src="../pitchAssets/waits.png"
          alt="Wait times chart"
          class="w-full rounded-lg"
          style="max-height: 240px; object-fit: contain;"
        />
        <p class="text-base text-slate-400 mt-3">
          17 days (2009) → 31 days (2025)
        </p>
      </div>
      <div class="space-y-4">
        <div class="bg-amber-900/40 border border-amber-500/50 rounded-xl p-4">
          <p class="text-lg font-bold text-amber-400">
            Current Tools Fall Short
          </p>
          <p class="text-slate-300 text-sm">
            Portals = raw data. Google = generic. 2nd opinions = slow & costly
          </p>
        </div>
        <div class="bg-red-900/40 border border-red-500/50 rounded-xl p-4">
          <p class="text-lg font-bold text-red-400">Blood Cancers Are Harder</p>
          <p class="text-slate-300 text-sm">
            Watch-and-wait, MRD, biomarkers, recurrence, treatment sequencing
          </p>
        </div>
        <div
          class="bg-emerald-900/40 border border-emerald-500/50 rounded-xl p-4"
        >
          <p class="text-lg font-bold text-emerald-400">Navis Fills the Gap</p>
          <p class="text-slate-300 text-sm">
            Organize case, surface questions, prepare for care team
          </p>
        </div>
      </div>
    </div>
    <p class="text-center text-2xl text-white font-bold">
      <span class="text-red-400">84%</span> never get a second opinion.
      <span class="text-emerald-400">1 in 3</span> who do change treatment.
    </p>
  </div>
  <div class="slide-number text-slate-500">2</div>
</section>
```

**Layout:** 2-column grid. Left = image/chart. Right = 2-4 stacked info cards. Bottom stat line.
**Density:** 1 headline, 1 image, 3-4 cards (title + 1 line each), 1 bottom stat.

---

## 3. Flow / Process

Horizontal steps showing "how it works." Good for product flow, onboarding, methodology.

```html
<section class="slide slide-centered bg-white">
  <div class="absolute top-8 left-8 right-8 flex justify-between items-center">
    <p class="text-sm text-slate-500 font-medium uppercase tracking-widest">
      What We Do
    </p>
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="h-8 opacity-40"
    />
  </div>
  <div class="w-full max-w-5xl text-center">
    <h2 class="text-5xl font-bold text-slate-900 mb-4">
      Complex Care Navigation
    </h2>
    <p class="text-2xl text-slate-500 mb-10">
      Built for patients & caregivers. Starting with second opinions.
    </p>
    <div class="flex justify-center items-center gap-4 mb-10">
      <div
        class="bg-sky-50 border border-sky-200 rounded-xl px-6 py-4 text-center"
      >
        <p class="text-lg font-semibold text-sky-700">Upload records</p>
      </div>
      <span class="text-2xl text-slate-300">&rarr;</span>
      <div
        class="bg-sky-50 border border-sky-200 rounded-xl px-6 py-4 text-center"
      >
        <p class="text-lg font-semibold text-sky-700">AI structures case</p>
      </div>
      <span class="text-2xl text-slate-300">&rarr;</span>
      <div
        class="bg-sky-50 border border-sky-200 rounded-xl px-6 py-4 text-center"
      >
        <p class="text-lg font-semibold text-sky-700">Find gaps in care</p>
      </div>
      <span class="text-2xl text-slate-300">&rarr;</span>
      <div
        class="bg-emerald-50 border-2 border-emerald-400 rounded-xl px-6 py-4 text-center"
      >
        <p class="text-lg font-semibold text-emerald-700">Get next step</p>
      </div>
    </div>
    <div class="bg-slate-900 rounded-2xl p-6 max-w-3xl mx-auto">
      <p class="text-xl text-white mb-3">
        Patients facing <span class="text-red-400">diagnosis</span>,
        <span class="text-red-400">recurrence</span>, or
        <span class="text-red-400">confusing test results</span> often have
        records but no clear next step.
      </p>
      <p class="text-slate-400">
        Navis helps organize the case, identify possible gaps, and prepare
        patients and caregivers for better decisions.
      </p>
    </div>
  </div>
  <div class="slide-number">3</div>
</section>
```

**Layout:** Headline + subhead, horizontal step boxes with arrows, optional callout box below.
**Density:** 3-5 steps (5 words max each), 1 callout (2 lines max).

---

## 4. Team Grid

Photo grid with credentials. Supports 3-6 people in a row.

```html
<section class="slide slide-centered bg-slate-900 text-white">
  <div class="absolute top-8 left-8 right-8 flex justify-between items-center">
    <p class="text-sm text-slate-400 font-medium uppercase tracking-widest">
      Team
    </p>
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="h-8 opacity-30"
    />
  </div>
  <div class="w-full max-w-5xl">
    <h2 class="text-4xl font-bold mb-8 text-center">Founder-Market Fit</h2>
    <div class="grid grid-cols-5 gap-4 mb-8">
      <div class="text-center">
        <img
          src="https://example.com/photo.jpg"
          alt="Name"
          class="w-32 h-32 mx-auto mb-3 rounded-full object-cover border-4 border-red-400"
        />
        <p class="font-bold text-white text-sm">Ari Akerstein, MS</p>
        <p class="text-xs text-slate-400">Co-Founder/CEO</p>
        <p class="text-xs text-slate-500">Ex-Meta PM</p>
        <p class="text-xs text-red-400 font-medium mt-1">DLBCL/FL Survivor</p>
      </div>
      <!-- repeat for each team member -->
    </div>
    <div
      class="bg-slate-800 rounded-xl px-6 py-4 text-center max-w-3xl mx-auto"
    >
      <p class="text-slate-300">
        <span class="text-red-400 font-semibold">Blood cancer survivors</span>
        who lived this problem
      </p>
    </div>
  </div>
  <div class="slide-number text-slate-500">4</div>
</section>
```

**Layout:** `grid-cols-{N}` where N = number of people. Photo (w-32 h-32 rounded-full), name, title, credential, highlight. Summary bar below.
**Density:** 3-6 people. Each: name + title + 1-2 credential lines. 1 summary bar.

---

## 5. Big Metrics

Large metric cards in a row with optional detail blocks below.

```html
<section class="slide slide-centered bg-white">
  <div class="absolute top-8 left-8 right-8 flex justify-between items-center">
    <p class="text-sm text-slate-500 font-medium uppercase tracking-widest">
      Executive Summary
    </p>
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="h-8 opacity-40"
    />
  </div>
  <div class="w-full max-w-5xl">
    <h2 class="text-5xl font-bold text-slate-900 mb-3 text-center">Progress</h2>
    <p class="text-xl text-slate-500 mb-6 text-center">
      Early but meaningful signal.
    </p>
    <div class="flex justify-center gap-5 mb-6">
      <div
        class="bg-emerald-100 border-2 border-emerald-500 rounded-2xl px-6 py-4 text-center"
      >
        <p class="text-5xl font-bold text-emerald-700">5</p>
        <p class="text-base font-semibold text-emerald-600">LOIs / Partners</p>
      </div>
      <div
        class="bg-sky-100 border-2 border-sky-500 rounded-2xl px-6 py-4 text-center"
      >
        <p class="text-5xl font-bold text-sky-700">2</p>
        <p class="text-base font-semibold text-sky-600">Active Pilots</p>
      </div>
      <div
        class="bg-amber-100 border-2 border-amber-500 rounded-2xl px-6 py-4 text-center"
      >
        <p class="text-5xl font-bold text-amber-700">20+</p>
        <p class="text-base font-semibold text-amber-600">Patient Cases</p>
      </div>
      <div
        class="bg-purple-100 border-2 border-purple-500 rounded-2xl px-6 py-4 text-center"
      >
        <p class="text-5xl font-bold text-purple-700">50+</p>
        <p class="text-base font-semibold text-purple-600">User Interviews</p>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-5">
      <div class="bg-slate-100 rounded-xl p-5 border border-slate-200">
        <p class="text-lg text-slate-800 font-bold mb-2">What's Working</p>
        <p class="text-base text-slate-600">
          Patients trust Navis with complex records, return during high-stakes
          decision windows.
        </p>
      </div>
      <div class="bg-red-50 rounded-xl p-5 border border-red-200">
        <p class="text-lg text-red-700 font-bold mb-2">Why Blood Cancers Fit</p>
        <p class="text-base text-slate-600">
          Repeated decision points around watch-and-wait, MRD, recurrence
          monitoring.
        </p>
      </div>
    </div>
  </div>
  <div class="slide-number">5</div>
</section>
```

**Layout:** Metric row (flex, gap-5), optional 2-column detail grid below.
**Density:** 2-5 metric cards (number + label each). 0-2 detail blocks (title + 1-2 sentences).

---

## 6. Feature Cards (3-column)

Three feature cards with icons and bullet lists. Good for product features, pillars, differentiators.

```html
<section class="slide slide-centered bg-slate-900 text-white">
  <div class="absolute top-8 left-8 right-8 flex justify-between items-center">
    <p class="text-sm text-slate-400 font-medium uppercase tracking-widest">
      Product Progress
    </p>
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="h-8 opacity-30"
    />
  </div>
  <div class="w-full max-w-5xl">
    <h2 class="text-4xl font-bold mb-10 text-center">What We've Built</h2>
    <div class="grid grid-cols-3 gap-8 mb-8">
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl"
      >
        <div
          class="w-14 h-14 bg-sky-500/20 rounded-xl flex items-center justify-center mb-5"
        >
          <span class="text-3xl">&#x1F4AC;</span>
        </div>
        <p class="text-2xl font-bold text-white mb-3">Cancer-Specific Q&A</p>
        <ul class="space-y-2 text-slate-300">
          <li class="flex items-start gap-2">
            <span class="text-sky-400 mt-1">&#8226;</span
            ><span>Ask anything about your diagnosis</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-sky-400 mt-1">&#8226;</span
            ><span>Evidence-grounded, cited answers</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-sky-400 mt-1">&#8226;</span
            ><span>NCCN + PubMed sourced</span>
          </li>
        </ul>
      </div>
      <div
        class="bg-gradient-to-br from-sky-900 to-slate-900 rounded-2xl p-8 border-2 border-sky-500 shadow-xl shadow-sky-500/10 -mt-2"
      >
        <div
          class="w-14 h-14 bg-sky-500/30 rounded-xl flex items-center justify-center mb-5"
        >
          <span class="text-3xl">&#x1F4C1;</span>
        </div>
        <p class="text-2xl font-bold text-white mb-3">Records Vault</p>
        <ul class="space-y-2 text-slate-300">
          <li class="flex items-start gap-2">
            <span class="text-sky-400 mt-1">&#8226;</span
            ><span>Upload any medical record</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-sky-400 mt-1">&#8226;</span
            ><span>AI extracts key findings</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-sky-400 mt-1">&#8226;</span
            ><span>Structured case summary</span>
          </li>
        </ul>
      </div>
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl"
      >
        <div
          class="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-5"
        >
          <span class="text-3xl">&#x1F3AF;</span>
        </div>
        <p class="text-2xl font-bold text-white mb-3">Gap Detection</p>
        <ul class="space-y-2 text-slate-300">
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 mt-1">&#8226;</span
            ><span>Surface possible missing tests</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 mt-1">&#8226;</span
            ><span>NCCN/ASCO guideline-based</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-emerald-400 mt-1">&#8226;</span
            ><span>Personalized next steps</span>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="bg-red-900/30 border border-red-500/50 rounded-xl px-6 py-4 text-center"
    >
      <p class="text-sm text-red-300 font-semibold mb-2">
        Blood Cancer Support Areas
      </p>
      <p class="text-slate-300 text-sm">
        Recurrence monitoring &middot; MRD testing &middot; CAR-T eligibility
        &middot; Pathology clarification
      </p>
    </div>
  </div>
  <div class="slide-number text-slate-500">6</div>
</section>
```

**Layout:** 3-column grid. Each card: icon (w-14 h-14), title (text-2xl), 3 bullets. Optional bottom banner.
**Density:** Exactly 3 cards. 3 bullets each (8 words max per bullet). 1 optional banner.
**Tip:** Make the middle card "featured" with a different border/bg and slight `-mt-2` offset.

---

## 7. Quotes / Testimonials

Metric cards on top, quote cards below. Good for traction, user validation.

```html
<section class="slide slide-centered bg-white">
  <div class="absolute top-8 left-8 right-8 flex justify-between items-center">
    <p class="text-sm text-slate-500 font-medium uppercase tracking-widest">
      User Traction
    </p>
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="h-8 opacity-40"
    />
  </div>
  <div class="w-full max-w-5xl">
    <h2 class="text-4xl font-bold text-slate-900 mb-3 text-center">
      Early Signal
    </h2>
    <p class="text-xl text-slate-500 mb-8 text-center">
      Small numbers, high-intent engagement.
    </p>
    <div class="flex justify-center gap-8 mb-8">
      <div
        class="bg-red-50 border-2 border-red-400 rounded-2xl p-6 text-center min-w-[180px]"
      >
        <p class="text-5xl font-bold text-red-600 mb-2">20+</p>
        <p class="text-xl font-semibold text-slate-700">Patient Cases</p>
        <p class="text-base text-slate-500">10+ blood cancer</p>
      </div>
      <div
        class="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-6 text-center min-w-[180px]"
      >
        <p class="text-5xl font-bold text-emerald-600 mb-2">8+</p>
        <p class="text-xl font-semibold text-slate-700">Records/Case</p>
        <p class="text-base text-slate-500">Deep trust signal</p>
      </div>
    </div>
    <div class="flex justify-center gap-5">
      <div class="flex-1 max-w-sm bg-slate-100 rounded-xl px-5 py-4">
        <p class="text-lg italic text-slate-700 mb-2">
          "I use Navis
          <span class="font-bold text-sky-600">almost daily</span> to track my
          case."
        </p>
        <p class="text-base text-slate-500">&mdash; Patient, Lymphoma</p>
      </div>
      <div class="flex-1 max-w-sm bg-slate-100 rounded-xl px-5 py-4">
        <p class="text-lg italic text-slate-700 mb-2">
          "Finally
          <span class="font-bold text-emerald-600">understand my options</span>
          for watch-and-wait."
        </p>
        <p class="text-base text-slate-500">&mdash; Caregiver, Lymphoma</p>
      </div>
    </div>
  </div>
  <div class="slide-number">7</div>
</section>
```

**Layout:** Metric row (2-4 cards), quote row (2-3 cards) below.
**Density:** 2-4 metric cards (number + label + sublabel). 2-3 quotes (20 words max each + attribution).

---

## 8. Table / Data

Styled table. Good for metrics, CAC/retention, comparison, pricing.

```html
<section class="slide slide-centered bg-slate-900 text-white">
  <div class="absolute top-8 left-8 right-8 flex justify-between items-center">
    <p class="text-sm text-slate-400 font-medium uppercase tracking-widest">
      CAC & Retention
    </p>
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="h-8 opacity-30"
    />
  </div>
  <div class="w-full max-w-5xl">
    <h2 class="text-4xl font-bold mb-6 text-center">Metrics That Matter</h2>
    <div
      class="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 mb-6"
    >
      <table class="w-full text-base">
        <thead class="bg-slate-700">
          <tr>
            <th class="text-left p-4 text-slate-300 font-semibold text-lg">
              Dimension
            </th>
            <th class="text-left p-4 text-slate-300 font-semibold text-lg">
              Current Signal
            </th>
          </tr>
        </thead>
        <tbody class="text-slate-300">
          <tr class="border-t border-slate-700">
            <td class="p-4 text-white font-medium">Acquisition sources</td>
            <td class="p-4">
              Word of mouth, founder outreach, patient communities
            </td>
          </tr>
          <tr class="border-t border-slate-700">
            <td class="p-4 text-white font-medium">CAC (directional)</td>
            <td class="p-4">
              ~$30 per engaged patient; strongest at diagnosis moments
            </td>
          </tr>
          <tr class="border-t border-slate-700">
            <td class="p-4 text-white font-medium">Activation</td>
            <td class="p-4">
              High-intent users upload records and ask follow-up questions
            </td>
          </tr>
          <tr class="border-t border-slate-700">
            <td class="p-4 text-white font-medium">Retention</td>
            <td class="p-4">
              Episodic; repeat engagement in acute decision windows
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-center text-slate-400 text-base">
      Depth of engagement matters more than classic SaaS retention at this
      stage.
    </p>
  </div>
  <div class="slide-number text-slate-500">8</div>
</section>
```

**Layout:** Full-width rounded table with header row. Optional footnote below.
**Density:** Max 6 rows, max 4 columns, max 15 words per cell.

---

## 9. Two-Column

Side-by-side content. Good for ask slide, comparison, fundraising + next steps.

```html
<section
  class="slide slide-centered bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
>
  <div class="absolute top-8 left-8 right-8 flex justify-between items-center">
    <p class="text-sm text-slate-400 font-medium uppercase tracking-widest">
      Fundraising & Partnership
    </p>
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="h-8 opacity-30"
    />
  </div>
  <div class="w-full max-w-5xl">
    <div class="grid grid-cols-2 gap-10">
      <div class="pt-4">
        <h2 class="text-3xl font-bold mb-6">Capital Status</h2>
        <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Target raise:</span>
              <span class="text-2xl font-bold text-white">$500K</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Structure:</span>
              <span class="text-white">Post-money SAFE, $5M cap</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Raised to date:</span>
              <span class="text-emerald-400 font-semibold">~$100K</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 class="text-3xl font-bold mb-6">Proposed Next Steps</h2>
        <div class="space-y-4">
          <div
            class="bg-emerald-900/30 border border-emerald-500/50 rounded-xl p-5"
          >
            <p class="text-emerald-300 font-semibold text-lg mb-1">
              1. Co-design FL workflows
            </p>
            <p class="text-slate-300">
              Working session on highest-value use cases
            </p>
          </div>
          <div
            class="bg-emerald-900/30 border border-emerald-500/50 rounded-xl p-5"
          >
            <p class="text-emerald-300 font-semibold text-lg mb-1">
              2. Blood cancer pilot
            </p>
            <p class="text-slate-300">
              Serve 500 patients, validate engagement
            </p>
          </div>
          <div class="bg-sky-900/30 border border-sky-500/50 rounded-xl p-5">
            <p class="text-sky-300 font-semibold text-lg mb-1">
              3. Fundraising support
            </p>
            <p class="text-slate-300">Introductions to aligned investors</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="slide-number text-slate-500">10</div>
</section>
```

**Layout:** 2-column grid. Left = data card with key-value rows. Right = stacked action items.
**Density:** Left: max 4 key-value pairs. Right: max 3 action items (title + 1 line each).

---

## 10. Checklist / Feature Matrix

Table with checkmarks. Good for indication coverage, feature comparison, roadmap status.

```html
<section class="slide slide-centered bg-white">
  <div class="absolute top-8 left-8 right-8 flex justify-between items-center">
    <p class="text-sm text-slate-500 font-medium uppercase tracking-widest">
      Indications Supported
    </p>
    <img
      src="../pitchAssets/navis-logo-circle-only.svg"
      alt="Navis"
      class="h-8 opacity-40"
    />
  </div>
  <div class="w-full max-w-5xl">
    <h2 class="text-4xl font-bold text-slate-900 mb-6 text-center">
      Indication Coverage
    </h2>
    <div class="overflow-hidden rounded-xl border border-slate-200 mb-4">
      <table class="w-full text-base">
        <thead class="bg-slate-100">
          <tr>
            <th class="text-left p-4 text-slate-600 font-semibold">
              Indication
            </th>
            <th class="text-center p-4 text-slate-600 font-semibold">Q&A</th>
            <th class="text-center p-4 text-slate-600 font-semibold">
              Records
            </th>
            <th class="text-center p-4 text-slate-600 font-semibold">Gaps</th>
            <th class="text-center p-4 text-slate-600 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-red-100 border-t-2 border-red-300">
            <td class="p-4 font-bold text-red-700 text-lg">Lymphoma / FL</td>
            <td class="p-4 text-center text-emerald-600 text-xl">&#10003;</td>
            <td class="p-4 text-center text-emerald-600 text-xl">&#10003;</td>
            <td class="p-4 text-center text-emerald-600 text-xl">&#10003;</td>
            <td class="p-4 text-center text-emerald-600 font-bold">Active</td>
          </tr>
          <tr class="bg-red-50 border-t border-slate-200">
            <td class="p-4 font-semibold text-red-600">
              CLL / Multiple Myeloma
            </td>
            <td class="p-4 text-center text-emerald-600 text-xl">&#10003;</td>
            <td class="p-4 text-center text-emerald-600 text-xl">&#10003;</td>
            <td class="p-4 text-center text-amber-500 text-xl">~</td>
            <td class="p-4 text-center text-amber-500">Building</td>
          </tr>
          <tr class="border-t-2 border-slate-300 bg-slate-50">
            <td class="p-4 text-slate-500" colspan="5">
              <span class="font-medium">Also supported:</span> Prostate,
              Pancreatic, Breast, other solid tumors
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-center text-slate-500 text-sm">
      <span class="text-emerald-600">&#10003;</span> = Supported &nbsp;&nbsp;
      <span class="text-amber-500">~</span> = Building
    </p>
    <p class="text-center text-red-600 mt-3 font-medium">
      Blood cancers are a strategic focus: repeated decision points, prolonged
      monitoring.
    </p>
  </div>
  <div class="slide-number">9</div>
</section>
```

**Layout:** Full-width table with hero row (highlighted bg), normal rows, optional collapse row. Legend + emphasis below.
**Density:** Max 6 rows, max 5 columns. Use &#10003; and ~ symbols. 1 emphasis line.

---

## Header Bar Reference

Every slide except Cover gets this header bar. Positioned absolute at top.

**Dark slide:**

```html
<div class="absolute top-8 left-8 right-8 flex justify-between items-center">
  <p class="text-sm text-slate-400 font-medium uppercase tracking-widest">
    SECTION LABEL
  </p>
  <img
    src="../pitchAssets/navis-logo-circle-only.svg"
    alt="Navis"
    class="h-8 opacity-30"
  />
</div>
```

**Light slide:**

```html
<div class="absolute top-8 left-8 right-8 flex justify-between items-center">
  <p class="text-sm text-slate-500 font-medium uppercase tracking-widest">
    SECTION LABEL
  </p>
  <img
    src="../pitchAssets/navis-logo-circle-only.svg"
    alt="Navis"
    class="h-8 opacity-40"
  />
</div>
```
