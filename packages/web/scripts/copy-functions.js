#!/usr/bin/env node

/**
 * Copy Functions to dist directory for Cloudflare Pages deployment
 */

import { cpSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const functionsSource = join(projectRoot, 'functions');
const functionsTarget = join(projectRoot, 'dist', 'functions');

console.log('📦 Copying Functions to dist directory...');
console.log(`   Source: ${functionsSource}`);
console.log(`   Target: ${functionsTarget}`);

if (!existsSync(functionsSource)) {
  console.error('❌ Functions directory not found!');
  process.exit(1);
}

// Create dist directory if it doesn't exist
if (!existsSync(join(projectRoot, 'dist'))) {
  mkdirSync(join(projectRoot, 'dist'), { recursive: true });
}

// Copy functions directory
try {
  cpSync(functionsSource, functionsTarget, { recursive: true });
  console.log('✅ Functions copied successfully!');
  console.log('   API endpoints will be available at /api/*');
} catch (error) {
  console.error('❌ Failed to copy functions:', error.message);
  process.exit(1);
}
