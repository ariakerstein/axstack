# Pitch Deck Themes

Four built-in themes. Each defines classes for every slide element. When generating, apply these classes consistently across all slides.

---

## dark-modern (default)

Dark slides with vibrant accent cards. Alternates dark/light for visual rhythm. Used in the March 2026 update deck.

| Element             | Dark Slide                                                                                                    | Light Slide                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Background          | `bg-slate-900 text-white`                                                                                     | `bg-white`                                                     |
| Cover bg            | `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white`                                      | -                                                              |
| Closing bg          | Same as cover                                                                                                 | -                                                              |
| Viewer bg (body)    | `#1a1a2e`                                                                                                     | -                                                              |
| Header label        | `text-sm text-slate-400 font-medium uppercase tracking-widest`                                                | `text-sm text-slate-500 font-medium uppercase tracking-widest` |
| Logo opacity        | `opacity-30`                                                                                                  | `opacity-40`                                                   |
| Headline            | `text-white` (inherits)                                                                                       | `text-slate-900`                                               |
| Body text           | `text-slate-300`                                                                                              | `text-slate-600`                                               |
| Muted text          | `text-slate-400`                                                                                              | `text-slate-500`                                               |
| Slide number        | `text-slate-500`                                                                                              | `text-slate-400`                                               |
| Card                | `bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-xl`                 | `bg-slate-100 rounded-xl border border-slate-200`              |
| Featured card       | `bg-gradient-to-br from-sky-900 to-slate-900 rounded-2xl border-2 border-sky-500 shadow-xl shadow-sky-500/10` | -                                                              |
| Metric card         | `bg-{color}-900/30 border border-{color}-500/50 rounded-xl`                                                   | `bg-{color}-100 border-2 border-{color}-500 rounded-2xl`       |
| Info card (colored) | `bg-{color}-900/40 border border-{color}-500/50 rounded-xl`                                                   | `bg-{color}-50 rounded-xl border border-{color}-200`           |
| Table wrapper       | `bg-slate-800 rounded-2xl border border-slate-700`                                                            | `rounded-xl border border-slate-200`                           |
| Table head          | `bg-slate-700` text `text-slate-300`                                                                          | `bg-slate-100` text `text-slate-600`                           |
| Table body          | `text-slate-300`, key cells `text-white font-medium`                                                          | `text-slate-600`, key cells `text-slate-900 font-medium`       |
| Row border          | `border-t border-slate-700`                                                                                   | `border-t border-slate-200`                                    |
| Quote card          | `bg-slate-100 rounded-xl` (always light bg for readability)                                                   | `bg-slate-100 rounded-xl`                                      |
| Summary bar         | `bg-slate-800 rounded-xl`                                                                                     | `bg-slate-100 rounded-xl`                                      |
| Action items        | `bg-{color}-900/30 border border-{color}-500/50 rounded-xl`                                                   | -                                                              |
| Callout box         | `bg-slate-900 rounded-2xl` text white                                                                         | `bg-slate-900 rounded-2xl` text white                          |
| Font                | Inter                                                                                                         | -                                                              |

**Accent color palette:**

- Emerald: trust, health, positive metrics
- Sky/Blue: product, technology, featured
- Red: urgency, blood cancer, survivors
- Amber: action, appointments, warnings
- Purple: community, users, engagement

---

## light-clean

All-white slides. Formal, institutional. Good for board decks, partner updates.

| Element      | Value                                                          |
| ------------ | -------------------------------------------------------------- |
| All slide bg | `bg-white`                                                     |
| Cover bg     | `bg-white`                                                     |
| Viewer bg    | `#f8fafc`                                                      |
| Header label | `text-sm text-slate-400 font-medium uppercase tracking-widest` |
| Logo opacity | `opacity-40`                                                   |
| Headline     | `text-slate-900`                                               |
| Body text    | `text-slate-600`                                               |
| Muted text   | `text-slate-400`                                               |
| Slide number | `text-slate-400`                                               |
| Card         | `bg-slate-50 rounded-xl border border-slate-200`               |
| Metric card  | `bg-{color}-50 border border-{color}-200 rounded-2xl`          |
| Table head   | `bg-slate-50` text `text-slate-600`                            |
| Table body   | `text-slate-600`                                               |
| Row border   | `border-t border-slate-100`                                    |
| Font         | Inter                                                          |

**Accent colors:** teal (primary CTA), slate (secondary), emerald (positive), red (urgency)

**No dark/light alternation.** All slides are white. Use subtle background tints (`bg-slate-50`, `bg-{color}-50`) for visual variety.

---

## warm-editorial

Warm background tones, editorial feel. Good for patient-facing or storytelling decks.

| Element     | Warm Slide                                                   | Dark Accent Slide                                  |
| ----------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Background  | `bg-gradient-to-br from-amber-50/40 via-white to-white`      | `bg-slate-800 text-white`                          |
| Cover bg    | `bg-gradient-to-br from-amber-50 via-white to-rose-50`       | -                                                  |
| Viewer bg   | `#292524`                                                    | -                                                  |
| Headline    | `text-slate-900`                                             | `text-white`                                       |
| Body text   | `text-slate-600`                                             | `text-slate-300`                                   |
| Card        | `bg-white rounded-2xl border border-slate-200 shadow-sm`     | `bg-slate-700 rounded-2xl border border-slate-600` |
| Metric card | `bg-white border-2 border-{color}-300 rounded-2xl shadow-sm` | -                                                  |
| Font        | Inter                                                        | -                                                  |

**Accent colors:** rose (people/care), amber (warmth/action), teal (trust), emerald (health)

**Alternate warm/dark accent slides** for rhythm. Use dark accent sparingly (1-2 per deck).

---

## bold-dark

High contrast black. Punchy, minimal. Good for demo day, conference, or keynote.

| Element       | Value                                                        |
| ------------- | ------------------------------------------------------------ |
| All slide bg  | `bg-black text-white`                                        |
| Cover bg      | `bg-black text-white`                                        |
| Viewer bg     | `#000000`                                                    |
| Headline      | `text-white`                                                 |
| Body text     | `text-slate-300`                                             |
| Muted text    | `text-slate-500`                                             |
| Slide number  | `text-slate-600`                                             |
| Card          | `bg-white/5 rounded-2xl border border-white/10`              |
| Metric card   | `bg-{color}-500/20 border border-{color}-400/50 rounded-2xl` |
| Table wrapper | `bg-white/5 rounded-2xl border border-white/10`              |
| Table head    | `bg-white/10` text `text-slate-300`                          |
| Row border    | `border-t border-white/10`                                   |
| Font          | Inter                                                        |

**Accent colors:** emerald (primary), sky (secondary), amber (highlight), white (text)

**No alternation.** All slides are black. Use accent-colored borders and backgrounds for variety.
