import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import chalk from 'chalk';

/**
 * Cleans up the specified automation profile by deleting it.
 * 
 * @param profilePath - The path to the profile to be deleted
 */
export async function cleanupProfile(profilePath: string): Promise<void> {
  if (!profilePath || profilePath.trim() === '') {
    return; // No path provided, nothing to cleanup
  }
  
  try {
    if (await fs.pathExists(profilePath)) {
      await fs.remove(profilePath);
      console.log(chalk.green(`Cleanup successful: ${profilePath} has been removed.`));
    }
  } catch (error) {
    console.log(chalk.yellow(`Warning: Failed to cleanup profile at ${profilePath}: ${error instanceof Error ? error.message : String(error)}`));
    throw error;
  }
}

/**
 * Clones the Chrome Default profile to a new destination, handling lock files appropriately.
 * 
 * This function:
 * 1. Locates the Chrome Default profile on macOS
 * 2. Detects and removes lock files before copying
 * 3. Copies the profile to the specified destination
 * 
 * @param destPath - The destination path where the profile should be cloned
 * @throws Error if the source profile doesn't exist or if copying fails
 */
export async function cloneProfile(destPath: string): Promise<void> {
  // Chrome Default profile path on macOS
  const chromeProfilePath = path.join(
    os.homedir(),
    'Library',
    'Application Support',
    'Google',
    'Chrome',
    'Default'
  );

  // Check if source profile exists
  if (!(await fs.pathExists(chromeProfilePath))) {
    throw new Error(`Chrome Default profile not found at: ${chromeProfilePath}`);
  }

  // Ensure destination directory exists
  await fs.ensureDir(path.dirname(destPath));

  // Remove destination if it already exists
  if (await fs.pathExists(destPath)) {
    await fs.remove(destPath);
  }

  try {
    // First, handle lock files in the source profile
    await removeLockFiles(chromeProfilePath);

    // Copy the profile to destination
    await fs.copy(chromeProfilePath, destPath, {
      // Skip lock files during copy as an additional safety measure
      filter: (src: string) => {
        const basename = path.basename(src);
        
        // Skip lock files
        if (basename === 'SingletonLock' || basename.endsWith('.lock')) {
          return false;
        }
        
        return true;
      }
    });

    // Remove any lock files that might have been created in the destination
    await removeLockFiles(destPath);

    console.log(chalk.green(`Successfully cloned Chrome profile to: ${destPath}`));
  } catch (error) {
    // Clean up incomplete profile directory on error
    try {
      if (await fs.pathExists(destPath)) {
        await fs.remove(destPath);
        console.log(chalk.yellow(`Cleaned up incomplete profile directory: ${destPath}`));
      }
    } catch (cleanupError) {
      console.log(chalk.yellow(`Warning: Could not cleanup incomplete profile: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`));
    }
    console.log(chalk.red(`Failed to clone Chrome profile: ${error instanceof Error ? error.message : String(error)}`));
    throw new Error(`Failed to clone Chrome profile: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Removes lock files from a Chrome profile directory.
 * This includes SingletonLock and any .lock files.
 * 
 * @param profilePath - Path to the Chrome profile directory
 */
async function removeLockFiles(profilePath: string): Promise<void> {
  try {
    // Remove SingletonLock file
    const singletonLockPath = path.join(profilePath, 'SingletonLock');
    if (await fs.pathExists(singletonLockPath)) {
      await fs.remove(singletonLockPath);
      console.log(`Removed SingletonLock from: ${profilePath}`);
    }

    // Find and remove all .lock files
    const entries = await fs.readdir(profilePath, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.lock')) {
        const lockFilePath = path.join(profilePath, entry.name);
        await fs.remove(lockFilePath);
        console.log(`Removed lock file: ${lockFilePath}`);
      }
      
      // Recursively check subdirectories for lock files
      if (entry.isDirectory()) {
        const subDirPath = path.join(profilePath, entry.name);
        await removeLockFiles(subDirPath);
      }
    }
  } catch (error) {
    // Log warning but don't fail the entire operation for lock file removal
    console.warn(`Warning: Could not remove all lock files from ${profilePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Creates an AutomationProfile by cloning the Chrome Default profile.
 * This is a convenience function that clones to a standard AutomationProfile location.
 * 
 * @param baseDir - Base directory where the AutomationProfile should be created (optional)
 * @returns The path to the created AutomationProfile
 * @throws Error if profile creation fails
 */
export async function createAutomationProfile(baseDir?: string): Promise<string> {
  const automationProfilePath = baseDir 
    ? path.join(baseDir, 'AutomationProfile')
    : path.join(os.homedir(), 'AutomationProfile');
  
  try {
    await cloneProfile(automationProfilePath);
    return automationProfilePath;
  } catch (error) {
    console.log(chalk.red(`Failed to create AutomationProfile: ${error instanceof Error ? error.message : String(error)}`));
    throw error;
  }
}
