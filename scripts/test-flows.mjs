#!/usr/bin/env node

/**
 * Test critical application flows
 * 1. Homepage loads
 * 2. Pricing page loads
 * 3. Login page loads
 * 4. Signup page loads
 * 5. Terms page loads
 * 6. Privacy page loads
 * 7. Sitemap generates
 * 8. Robots.txt exists
 */

const baseUrl = 'http://localhost:3000';

const testPages = [
  { path: '/', name: 'Homepage' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/login', name: 'Login' },
  { path: '/signup', name: 'Signup' },
  { path: '/terms', name: 'Terms of Service' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/sitemap.xml', name: 'Sitemap' },
  { path: '/robots.txt', name: 'Robots.txt' }
];

async function testPage(path, name) {
  try {
    const response = await fetch(`${baseUrl}${path}`);
    
    if (response.status === 200) {
      console.log(`✅ ${name.padEnd(25)} - OK (${response.status})`);
      return true;
    } else {
      console.log(`❌ ${name.padEnd(25)} - FAILED (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name.padEnd(25)} - ERROR (${error.message})`);
    return false;
  }
}

async function testApplication() {
  console.log('🧪 Testing Webhook Tester application flows...\n');
  console.log(`📡 Base URL: ${baseUrl}\n`);
  
  let passed = 0;
  let failed = 0;
  
  for (const page of testPages) {
    const result = await testPage(page.path, page.name);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Application is ready.');
    console.log('\nNext steps:');
    console.log('1. Manual test: Sign up at http://localhost:3000/signup');
    console.log('2. Create a test endpoint');
    console.log('3. Send a webhook to test endpoint');
    console.log('4. Test Stripe checkout (test mode)');
    console.log('5. Deploy to production');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the application.');
  }
}

// Wait a moment for dev server to be ready
console.log('⏳ Waiting for dev server to be ready...\n');
setTimeout(() => {
  testApplication().catch(console.error);
}, 2000);
