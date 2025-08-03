import { launchBrowser, launchBrowserWithTempProfile, launchBrowserWithFixedProfile } from './launchBrowser.js';

/**
 * Example usage of the launchBrowser functionality
 */
async function example() {
  try {
    console.log('Example 1: Launch with default fixed profile');
    const browser1 = await launchBrowser();
    await browser1.close();
    
    console.log('\nExample 2: Launch with temporary profile');
    const browser2 = await launchBrowserWithTempProfile();
    await browser2.close();
    
    console.log('\nExample 3: Launch with custom profile path');
    const browser3 = await launchBrowserWithFixedProfile('/tmp/my-custom-profile');
    await browser3.close();
    
    console.log('\nExample 4: Launch with additional options');
    const browser4 = await launchBrowser({
      useTemporaryProfile: true,
      additionalOptions: {
        args: ['--start-maximized']
      }
    });
    await browser4.close();
    
    console.log('\nAll examples completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the example
// example();

export { example };
