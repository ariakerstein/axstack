#!/usr/bin/env node

/**
 * Voice Interview - Interactive interview simulation with voice input
 *
 * Records your spoken answers, transcribes them, and scores against nSARl framework.
 *
 * Usage:
 *   node voice-interview.mjs              # Full interview
 *   node voice-interview.mjs --quick      # 5-question rapid fire
 *   node voice-interview.mjs --type behavioral  # Focus on one type
 */

import { spawn, execSync } from 'child_process';
import { createReadStream, unlinkSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { createInterface } from 'readline';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  targetDuration: 90,  // seconds - ideal answer length
  maxDuration: 120,    // seconds - hard cutoff
  tempDir: join(__dirname, '.tmp'),
  audioFile: 'answer.wav',
};

// ─────────────────────────────────────────────────────────────────────────────
// Question Bank
// ─────────────────────────────────────────────────────────────────────────────

const QUESTIONS = {
  behavioral: {
    leadership: [
      "Tell me about a time you led a team through ambiguity.",
      "Describe a situation where you had to make a tough call without full information.",
      "Tell me about building and scaling a team.",
      "Describe a time you had to fire someone or manage someone out.",
    ],
    influence: [
      "Tell me about influencing without direct authority.",
      "Describe working with a difficult stakeholder.",
      "How did you get buy-in for an unpopular decision?",
      "Tell me about convincing leadership to change direction.",
    ],
    conflict: [
      "Tell me about a significant failure and what you learned.",
      "Describe receiving difficult feedback and how you responded.",
      "Tell me about a time you disagreed with your manager.",
      "Describe a project that didn't go as planned.",
    ],
    customer: [
      "Tell me about a time you deeply understood customer needs.",
      "How did you balance customer requests vs product vision?",
      "Describe advocating for the customer against business pressure.",
    ],
    execution: [
      "Tell me about delivering under a tight deadline.",
      "Describe a time you had to cut scope to ship.",
      "Tell me about managing competing priorities.",
    ],
  },
  product: {
    design: [
      "Design a product for elderly users to manage medications.",
      "How would you improve Instagram Stories?",
      "Design a feature to help people find clinical trials.",
    ],
    strategy: [
      "Should Uber launch a healthcare delivery service? Why or why not?",
      "How would you prioritize these 5 features for a new user?",
      "What metrics would you track for a patient navigation app?",
    ],
    diagnosis: [
      "User engagement is down 20% after our last release. Walk me through debugging.",
      "Conversion dropped on the pricing page. What would you investigate?",
      "Feature adoption is low despite positive user feedback. Why?",
    ],
  },
  strategy: {
    market: [
      "How would you enter the telehealth market as a startup?",
      "A competitor just raised $100M and launched your core feature. How do you respond?",
      "What's the biggest threat to healthcare startups in 5 years?",
    ],
    business: [
      "How would you monetize a patient navigation app?",
      "Should we switch from subscription to usage-based pricing?",
      "How would you build a two-sided healthcare marketplace?",
    ],
  },
  leadership: {
    team: [
      "How do you hire great product managers?",
      "How do you develop your team members?",
      "How do you handle underperformers?",
    ],
    org: [
      "How do you structure a product org?",
      "How do you align multiple product teams?",
      "How do you communicate up vs down?",
    ],
  },
};

// Question weights by level
const WEIGHTS = {
  ic: { behavioral: 0.4, product: 0.3, strategy: 0.1, leadership: 0.0, execution: 0.2 },
  manager: { behavioral: 0.3, product: 0.25, strategy: 0.15, leadership: 0.15, execution: 0.15 },
  director: { behavioral: 0.2, product: 0.2, strategy: 0.25, leadership: 0.25, execution: 0.1 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function clear() {
  process.stdout.write('\x1Bc');
}

function printHeader(title) {
  console.log('\n' + '━'.repeat(60));
  console.log(`  ${title}`);
  console.log('━'.repeat(60) + '\n');
}

function printDivider() {
  console.log('\n' + '─'.repeat(60) + '\n');
}

function getRandomQuestion(type, subtype) {
  const questions = QUESTIONS[type]?.[subtype];
  if (!questions || questions.length === 0) return null;
  return questions[Math.floor(Math.random() * questions.length)];
}

function selectQuestionByWeight(level) {
  const weights = WEIGHTS[level] || WEIGHTS.manager;
  const rand = Math.random();
  let cumulative = 0;

  for (const [type, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (rand < cumulative && QUESTIONS[type]) {
      const subtypes = Object.keys(QUESTIONS[type]);
      const subtype = subtypes[Math.floor(Math.random() * subtypes.length)];
      const question = getRandomQuestion(type, subtype);
      if (question) {
        return { type, subtype, question };
      }
    }
  }

  // Fallback
  return {
    type: 'behavioral',
    subtype: 'leadership',
    question: QUESTIONS.behavioral.leadership[0],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio Recording
// ─────────────────────────────────────────────────────────────────────────────

async function recordAudio(filepath) {
  return new Promise((resolve, reject) => {
    console.log('\n🎙️  Recording... (press ENTER to stop)\n');

    const startTime = Date.now();
    let timer;

    // Start sox recording
    const rec = spawn('rec', [
      filepath,
      'rate', '16k',        // 16kHz sample rate (good for speech)
      'channels', '1',      // mono
      'silence', '1', '0.1', '1%',  // start on sound
    ], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Timer display
    timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      const display = `${mins}:${secs.toString().padStart(2, '0')}`;
      const target = `${Math.floor(CONFIG.targetDuration / 60)}:${(CONFIG.targetDuration % 60).toString().padStart(2, '0')}`;

      // Progress bar
      const progress = Math.min(elapsed / CONFIG.targetDuration, 1);
      const barLength = 30;
      const filled = Math.floor(progress * barLength);
      const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

      process.stdout.write(`\r⏱️  ${display} / ${target}  ${bar}  `);

      if (elapsed >= CONFIG.maxDuration) {
        console.log('\n\n⏰ Max time reached, stopping...');
        rec.kill('SIGTERM');
      }
    }, 1000);

    // Wait for ENTER to stop
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      clearInterval(timer);
      rec.kill('SIGTERM');
      process.stdin.setRawMode(false);
    });

    rec.on('close', (code) => {
      clearInterval(timer);
      const duration = Math.floor((Date.now() - startTime) / 1000);
      console.log(`\n\n✓ Recorded ${duration} seconds\n`);
      resolve(duration);
    });

    rec.on('error', (err) => {
      clearInterval(timer);
      reject(err);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Transcription (Whisper API)
// ─────────────────────────────────────────────────────────────────────────────

async function transcribeAudio(filepath) {
  console.log('📝 Transcribing...\n');

  const openai = new OpenAI();

  const transcription = await openai.audio.transcriptions.create({
    file: createReadStream(filepath),
    model: 'whisper-1',
    language: 'en',
  });

  return transcription.text;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scoring (Claude via OpenAI-compatible API or direct)
// ─────────────────────────────────────────────────────────────────────────────

async function scoreAnswer(question, answer, questionType) {
  const useClaude = !!process.env.ANTHROPIC_API_KEY;
  console.log(`🧠 Scoring against nSARl framework (${useClaude ? 'Claude' : 'GPT-4'})...\n`);

  const systemPrompt = `You are an expert interview coach scoring behavioral interview answers.

Score the answer against the nSARl framework:
- n (Nugget): Did they open with a compelling 1-sentence hook that previews the outcome?
- S (Situation): Was the context brief (2-3 sentences max) and clear?
- A (Actions): Did they use "I" (not "we")? Were actions specific and detailed?
- R (Result): Did they include NUMBERS/METRICS? Quantified outcomes?
- l (Lessons): Did they share what they learned and how they apply it?

Also assess:
- Relevance: Did they actually answer the question asked?
- Timing: Was the length appropriate (60-90 seconds ideal)?
- Clarity: Was it easy to follow?

Provide:
1. A score table (1-5 for each nSARl element)
2. Specific feedback for each element
3. An overall score out of 25
4. A rewritten "ideal" version of their answer using their content

Be direct and specific. Point out weak phrases and suggest better alternatives.`;

  const userPrompt = `QUESTION: "${question}"

QUESTION TYPE: ${questionType}

CANDIDATE'S ANSWER:
"${answer}"

Score this answer and provide detailed feedback.`;

  if (useClaude) {
    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    });
    return response.content[0].text;
  } else {
    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });
    return response.choices[0].message.content;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Interview Flow
// ─────────────────────────────────────────────────────────────────────────────

async function runInterview(options = {}) {
  const { quick = false, focusType = null } = options;

  // Setup
  if (!existsSync(CONFIG.tempDir)) {
    mkdirSync(CONFIG.tempDir, { recursive: true });
  }

  clear();
  printHeader('🎙️  VOICE INTERVIEW SIMULATION');

  // Get role and level
  console.log('Select your role:\n');
  console.log('  1. Product Manager');
  console.log('  2. General Manager');
  const roleChoice = await prompt('\nChoice (1-2): ');
  const role = roleChoice === '2' ? 'gm' : 'pm';

  console.log('\nSelect your level:\n');
  console.log('  1. IC (Individual Contributor)');
  console.log('  2. Manager');
  console.log('  3. Director+');
  const levelChoice = await prompt('\nChoice (1-3): ');
  const level = levelChoice === '1' ? 'ic' : levelChoice === '3' ? 'director' : 'manager';

  const numQuestions = quick ? 5 : 8;
  const results = [];

  clear();
  printHeader(`🎯 ${role.toUpperCase()} | ${level.toUpperCase()} | ${numQuestions} Questions`);

  // Question loop
  for (let i = 0; i < numQuestions; i++) {
    const { type, subtype, question } = selectQuestionByWeight(level);

    printDivider();
    console.log(`📋 QUESTION ${i + 1}/${numQuestions} (${type} - ${subtype})\n`);
    console.log(`   "${question}"\n`);

    // Optional: read question aloud
    // spawn('say', ['-v', 'Samantha', question]);

    await prompt('Press ENTER to start recording...');

    const audioPath = join(CONFIG.tempDir, `answer_${i}.wav`);

    try {
      // Record
      const duration = await recordAudio(audioPath);

      // Transcribe
      const transcript = await transcribeAudio(audioPath);

      console.log('─'.repeat(40));
      console.log('YOUR ANSWER:\n');
      console.log(`"${transcript}"\n`);
      console.log('─'.repeat(40));

      // Score
      const feedback = await scoreAnswer(question, transcript, `${type} - ${subtype}`);

      console.log('\n' + feedback);

      results.push({
        question,
        type,
        subtype,
        transcript,
        feedback,
        duration,
      });

      // Cleanup audio file
      if (existsSync(audioPath)) {
        unlinkSync(audioPath);
      }

    } catch (err) {
      console.error('\n❌ Error:', err.message);
      if (err.message.includes('OPENAI_API_KEY')) {
        console.log('\n💡 Set your OpenAI API key: export OPENAI_API_KEY=sk-...\n');
        process.exit(1);
      }
    }

    if (i < numQuestions - 1) {
      const next = await prompt('\n[ENTER] Next question  [R] Retry  [Q] Quit: ');
      if (next.toLowerCase() === 'q') break;
      if (next.toLowerCase() === 'r') i--; // Retry same question
    }
  }

  // Session summary
  printDivider();
  printHeader('📊 SESSION SUMMARY');

  console.log(`Completed: ${results.length}/${numQuestions} questions`);
  console.log(`Total time: ${results.reduce((sum, r) => sum + r.duration, 0)} seconds\n`);

  console.log('Questions covered:');
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. [${r.type}] ${r.question.substring(0, 50)}...`);
  });

  // Save results
  const sessionFile = join(CONFIG.tempDir, `session_${Date.now()}.json`);
  writeFileSync(sessionFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Session saved to: ${sessionFile}\n`);

  rl.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI Entry Point
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const quick = args.includes('--quick');
const typeIndex = args.indexOf('--type');
const focusType = typeIndex !== -1 ? args[typeIndex + 1] : null;

// Check for API keys
if (!process.env.OPENAI_API_KEY) {
  console.log('\n❌ Missing OPENAI_API_KEY (needed for Whisper transcription)');
  console.log('Set it with: export OPENAI_API_KEY=sk-...\n');
  process.exit(1);
}

// Claude is optional - will fall back to GPT-4 for scoring
if (process.env.ANTHROPIC_API_KEY) {
  console.log('✓ Using Claude for scoring');
} else {
  console.log('ℹ Using GPT-4 for scoring (set ANTHROPIC_API_KEY to use Claude)');
}

// Check for sox
try {
  execSync('which rec', { stdio: 'pipe' });
} catch {
  console.log('\n❌ sox not found. Install with: brew install sox\n');
  process.exit(1);
}

runInterview({ quick, focusType }).catch(console.error);
