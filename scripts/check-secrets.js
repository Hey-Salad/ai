#!/usr/bin/env node

/**
 * Security Check Script
 * Scans codebase for sensitive information before pushing to GitHub
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

// Patterns to detect sensitive information
const sensitivePatterns = [
  // API Keys
  { pattern: /sk-[a-zA-Z0-9]{32,}/g, name: 'OpenAI API Key', severity: 'high' },
  { pattern: /sk-ant-[a-zA-Z0-9-]{95,}/g, name: 'Anthropic API Key', severity: 'high' },
  { pattern: /AIza[0-9A-Za-z-_]{35}/g, name: 'Google API Key', severity: 'high' },
  { pattern: /hf_[a-zA-Z0-9]{32,}/g, name: 'HuggingFace API Key', severity: 'high' },
  
  // AWS
  { pattern: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Key', severity: 'high' },
  { pattern: /aws_secret_access_key\s*=\s*[^\s]+/gi, name: 'AWS Secret Key', severity: 'high' },
  
  // Generic API Keys
  { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]{20,}['"]/gi, name: 'Generic API Key', severity: 'high' },
  { pattern: /apikey\s*[:=]\s*['"][^'"]{20,}['"]/gi, name: 'Generic API Key', severity: 'high' },
  
  // Tokens
  { pattern: /token\s*[:=]\s*['"][^'"]{20,}['"]/gi, name: 'Token', severity: 'high' },
  { pattern: /bearer\s+[a-zA-Z0-9\-._~+/]+=*/gi, name: 'Bearer Token', severity: 'high' },
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: 'GitHub Personal Access Token', severity: 'high' },
  
  // Passwords
  { pattern: /password\s*[:=]\s*['"][^'"]{8,}['"]/gi, name: 'Password', severity: 'high' },
  { pattern: /passwd\s*[:=]\s*['"][^'"]{8,}['"]/gi, name: 'Password', severity: 'high' },
  
  // Private Keys
  { pattern: /-----BEGIN (RSA |DSA |EC )?PRIVATE KEY-----/g, name: 'Private Key', severity: 'critical' },
  { pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/g, name: 'SSH Private Key', severity: 'critical' },
  
  // Database URLs
  { pattern: /mongodb(\+srv)?:\/\/[^\s]+/gi, name: 'MongoDB Connection String', severity: 'high' },
  { pattern: /postgres(ql)?:\/\/[^\s]+/gi, name: 'PostgreSQL Connection String', severity: 'high' },
  { pattern: /mysql:\/\/[^\s]+/gi, name: 'MySQL Connection String', severity: 'high' },
  
  // Email addresses (in code, not comments)
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, name: 'Email Address', severity: 'low' },
  
  // IP Addresses (private ranges)
  { pattern: /\b(?:10|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b/g, name: 'Private IP Address', severity: 'medium' },
  
  // JWT Tokens
  { pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g, name: 'JWT Token', severity: 'high' },
  
  // Slack Tokens
  { pattern: /xox[baprs]-[0-9a-zA-Z-]{10,}/g, name: 'Slack Token', severity: 'high' },
  
  // Stripe Keys
  { pattern: /sk_live_[0-9a-zA-Z]{24,}/g, name: 'Stripe Secret Key', severity: 'critical' },
  { pattern: /pk_live_[0-9a-zA-Z]{24,}/g, name: 'Stripe Publishable Key', severity: 'medium' },
];

// Files and directories to exclude
const excludePatterns = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.next/,
  /\.cache/,
  /coverage/,
  /\.wrangler/,
  /\.env\.example/,
  /package-lock\.json/,
  /pnpm-lock\.yaml/,
  /yarn\.lock/,
  /bun\.lock/,
  /\.DS_Store/,
  /\.ico$/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.gif$/,
  /\.svg$/,
  /\.woff$/,
  /\.woff2$/,
  /\.ttf$/,
  /\.eot$/,
  /\.pdf$/,
  /check-secrets\.js$/, // Exclude this script itself
  /package\.json$/, // Exclude package.json (has version numbers that look like IPs)
  /SECURITY\.md$/, // Exclude security documentation (has example patterns)
  /docs\/infrastructure\/SELF_HOSTING\.md$/, // Exclude self-hosting docs (has example IPs)
  /docs\/SECURITY_SETUP\.md$/, // Exclude security setup docs (has before/after examples)
];

// Safe patterns (false positives to ignore)
const safePatterns = [
  /process\.env\./,
  /import\.meta\.env\./,
  /placeholder/i,
  /example/i,
  /test/i,
  /mock/i,
  /dummy/i,
  /fake/i,
  /sample/i,
  /YOUR_API_KEY/,
  /sk_test_/,
  /pk_test_/,
  /user:pass@host/i, // Example connection strings
  /@heysalad\.(app|io)/i, // Official HeySalad contact emails
  /@bereit\.works/i, // Mock data emails
  /"\^?\d+\.\d+\.\d+"/, // Package version numbers in package.json
];

let findings = [];
let filesScanned = 0;

function shouldExclude(filePath) {
  return excludePatterns.some(pattern => pattern.test(filePath));
}

function isSafeContext(line) {
  return safePatterns.some(pattern => pattern.test(line));
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineNumber) => {
      // Skip if it's a safe context (env variable, placeholder, etc.)
      if (isSafeContext(line)) {
        return;
      }
      
      sensitivePatterns.forEach(({ pattern, name, severity }) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            findings.push({
              file: filePath,
              line: lineNumber + 1,
              match: match.substring(0, 50) + (match.length > 50 ? '...' : ''),
              type: name,
              severity,
              context: line.trim().substring(0, 100)
            });
          });
        }
      });
    });
    
    filesScanned++;
  } catch (error) {
    // Ignore files that can't be read
  }
}

function scanDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      
      if (shouldExclude(fullPath)) {
        return;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        scanFile(fullPath);
      }
    });
  } catch (error) {
    // Ignore directories that can't be read
  }
}

function printResults() {
  console.log('\n' + colors.blue + '═'.repeat(80) + colors.reset);
  console.log(colors.blue + '  🔒 HeySalad AI - Security Check' + colors.reset);
  console.log(colors.blue + '═'.repeat(80) + colors.reset + '\n');
  
  console.log(`Scanned ${filesScanned} files\n`);
  
  if (findings.length === 0) {
    console.log(colors.green + '✓ No sensitive information detected!' + colors.reset);
    console.log(colors.green + '✓ Safe to push to GitHub' + colors.reset + '\n');
    return 0;
  }
  
  // Group by severity
  const critical = findings.filter(f => f.severity === 'critical');
  const high = findings.filter(f => f.severity === 'high');
  const medium = findings.filter(f => f.severity === 'medium');
  const low = findings.filter(f => f.severity === 'low');
  
  if (critical.length > 0) {
    console.log(colors.red + `\n⚠️  CRITICAL: ${critical.length} critical issue(s) found` + colors.reset);
    critical.forEach(f => printFinding(f, colors.red));
  }
  
  if (high.length > 0) {
    console.log(colors.red + `\n⚠️  HIGH: ${high.length} high-severity issue(s) found` + colors.reset);
    high.forEach(f => printFinding(f, colors.red));
  }
  
  if (medium.length > 0) {
    console.log(colors.yellow + `\n⚠️  MEDIUM: ${medium.length} medium-severity issue(s) found` + colors.reset);
    medium.forEach(f => printFinding(f, colors.yellow));
  }
  
  if (low.length > 0) {
    console.log(colors.yellow + `\n⚠️  LOW: ${low.length} low-severity issue(s) found` + colors.reset);
    low.forEach(f => printFinding(f, colors.yellow));
  }
  
  console.log('\n' + colors.red + '✗ DO NOT push to GitHub until these issues are resolved!' + colors.reset);
  console.log(colors.yellow + '\nRecommendations:' + colors.reset);
  console.log('  1. Move sensitive data to .env files');
  console.log('  2. Add .env to .gitignore');
  console.log('  3. Use environment variables (process.env.*)');
  console.log('  4. Rotate any exposed credentials');
  console.log('  5. Review .env.example for safe defaults\n');
  
  return 1;
}

function printFinding(finding, color) {
  console.log(color + '\n  Type: ' + finding.type + colors.reset);
  console.log('  File: ' + finding.file + ':' + finding.line);
  console.log('  Match: ' + finding.match);
  console.log('  Context: ' + finding.context);
}

// Main execution
console.log('Starting security scan...\n');

const rootDir = path.join(__dirname, '..');
scanDirectory(rootDir);

const exitCode = printResults();
process.exit(exitCode);
