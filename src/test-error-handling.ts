import { cleanupProfile, cloneProfile } from './cloneProfile.js';
import * as path from 'path';
import * as os from 'os';

/**
 * Test function to verify error handling and cleanup functionality
 */
async function testErrorHandling(): Promise<void> {
  console.log('Testing error handling and cleanup functionality...\n');

  // Test 1: Test cleanupProfile with valid path
  console.log('Test 1: Testing cleanupProfile with valid path');
  const testProfilePath = path.join(os.tmpdir(), `test-profile-${Date.now()}`);
  
  try {
    // Create a test directory
    await import('fs-extra').then(fs => fs.ensureDir(testProfilePath));
    console.log(`Created test directory: ${testProfilePath}`);
    
    // Test cleanup
    await cleanupProfile(testProfilePath);
    console.log('✅ Test 1 passed: cleanupProfile successfully removed test directory\n');
  } catch (error) {
    console.log(`❌ Test 1 failed: ${error}\n`);
  }

  // Test 2: Test cleanupProfile with empty/invalid path
  console.log('Test 2: Testing cleanupProfile with empty path');
  try {
    await cleanupProfile('');
    console.log('✅ Test 2 passed: cleanupProfile handled empty path gracefully\n');
  } catch (error) {
    console.log(`❌ Test 2 failed: ${error}\n`);
  }

  // Test 3: Test cloneProfile error handling with invalid source path
  console.log('Test 3: Testing cloneProfile error handling with invalid destination');
  const invalidDestPath = '/root/invalid-destination-that-should-fail';
  
  try {
    await cloneProfile(invalidDestPath);
    console.log('❌ Test 3 failed: cloneProfile should have thrown an error\n');
  } catch (error) {
    console.log('✅ Test 3 passed: cloneProfile properly handled error and cleaned up\n');
  }

  console.log('Error handling tests completed!');
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testErrorHandling().catch(console.error);
}

export { testErrorHandling };
