import puppeteer from 'puppeteer';
import type { Browser, LaunchOptions } from 'puppeteer';
import * as path from 'path';
import chalk from 'chalk';
import { cleanupProfile } from './cloneProfile.js';
import * as os from 'os';
import { cloneProfile, createAutomationProfile } from './cloneProfile.js';

export interface LaunchBrowserOptions {
  /**
   * Custom path for the automation profile directory.
   * If not provided, defaults to ~/AutomationProfile
   */
  profilePath?: string;
  
  /**
   * Whether to create a temporary profile that gets cleaned up.
   * If false, uses a fixed AutomationProfile directory.
   */
  useTemporaryProfile?: boolean;
  
  /**
   * Additional Puppeteer launch options to merge with defaults
   */
  additionalOptions?: Partial<LaunchOptions>;
}

/**
 * Launches Puppeteer with a cloned Chrome profile, preserving extensions and cookies.
 * 
 * This function:
 * 1. Creates or uses an existing AutomationProfile by cloning the Chrome Default profile
 * 2. Launches Puppeteer with the cloned profile as userDataDir
 * 3. Configures launch options to preserve extensions and optimize for automation
 * 
 * @param options - Configuration options for launching the browser
 * @returns Promise resolving to a Puppeteer Browser instance
 * @throws Error if profile cloning or browser launch fails
 */
export async function launchBrowser(options: LaunchBrowserOptions = {}): Promise<Browser> {
  const {
    profilePath,
    useTemporaryProfile = false,
    additionalOptions = {}
  } = options;

  let automationProfilePath: string = '';

  try {
    if (useTemporaryProfile) {
      // Create a temporary profile directory
      const tempDir = os.tmpdir();
      const tempProfileName = `puppeteer-profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      automationProfilePath = path.join(tempDir, tempProfileName);
      
      // Clone the profile to the temporary location
      await cloneProfile(automationProfilePath);
    } else {
      // Use fixed AutomationProfile directory
      if (profilePath) {
        await cloneProfile(profilePath);
        automationProfilePath = profilePath;
      } else {
        // Use the convenience function to create standard AutomationProfile
        automationProfilePath = await createAutomationProfile();
      }
    }

    console.log(`Using automation profile at: ${automationProfilePath}`);

    // Launch Puppeteer with the cloned profile
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: automationProfilePath,
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage'
      ],
      ignoreDefaultArgs: ['--disable-extensions'],
      // Merge any additional options provided by the user
      ...additionalOptions
    });

    console.log('Browser launched successfully with cloned profile');
    return browser;

  } catch (error) {
    // Attempt to cleanup incomplete profile directory on error (only if path is set)
    if (automationProfilePath) {
      try {
        await cleanupProfile(automationProfilePath);
      } catch (cleanupError) {
        console.log(chalk.yellow(`Warning: Could not cleanup profile directory ${automationProfilePath}: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`));
      }
    }
    console.log(chalk.red(`Error: Failed to launch browser with cloned profile: ${error instanceof Error ? error.message : String(error)}`));
    throw new Error(`Failed to launch browser with cloned profile: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Launches Puppeteer with a temporary cloned profile.
 * This is a convenience function for when you want a clean temporary profile.
 * 
 * @param additionalOptions - Additional Puppeteer launch options
 * @returns Promise resolving to a Puppeteer Browser instance
 */
export async function launchBrowserWithTempProfile(additionalOptions: Partial<LaunchOptions> = {}): Promise<Browser> {
  return launchBrowser({
    useTemporaryProfile: true,
    additionalOptions
  });
}

/**
 * Launches Puppeteer with a fixed AutomationProfile directory.
 * This preserves the profile between runs, maintaining extensions and cookies.
 * 
 * @param profilePath - Optional custom path for the automation profile
 * @param additionalOptions - Additional Puppeteer launch options
 * @returns Promise resolving to a Puppeteer Browser instance
 */
export async function launchBrowserWithFixedProfile(
  profilePath?: string, 
  additionalOptions: Partial<LaunchOptions> = {}
): Promise<Browser> {
  const options: LaunchBrowserOptions = {
    useTemporaryProfile: false,
    additionalOptions
  };
  
  if (profilePath) {
    options.profilePath = profilePath;
  }
  
  return launchBrowser(options);
}
