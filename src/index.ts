// Export profile cloning functionality
export { cloneProfile, createAutomationProfile, cleanupProfile } from './cloneProfile.js';

// Export browser launching functionality
export { 
  launchBrowser, 
  launchBrowserWithTempProfile, 
  launchBrowserWithFixedProfile,
  type LaunchBrowserOptions 
} from './launchBrowser.js';
