#!/usr/bin/env node

/**
 * LinkedIn Export - Opens LinkedIn data export page in your default browser
 *
 * Usage:
 *   node linkedin-export.mjs
 */

import { existsSync, mkdirSync, readdirSync, watch } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { execSync, spawn } from 'child_process';

// ─────────────────────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────────────────────

const DATA_DIR = join(homedir(), '.linkedin-prep');
const DOWNLOADS_DIR = join(homedir(), 'Downloads');

if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Flow
// ─────────────────────────────────────────────────────────────────────────────

async function exportConnections() {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📥 LINKEDIN CONNECTIONS EXPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Opening LinkedIn data export page in your browser...
(You should already be logged in)
`);

  // Open the LinkedIn data export page in default browser
  const url = 'https://www.linkedin.com/mypreferences/d/download-my-data';

  // Use 'open' on macOS to open in default browser
  spawn('open', [url]);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📋 INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In the browser window that just opened:

1. Make sure "Connections" is checked
2. Click "Request archive"
3. Wait for email from LinkedIn (usually 10-15 min)
4. Download the ZIP file
5. Extract to find 'Connections.csv'

Then run:
   node linkedin-prep.mjs import ~/Downloads/Connections.csv

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👀 WATCHING FOR DOWNLOADS...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I'll watch your Downloads folder for LinkedIn export files.
When detected, I'll automatically import them.

Press Ctrl+C to stop watching.
`);

  // Watch Downloads folder for LinkedIn export files
  const watcher = watch(DOWNLOADS_DIR, (eventType, filename) => {
    if (!filename) return;

    const lowerName = filename.toLowerCase();
    if (
      lowerName.includes('linkedin') ||
      lowerName.includes('connections') ||
      (lowerName.endsWith('.zip') && lowerName.includes('dataexport'))
    ) {
      console.log(`\n📁 Detected: ${filename}`);

      if (filename.endsWith('.csv') && lowerName.includes('connections')) {
        console.log('✓ Found Connections.csv! Importing...\n');
        try {
          execSync(`node linkedin-prep.mjs import "${join(DOWNLOADS_DIR, filename)}"`, {
            stdio: 'inherit',
            cwd: import.meta.dirname,
          });
        } catch (e) {
          console.error('Import error:', e.message);
        }
      } else if (filename.endsWith('.zip')) {
        console.log(`\n📦 ZIP file detected. Extract it and look for Connections.csv`);
        console.log(`   Then run: node linkedin-prep.mjs import ~/Downloads/Connections.csv\n`);
      }
    }
  });

  // Keep watching for 30 minutes
  await new Promise(resolve => setTimeout(resolve, 1800000));
  watcher.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick check for existing downloads
// ─────────────────────────────────────────────────────────────────────────────

function checkForExistingExport() {
  // Look for LinkedIn export files in Downloads
  const files = readdirSync(DOWNLOADS_DIR);

  // LinkedIn exports are usually named like "Basic_LinkedInDataExport_..." or just contain Connections.csv
  const linkedInFiles = files.filter(f =>
    f.toLowerCase().includes('linkedin') ||
    f.toLowerCase().includes('connections.csv') ||
    (f.endsWith('.zip') && f.includes('DataExport'))
  );

  if (linkedInFiles.length > 0) {
    console.log('\n📁 Found potential LinkedIn export files in Downloads:\n');
    linkedInFiles.forEach(f => console.log(`   - ${f}`));
    console.log('\nIf one of these is your export, extract it and run:');
    console.log('   node linkedin-prep.mjs import ~/Downloads/Connections.csv\n');
    return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry Point
// ─────────────────────────────────────────────────────────────────────────────

const hasExisting = checkForExistingExport();

if (hasExisting) {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('\nOpen LinkedIn anyway to get fresh export? (y/N): ', async (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y') {
      await exportConnections();
    } else {
      console.log('\nOK! Run this to import an existing CSV:');
      console.log('   node linkedin-prep.mjs import ~/Downloads/Connections.csv\n');
    }
  });
} else {
  exportConnections();
}
