#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables for deployment...\n');

// Get Railway URL from user
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your Railway backend URL (e.g., https://lesson-planner-production-xxxx.up.railway.app): ', (railwayUrl) => {
  if (!railwayUrl) {
    console.log('❌ No URL provided. Please run this script again with a valid Railway URL.');
    rl.close();
    return;
  }

  // Create .env.local for local development
  const envLocalContent = `VITE_API_URL=${railwayUrl}`;
  fs.writeFileSync('.env.local', envLocalContent);
  console.log('✅ Created .env.local file');

  // Create .env.production for production
  const envProductionContent = `VITE_API_URL=${railwayUrl}`;
  fs.writeFileSync('.env.production', envProductionContent);
  console.log('✅ Created .env.production file');

  console.log('\n🎉 Environment setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Deploy to Vercel: vercel');
  console.log('2. Or set environment variable in Vercel dashboard:');
  console.log('   - Go to your Vercel project');
  console.log('   - Settings → Environment Variables');
  console.log('   - Add VITE_API_URL with value:', railwayUrl);

  rl.close();
}); 