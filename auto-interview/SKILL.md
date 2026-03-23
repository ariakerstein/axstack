# Auto Interview Skill

Interactive interview simulation that asks questions based on role type and seniority level.

---

## Commands

| Command | Purpose |
|---------|---------|
| `/auto-interview` | Start a full interview simulation |
| `/auto-interview quick` | 5-question rapid fire |
| `/auto-interview [type]` | Focus on one question type (behavioral, product, strategy) |

---

## How It Works

1. **Select Role Type**: Product, General Manager
2. **Select Seniority**: IC, Manager, Director+/C-level
3. **Question Loop**:
   - Ask question from bank
   - User responds
   - Provide feedback using nSARl framework
   - Move to next question type

---

## Question Types by Seniority

| Level | Behavioral | Product Sense | Strategy | Execution | Leadership |
|-------|------------|---------------|----------|-----------|------------|
| IC | 40% | 30% | 10% | 20% | 0% |
| Manager | 30% | 25% | 15% | 15% | 15% |
| Director+ | 20% | 20% | 25% | 10% | 25% |

---

## Question Bank

### Behavioral Questions

#### Leadership
- Tell me about a time you led a team through ambiguity
- Describe a situation where you had to make a tough call without full information
- Tell me about building and scaling a team
- Describe a time you had to fire someone or manage someone out
- Tell me about inheriting a struggling team and turning it around

#### Influence
- Tell me about influencing without direct authority
- Describe working with a difficult stakeholder
- How did you get buy-in for an unpopular decision?
- Tell me about convincing leadership to change direction
- Describe navigating competing priorities across teams

#### Conflict & Growth
- Tell me about a significant failure and what you learned
- Describe receiving difficult feedback and how you responded
- Tell me about a time you disagreed with your manager
- Describe a project that didn't go as planned
- Tell me about a time you were wrong about something important

#### Customer Focus
- Tell me about a time you deeply understood customer needs
- How did you balance customer requests vs product vision?
- Describe advocating for the customer against business pressure
- Tell me about a time you changed direction based on customer feedback
- Describe building something customers didn't know they needed

#### Execution
- Tell me about delivering under a tight deadline
- Describe a time you had to cut scope to ship
- Tell me about managing competing priorities
- Describe a time you had to say no to stakeholders
- Tell me about debugging a critical production issue

---

### Product Sense Questions

#### Product Design
- Design a product for [user segment] to solve [problem]
- How would you improve [existing product]?
- Design a feature for [company]'s main product
- You're the PM for [product]. What would you change?
- Design a marketplace for [niche]

#### Product Strategy
- Should [company] launch [product]? Why or why not?
- How would you prioritize these 5 features?
- What metrics would you track for [product]?
- How would you price [product]?
- Should we build, buy, or partner for [capability]?

#### Product Diagnosis
- [Product] engagement is down 20%. What would you investigate?
- Conversion dropped after the last release. Walk me through debugging.
- Users are churning after 30 days. What's your hypothesis?
- Feature adoption is low despite positive feedback. Why?

---

### Strategy Questions

#### Market & Competition
- How would you enter [market]?
- [Competitor] just launched [feature]. How do you respond?
- What's the biggest threat to [company] in 5 years?
- Should [company] expand internationally? Where first?
- How would you evaluate an acquisition target?

#### Business Model
- How would you monetize [product]?
- Should we switch from subscription to usage-based pricing?
- How would you build a marketplace with chicken-and-egg problem?
- What's the right GTM for [product]?

#### Vision & Roadmap
- What would you build in year 1 vs year 3?
- How do you balance short-term wins vs long-term bets?
- How do you decide when to pivot vs persist?
- Describe your framework for roadmap prioritization

---

### Execution Questions

#### Estimation
- How many [X] are there in [Y]?
- Estimate the market size for [product]
- How long would it take to build [feature]?
- What would it cost to run [operation]?

#### Metrics & Analysis
- What metrics would you track for [product]?
- How would you set up an A/B test for [feature]?
- Walk me through analyzing [dataset]
- How would you measure success for [initiative]?

#### Process & Operations
- How do you run a product team?
- Describe your sprint/planning process
- How do you handle tech debt vs features?
- How do you work with engineering?

---

### Leadership Questions (Manager+)

#### Team Building
- How do you hire great PMs?
- How do you develop your team?
- Describe your management philosophy
- How do you handle underperformers?
- How do you build culture?

#### Organizational
- How do you structure a product org?
- How do you align multiple product teams?
- How do you handle reorgs?
- How do you communicate up vs down?

#### Executive Presence
- How would you present to the board?
- How do you handle disagreements with the CEO?
- How do you make decisions with incomplete information?
- Describe setting vision for a product portfolio

---

## Role-Specific Question Emphasis

### Product Manager (IC)
- Heavy on product sense (design, diagnosis)
- Behavioral: execution, customer focus
- Light on strategy

### Product Manager (Manager)
- Balanced across all types
- Add: team leadership, hiring, developing others
- More strategy questions

### General Manager (IC → equivalent to Senior PM)
- Product sense + business model questions
- P&L awareness questions
- Cross-functional collaboration

### General Manager (Manager+)
- Heavy on strategy and leadership
- Business building, scaling
- Organizational questions
- Executive presence

---

## Feedback Framework

After each answer, provide feedback on:

1. **nSARl Structure**
   - Did they start with a nugget/hook?
   - Was situation brief (< 20% of answer)?
   - Were actions specific and "I" focused?
   - Did results include numbers?
   - Did they share lessons?

2. **Content Quality**
   - Was it relevant to the question?
   - Did they show good judgment?
   - Was the scope appropriate for their level?

3. **Delivery Tips**
   - Pacing (too long/short?)
   - Clarity
   - Confidence signals

---

## Session Flow

```
1. "What role are you interviewing for?"
   → Product Manager / General Manager

2. "What level?"
   → IC / Manager / Director+

3. "Let's start. Here's your first question..."
   → [Question from bank, weighted by level]

4. [User answers]

5. "Here's my feedback..."
   → [nSARl analysis + suggestions]

6. "Ready for the next one?"
   → [Next question type]

7. [Repeat 5-8 questions]

8. "Session complete. Summary..."
   → [Strengths, areas to improve, stories to develop]
```

---

## Quick Mode

`/auto-interview quick` runs 5 questions:
1. TMAY
2. Behavioral (random)
3. Product sense (random)
4. Situational/Strategy
5. "Questions for us?"

---

## Installation

1. Copy to `~/.claude/skills/auto-interview/SKILL.md`
2. Add `Skill(auto-interview)` to settings

---

*Part of [axstack](https://github.com/ariakerstein/axstack)*
