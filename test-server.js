#!/usr/bin/env node

/**
 * Test script for Indian Stock Market MCP Server
 *
 * This script simulates MCP protocol messages to test the server
 * without needing Claude Code.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.URL);
const __dirname = dirname(__filename);

// Test cases
const tests = [
  {
    name: 'List Tools',
    request: {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {},
    },
  },
  {
    name: 'Get Stock Details - Tata Steel',
    request: {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_stock_details',
        arguments: {
          name: 'Tata Steel',
        },
      },
    },
  },
  {
    name: 'Get Trending Stocks',
    request: {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'get_trending_stocks',
        arguments: {},
      },
    },
  },
];

async function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`\n🧪 Running test: ${test.name}`);
    console.log('Request:', JSON.stringify(test.request, null, 2));

    const serverProcess = spawn('node', [join(__dirname, 'index.js')], {
      stdio: ['pipe', 'pipe', 'inherit'],
    });

    let output = '';

    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    serverProcess.on('close', (code) => {
      try {
        const response = JSON.parse(output);
        console.log('✅ Response:', JSON.stringify(response, null, 2));
        resolve(response);
      } catch (error) {
        console.error('❌ Failed to parse response:', output);
        reject(error);
      }
    });

    serverProcess.stdin.write(JSON.stringify(test.request) + '\n');
    serverProcess.stdin.end();

    setTimeout(() => {
      serverProcess.kill();
      reject(new Error('Test timeout'));
    }, 10000);
  });
}

async function runAllTests() {
  console.log('🚀 Starting MCP Server Tests\n');
  console.log('=' .repeat(60));

  for (const test of tests) {
    try {
      await runTest(test);
      console.log('✅ Test passed:', test.name);
    } catch (error) {
      console.error('❌ Test failed:', test.name);
      console.error('Error:', error.message);
    }
    console.log('=' .repeat(60));
  }

  console.log('\n✅ All tests completed!');
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
